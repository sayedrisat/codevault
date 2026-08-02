import { useMemo, useState } from "react";
import useLocalStorage from "./useLocalStorage.js";

export const LANGUAGES = [
  "TypeScript",
  "JavaScript",
  "Python",
  "Bash",
  "Shell",
  "Go",
  "Rust",
  "SQL",
  "CSS",
  "HTML",
  "JSON",
  "Markdown",
  "YAML",
  "Java",
  "C",
  "C++",
  "C#",
  "PHP",
  "Ruby",
  "Swift",
  "Kotlin",
  "Dart",
  "Lua",
  "R",
  "Scala",
  "Elixir",
  "Clojure",
  "GraphQL",
  "Dockerfile",
];
export const COLLECTIONS = [
  "React Hooks",
  "Docker Configs",
  "Python Scripts",
  "Utilities",
];

export const RECALL_COLLECTION = "Recall";
export const RECALL_INTERVALS = [1, 4, 7];

const SYSTEM_COLLECTIONS = ["All", "Favorites", RECALL_COLLECTION];
const FALLBACK_COLLECTION = "Uncategorized";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const SEED_NOTES = [
  {
    id: 1,
    title: "useDebounce",
    lang: "TypeScript",
    collection: "React Hooks",
    reason:
      "Custom hook to debounce fast-changing values without external deps",
    tags: ["hooks", "performance"],
    favorite: true,
    code: `import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(value)
    }, delay)
    return () => clearTimeout(t)
  }, [value, delay])

  return debounced
}`,
  },
  {
    id: 2,
    title: "flatten_dict",
    lang: "Python",
    collection: "Python Scripts",
    reason: "Recursively flatten nested dictionaries with a custom separator",
    tags: ["utils", "dict"],
    favorite: false,
    code: `def flatten_dict(d, parent_key='', sep='.'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep).items())
        else:
            items.append((new_key, v))
    return dict(items)`,
  },
  {
    id: 3,
    title: "git-clean-branches",
    lang: "Bash",
    collection: "Utilities",
    reason: "Remove all local branches already merged into main",
    tags: ["git", "cleanup"],
    favorite: false,
    code: `#!/usr/bin/env bash
git branch --merged main | grep -v "\\* main" | xargs -n 1 git branch -d`,
  },
  {
    id: 4,
    title: "useLocalStorage",
    lang: "TypeScript",
    collection: "React Hooks",
    reason: "useState with automatic localStorage sync and JSON parsing",
    tags: ["hooks", "storage"],
    favorite: true,
    code: `import { useState } from 'react'

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initial
  })

  const set = (v: T) => {
    setValue(v)
    localStorage.setItem(key, JSON.stringify(v))
  }

  return [value, set] as const
}`,
  },
  {
    id: 5,
    title: "docker-compose base",
    lang: "Bash",
    collection: "Docker Configs",
    reason: "Minimal compose file for a node + postgres dev stack",
    tags: ["docker", "devops"],
    favorite: false,
    code: `version: "3.9"
services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [db]
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: devpass`,
  },
];

function nextIdFrom(notes) {
  return notes.reduce((max, n) => Math.max(max, n.id), 0) + 1;
}

