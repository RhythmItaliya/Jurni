import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type SidebarContentType =
  | 'suggestions'
  | 'followers'
  | 'following'
  | 'likes'
  | 'posts';

interface SidebarState {
  contentType: SidebarContentType;
  userId: string | null;
  username: string | null;
  isOpen: boolean;
}

const initialState: SidebarState = {
  contentType: 'suggestions',
  userId: null,
  username: null,
  isOpen: false,
};

const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    openSidebar: (
      state,
      action: PayloadAction<{
        contentType: SidebarContentType;
        userId?: string;
        username?: string;
      }>
    ) => {
      state.contentType = action.payload.contentType;
      state.userId = action.payload.userId || null;
      state.username = action.payload.username || null;
      state.isOpen = true;
    },
    closeSidebar: state => {
      state.isOpen = false;
    },
    resetSidebar: state => {
      state.contentType = 'suggestions';
      state.userId = null;
      state.username = null;
      state.isOpen = false;
    },
  },
});

export const { openSidebar, closeSidebar, resetSidebar } = sidebarSlice.actions;
export default sidebarSlice.reducer;
