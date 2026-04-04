"use client";

import { useState } from "react";
import SuggestionModal from "./SuggestionModal";
import { useAuthStore } from "@/lib/store";

export default function SuggestButton({ userId, userName }) {
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Don't show button if viewing own profile
  if (user?.id === userId) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition font-medium flex items-center justify-center gap-2"
        title="Send a helpful suggestion to this user"
      >
        ✨ Suggest
      </button>

      <SuggestionModal
        userId={userId}
        userName={userName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
