import { create } from 'zustand';

const drawerWidth = '280px';

const useSidebarStore = create((set) => ({
    isSidebarOpen: false,
    sidebarWidth: drawerWidth,

    toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
    openSidebar: () => set({ isSidebarOpen: true }),
    closeSidebar: () => set({ isSidebarOpen: false }),
}));

export default useSidebarStore;
