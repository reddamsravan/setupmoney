package platform

import (
	"testing"
	"time"
)

func TestRealClock(t *testing.T) {
	clock := RealClock{}
	before := time.Now()
	now := clock.Now()
	after := time.Now()

	if now.Before(before) || now.After(after) {
		t.Fatalf("RealClock.Now() = %v, want between %v and %v", now, before, after)
	}
}

func TestFixedClock(t *testing.T) {
	fixedTime := time.Date(2026, 9, 5, 12, 0, 0, 0, time.UTC)
	clock := NewFixedClock(fixedTime)

	if got := clock.Now(); !got.Equal(fixedTime) {
		t.Fatalf("FixedClock.Now() = %v, want %v", got, fixedTime)
	}
}
