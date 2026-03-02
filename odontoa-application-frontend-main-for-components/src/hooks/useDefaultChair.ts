import { useState, useEffect } from "react";
import { useAuth } from "@/auth/AuthProvider";

const STORAGE_KEY_PREFIX = "dentist_chair_preference_";

/**
 * Hook to get and set the default chair preference for the current dentist
 * Stores preference in localStorage with key: dentist_chair_preference_{userId}
 */
export const useDefaultChair = () => {
  const { user } = useAuth();
  const [defaultChair, setDefaultChairState] = useState<string>("1");

  // Load preference from localStorage on mount
  useEffect(() => {
    if (user?.sub) {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${user.sub}`);
      if (stored) {
        setDefaultChairState(stored);
      }
    }
  }, [user?.sub]);

  // Function to set and save the default chair
  const setDefaultChair = (chair: string) => {
    if (user?.sub) {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${user.sub}`, chair);
      setDefaultChairState(chair);
    }
  };

  return {
    defaultChair,
    setDefaultChair,
  };
};

/**
 * Utility function to get default chair without hook (for use outside components)
 */
export const getDefaultChair = (userId: number | string): string => {
  if (typeof window === "undefined") return "1";
  const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
  return stored || "1";
};
