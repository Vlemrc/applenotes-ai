import { create } from 'zustand';

interface LearningModeStore {
  isLearningMode: boolean;
  activateLearningMode: () => void;
  deactivateLearningMode: () => void;
  toggleLearningMode: () => void;
}

export const useLearningModeStore = create<LearningModeStore>((set) => ({
  isLearningMode: false,

  activateLearningMode: () => set({ isLearningMode: true }),
  deactivateLearningMode: () => set({ isLearningMode: false }),
  toggleLearningMode: () =>
    set((state) => ({ isLearningMode: !state.isLearningMode })),
}));
