import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatState {
  activeConversationId: string | null;
  typing: boolean;
}

const initialState: ChatState = {
  activeConversationId: null,
  typing: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.typing = action.payload;
    },
  },
});

export const { setActiveConversation, setTyping } = chatSlice.actions;

export default chatSlice.reducer;
