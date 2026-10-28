export type UserRole = "ADMIN" | "INTERVIEWER" | "CANDIDATE" | "REVIEWER";

export const PERMISSIONS = {
  ADMIN: [
    "users:manage",
    "questions:create",
    "questions:edit",
    "questions:archive",
    "interviews:create",
    "interviews:view_all",
    "interviews:delete",
    "reports:view_all",
    "reports:release",
    "analytics:view",
    "audit:view",
  ],
  INTERVIEWER: [
    "questions:create",
    "questions:edit",
    "interviews:create",
    "interviews:view_assigned",
    "interviews:manage",
    "workspace:collaborate",
    "reports:create",
    "reports:release",
    "ai:use_copilot",
    "analytics:view",
  ],
  CANDIDATE: [
    "interviews:access_invited",
    "workspace:code",
    "code:run_sample_tests",
    "code:submit",
    "reports:view_released",
  ],
  REVIEWER: [
    "interviews:view_assigned",
    "reports:create",
    "reports:edit_rubric",
    "reports:view_all",
    "ai:use_copilot",
  ],
} as const;

export function hasPermission(
  role: UserRole,
  permission: string
): boolean {
  if (role === "ADMIN") return true;
  const rolePermissions = PERMISSIONS[role] || [];
  return rolePermissions.includes(permission as never);
}

export function canManageInterview(
  userRole: UserRole,
  userId: string,
  interviewOwnerId: string
): boolean {
  if (userRole === "ADMIN") return true;
  if (userRole === "INTERVIEWER" && userId === interviewOwnerId) return true;
  return false;
}
