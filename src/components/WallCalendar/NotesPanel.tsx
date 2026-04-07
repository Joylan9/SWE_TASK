// ── NotesPanel.tsx ──────────────────────────────────────────────

import React, { useState, useCallback } from 'react';
import { Trash2, Plus, FileText } from 'lucide-react';
import type { CalendarNote } from './types/calendar.types';
import { formatDateRange } from './utils/calendarUtils';

interface NotesPanelProps {
  /** Label for the notes input (changes based on range selection) */
  label: string;
  /** Notes filtered to the current month */
  notes: CalendarNote[];
  /** Callback to add a new note */
  onAddNote: (content: string) => void;
  /** Callback to delete a note by ID */
  onDeleteNote: (noteId: string) => void;
}

/**
 * Notes panel component with ruled notebook-line styling.
 * Features:
 * - Textarea for entering notes
 * - Notes list with date range tags
 * - Delete functionality with confirmation
 * - Ruled line background using CSS repeating-linear-gradient
 */
export const NotesPanel: React.FC<NotesPanelProps> = ({
  label,
  notes,
  onAddNote,
  onDeleteNote,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (inputValue.trim()) {
        onAddNote(inputValue);
        setInputValue('');
      }
    },
    [inputValue, onAddNote]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (inputValue.trim()) {
          onAddNote(inputValue);
          setInputValue('');
        }
      }
    },
    [inputValue, onAddNote]
  );

  return (
    <div className="cal-notes">
      <h3 className="cal-notes__title">
        <FileText size={14} aria-hidden="true" />
        {label}
      </h3>

      {/* Ruled lines textarea */}
      <form onSubmit={handleSubmit} className="cal-notes__form">
        <div className="cal-notes__textarea-wrapper">
          <textarea
            className="cal-notes__textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write a note... (Ctrl+Enter to save)"
            rows={3}
            aria-label={`${label} input`}
          />
        </div>
        <button
          type="submit"
          className="cal-notes__add-btn"
          disabled={!inputValue.trim()}
          aria-label="Add note"
        >
          <Plus size={14} aria-hidden="true" />
          <span>Add</span>
        </button>
      </form>

      {/* Saved notes list */}
      {notes.length > 0 && (
        <ul className="cal-notes__list" aria-label="Saved notes">
          {notes.map((note) => (
            <li key={note.id} className="cal-notes__item">
              <div className="cal-notes__item-content">
                {(note.rangeStart || note.rangeEnd) && (
                  <span className="cal-notes__item-range">
                    {formatDateRange(note.rangeStart, note.rangeEnd)}
                  </span>
                )}
                <p className="cal-notes__item-text">{note.content}</p>
              </div>
              <button
                type="button"
                className="cal-notes__delete-btn"
                onClick={() => onDeleteNote(note.id)}
                aria-label={`Delete note: ${note.content.slice(0, 30)}`}
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {notes.length === 0 && (
        <p className="cal-notes__empty">No notes for this month yet.</p>
      )}
    </div>
  );
};