function addDays(date, days) {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

function cleanCollectionName(name) {
  return name.trim().replace(/\s+/g, " ");
}

function sameCollection(a, b) {
  return String(a).toLowerCase() === String(b).toLowerCase();
}

function normalizeCollections(list) {
  const normalized = [];

  list.forEach((item) => {
    if (typeof item !== "string") return;
    const name = cleanCollectionName(item);
    if (!name) return;
    if (SYSTEM_COLLECTIONS.some((system) => sameCollection(system, name))) return;
    if (normalized.some((existing) => sameCollection(existing, name))) return;
    normalized.push(name);
  });

  return normalized.length ? normalized : [...COLLECTIONS];
}

export function createRecallPlan(date = new Date()) {
  return {
    enabled: true,
    completedSteps: 0,
    startedAt: date.toISOString(),
    nextDueAt: addDays(date, RECALL_INTERVALS[0]).toISOString(),
    lastReviewedAt: null,
    completedAt: null,
  };
}

export function getRecallSummary(note, date = new Date()) {
  const recall = note?.recall;

  if (!recall?.enabled) {
    return {
      enabled: false,
      due: false,
      mastered: false,
      completedSteps: 0,
      nextInterval: RECALL_INTERVALS[0],
      title: "1-4-7 Recall off",
      detail: "Enable recall from Edit snippet",
      nextDueAt: null,
    };
  }

  const completedSteps = Math.min(
    Math.max(Number(recall.completedSteps) || 0, 0),
    RECALL_INTERVALS.length,
  );
  const mastered = completedSteps >= RECALL_INTERVALS.length;
  const nextDueAt = recall.nextDueAt || null;
  const due =
    recall.enabled &&
    !mastered &&
    (!nextDueAt || new Date(nextDueAt).getTime() <= date.getTime());
  const nextInterval = mastered ? null : RECALL_INTERVALS[completedSteps];

  let detail = "Due now";

  if (mastered) {
    detail = "Mastered";
  } else if (!due && nextDueAt) {
    detail = `Next ${new Date(nextDueAt).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })}`;
  }

  return {
    enabled: true,
    due,
    mastered,
    completedSteps,
    nextInterval,
    title: mastered ? "147 Mastered" : `Day ${nextInterval} recall`,
    detail,
    nextDueAt,
  };
}

function applyRecallPreference(note, recallEnabled, date = new Date()) {
  if (!recallEnabled) {
    return null;
  }

  return note?.recall?.enabled ? note.recall : createRecallPlan(date);
}

function advanceRecall(note, date = new Date()) {
  if (!note.recall?.enabled) return note;

  const summary = getRecallSummary(note, date);
  const completedSteps = Math.min(
    summary.completedSteps + 1,
    RECALL_INTERVALS.length,
  );
  const mastered = completedSteps >= RECALL_INTERVALS.length;

  return {
    ...note,
    recall: {
      ...note.recall,
      enabled: true,
      completedSteps,
      lastReviewedAt: date.toISOString(),
      nextDueAt: mastered
        ? null
        : addDays(date, RECALL_INTERVALS[completedSteps]).toISOString(),
      completedAt: mastered ? date.toISOString() : null,
    },
  };
}

export default function useNotes() {
  const [notes, setNotes] = useLocalStorage("codevault:notes", SEED_NOTES);
  const [storedCollections, setStoredCollections] = useLocalStorage(
    "codevault:collections",
    COLLECTIONS,
  );
  const [activeCollection, setActiveCollection] = useState("All");
  const [activeLang, setActiveLang] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const collections = useMemo(
    () => normalizeCollections(storedCollections),
    [storedCollections],
  );

  const counts = useMemo(() => {
    const c = {
      All: notes.length,
      Favorites: notes.filter((n) => n.favorite).length,
      [RECALL_COLLECTION]: notes.filter((n) => getRecallSummary(n).enabled)
        .length,
    };
    collections.forEach((col) => {
      c[col] = notes.filter((n) => n.collection === col).length;
    });
    return c;
  }, [notes, collections]);

  const filteredNotes = useMemo(() => {
    return notes.filter((n) => {
      if (activeCollection === "Favorites" && !n.favorite) return false;
      if (
        activeCollection === RECALL_COLLECTION &&
        !getRecallSummary(n).enabled
      ) {
        return false;
      }
      if (
        activeCollection !== "All" &&
        activeCollection !== "Favorites" &&
        activeCollection !== RECALL_COLLECTION &&
        activeCollection !== "tags" &&
        activeCollection !== "settings" &&
        n.collection !== activeCollection
      )
        return false;
      if (activeLang && n.lang !== activeLang) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const haystack =
          `${n.title} ${n.reason} ${n.tags.join(" ")} ${n.code}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [notes, activeCollection, activeLang, searchQuery]);

  const saveNote = (payload, editingId) => {
    const { recallEnabled, ...notePayload } = payload;
    const now = new Date();

    if (editingId) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === editingId
            ? {
                ...n,
                ...notePayload,
                recall: applyRecallPreference(n, recallEnabled, now),
              }
            : n,
        ),
      );
    } else {
      setNotes((prev) => [
        {
          id: nextIdFrom(prev),
          ...notePayload,
          recall: recallEnabled ? createRecallPlan(now) : null,
        },
        ...prev,
      ]);
    }
  };

  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const markRecall = (id) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? advanceRecall(note) : note)),
    );
  };

  const resetRecall = (id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, recall: createRecallPlan() } : note,
      ),
    );
  };

  const addCollection = (name) => {
    const nextName = cleanCollectionName(name);
    const reserved = [...SYSTEM_COLLECTIONS, ...collections];

    if (!nextName || reserved.some((item) => sameCollection(item, nextName))) {
      return false;
    }

    setStoredCollections((prev) => [...normalizeCollections(prev), nextName]);
    setActiveCollection(nextName);
    return true;
  };

  const renameCollection = (currentName, nextName) => {
    const cleanCurrent = cleanCollectionName(currentName);
    const cleanNext = cleanCollectionName(nextName);

    if (!cleanCurrent || !cleanNext) return false;
    if (SYSTEM_COLLECTIONS.some((item) => sameCollection(item, cleanCurrent))) {
      return false;
    }

    const nameTaken = collections.some(
      (item) => !sameCollection(item, cleanCurrent) && sameCollection(item, cleanNext),
    );

    if (
      SYSTEM_COLLECTIONS.some((item) => sameCollection(item, cleanNext)) ||
      nameTaken
    ) {
      return false;
    }

    setStoredCollections((prev) =>
      normalizeCollections(prev).map((item) =>
        sameCollection(item, cleanCurrent) ? cleanNext : item,
      ),
    );
    setNotes((prev) =>
      prev.map((note) =>
        sameCollection(note.collection, cleanCurrent)
          ? { ...note, collection: cleanNext }
          : note,
      ),
    );
    setActiveCollection((current) =>
      sameCollection(current, cleanCurrent) ? cleanNext : current,
    );
    return true;
  };

  const deleteCollection = (name) => {
    const targetName = cleanCollectionName(name);

    if (!targetName) return false;
    if (SYSTEM_COLLECTIONS.some((item) => sameCollection(item, targetName))) {
      return false;
    }

    const remainingCollections = collections.filter(
      (item) => !sameCollection(item, targetName),
    );
    const safeCollections = remainingCollections.length
      ? remainingCollections
      : [FALLBACK_COLLECTION];
    const fallback = safeCollections[0];

    setStoredCollections(safeCollections);
    setNotes((prev) =>
      prev.map((note) =>
        sameCollection(note.collection, targetName)
          ? { ...note, collection: fallback }
          : note,
      ),
    );
    setActiveCollection((current) =>
      sameCollection(current, targetName) ? "All" : current,
    );
    return true;
  };

  return {
    notes,
    filteredNotes,
    collections,
    counts,
    activeCollection,
    setActiveCollection,
    activeLang,
    setActiveLang,
    searchQuery,
    setSearchQuery,
    saveNote,
    deleteNote,
    markRecall,
    resetRecall,
    addCollection,
    renameCollection,
    deleteCollection,
  };
}
