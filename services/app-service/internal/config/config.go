package config

import (
	"errors"
	"fmt"
	"net/url"
	"strconv"
	"strings"
	"time"

	"setupmoney/services/app-service/internal/version"
)

type LookupEnv func(string) (string, bool)

type Config struct {
	Environment string
	HTTP        HTTPConfig
	Database    DatabaseConfig
	OIDC        OIDCConfig
	Cookie      CookieConfig
	Security    SecurityConfig
	Logging     LoggingConfig
}

type HTTPConfig struct {
	Address         string
	ShutdownTimeout time.Duration
	ReadTimeout     time.Duration
	WriteTimeout    time.Duration
	IdleTimeout     time.Duration
	MaxHeaderBytes  int
}

type DatabaseConfig struct {
	URL string
}

type OIDCConfig struct {
	Issuer       string
	ClientID     string
	ClientSecret string
	RedirectURL  string
}

type CookieConfig struct {
	Secure        bool
	HTTPOnly      bool
	SameSite      string
	SessionSecret string
}

type SecurityConfig struct {
	TrustedOrigins   []string
	RequestBodyLimit int64
	RateLimit        int
}

type LoggingConfig struct {
	Level   string
	Format  string
	Service string
	Version string
}

func Load(lookup LookupEnv) (Config, error) {
	if lookup == nil {
		return Config{}, errors.New("configuration lookup cannot be nil")
	}

	get := func(name, fallback string) string {
		if value, ok := lookup(name); ok && strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
		return fallback
	}

	errorsFound := make([]string, 0)

	config := Config{
		Environment: get("SETUPMONEY_ENV", "development"),
		HTTP: HTTPConfig{
			Address:         get("SETUPMONEY_HTTP_ADDRESS", "127.0.0.1:8080"),
			ShutdownTimeout: getDuration(get, "SETUPMONEY_HTTP_SHUTDOWN_TIMEOUT", 10*time.Second),
			ReadTimeout:     getDuration(get, "SETUPMONEY_HTTP_READ_TIMEOUT", 15*time.Second),
			WriteTimeout:    getDuration(get, "SETUPMONEY_HTTP_WRITE_TIMEOUT", 15*time.Second),
			IdleTimeout:     getDuration(get, "SETUPMONEY_HTTP_IDLE_TIMEOUT", 60*time.Second),
			MaxHeaderBytes:  getInt(get, "SETUPMONEY_HTTP_MAX_HEADER_BYTES", 1<<20),
		},
		Database: DatabaseConfig{URL: get("SETUPMONEY_DATABASE_URL", "postgres://setupmoney:setupmoney@localhost:5432/setupmoney?sslmode=disable")},
		OIDC: OIDCConfig{
			Issuer:       get("SETUPMONEY_OIDC_ISSUER", ""),
			ClientID:     get("SETUPMONEY_OIDC_CLIENT_ID", ""),
			ClientSecret: get("SETUPMONEY_OIDC_CLIENT_SECRET", ""),
			RedirectURL:  get("SETUPMONEY_OIDC_REDIRECT_URL", ""),
		},
		Cookie: CookieConfig{
			Secure:        getBool(&errorsFound, lookup, "SETUPMONEY_COOKIE_SECURE", false),
			HTTPOnly:      getBool(&errorsFound, lookup, "SETUPMONEY_COOKIE_HTTP_ONLY", true),
			SameSite:      get("SETUPMONEY_COOKIE_SAME_SITE", "lax"),
			SessionSecret: get("SETUPMONEY_COOKIE_SESSION_SECRET", "development-session-secret"),
		},
		Security: SecurityConfig{
			TrustedOrigins:   getList(get("SETUPMONEY_SECURITY_TRUSTED_ORIGINS", "http://localhost:5173")),
			RequestBodyLimit: getInt64(get, "SETUPMONEY_SECURITY_REQUEST_BODY_LIMIT", 10<<20),
			RateLimit:        getInt(get, "SETUPMONEY_SECURITY_RATE_LIMIT", 60),
		},
		Logging: LoggingConfig{
			Level:   get("SETUPMONEY_LOG_LEVEL", "INFO"),
			Format:  get("SETUPMONEY_LOG_FORMAT", "text"),
			Service: get("SETUPMONEY_SERVICE_NAME", "setupmoney"),
			Version: get("SETUPMONEY_VERSION", version.Value),
		},
	}

	validateConfig(config, lookup, &errorsFound)

	if len(errorsFound) > 0 {
		return Config{}, errors.New(strings.Join(errorsFound, "; "))
	}
	return config, nil
}

