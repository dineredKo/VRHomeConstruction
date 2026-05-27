package handlers

import (
	"net/http"

	"github.com/execada/VRHomeConstruction/backend/internal/models"
	"github.com/execada/VRHomeConstruction/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type LayoutHandler struct {
	service *services.LayoutService
}

func NewLayoutHandler(service *services.LayoutService) *LayoutHandler {
	return &LayoutHandler{service: service}
}

func (h *LayoutHandler) List(c *gin.Context) {
	layouts, err := h.service.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if layouts == nil {
		layouts = []models.Layout{}
	}

	c.JSON(http.StatusOK, layouts)
}

func (h *LayoutHandler) GetByID(c *gin.Context) {
	id := c.Param("id")

	layout, err := h.service.GetByID(c.Request.Context(), id)
	if err != nil {
		if err == services.ErrLayoutNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "layout not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, layout)
}

func (h *LayoutHandler) Create(c *gin.Context) {
	var req models.CreateLayoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	layout, err := h.service.Create(c.Request.Context(), req, defaultUserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, layout)
}

func (h *LayoutHandler) Update(c *gin.Context) {
	id := c.Param("id")

	var req models.UpdateLayoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	layout, err := h.service.Update(c.Request.Context(), id, req)
	if err != nil {
		if err == services.ErrLayoutNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "layout not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, layout)
}

func (h *LayoutHandler) Delete(c *gin.Context) {
	id := c.Param("id")

	if err := h.service.Delete(c.Request.Context(), id); err != nil {
		if err == services.ErrLayoutNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "layout not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "deleted"})
}
