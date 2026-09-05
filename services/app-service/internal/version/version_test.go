package version

import "testing"

func TestDefaultVersion(t *testing.T) {
	if Value != "dev" {
		t.Fatalf("Value = %q, want %q", Value, "dev")
	}
}
