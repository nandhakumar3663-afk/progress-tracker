const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const databaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID || "(default)";

export const isLiveStorageConfigured = Boolean(projectId && apiKey);

const baseUrl = projectId
  ? `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents`
  : "";

function buildUrl(path) {
  const separator = path.includes("?") ? "&" : "?";
  return `${baseUrl}/${path}${separator}key=${encodeURIComponent(apiKey)}`;
}

export async function firestoreRequest(path, options = {}) {
  if (!isLiveStorageConfigured) {
    throw new Error("Firebase live storage is not configured.");
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;

    try {
      const payload = await response.json();
      message = payload.error?.message || message;
    } catch {
      // Keep the HTTP status message if Firebase does not return JSON.
    }

    throw new Error(message);
  }

  return response.json();
}

export function toFirestoreFields(value) {
  return Object.fromEntries(
    Object.entries(value).map(([key, fieldValue]) => [key, toFirestoreValue(fieldValue)])
  );
}

function toFirestoreValue(value) {
  if (value === null || value === undefined) {
    return { nullValue: null };
  }

  if (typeof value === "number") {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }

  if (typeof value === "boolean") {
    return { booleanValue: value };
  }

  if (typeof value === "object" && !Array.isArray(value)) {
    return { mapValue: { fields: toFirestoreFields(value) } };
  }

  return { stringValue: String(value) };
}

export function fromFirestoreFields(fields = {}) {
  return Object.fromEntries(
    Object.entries(fields).map(([key, fieldValue]) => [key, fromFirestoreValue(fieldValue)])
  );
}

function fromFirestoreValue(value) {
  if ("integerValue" in value) {
    return Number(value.integerValue);
  }

  if ("doubleValue" in value) {
    return Number(value.doubleValue);
  }

  if ("booleanValue" in value) {
    return value.booleanValue;
  }

  if ("mapValue" in value) {
    return fromFirestoreFields(value.mapValue.fields || {});
  }

  if ("nullValue" in value) {
    return null;
  }

  return value.stringValue || "";
}
