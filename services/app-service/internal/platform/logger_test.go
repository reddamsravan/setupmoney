package platform

import (
	"bytes"
	"context"
	"encoding/json"
	"log/slog"
	"strings"
	"testing"

	"setupmoney/services/app-service/internal/config"
)

func TestNewLoggerText(t *testing.T) {
	var buf bytes.Buffer
	cfg := config.LoggingConfig{
		Level:   "INFO",
		Format:  "text",
		Service: "setupmoney",
		Version: "v1.0.0",
	}

	logger := NewLogger(cfg, &buf)
	logger.Info("hello world")

	output := buf.String()
	if !strings.Contains(output, "hello world") {
		t.Fatalf("logger output missing message: %q", output)
	}
	if !strings.Contains(output, "service=setupmoney") {
		t.Fatalf("logger output missing service: %q", output)
	}
	if !strings.Contains(output, "version=v1.0.0") {
		t.Fatalf("logger output missing version: %q", output)
	}
}

func TestNewLoggerJSON(t *testing.T) {
	var buf bytes.Buffer
	cfg := config.LoggingConfig{
		Level:   "DEBUG",
		Format:  "json",
		Service: "setupmoney-test",
		Version: "v2.0.0",
	}

	logger := NewLogger(cfg, &buf)
	logger.DebugContext(context.Background(), "debug event", slog.String("trace_id", "12345"))

	var entry map[string]any
	if err := json.Unmarshal(buf.Bytes(), &entry); err != nil {
		t.Fatalf("failed to parse JSON log entry: %v, output: %q", err, buf.String())
	}

	if entry["msg"] != "debug event" {
		t.Fatalf("msg = %v, want 'debug event'", entry["msg"])
	}
	if entry["service"] != "setupmoney-test" {
		t.Fatalf("service = %v, want 'setupmoney-test'", entry["service"])
	}
	if entry["version"] != "v2.0.0" {
		t.Fatalf("version = %v, want 'v2.0.0'", entry["version"])
	}
	if entry["level"] != "DEBUG" {
		t.Fatalf("level = %v, want 'DEBUG'", entry["level"])
	}
	if entry["trace_id"] != "12345" {
		t.Fatalf("trace_id = %v, want '12345'", entry["trace_id"])
	}
}

func TestNewLoggerFiltering(t *testing.T) {
	var buf bytes.Buffer
	cfg := config.LoggingConfig{
		Level:   "WARN",
		Format:  "text",
		Service: "setupmoney",
		Version: "v1.0.0",
	}

	logger := NewLogger(cfg, &buf)
	logger.Info("should be ignored")
	logger.Warn("should be printed")

	output := buf.String()
	if strings.Contains(output, "should be ignored") {
		t.Fatalf("info log was not filtered out: %q", output)
	}
	if !strings.Contains(output, "should be printed") {
		t.Fatalf("warn log was not printed: %q", output)
	}
}