func validateConfig(config Config, lookup LookupEnv, errorsFound *[]string) {
	if config.Environment != "development" && config.Environment != "test" && config.Environment != "production" {
		*errorsFound = append(*errorsFound, "SETUPMONEY_ENV must be development, test, or production")
	}
	validatePositive(errorsFound, "SETUPMONEY_HTTP_SHUTDOWN_TIMEOUT", config.HTTP.ShutdownTimeout)
	validatePositive(errorsFound, "SETUPMONEY_HTTP_READ_TIMEOUT", config.HTTP.ReadTimeout)
	validatePositive(errorsFound, "SETUPMONEY_HTTP_WRITE_TIMEOUT", config.HTTP.WriteTimeout)
	validatePositive(errorsFound, "SETUPMONEY_HTTP_IDLE_TIMEOUT", config.HTTP.IdleTimeout)
	if config.HTTP.MaxHeaderBytes <= 0 {
		*errorsFound = append(*errorsFound, "SETUPMONEY_HTTP_MAX_HEADER_BYTES must be positive")
	}
	validateURL(errorsFound, "SETUPMONEY_DATABASE_URL", config.Database.URL, "postgres", "postgresql")
	validateURL(errorsFound, "SETUPMONEY_OIDC_ISSUER", config.OIDC.Issuer, "http", "https")
	validateURL(errorsFound, "SETUPMONEY_OIDC_REDIRECT_URL", config.OIDC.RedirectURL, "http", "https")
	if config.Cookie.SameSite != "lax" && config.Cookie.SameSite != "strict" && config.Cookie.SameSite != "none" {
		*errorsFound = append(*errorsFound, "SETUPMONEY_COOKIE_SAME_SITE must be lax, strict, or none")
	}
	if config.Cookie.SameSite == "none" && !config.Cookie.Secure {
		*errorsFound = append(*errorsFound, "SETUPMONEY_COOKIE_SECURE must be true when SETUPMONEY_COOKIE_SAME_SITE is none")
	}
	if config.Security.RequestBodyLimit <= 0 {
		*errorsFound = append(*errorsFound, "SETUPMONEY_SECURITY_REQUEST_BODY_LIMIT must be positive")
	}
	if config.Security.RateLimit <= 0 {
		*errorsFound = append(*errorsFound, "SETUPMONEY_SECURITY_RATE_LIMIT must be positive")
	}
	if len(config.Security.TrustedOrigins) == 0 {
		*errorsFound = append(*errorsFound, "SETUPMONEY_SECURITY_TRUSTED_ORIGINS must contain at least one origin")
	}
	if config.Logging.Level == "" || config.Logging.Format == "" || config.Logging.Service == "" {
		*errorsFound = append(*errorsFound, "logging settings must not be empty")
	}
	level := strings.ToUpper(config.Logging.Level)
	if level != "DEBUG" && level != "INFO" && level != "WARN" && level != "WARNING" && level != "ERROR" {
		*errorsFound = append(*errorsFound, "SETUPMONEY_LOG_LEVEL must be DEBUG, INFO, WARN, or ERROR")
	}
	if config.Logging.Format != "text" && config.Logging.Format != "json" {
		*errorsFound = append(*errorsFound, "SETUPMONEY_LOG_FORMAT must be text or json")
	}
	if config.Environment == "production" {
		validatePresentEnv(errorsFound, lookup, "SETUPMONEY_DATABASE_URL")
		validatePresentEnv(errorsFound, lookup, "SETUPMONEY_OIDC_ISSUER")
		validatePresentEnv(errorsFound, lookup, "SETUPMONEY_OIDC_CLIENT_ID")
		validatePresentEnv(errorsFound, lookup, "SETUPMONEY_OIDC_CLIENT_SECRET")
		validatePresentEnv(errorsFound, lookup, "SETUPMONEY_OIDC_REDIRECT_URL")
		validatePresentEnv(errorsFound, lookup, "SETUPMONEY_COOKIE_SESSION_SECRET")
		validatePresentEnv(errorsFound, lookup, "SETUPMONEY_SECURITY_TRUSTED_ORIGINS")
		if !config.Cookie.Secure {
			*errorsFound = append(*errorsFound, "SETUPMONEY_COOKIE_SECURE must be true in production")
		}
	}
}

func getDuration(get func(string, string) string, name string, fallback time.Duration) time.Duration {
	value := get(name, fallback.String())
	parsed, err := time.ParseDuration(value)
	if err != nil {
		return 0
	}
	return parsed
}

func getInt(get func(string, string) string, name string, fallback int) int {
	value := get(name, strconv.Itoa(fallback))
	parsed, err := strconv.Atoi(value)
	if err != nil {
		return 0
	}
	return parsed
}

func getInt64(get func(string, string) string, name string, fallback int64) int64 {
	value := get(name, strconv.FormatInt(fallback, 10))
	parsed, err := strconv.ParseInt(value, 10, 64)
	if err != nil {
		return 0
	}
	return parsed
}

func getBool(errorsFound *[]string, lookup LookupEnv, name string, fallback bool) bool {
	value, ok := lookup(name)
	if !ok || strings.TrimSpace(value) == "" {
		return fallback
	}
	parsed, err := strconv.ParseBool(strings.TrimSpace(value))
	if err != nil {
		*errorsFound = append(*errorsFound, fmt.Sprintf("%s must be a valid boolean", name))
		return fallback
	}
	return parsed
}

func getList(value string) []string {
	parts := strings.Split(value, ",")
	result := make([]string, 0, len(parts))
	for _, part := range parts {
		if value := strings.TrimSpace(part); value != "" {
			result = append(result, value)
		}
	}
	return result
}

func validatePresentEnv(errorsFound *[]string, lookup LookupEnv, name string) {
	value, ok := lookup(name)
	if !ok || strings.TrimSpace(value) == "" {
		*errorsFound = append(*errorsFound, fmt.Sprintf("%s is required", name))
	}
}

func validatePositive(errorsFound *[]string, name string, value time.Duration) {
	if value <= 0 {
		*errorsFound = append(*errorsFound, fmt.Sprintf("%s must be a positive duration", name))
	}
}

func validateURL(errorsFound *[]string, name, value string, schemes ...string) {
	if value == "" {
		return
	}
	parsed, err := url.Parse(value)
	if err != nil || parsed.Scheme == "" || parsed.Host == "" {
		*errorsFound = append(*errorsFound, fmt.Sprintf("%s must be a valid URL", name))
		return
	}
	for _, scheme := range schemes {
		if parsed.Scheme == scheme {
			return
		}
	}
	*errorsFound = append(*errorsFound, fmt.Sprintf("%s uses an unsupported URL scheme", name))
}
