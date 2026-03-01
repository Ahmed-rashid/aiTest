export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export function assertFound(entity, message) {
  if (!entity) {
    throw new ApiError(404, message);
  }
}
