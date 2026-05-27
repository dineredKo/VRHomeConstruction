package repositories

import (
	"context"
	"time"

	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type VerificationRepo struct {
	collection *mongo.Collection
}

func NewVerificationRepo(db *mongo.Client) *VerificationRepo {
	return &VerificationRepo{
		collection: db.Database("vr_home_construction").Collection("verification_codes"),
	}
}

func (r *VerificationRepo) Upsert(ctx context.Context, record *models.VerificationRecord) error {
	filter := bson.M{"email": record.Email, "purpose": record.Purpose}
	update := bson.M{
		"$set": bson.M{
			"codeHash":     record.CodeHash,
			"expiresAt":    record.ExpiresAt,
			"name":         record.Name,
			"passwordHash": record.PasswordHash,
			"userId":       record.UserID,
		},
		"$setOnInsert": bson.M{
			"_id": record.ID,
		},
	}
	opts := options.Update().SetUpsert(true)
	_, err := r.collection.UpdateOne(ctx, filter, update, opts)
	return err
}

func (r *VerificationRepo) FindValid(ctx context.Context, email, purpose string) (*models.VerificationRecord, error) {
	var record models.VerificationRecord
	err := r.collection.FindOne(ctx, bson.M{
		"email":     email,
		"purpose":   purpose,
		"expiresAt": bson.M{"$gt": time.Now()},
	}).Decode(&record)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}
	return &record, nil
}

func (r *VerificationRepo) Delete(ctx context.Context, email, purpose string) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"email": email, "purpose": purpose})
	return err
}
