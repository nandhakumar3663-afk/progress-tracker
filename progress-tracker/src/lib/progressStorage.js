import { DEFAULT_PROGRESS, SKILLS, normalizeUserId } from "../data/students";
import {
  firestoreRequest,
  fromFirestoreFields,
  isLiveStorageConfigured,
  toFirestoreFields,
} from "./firestore";

const COLLECTION = "progress";

export { isLiveStorageConfigured };

function clampNumber(value, min, max) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return min;
  }

  return Math.min(max, Math.max(min, Math.trunc(number)));
}

export function sanitizeProgress(progress = {}) {
  const nextProgress = { ...DEFAULT_PROGRESS };

  SKILLS.forEach((skill) => {
    nextProgress[skill.key] = clampNumber(progress[skill.key], 0, skill.max);
  });

  nextProgress.rp = clampNumber(progress.rp, 0, Number.MAX_SAFE_INTEGER);
  nextProgress.ap = clampNumber(progress.ap, 0, Number.MAX_SAFE_INTEGER);
  nextProgress.skillsCompleted = clampNumber(
    progress.skillsCompleted,
    0,
    SKILLS.length
  );

  return nextProgress;
}

function getDocumentIdFromName(name = "") {
  return decodeURIComponent(name.split("/").pop() || "");
}

function progressFromDocument(document) {
  const data = fromFirestoreFields(document?.fields || {});
  const storedProgress = data.progress || {};

  return sanitizeProgress({
    ...storedProgress,
    rp: data.rewardpoints ?? storedProgress.rp,
    ap: data.activitypoints ?? storedProgress.ap,
    skillsCompleted: data.skillsCompleted ?? storedProgress.skillsCompleted,
  });
}

export async function getUserProgress(userId) {
  const normalizedUserId = normalizeUserId(userId);
  const document = await firestoreRequest(
    `${COLLECTION}/${encodeURIComponent(normalizedUserId)}`
  );

  if (!document) {
    return { ...DEFAULT_PROGRESS };
  }

  return progressFromDocument(document);
}

export async function saveUserProgress(userId, displayName, progress) {
  const normalizedUserId = normalizeUserId(userId);
  const nextProgress = sanitizeProgress(progress);

  await firestoreRequest(`${COLLECTION}/${encodeURIComponent(normalizedUserId)}`, {
    method: "PATCH",
    body: JSON.stringify({
      fields: toFirestoreFields({
        userId: normalizedUserId,
        displayName,
        rewardpoints: nextProgress.rp,
        activitypoints: nextProgress.ap,
        skillsCompleted: nextProgress.skillsCompleted,
        progress: nextProgress,
        updatedAt: new Date().toISOString(),
      }),
    }),
  });

  return nextProgress;
}

export async function getLeaderboard(defaultRows) {
  const result = await firestoreRequest(COLLECTION);
  const mergedRows = new Map(defaultRows.map((row) => [row.id, row]));

  (result?.documents || []).forEach((document) => {
    const data = fromFirestoreFields(document.fields || {});
    const id = normalizeUserId(data.userId || getDocumentIdFromName(document.name));

    if (!id) {
      return;
    }

    const storedProgress = progressFromDocument(document);
    const fallback = mergedRows.get(id) || {};

    mergedRows.set(id, {
      id,
      displayName: data.displayName || fallback.displayName || id,
      rewardpoints: storedProgress.rp ?? fallback.rewardpoints ?? 0,
      activitypoints: storedProgress.ap ?? fallback.activitypoints ?? 0,
    });
  });

  return Array.from(mergedRows.values()).sort((a, b) => {
    if (b.activitypoints !== a.activitypoints) {
      return b.activitypoints - a.activitypoints;
    }

    return b.rewardpoints - a.rewardpoints;
  });
}
