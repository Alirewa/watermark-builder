'use client';

import { useCallback } from 'react';
import { useWatermarkStore } from '@/store/useWatermarkStore';

export function useHistory(
  loadFromJson: (json: string) => void
) {
  const { pushHistory, undoHistory, redoHistory, canUndo, canRedo } =
    useWatermarkStore();

  const push = useCallback(
    (json: string) => pushHistory(json),
    [pushHistory]
  );

  const undo = useCallback(() => {
    const entry = undoHistory();
    if (entry) loadFromJson(entry.canvasJson);
  }, [undoHistory, loadFromJson]);

  const redo = useCallback(() => {
    const entry = redoHistory();
    if (entry) loadFromJson(entry.canvasJson);
  }, [redoHistory, loadFromJson]);

  return { push, undo, redo, canUndo, canRedo };
}
