package models

import "time"

type Opening struct {
	ID       string    `json:"id" bson:"id"`
	WallID   string    `json:"wallId" bson:"wallId"`
	Type     string    `json:"type" bson:"type"`
	Position []float64 `json:"position" bson:"position"`
	Width    float64   `json:"width" bson:"width"`
	Height   float64   `json:"height" bson:"height"`
}

type Partition struct {
	ID       string    `json:"id" bson:"id"`
	Position []float64 `json:"position" bson:"position"`
	Rotation []float64 `json:"rotation" bson:"rotation"`
	Size     []float64 `json:"size" bson:"size"`
	Openings []Opening `json:"openings" bson:"openings"`
	Color    *string   `json:"color,omitempty" bson:"color,omitempty"`
}

type FurnitureItem struct {
	ID        string    `json:"id" bson:"id"`
	Name      string    `json:"name" bson:"name"`
	ModelPath string    `json:"modelPath" bson:"modelPath"`
	Position  []float64 `json:"position" bson:"position"`
	Rotation  []float64 `json:"rotation" bson:"rotation"`
	Scale     float64   `json:"scale" bson:"scale"`
	HalfWidth *float64  `json:"halfWidth,omitempty" bson:"halfWidth,omitempty"`
	HalfDepth *float64  `json:"halfDepth,omitempty" bson:"halfDepth,omitempty"`
	Height    *float64  `json:"height,omitempty" bson:"height,omitempty"`
}

type RoomDimensions struct {
	Width  float64 `json:"width" bson:"width"`
	Height float64 `json:"height" bson:"height"`
	Depth  float64 `json:"depth" bson:"depth"`
}

type RoomColors struct {
	Walls   string `json:"walls" bson:"walls"`
	Floor   string `json:"floor" bson:"floor"`
	Ceiling string `json:"ceiling" bson:"ceiling"`
}

type RoomLight struct {
	Intensity        float64 `json:"intensity" bson:"intensity"`
	AmbientIntensity float64 `json:"ambientIntensity" bson:"ambientIntensity"`
	Color            string  `json:"color" bson:"color"`
}

type RoomData struct {
	Dimensions RoomDimensions  `json:"dimensions" bson:"dimensions"`
	Colors     RoomColors      `json:"colors" bson:"colors"`
	Light      RoomLight       `json:"light" bson:"light"`
	Openings   []Opening       `json:"openings" bson:"openings"`
	Partitions []Partition     `json:"partitions" bson:"partitions"`
	Furniture  []FurnitureItem `json:"furniture" bson:"furniture"`
}

type Project struct {
	ID        string    `json:"_id" bson:"_id"`
	Name      string    `json:"name" bson:"name"`
	Template  *string   `json:"template,omitempty" bson:"template,omitempty"`
	Number    *int      `json:"number,omitempty" bson:"number,omitempty"`
	CreatedAt time.Time `json:"createdAt" bson:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt" bson:"updatedAt"`
	UserID    string    `json:"userId" bson:"userId"`
	Status    string    `json:"status" bson:"status"`
	RoomData  RoomData  `json:"roomData" bson:"roomData"`
}

type CreateProjectRequest struct {
	Name     string  `json:"name" binding:"required"`
	Template *string `json:"template,omitempty"`
	Status   string  `json:"status"`
}

type UpdateProjectRequest struct {
	Name     string   `json:"name" binding:"required"`
	Template *string  `json:"template,omitempty"`
	Number   *int     `json:"number,omitempty"`
	Status   string   `json:"status" binding:"required"`
	RoomData RoomData `json:"roomData" binding:"required"`
}
