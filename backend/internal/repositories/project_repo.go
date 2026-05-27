package repositories

import (
	"context"

	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type ProjectRepo struct {
	collection *mongo.Collection
}

func NewProjectRepo(db *mongo.Client) *ProjectRepo {
	return &ProjectRepo{
		collection: db.Database("vr_home_construction").Collection("projects"),
	}
}

func (r *ProjectRepo) FindAll(ctx context.Context, filter bson.M, page, limit int64) ([]models.Project, int64, error) {
	opts := options.Find().
		SetSkip((page - 1) * limit).
		SetLimit(limit).
		SetSort(bson.D{{Key: "updatedAt", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, 0, err
	}
	defer cursor.Close(ctx)

	var projects []models.Project
	if err := cursor.All(ctx, &projects); err != nil {
		return nil, 0, err
	}

	total, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return nil, 0, err
	}

	return projects, total, nil
}

func (r *ProjectRepo) FindByID(ctx context.Context, id string) (*models.Project, error) {
	var project models.Project
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&project)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepo) Insert(ctx context.Context, project *models.Project) error {
	_, err := r.collection.InsertOne(ctx, project)
	return err
}

func (r *ProjectRepo) Update(ctx context.Context, id string, project *models.Project) error {
	_, err := r.collection.ReplaceOne(ctx, bson.M{"_id": id}, project)
	return err
}

func (r *ProjectRepo) Delete(ctx context.Context, id string) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}
