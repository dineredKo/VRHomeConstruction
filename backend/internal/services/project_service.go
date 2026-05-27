package services

import (
	"context"
	"errors"
	"time"

	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"github.com/execada/VRHomeConstruction/backend/internal/repositories"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	ErrProjectNotFound   = errors.New("project not found")
	ErrProjectForbidden  = errors.New("project forbidden")
)

type ProjectService struct {
	repo *repositories.ProjectRepo
}

func NewProjectService(repo *repositories.ProjectRepo) *ProjectService {
	return &ProjectService{repo: repo}
}

func (s *ProjectService) List(ctx context.Context, userID string, page, limit int64, status string) ([]models.Project, int64, error) {
	filter := bson.M{"userId": userID}
	if status != "" {
		filter["status"] = status
	}
	return s.repo.FindAll(ctx, filter, page, limit)
}

func (s *ProjectService) GetByID(ctx context.Context, id, userID string) (*models.Project, error) {
	project, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if project == nil {
		return nil, ErrProjectNotFound
	}
	if project.UserID != userID {
		return nil, ErrProjectForbidden
	}
	return project, nil
}

func (s *ProjectService) Create(ctx context.Context, req models.CreateProjectRequest, userID string) (*models.Project, error) {
	now := time.Now()
	status := req.Status
	if status == "" {
		status = "draft"
	}

	project := &models.Project{
		ID:        primitive.NewObjectID().Hex(),
		Name:      req.Name,
		Template:  req.Template,
		CreatedAt: now,
		UpdatedAt: now,
		UserID:    userID,
		Status:    status,
		RoomData: models.RoomData{
			Openings:   []models.Opening{},
			Partitions: []models.Partition{},
			Furniture:  []models.FurnitureItem{},
		},
	}

	if err := s.repo.Insert(ctx, project); err != nil {
		return nil, err
	}
	return project, nil
}

func (s *ProjectService) Update(ctx context.Context, id, userID string, req models.UpdateProjectRequest) (*models.Project, error) {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, ErrProjectNotFound
	}
	if existing.UserID != userID {
		return nil, ErrProjectForbidden
	}

	now := time.Now()
	project := &models.Project{
		ID:        id,
		Name:      req.Name,
		Template:  req.Template,
		Number:    req.Number,
		CreatedAt: existing.CreatedAt,
		UpdatedAt: now,
		UserID:    existing.UserID,
		Status:    req.Status,
		RoomData:  req.RoomData,
	}

	if err := s.repo.Update(ctx, id, project); err != nil {
		return nil, err
	}
	return project, nil
}

func (s *ProjectService) Delete(ctx context.Context, id, userID string) error {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrProjectNotFound
	}
	if existing.UserID != userID {
		return ErrProjectForbidden
	}
	return s.repo.Delete(ctx, id)
}
