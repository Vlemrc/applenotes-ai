import { create } from 'zustand';

interface LearningModeStore {
  isLearningMode: boolean;
  activateLearningMode: () => void;
  deactivateLearningMode: () => void;
  toggleLearningMode: () => void;
}

const getInitialLearningMode = (): boolean => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("isLearningMode");
    return stored === "true";
  }
  return false;
};

export const useLearningModeStore = create<LearningModeStore>((set) => ({
  isLearningMode: getInitialLearningMode(),

  activateLearningMode: () => {
    set({ isLearningMode: true });
    localStorage.setItem("isLearningMode", "true");
  },
  deactivateLearningMode: () => {
    set({ isLearningMode: false });
    localStorage.setItem("isLearningMode", "false");
  },
  toggleLearningMode: () =>
    set((state) => {
      const newValue = !state.isLearningMode;
      localStorage.setItem("isLearningMode", newValue.toString());
      return { isLearningMode: newValue };
    }),
}));