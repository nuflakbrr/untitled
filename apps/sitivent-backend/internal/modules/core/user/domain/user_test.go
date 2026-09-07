package domain

import (
	"testing"
	"time"
)

func TestUser_IsBanned_NotBanned(t *testing.T) {
	u := &User{Banned: false}
	if u.IsBanned() {
		t.Error("IsBanned() should be false for non-banned user")
	}
}

func TestUser_IsBanned_PermanentBan(t *testing.T) {
	u := &User{Banned: true, BanExpires: nil}
	if !u.IsBanned() {
		t.Error("IsBanned() should be true for permanently banned user (no expiry)")
	}
}

func TestUser_IsBanned_ActiveBan(t *testing.T) {
	future := time.Now().Add(24 * time.Hour)
	u := &User{Banned: true, BanExpires: &future}
	if !u.IsBanned() {
		t.Error("IsBanned() should be true for user with active future ban")
	}
}

func TestUser_IsBanned_ExpiredBan(t *testing.T) {
	past := time.Now().Add(-24 * time.Hour)
	u := &User{Banned: true, BanExpires: &past}
	if u.IsBanned() {
		t.Error("IsBanned() should be false for user whose ban has expired")
	}
}

func TestUser_CanLogin_Active(t *testing.T) {
	u := &User{Banned: false}
	if !u.CanLogin() {
		t.Error("CanLogin() should be true for non-banned user")
	}
}

func TestUser_CanLogin_Banned(t *testing.T) {
	u := &User{Banned: true, BanExpires: nil}
	if u.CanLogin() {
		t.Error("CanLogin() should be false for banned user")
	}
}
