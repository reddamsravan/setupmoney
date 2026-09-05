package platform

import (
	"io"
	"log/slog"
	"os"
	"strings"

	"setupmoney/services/app-service/internal/config"
)

// NewLogger constructs an slog.Logger matching the provided configuration.
func NewLogger(cfg config.LoggingConfig, out io.Writer) *slog.Logger {
	if out == nil {
		out = os.Stdout
	}

	var level slog.Level
	switch strings.ToUpper(strings.TrimSpace(cfg.Level)) {
	case "DEBUG":
		level = slog.LevelDebug
	case "WARN", "WARNING":
		level = slog.LevelWarn
	case "ERROR":
		level = slog.LevelError
	default:
		level = slog.LevelInfo
	}

	handlerOpts := &slog.HandlerOptions{
		Level: level,
	}

	var handler slog.Handler
	if strings.ToLower(strings.TrimSpace(cfg.Format)) == "json" {
		handler = slog.NewJSONHandler(out, handlerOpts)
	} else {
		handler = slog.NewTextHandler(out, handlerOpts)
	}

	logger := slog.New(handler)
	attrs := make([]any, 0, 4)
	if cfg.Service != "" {
		attrs = append(attrs, slog.String("service", cfg.Service))
	}
	if cfg.Version != "" {
		attrs = append(attrs, slog.String("version", cfg.Version))
	}

	if len(attrs) > 0 {
		logger = logger.With(attrs...)
	}

	return logger
}
