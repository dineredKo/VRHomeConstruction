package services

import (
	"context"
	"errors"
	"time"

	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"github.com/execada/VRHomeConstruction/backend/internal/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var ErrLayoutNotFound = errors.New("layout not found")

type LayoutService struct {
	repo *repositories.LayoutRepo
}

func NewLayoutService(repo *repositories.LayoutRepo) *LayoutService {
	return &LayoutService{repo: repo}
}

func (s *LayoutService) List(ctx context.Context) ([]models.Layout, error) {
	return s.repo.FindAll(ctx)
}

func (s *LayoutService) GetByID(ctx context.Context, id string) (*models.Layout, error) {
	layout, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if layout == nil {
		return nil, ErrLayoutNotFound
	}
	return layout, nil
}

func (s *LayoutService) Create(ctx context.Context, req models.CreateLayoutRequest, userID string) (*models.Layout, error) {
	now := time.Now()
	layout := &models.Layout{
		ID:        primitive.NewObjectID().Hex(),
		Name:      req.Name,
		UserID:    userID,
		CreatedAt: now,
		UpdatedAt: now,
	}

	if err := s.repo.Insert(ctx, layout); err != nil {
		return nil, err
	}
	return layout, nil
}

func (s *LayoutService) Update(ctx context.Context, id string, req models.UpdateLayoutRequest) (*models.Layout, error) {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, ErrLayoutNotFound
	}

	now := time.Now()
	layout := &models.Layout{
		ID:        id,
		Name:      req.Name,
		UserID:    existing.UserID,
		CreatedAt: existing.CreatedAt,
		UpdatedAt: now,
	}

	if err := s.repo.Update(ctx, id, layout); err != nil {
		return nil, err
	}
	return layout, nil
}

func (s *LayoutService) Delete(ctx context.Context, id string) error {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrLayoutNotFound
	}
	return s.repo.Delete(ctx, id)
}
