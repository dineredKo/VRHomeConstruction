package handlers

import (
	"net/http"

	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"github.com/execada/VRHomeConstruction/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type FolderHandler struct {
	service *services.FolderService
}

func NewFolderHandler(service *services.FolderService) *FolderHandler {
	return &FolderHandler{service: service}
}

func (h *FolderHandler) GetTree(c *gin.Context) {
	tree, err := h.service.GetTree(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if tree == nil {
		tree = []models.FolderTree{}
	}

	c.JSON(http.StatusOK, tree)
}

func (h *FolderHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	folder, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == services.ErrFolderNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "folder not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, folder)
}

func (h *FolderHandler) Create(c *gin.Context) {
	var req models.CreateFolderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	folder, err := h.service.Create(c.Request.Context(), req, defaultUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, folder)
}

func (h *FolderHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req models.UpdateFolderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	folder, err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		if err == services.ErrFolderNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "folder not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, folder)
}

func (h *FolderHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if err == services.ErrFolderNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "folder not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
