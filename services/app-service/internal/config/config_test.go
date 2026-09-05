package config

import (
	"strings"
	"testing"
)

func TestLoadDevelopmentDefaults(t *testing.T) {
	config, err := Load(mapLookup(map[string]string{}))
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}

	if config.Environment != "development" {
		t.Fatalf("Environment = %q, want development", config.Environment)
	}
	if config.HTTP.Address != "127.0.0.1:8080" {
		t.Fatalf("HTTP.Address = %q, want 127.0.0.1:8080", config.HTTP.Address)
	}
	if config.HTTP.ShutdownTimeout.String() != "10s" {
		t.Fatalf("HTTP.ShutdownTimeout = %s, want 10s", config.HTTP.ShutdownTimeout)
	}
	if config.Logging.Format != "text" {
		t.Fatalf("Logging.Format = %q, want text", config.Logging.Format)
	}
}

func TestLoadParsesTypedValues(t *testing.T) {
	values := map[string]string{
		"SETUPMONEY_ENV":                         "test",
		"SETUPMONEY_HTTP_ADDRESS":                "127.0.0.1:9090",
		"SETUPMONEY_HTTP_SHUTDOWN_TIMEOUT":       "15s",
		"SETUPMONEY_HTTP_READ_TIMEOUT":           "2s",
		"SETUPMONEY_HTTP_WRITE_TIMEOUT":          "3s",
		"SETUPMONEY_HTTP_IDLE_TIMEOUT":           "4s",
		"SETUPMONEY_HTTP_MAX_HEADER_BYTES":       "8192",
		"SETUPMONEY_DATABASE_URL":                "postgres://db/app",
		"SETUPMONEY_OIDC_ISSUER":                 "https://issuer.example",
		"SETUPMONEY_OIDC_CLIENT_ID":              "client",
		"SETUPMONEY_OIDC_CLIENT_SECRET":          "secret",
		"SETUPMONEY_OIDC_REDIRECT_URL":           "https://app.example/callback",
		"SETUPMONEY_COOKIE_SECURE":               "true",
		"SETUPMONEY_COOKIE_HTTP_ONLY":            "true",
		"SETUPMONEY_COOKIE_SAME_SITE":            "strict",
		"SETUPMONEY_COOKIE_SESSION_SECRET":       "session-secret",
		"SETUPMONEY_SECURITY_TRUSTED_ORIGINS":    "https://app.example,https://admin.example",
		"SETUPMONEY_SECURITY_REQUEST_BODY_LIMIT": "1048576",
		"SETUPMONEY_SECURITY_RATE_LIMIT":         "60",
		"SETUPMONEY_LOG_LEVEL":                   "DEBUG",
		"SETUPMONEY_LOG_FORMAT":                  "json",
		"SETUPMONEY_VERSION":                     "v1.2.3",
	}

	config, err := Load(mapLookup(values))
	if err != nil {
		t.Fatalf("Load() error = %v", err)
	}
	if config.HTTP.MaxHeaderBytes != 8192 || config.Security.RequestBodyLimit != 1048576 {
		t.Fatalf("integer settings did not parse: %+v", config)
	}
	if len(config.Security.TrustedOrigins) != 2 {
		t.Fatalf("TrustedOrigins = %#v, want two origins", config.Security.TrustedOrigins)
	}
	if !config.Cookie.Secure || !config.Cookie.HTTPOnly || config.Cookie.SameSite != "strict" {
		t.Fatalf("cookie settings did not parse: %+v", config.Cookie)
	}
	if config.Logging.Version != "v1.2.3" {
		t.Fatalf("Logging.Version = %q, want v1.2.3", config.Logging.Version)
	}
}

func TestLoadRequiresProductionValues(t *testing.T) {
	_, err := Load(mapLookup(map[string]string{"SETUPMONEY_ENV": "production"}))
	if err == nil {
		t.Fatal("Load() error = nil, want production validation errors")
	}
	for _, name := range []string{"SETUPMONEY_DATABASE_URL", "SETUPMONEY_OIDC_ISSUER", "SETUPMONEY_COOKIE_SESSION_SECRET"} {
		if !strings.Contains(err.Error(), name) {
			t.Fatalf("error %q does not mention %s", err, name)
		}
	}
}

func TestLoadRedactsSecretValues(t *testing.T) {
	values := map[string]string{
		"SETUPMONEY_ENV":                "production",
		"SETUPMONEY_DATABASE_URL":       "not a url",
		"SETUPMONEY_OIDC_CLIENT_SECRET": "do-not-print",
	}
	_, err := Load(mapLookup(values))
	if err == nil {
		t.Fatal("Load() error = nil, want validation errors")
	}
	if strings.Contains(err.Error(), "do-not-print") {
		t.Fatalf("error exposes secret: %q", err)
	}
}

func TestLoad_NilLookup(t *testing.T) {
	_, err := Load(nil)
	if err == nil {
		t.Fatal("Load(nil) expected error, got nil")
	}
}

func TestLoad_PostgresqlScheme(t *testing.T) {
	cfg, err := Load(mapLookup(map[string]string{"SETUPMONEY_DATABASE_URL": "postgresql://user:pass@localhost:5432/setupmoney"}))
	if err != nil {
		t.Fatalf("Load() unexpected error with postgresql://: %v", err)
	}
	if cfg.Database.URL != "postgresql://user:pass@localhost:5432/setupmoney" {
		t.Fatalf("Database.URL = %q", cfg.Database.URL)
	}
}

func TestLoad_InvalidValues(t *testing.T) {
	tests := []struct {
		name          string
		env           map[string]string
		expectedError string
	}{
		{
			name:          "invalid duration",
			env:           map[string]string{"SETUPMONEY_HTTP_READ_TIMEOUT": "invalid_duration"},
			expectedError: "SETUPMONEY_HTTP_READ_TIMEOUT",
		},
		{
			name:          "invalid boolean",
			env:           map[string]string{"SETUPMONEY_COOKIE_HTTP_ONLY": "invalid_bool"},
			expectedError: "SETUPMONEY_COOKIE_HTTP_ONLY",
		},
		{
			name:          "invalid log level",
			env:           map[string]string{"SETUPMONEY_LOG_LEVEL": "TRACE"},
			expectedError: "SETUPMONEY_LOG_LEVEL",
		},
		{
			name:          "invalid log format",
			env:           map[string]string{"SETUPMONEY_LOG_FORMAT": "xml"},
			expectedError: "SETUPMONEY_LOG_FORMAT",
		},
		{
			name:          "unsupported database url scheme",
			env:           map[string]string{"SETUPMONEY_DATABASE_URL": "mysql://localhost/db"},
			expectedError: "SETUPMONEY_DATABASE_URL",
		},
		{
			name: "SameSite none requires Secure",
			env: map[string]string{
				"SETUPMONEY_COOKIE_SAME_SITE": "none",
				"SETUPMONEY_COOKIE_SECURE":    "false",
			},
			expectedError: "SETUPMONEY_COOKIE_SECURE",
		},
		{
			name:          "empty trusted origins",
			env:           map[string]string{"SETUPMONEY_SECURITY_TRUSTED_ORIGINS": " , "},
			expectedError: "at least one origin",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			_, err := Load(mapLookup(tc.env))
			if err == nil {
				t.Fatalf("Load() expected error, got nil")
			}
			if !strings.Contains(err.Error(), tc.expectedError) {
				t.Fatalf("error %q does not contain %q", err.Error(), tc.expectedError)
			}
		})
	}
}



func mapLookup(values map[string]string) LookupEnv {
	return func(key string) (string, bool) {
		value, ok := values[key]
		return value, ok
	}
}
