import { STORAGE_KEYS, readJSON, writeJSON } from "./storage";

type NotesMap = Record<string, string>;

/** Per-lesson notes with autosave semantics handled by the caller. */
export const journalService = {
  getNote(lessonId: string): string {
    const map = readJSON<NotesMap>(STORAGE_KEYS.notes, {});
    return map[lessonId] ?? "";
  },

  saveNote(lessonId: string, content: string): void {
    const map = readJSON<NotesMap>(STORAGE_KEYS.notes, {});
    map[lessonId] = content;
    writeJSON(STORAGE_KEYS.notes, map);
  },

  getAllNotes(): NotesMap {
    return readJSON<NotesMap>(STORAGE_KEYS.notes, {});
  },

  countNotes(): number {
    const map = readJSON<NotesMap>(STORAGE_KEYS.notes, {});
    return Object.values(map).filter((v) => v.trim().length > 0).length;
  },
};
