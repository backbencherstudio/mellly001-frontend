import { baseApi } from "../../api/baseApi";


export const Socket = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createConversation: builder.mutation({
            query: (body) => ({
                url: "chat/message/open-or-create-conversation",
                method: "POST",
                body,
            }),
            // invalidatesTags: ["Auth"],
        }),

        AllConversationId: builder.query({
            query: (conversationId) => ({
                url: `chat/message/all-message/${conversationId}`,
                method: "GET",

            }),
            providesTags: ["Conversation"],
        }),

        SendConversationMessage: builder.mutation({
            query: (body) => ({
                url: "chat/message/send-message",
                method: "POST",
                body,

            }),
            invalidatesTags: ["Conversation"],
        }),


        AllConversationUser: builder.query({
            query: () => ({
                url: "chat/conversation/conversation-list",
                method: "GET",

            }),
            providesTags: ["Conversation"],
        }),
    }),
});

export const { useCreateConversationMutation,
    useAllConversationIdQuery,
    useAllConversationUserQuery,
    useSendConversationMessageMutation
} = Socket;