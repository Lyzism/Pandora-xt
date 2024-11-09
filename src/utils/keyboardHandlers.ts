import React from "react";

export const handleEnterKey = (
  e: React.KeyboardEvent,
  action: () => void
) => {
  if (e.key === "Enter") {
    e.preventDefault();
    action();
  }
};
