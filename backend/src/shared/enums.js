export const TODO_STATUS = Object.freeze({
  ACTIVE: "active",
  INACTIVE: "inactive",
  COMPLETED: "completed",
});

export const VALID_TODO_STATUS = Object.freeze(Object.values(TODO_STATUS));

export const PRIORITY_STATUS = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

export const VALID_PRIORITY_STATUS = Object.freeze(
  Object.values(PRIORITY_STATUS),
);
