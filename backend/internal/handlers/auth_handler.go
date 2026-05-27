package handlers

import (
	"net/http"

	"github.com/execada/VRHomeConstruction/backend/internal/middleware"
	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"github.com/execada/VRHomeConstruction/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	service *services.AuthService
}

func NewAuthHandler(service *services.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) SendCode(c *gin.Context) {
	var req models.SendCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.service.SendCode(c.Request.Context(), req)
	if err != nil {
		h.handleAuthError(c, err)
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *AuthHandler) VerifyCode(c *gin.Context) {
	var req models.VerifyCodeRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	resp, err := h.service.VerifyCode(c.Request.Context(), req)
	if err != nil {
		h.handleAuthError(c, err)
		return
	}

	c.JSON(http.StatusOK, resp)
}

func (h *AuthHandler) Me(c *gin.Context) {
	userID := middleware.GetUserID(c)
	if userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	user, err := h.service.GetByID(c.Request.Context(), userID)
	if err != nil {
		if err == services.ErrUserNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "user not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *AuthHandler) handleAuthError(c *gin.Context, err error) {
	switch err {
	case services.ErrUserAlreadyExists:
		c.JSON(http.StatusConflict, gin.H{"error": "email already registered"})
	case services.ErrInvalidCredentials:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid email or password"})
	case services.ErrInvalidCode:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid verification code"})
	case services.ErrCodeExpired:
		c.JSON(http.StatusUnauthorized, gin.H{"error": "verification code expired, request a new one"})
	case services.ErrEmailSendFailed:
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	}
}
