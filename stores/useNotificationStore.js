import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
  clearNotifications: () => set({ notifications: [] }),
  clearNotification: (id) => set((state)=> ({
    notifications: state.notifications.filter(notification => notification.id!== id)
  }))
}));

export default useNotificationStore;