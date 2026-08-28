package repository

import (
	"strings"
	"testing"

	"venturo-skeleton-go/internal/modules/features/registration/dto"
)

func TestRegistrationNumberFormatAndLength(t *testing.T) {
	number := makeRegistrationNumber(" Fasilkom ", "Workshop Go & Next.js", 2026, 7)
	if number != "REG-FASILKOM-WORKSHOP-GO-NEXT-JS-2026-00007" {
		t.Fatalf("number = %q", number)
	}
	long := makeRegistrationNumber(strings.Repeat("TENANT", 10), strings.Repeat("event-", 30), 2026, 99999)
	if len(long) > 100 {
		t.Fatalf("registration number length = %d", len(long))
	}
}

func TestPaginationDefaults(t *testing.T) {
	page, limit := pagination(dto.RegistrationQuery{})
	if page != 1 || limit != 10 {
		t.Fatalf("page = %d, limit = %d", page, limit)
	}
	page, limit = pagination(dto.RegistrationQuery{Page: 3, Limit: 25})
	if page != 3 || limit != 25 {
		t.Fatalf("page = %d, limit = %d", page, limit)
	}
}
