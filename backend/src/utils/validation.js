import { ApiError } from './errors.js';

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function nonEmptyString(value, fieldName, minLength = 1) {
  if (typeof value !== 'string' || value.trim().length < minLength) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
  return value;
}

function email(value, fieldName) {
  nonEmptyString(value, fieldName, 3);
  if (!value.includes('@') || value.startsWith('@') || value.endsWith('@')) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
  return value;
}

function positiveNumber(value, fieldName) {
  if (typeof value !== 'number' || Number.isNaN(value) || value <= 0) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
  return value;
}

function positiveIntInRange(value, fieldName, max) {
  if (!Number.isInteger(value) || value <= 0 || value > max) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
  return value;
}

function enumValue(value, fieldName, allowed) {
  if (!allowed.includes(value)) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
  return value;
}

function isoDateTimeString(value, fieldName) {
  nonEmptyString(value, fieldName, 1);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime()) || !value.includes('T')) {
    throw new ApiError(400, `Invalid ${fieldName}`);
  }
  return value;
}

export function requireObject(payload, payloadName) {
  if (!isObject(payload)) {
    throw new ApiError(400, `Invalid ${payloadName}`);
  }
  return payload;
}

export const validate = {
  nonEmptyString,
  email,
  positiveNumber,
  positiveIntInRange,
  enumValue,
  isoDateTimeString
};
