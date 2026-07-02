"use client";

import { useEffect } from "react";
import { useWizardAutoSave } from "../hooks/useWizardAutoSave";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/shared/ui/dialog';

export function UnsavedChangesDialog() {
  const { hasUnsavedChanges, concurrentEditDetected } = useWizardAutoSave();
  const router = useRouter();

  // Prevent closing the tab if there are unsaved changes in the 1s debounce window
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  if (!concurrentEditDetected) return null;

  return (
    <Dialog open={concurrentEditDetected} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-red-600">Concurrent Edit Detected</DialogTitle>
          <DialogDescription>
            This draft has been modified in another browser tab or window. Continuing to edit here
            may overwrite those changes.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-semibold hover:bg-gray-200"
          >
            Reload Latest Data
          </button>
          <button
            onClick={() => {
              // Note: If they choose to keep editing, they will fork the state.
              // We could force a reset of the concurrent edit flag if needed.
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700"
          >
            Keep Editing (Overwrite)
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
