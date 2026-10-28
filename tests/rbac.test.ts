import { describe, it, expect } from "vitest";
import { hasPermission, canManageInterview } from "@/lib/auth/rbac";

describe("Role-Based Access Control (RBAC)", () => {
  it("allows ADMIN all permissions", () => {
    expect(hasPermission("ADMIN", "questions:create")).toBe(true);
    expect(hasPermission("ADMIN", "users:manage")).toBe(true);
    expect(hasPermission("ADMIN", "reports:release")).toBe(true);
  });

  it("grants INTERVIEWER interview and question management but restricts user admin", () => {
    expect(hasPermission("INTERVIEWER", "interviews:create")).toBe(true);
    expect(hasPermission("INTERVIEWER", "questions:create")).toBe(true);
    expect(hasPermission("INTERVIEWER", "ai:use_copilot")).toBe(true);
    expect(hasPermission("INTERVIEWER", "users:manage")).toBe(false);
  });

  it("restricts CANDIDATE to invited workspace, mock practice, and prevents scheduling", () => {
    expect(hasPermission("CANDIDATE", "workspace:code")).toBe(true);
    expect(hasPermission("CANDIDATE", "code:submit")).toBe(true);
    expect(hasPermission("CANDIDATE", "mock:practice")).toBe(true);
    expect(hasPermission("CANDIDATE", "interviews:create")).toBe(false);
    expect(hasPermission("CANDIDATE", "reports:release")).toBe(false);
    expect(hasPermission("CANDIDATE", "admin:panel")).toBe(false);
  });

  it("authorizes ADMIN for global governance and control panel", () => {
    expect(hasPermission("ADMIN", "admin:panel")).toBe(true);
    expect(hasPermission("ADMIN", "users:manage")).toBe(true);
    expect(hasPermission("ADMIN", "interviews:delete")).toBe(true);
    expect(hasPermission("INTERVIEWER", "admin:panel")).toBe(false);
  });

  it("validates interview management ownership correctly", () => {
    const ownerId = "user-123";
    const otherId = "user-456";

    expect(canManageInterview("INTERVIEWER", ownerId, ownerId)).toBe(true);
    expect(canManageInterview("INTERVIEWER", otherId, ownerId)).toBe(false);
    expect(canManageInterview("ADMIN", otherId, ownerId)).toBe(true);
    expect(canManageInterview("CANDIDATE", ownerId, ownerId)).toBe(false);
  });
});
