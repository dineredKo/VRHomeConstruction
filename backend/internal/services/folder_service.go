package services

import (
	"context"
	"errors"
	"time"

	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"github.com/execada/VRHomeConstruction/backend/internal/repositories"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var ErrFolderNotFound = errors.New("folder not found")

type FolderService struct {
	repo *repositories.FolderRepo
}

func NewFolderService(repo *repositories.FolderRepo) *FolderService {
	return &FolderService{repo: repo}
}

func (s *FolderService) GetTree(ctx context.Context) ([]models.FolderTree, error) {
	folders, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	folderMap := make(map[string]*models.FolderTree)
	var roots []models.FolderTree

	for i := range folders {
		folderMap[folders[i].ID] = &models.FolderTree{
			Folder:   folders[i],
			Children: nil,
		}
	}

	for _, f := range folders {
		node := folderMap[f.ID]
		if f.ParentID != nil && *f.ParentID != "" {
			if parent, ok := folderMap[*f.ParentID]; ok {
				parent.Children = append(parent.Children, *node)
			}
		} else {
			roots = append(roots, *node)
		}
	}

	return roots, nil
}

func (s *FolderService) GetByID(ctx context.Context, id string) (*models.Folder, error) {
	folder, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if folder == nil {
		return nil, ErrFolderNotFound
	}
	return folder, nil
}

func (s *FolderService) Create(ctx context.Context, req models.CreateFolderRequest, userID string) (*models.Folder, error) {
	now := time.Now()
	folder := &models.Folder{
		ID:             primitive.NewObjectID().Hex(),
		Name:           req.Name,
		Description:    req.Description,
		UserID:         userID,
		ParentID:       req.ParentID,
		ProjectIDs:     []string{},
		LayoutIDs:      []string{},
		ChildFolderIDs: []string{},
		CreatedAt:      now,
		UpdatedAt:      now,
	}

	if err := s.repo.Insert(ctx, folder); err != nil {
		return nil, err
	}
	return folder, nil
}

func (s *FolderService) Update(ctx context.Context, id string, req models.UpdateFolderRequest) (*models.Folder, error) {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, ErrFolderNotFound
	}

	if req.ProjectIDs == nil {
		req.ProjectIDs = []string{}
	}
	if req.LayoutIDs == nil {
		req.LayoutIDs = []string{}
	}
	if req.ChildFolderIDs == nil {
		req.ChildFolderIDs = []string{}
	}

	now := time.Now()
	folder := &models.Folder{
		ID:             id,
		Name:           req.Name,
		Description:    req.Description,
		UserID:         existing.UserID,
		ParentID:       req.ParentID,
		ProjectIDs:     req.ProjectIDs,
		LayoutIDs:      req.LayoutIDs,
		ChildFolderIDs: req.ChildFolderIDs,
		CreatedAt:      existing.CreatedAt,
		UpdatedAt:      now,
	}

	if err := s.repo.Update(ctx, id, folder); err != nil {
		return nil, err
	}
	return folder, nil
}

func (s *FolderService) Delete(ctx context.Context, id string) error {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}
	if existing == nil {
		return ErrFolderNotFound
	}
	return s.repo.Delete(ctx, id)
}
