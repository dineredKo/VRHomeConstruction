package models

type User struct {
	ID           string  `json:"-" bson:"_id"`
	Name         string  `json:"name" bson:"name"`
	Email        string  `json:"email" bson:"email"`
	PasswordHash string  `json:"-" bson:"passwordHash"`
	Avatar       *string `json:"avatar,omitempty" bson:"avatar,omitempty"`
}

// UserPublic is the API representation expected by the frontend (id, not _id).
type UserPublic struct {
	ID     string  `json:"id"`
	Name   string  `json:"name"`
	Email  string  `json:"email"`
	Avatar *string `json:"avatar,omitempty"`
}

func (u *User) ToPublic() UserPublic {
	return UserPublic{
		ID:     u.ID,
		Name:   u.Name,
		Email:  u.Email,
		Avatar: u.Avatar,
	}
}

type RegisterRequest struct {
	Name     string `json:"name" binding:"required,min=1"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	User  UserPublic `json:"user"`
	Token string     `json:"token"`
}
