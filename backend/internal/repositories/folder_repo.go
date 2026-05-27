package repositories

import (
	"context"

	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type FolderRepo struct {
	collection *mongo.Collection
}

func NewFolderRepo(db *mongo.Client) *FolderRepo {
	return &FolderRepo{
		collection: db.Database("vr_home_construction").Collection("folders"),
	}
}

func (r *FolderRepo) FindAll(ctx context.Context) ([]models.Folder, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var folders []models.Folder
	if err := cursor.All(ctx, &folders); err != nil {
		return nil, err
	}
	return folders, nil
}

func (r *FolderRepo) FindByID(ctx context.Context, id string) (*models.Folder, error) {
	var folder models.Folder
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&folder)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &folder, nil
}

func (r *FolderRepo) Insert(ctx context.Context, folder *models.Folder) error {
	_, err := r.collection.InsertOne(ctx, folder)
	return err
}

func (r *FolderRepo) Update(ctx context.Context, id string, folder *models.Folder) error {
	_, err := r.collection.ReplaceOne(ctx, bson.M{"_id": id}, folder)
	return err
}

func (r *FolderRepo) Delete(ctx context.Context, id string) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *FolderRepo) FindByParentID(ctx context.Context, parentID string) ([]models.Folder, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"parentId": parentID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var folders []models.Folder
	if err := cursor.All(ctx, &folders); err != nil {
		return nil, err
	}
	return folders, nil
}
