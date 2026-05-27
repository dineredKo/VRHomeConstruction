package services

import (
	"context"
	"crypto/rand"
	"errors"
	"log"
	"math/big"
	"strings"
	"time"

	"github.com/execada/VRHomeConstruction/backend/internal/auth"
	"github.com/execada/VRHomeConstruction/backend/internal/email"
	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"github.com/execada/VRHomeConstruction/backend/internal/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

const verificationTTL = 10 * time.Minute

var (
	ErrUserNotFound        = errors.New("user not found")
	ErrUserAlreadyExists   = errors.New("user already exists")
	ErrInvalidCredentials  = errors.New("invalid credentials")
	ErrInvalidCode         = errors.New("invalid code")
	ErrCodeExpired         = errors.New("code expired")
	ErrEmailSendFailed     = errors.New("email send failed")
	ErrInvalidPurpose      = errors.New("invalid purpose")
)

type AuthService struct {
	users         *repositories.UserRepo
	verifications *repositories.VerificationRepo
	tokens        *auth.TokenService
	sender        email.Sender
}

func NewAuthService(
	users *repositories.UserRepo,
	verifications *repositories.VerificationRepo,
	tokens *auth.TokenService,
	sender email.Sender,
) *AuthService {
	return &AuthService{
		users:         users,
		verifications: verifications,
		tokens:        tokens,
		sender:        sender,
	}
}

func (s *AuthService) SendCode(ctx context.Context, req models.SendCodeRequest) (*models.SendCodeResponse, error) {
	email := normalizeEmail(req.Email)
	purpose := strings.TrimSpace(req.Purpose)

	switch purpose {
	case models.VerificationPurposeRegister:
		if err := s.validateRegisterPayload(req); err != nil {
			return nil, err
		}
		existing, err := s.users.FindByEmail(ctx, email)
		if err != nil {
			return nil, err
		}
		if existing != nil {
			return nil, ErrUserAlreadyExists
		}
	case models.VerificationPurposeLogin:
		if req.Password == "" {
			return nil, ErrInvalidCredentials
		}
		user, err := s.users.FindByEmail(ctx, email)
		if err != nil {
			return nil, err
		}
		if user == nil {
			return nil, ErrInvalidCredentials
		}
		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			return nil, ErrInvalidCredentials
		}
	default:
		return nil, ErrInvalidPurpose
	}

	code, err := generateCode()
	if err != nil {
		return nil, err
	}

	codeHash, err := bcrypt.GenerateFromPassword([]byte(code), bcrypt.MinCost)
	if err != nil {
		return nil, err
	}

	record := &models.VerificationRecord{
		ID:        primitive.NewObjectID().Hex(),
		Email:     email,
		Purpose:   purpose,
		CodeHash:  string(codeHash),
		ExpiresAt: time.Now().Add(verificationTTL),
	}

	if purpose == models.VerificationPurposeRegister {
		passHash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			return nil, err
		}
		record.Name = strings.TrimSpace(req.Name)
		record.PasswordHash = string(passHash)
	}

	if purpose == models.VerificationPurposeLogin {
		user, _ := s.users.FindByEmail(ctx, email)
		if user != nil {
			record.UserID = user.ID
		}
	}

	if err := s.verifications.Upsert(ctx, record); err != nil {
		return nil, err
	}

	purposeLabel := "входа"
	if purpose == models.VerificationPurposeRegister {
		purposeLabel = "регистрации"
	}

	log.Printf("[CODE] email=%s purpose=%s code=%s", email, purposeLabel, code)

	to := email
	go func() {
		if err := s.sender.SendVerificationCode(to, code, purposeLabel); err != nil {
			log.Printf("[EMAIL BG FAILED] to=%s code=%s err=%v", to, code, err)
		}
	}()

	if s.sender.LogOnly() {
		return &models.SendCodeResponse{
			Message: "Код готов. Смотрите логи бэкенда (строка [CODE])",
		}, nil
	}

	return &models.SendCodeResponse{
		Message: "Код отправлен на email. Проверьте входящие и папку «Спам».",
	}, nil
}

func (s *AuthService) VerifyCode(ctx context.Context, req models.VerifyCodeRequest) (*models.AuthResponse, error) {
	email := normalizeEmail(req.Email)
	purpose := strings.TrimSpace(req.Purpose)
	code := strings.TrimSpace(req.Code)

	record, err := s.verifications.FindValid(ctx, email, purpose)
	if err != nil {
		return nil, err
	}
	if record == nil {
		return nil, ErrCodeExpired
	}

	if err := bcrypt.CompareHashAndPassword([]byte(record.CodeHash), []byte(code)); err != nil {
		return nil, ErrInvalidCode
	}

	var user *models.User

	switch purpose {
	case models.VerificationPurposeRegister:
		user, err = s.createUserFromVerification(ctx, record)
	case models.VerificationPurposeLogin:
		user, err = s.users.FindByID(ctx, record.UserID)
		if err != nil {
			return nil, err
		}
		if user == nil {
			return nil, ErrUserNotFound
		}
	default:
		return nil, ErrInvalidPurpose
	}

	if err != nil {
		return nil, err
	}

	_ = s.verifications.Delete(ctx, email, purpose)

	return s.buildAuthResponse(user)
}

func (s *AuthService) createUserFromVerification(ctx context.Context, record *models.VerificationRecord) (*models.User, error) {
	existing, err := s.users.FindByEmail(ctx, record.Email)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, ErrUserAlreadyExists
	}

	user := &models.User{
		ID:           primitive.NewObjectID().Hex(),
		Name:         record.Name,
		Email:        record.Email,
		PasswordHash: record.PasswordHash,
	}

	if err := s.users.Insert(ctx, user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) GetByID(ctx context.Context, userID string) (*models.UserPublic, error) {
	user, err := s.users.FindByID(ctx, userID)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, ErrUserNotFound
	}

	public := user.ToPublic()
	return &public, nil
}

func (s *AuthService) buildAuthResponse(user *models.User) (*models.AuthResponse, error) {
	token, err := s.tokens.Generate(user.ID)
	if err != nil {
		return nil, err
	}

	return &models.AuthResponse{
		User:  user.ToPublic(),
		Token: token,
	}, nil
}

func (s *AuthService) validateRegisterPayload(req models.SendCodeRequest) error {
	if strings.TrimSpace(req.Name) == "" {
		return errors.New("name is required")
	}
	if len(req.Password) < 6 {
		return errors.New("password must be at least 6 characters")
	}
	return nil
}

func generateCode() (string, error) {
	var sb strings.Builder
	for i := 0; i < 6; i++ {
		n, err := rand.Int(rand.Reader, big.NewInt(10))
		if err != nil {
			return "", err
		}
		sb.WriteByte(byte('0' + n.Int64()))
	}
	return sb.String(), nil
}

func normalizeEmail(email string) string {
	return strings.ToLower(strings.TrimSpace(email))
}
