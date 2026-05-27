package config

import "os"

type Config struct {
	Port         string
	MongoURI     string
	JWTSecret    string
	SMTP         SMTPConfig
	ResendAPIKey string
	ResendFrom   string
}

type SMTPConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	From     string
	Enabled  bool
	LogOnly  bool
}

func Load() *Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mongoURI := os.Getenv("MONGO_URI")
	if mongoURI == "" {
		mongoURI = "mongodb://localhost:27017"
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "dev-jwt-secret-change-in-production"
	}

	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")
	if smtpPort == "" {
		smtpPort = "587"
	}
	smtpUser := os.Getenv("SMTP_USER")
	smtpPass := os.Getenv("SMTP_PASSWORD")
	smtpFrom := os.Getenv("SMTP_FROM")
	if smtpFrom == "" {
		smtpFrom = smtpUser
	}

	logOnly := os.Getenv("SMTP_LOG_ONLY") == "1" || os.Getenv("SMTP_LOG_ONLY") == "true"
	if smtpHost == "" {
		logOnly = true
	}

	resendKey := os.Getenv("RESEND_API_KEY")
	resendFrom := os.Getenv("RESEND_FROM")
	if resendFrom == "" {
		resendFrom = "VR Home <onboarding@resend.dev>"
	}

	return &Config{
		Port:         port,
		MongoURI:     mongoURI,
		JWTSecret:    jwtSecret,
		ResendAPIKey: resendKey,
		ResendFrom:   resendFrom,
		SMTP: SMTPConfig{
			Host:     smtpHost,
			Port:     smtpPort,
			User:     smtpUser,
			Password: smtpPass,
			From:     smtpFrom,
			Enabled:  smtpHost != "" && !logOnly,
			LogOnly:  logOnly,
		},
	}
}
