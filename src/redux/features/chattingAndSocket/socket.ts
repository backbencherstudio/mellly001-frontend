import { baseApi } from "../../api/baseApi";

interface NotificationItem {
  id: string;
  created_at: string;
  type: string;
  text: string;
  sender?: { name?: string } | null;
}

interface NotificationResponse {
  success: boolean;
  message: string;
  data: NotificationItem[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
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

  GetAllNotification: builder.query<NotificationResponse, { page?: number; perPage?: number }>({
  query: ({ page = 1, perPage = 10 }) => ({
    url: `notification/?page=${page}&perPage=${perPage}`,
    method: "GET",
  }),
}),


    }),
});

export const { useCreateConversationMutation,
    useAllConversationIdQuery,
    useAllConversationUserQuery,
    useSendConversationMessageMutation,
    useGetAllNotificationQuery,
    useLazyGetAllNotificationQuery
} = Socket;