// src/utils/keyboardHandlers.ts
import React from "react";

export const handleEnterKey = (
  e: React.KeyboardEvent,
  action: () => void
) => {
  if (e.key === "Enter") {
    e.preventDefault(); // Prevent form submission on Enter
    action(); // Execute the provided action
  }
};
