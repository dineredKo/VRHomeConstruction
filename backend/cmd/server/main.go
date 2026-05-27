package main

import (
	"log"
	"time"

	"github.com/execada/VRHomeConstruction/backend/internal/auth"
	"github.com/execada/VRHomeConstruction/backend/internal/config"
	"github.com/execada/VRHomeConstruction/backend/internal/database"
	"github.com/execada/VRHomeConstruction/backend/internal/email"
	"github.com/execada/VRHomeConstruction/backend/internal/handlers"
	"github.com/execada/VRHomeConstruction/backend/internal/middleware"
	"github.com/execada/VRHomeConstruction/backend/internal/repositories"
	"github.com/execada/VRHomeConstruction/backend/internal/services"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	client, err := database.Connect(cfg.MongoURI)
	if err != nil {
		log.Fatalf("failed to connect to MongoDB: %v", err)
	}
	defer client.Disconnect(nil)

	log.Println("connected to MongoDB")

	if cfg.ResendAPIKey != "" {
		log.Printf("Email: Resend API (from %s)", cfg.ResendFrom)
	} else if cfg.SMTP.LogOnly {
		log.Println("Email: только логи ([CODE] в консоли)")
	} else if cfg.SMTP.Enabled {
		log.Printf("Email: SMTP %s:%s", cfg.SMTP.Host, cfg.SMTP.Port)
	} else {
		log.Println("Email: не настроен — коды в логах")
	}

	userRepo := repositories.NewUserRepo(client)
	verificationRepo := repositories.NewVerificationRepo(client)
	projectRepo := repositories.NewProjectRepo(client)
	folderRepo := repositories.NewFolderRepo(client)
	layoutRepo := repositories.NewLayoutRepo(client)

	tokenService := auth.NewTokenService(cfg.JWTSecret, 7*24*time.Hour)

	sender := email.NewSender(cfg)
	authService := services.NewAuthService(userRepo, verificationRepo, tokenService, sender)
	projectService := services.NewProjectService(projectRepo)
	folderService := services.NewFolderService(folderRepo)
	layoutService := services.NewLayoutService(layoutRepo)

	authHandler := handlers.NewAuthHandler(authService)
	projectHandler := handlers.NewProjectHandler(projectService)
	folderHandler := handlers.NewFolderHandler(folderService)
	layoutHandler := handlers.NewLayoutHandler(layoutService)

	r := gin.Default()
	r.Use(middleware.CORS())

	api := r.Group("/api")
	{
		authRoutes := api.Group("/auth")
		{
			authRoutes.POST("/send-code", authHandler.SendCode)
			authRoutes.POST("/verify-code", authHandler.VerifyCode)

			protected := authRoutes.Group("")
			protected.Use(middleware.Auth(tokenService))
			protected.GET("/me", authHandler.Me)
		}

		protected := api.Group("")
		protected.Use(middleware.Auth(tokenService))
		{
			projects := protected.Group("/projects")
			{
				projects.GET("", projectHandler.List)
				projects.GET("/:id", projectHandler.GetByID)
				projects.POST("", projectHandler.Create)
				projects.PUT("/:id", projectHandler.Update)
				projects.DELETE("/:id", projectHandler.Delete)
			}
		}

		folders := api.Group("/folders")
		{
			folders.GET("", folderHandler.GetTree)
			folders.POST("", folderHandler.Create)
			folders.PUT("/:id", folderHandler.Update)
			folders.DELETE("/:id", folderHandler.Delete)
		}

		layouts := api.Group("/layouts")
		{
			layouts.GET("", layoutHandler.List)
			layouts.POST("", layoutHandler.Create)
			layouts.PUT("/:id", layoutHandler.Update)
			layouts.DELETE("/:id", layoutHandler.Delete)
		}
	}

	log.Printf("starting server on port %s", cfg.Port)
	if err := r.Run(":" + cfg.Port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
