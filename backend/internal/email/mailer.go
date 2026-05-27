package email

import (
	"crypto/tls"
	"fmt"
	"log"
	"net"
	"net/smtp"
	"strings"
	"time"

	"github.com/execada/VRHomeConstruction/backend/internal/config"
)

const smtpTimeout = 25 * time.Second

type Mailer struct {
	cfg config.SMTPConfig
}

func NewMailer(cfg config.SMTPConfig) *Mailer {
	return &Mailer{cfg: cfg}
}

func (m *Mailer) LogOnly() bool {
	return m.cfg.LogOnly || !m.cfg.Enabled
}

// Ensure Mailer implements Sender.
var _ Sender = (*Mailer)(nil)

func (m *Mailer) SendVerificationCode(to, code, purposeLabel string) error {
	subject := "Код подтверждения — VR Home Construction"
	body := fmt.Sprintf(
		"Здравствуйте!\n\nВаш код для %s: %s\n\nКод действителен 10 минут. Если вы не запрашивали код, проигнорируйте это письмо.\n",
		purposeLabel,
		code,
	)

	if !m.cfg.Enabled || m.cfg.LogOnly {
		log.Printf("[CODE] to=%s purpose=%s code=%s (SMTP_LOG_ONLY)", to, purposeLabel, code)
		return nil
	}

	from := m.cfg.From
	if from == "" {
		from = m.cfg.User
	}

	msg := strings.Join([]string{
		"From: " + from,
		"To: " + to,
		"Subject: " + subject,
		"MIME-Version: 1.0",
		"Content-Type: text/plain; charset=UTF-8",
		"",
		body,
	}, "\r\n")

	var err error
	if m.cfg.Port == "465" {
		err = m.sendTLS465(from, to, []byte(msg))
	} else {
		err = m.sendSTARTTLS(from, to, []byte(msg))
	}

	if err != nil {
		log.Printf("[EMAIL FAILED] to=%s code=%s err=%v", to, code, err)
		return err
	}

	log.Printf("[EMAIL OK] code sent to %s", to)
	return nil
}

// sendTLS465 — Gmail SSL (порт 465), часто работает при блокировке 587.
func (m *Mailer) sendTLS465(from, to string, msg []byte) error {
	addr := net.JoinHostPort(m.cfg.Host, m.cfg.Port)
	tlsConfig := &tls.Config{ServerName: m.cfg.Host}

	conn, err := tls.DialWithDialer(&net.Dialer{Timeout: smtpTimeout}, "tcp", addr, tlsConfig)
	if err != nil {
		return fmt.Errorf("tls dial %s: %w", addr, err)
	}
	defer conn.Close()

	_ = conn.SetDeadline(time.Now().Add(smtpTimeout))

	client, err := smtp.NewClient(conn, m.cfg.Host)
	if err != nil {
		return fmt.Errorf("smtp client: %w", err)
	}
	defer client.Close()

	return m.deliver(client, from, to, msg)
}

func (m *Mailer) sendSTARTTLS(from, to string, msg []byte) error {
	addr := net.JoinHostPort(m.cfg.Host, m.cfg.Port)

	conn, err := net.DialTimeout("tcp", addr, smtpTimeout)
	if err != nil {
		return fmt.Errorf("dial %s: %w", addr, err)
	}
	defer conn.Close()

	_ = conn.SetDeadline(time.Now().Add(smtpTimeout))

	client, err := smtp.NewClient(conn, m.cfg.Host)
	if err != nil {
		return fmt.Errorf("smtp client: %w", err)
	}
	defer client.Close()

	if ok, _ := client.Extension("STARTTLS"); ok {
		tlsConfig := &tls.Config{ServerName: m.cfg.Host}
		if err = client.StartTLS(tlsConfig); err != nil {
			return fmt.Errorf("starttls: %w", err)
		}
	}

	return m.deliver(client, from, to, msg)
}

func (m *Mailer) deliver(client *smtp.Client, from, to string, msg []byte) error {
	auth := smtp.PlainAuth("", m.cfg.User, m.cfg.Password, m.cfg.Host)
	if err := client.Auth(auth); err != nil {
		return fmt.Errorf("smtp auth: %w", err)
	}

	if err := client.Mail(from); err != nil {
		return err
	}
	if err := client.Rcpt(to); err != nil {
		return err
	}

	w, err := client.Data()
	if err != nil {
		return err
	}
	if _, err = w.Write(msg); err != nil {
		return err
	}
	if err = w.Close(); err != nil {
		return err
	}

	return client.Quit()
}
