import React from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { toggleSaved, selectIsSaved } from "../features/saved/savedSlice";

interface SaveButtonProps {
  id: string;
  className?: string;
}

// Bookmark toggle for the "Recipe Box". Often rendered inside a react-router
// <Link>, so the click handler must stop the event before it bubbles to the
// surrounding navigation.
const SaveButton = ({ id, className = "" }: SaveButtonProps) => {
  const dispatch = useAppDispatch();
  const isSaved = useAppSelector(selectIsSaved(id));

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleSaved(id));
  };

  const label = isSaved ? "Remove from saved" : "Save recipe";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      aria-pressed={isSaved}
      title={label}
      className={`inline-flex items-center justify-center rounded-full bg-white/90 p-2 text-base shadow hover:bg-white transition-colors ${className}`}
    >
      {isSaved ? (
        <FaBookmark className="text-red-500" />
      ) : (
        <FaRegBookmark className="text-gray-600" />
      )}
    </button>
  );
};

export default SaveButton;
