package email

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type ResendSender struct {
	apiKey string
	from   string
	client *http.Client
}

func NewResendSender(apiKey, from string) *ResendSender {
	if from == "" {
		from = "VR Home <onboarding@resend.dev>"
	}
	return &ResendSender{
		apiKey: apiKey,
		from:   from,
		client: &http.Client{Timeout: 15 * time.Second},
	}
}

func (r *ResendSender) SendVerificationCode(to, code, purposeLabel string) error {
	subject := "Код подтверждения — VR Home Construction"
	text := fmt.Sprintf(
		"Здравствуйте!\n\nВаш код для %s: %s\n\nКод действителен 10 минут.\n",
		purposeLabel,
		code,
	)

	payload := map[string]interface{}{
		"from":    r.from,
		"to":      []string{to},
		"subject": subject,
		"text":    text,
	}
	body, _ := json.Marshal(payload)

	req, err := http.NewRequest(http.MethodPost, "https://api.resend.com/emails", bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+r.apiKey)
	req.Header.Set("Content-Type", "application/json")

	res, err := r.client.Do(req)
	if err != nil {
		return fmt.Errorf("resend request: %w", err)
	}
	defer res.Body.Close()

	if res.StatusCode >= 400 {
		var errBody struct {
			Message string `json:"message"`
		}
		_ = json.NewDecoder(res.Body).Decode(&errBody)
		msg := errBody.Message
		if msg == "" {
			msg = res.Status
		}
		return fmt.Errorf("resend api: %s", msg)
	}

	log.Printf("[RESEND OK] code sent to %s", to)
	return nil
}

func (r *ResendSender) LogOnly() bool {
	return false
}

var _ Sender = (*ResendSender)(nil)
