// import { create } from "zustand";

// const useNotificationStore = create((set) => ({
//   notifications: [],
//   addNotification: (notification) => set((state) => ({
//     notifications: [notification, ...state.notifications]
//   })),
//   clearNotifications: () => set({ notifications: [] }),
//   clearNotification: (id) => set((state)=> ({
//     notifications: state.notifications.filter(notification => notification._id!== id)
//   }))
// }));

// export default useNotificationStore;

import { create } from "zustand";

const useNotificationStore = create((set) => ({
  notifications: [],
  
  addNotification: (notification) => set((state) => {
    // Verificar si la notificación ya existe
    const exists = state.notifications.some(
      (notif) => notif.id === notification.id
    );
    
    // Si no existe, agregarla al estado
    if (!exists) {
      return { notifications: [notification, ...state.notifications] };
    }
    // Si ya existe, no hacer nada
    return state;
  }),

  clearNotifications: () => set({ notifications: [] }),

  clearNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((notification) => notification.id !== id)
  }))
}));

export default useNotificationStore;
