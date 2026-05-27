package models

import "time"

type Layout struct {
	ID        string    `json:"_id" bson:"_id"`
	Name      string    `json:"name" bson:"name"`
	UserID    string    `json:"userId" bson:"userId"`
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
}

type CreateLayoutRequest struct {
	Name string `json:"name" binding:"required"`
}

type UpdateLayoutRequest struct {
	Name string `json:"name" binding:"required"`
}
