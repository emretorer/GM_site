const ROLE_ALIASES = {
  admin: "admin",
  institution: "institution",
  kurum: "institution",
  psychologist: "institution",
  psikolog: "institution",
  teacher: "teacher",
  parent: "parent",
  child: "child",
  student: "child",
};

function normalizeRole(role) {
  if (typeof role !== "string") {
    return null;
  }
  const trimmedRole = role.trim().toLowerCase();
  if (!trimmedRole) {
    return null;
  }
  return ROLE_ALIASES[trimmedRole] || trimmedRole;
}

export function getAccountUserType(accountData = {}) {
  if (!accountData || typeof accountData !== "object") {
    return null;
  }

  if (typeof accountData.userType === "string" && accountData.userType.trim()) {
    return accountData.userType.trim();
  }

  if (Array.isArray(accountData.roles) && accountData.roles.length > 0) {
    const roleFromList = accountData.roles.find(
      (role) => typeof role === "string" && role.trim()
    );
    if (roleFromList) {
      return roleFromList.trim();
    }
  }

  if (typeof accountData.user_type === "string" && accountData.user_type.trim()) {
    return accountData.user_type.trim();
  }

  return null;
}

export function getAccountRoles(accountData = {}) {
  if (!accountData || typeof accountData !== "object") {
    return [];
  }

  if (Array.isArray(accountData.roles) && accountData.roles.length > 0) {
    return accountData.roles
      .filter((role) => typeof role === "string" && role.trim())
      .map((role) => role.trim());
  }

  const userType = getAccountUserType(accountData);
  return userType ? [userType] : [];
}

export function hasRole(accountData, expectedRole) {
  const normalizedExpectedRole = normalizeRole(expectedRole);
  if (!normalizedExpectedRole) {
    return false;
  }

  const roles = getAccountRoles(accountData);
  return roles.some((role) => normalizeRole(role) === normalizedExpectedRole);
}
