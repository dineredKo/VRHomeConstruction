package models

import "time"

const (
	VerificationPurposeLogin    = "login"
	VerificationPurposeRegister = "register"
)

type SendCodeRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Purpose  string `json:"purpose" binding:"required,oneof=login register"`
	Name     string `json:"name"`
	Password string `json:"password"`
}

type VerifyCodeRequest struct {
	Email   string `json:"email" binding:"required,email"`
	Code    string `json:"code" binding:"required,len=6"`
	Purpose string `json:"purpose" binding:"required,oneof=login register"`
}

type SendCodeResponse struct {
	Message string `json:"message"`
}

type VerificationRecord struct {
	ID           string    `bson:"_id"`
	Email        string    `bson:"email"`
	Purpose      string    `bson:"purpose"`
	CodeHash     string    `bson:"codeHash"`
	ExpiresAt    time.Time `bson:"expiresAt"`
	Name         string    `bson:"name,omitempty"`
	PasswordHash string    `bson:"passwordHash,omitempty"`
	UserID       string    `bson:"userId,omitempty"`
}
