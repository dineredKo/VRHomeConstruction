package repositories

import (
	"context"

	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type LayoutRepo struct {
	collection *mongo.Collection
}

func NewLayoutRepo(db *mongo.Client) *LayoutRepo {
	return &LayoutRepo{
		collection: db.Database("vr_home_construction").Collection("layouts"),
	}
}

func (r *LayoutRepo) FindAll(ctx context.Context) ([]models.Layout, error) {
	cursor, err := r.collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var layouts []models.Layout
	if err := cursor.All(ctx, &layouts); err != nil {
		return nil, err
	}
	return layouts, nil
}

func (r *LayoutRepo) FindByID(ctx context.Context, id string) (*models.Layout, error) {
	var layout models.Layout
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&layout)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &layout, nil
}

func (r *LayoutRepo) Insert(ctx context.Context, layout *models.Layout) error {
	_, err := r.collection.InsertOne(ctx, layout)
	return err
}

func (r *LayoutRepo) Update(ctx context.Context, id string, layout *models.Layout) error {
	_, err := r.collection.ReplaceOne(ctx, bson.M{"_id": id}, layout)
	return err
}

func (r *LayoutRepo) Delete(ctx context.Context, id string) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}
