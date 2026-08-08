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
            query: (args: string | { conversationId: string; page?: number; perPage?: number }) => {
                const conversationId = typeof args === "string" ? args : args?.conversationId;
                const page = typeof args === "object" ? args?.page || 1 : 1;
                const perPage = typeof args === "object" ? args?.perPage || 1000000 : 1000000;
                return {
                    url: `chat/message/all-message/${conversationId}?page=${page}&perPage=${perPage}`,
                    method: "GET",
                };
            },
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
            query: (params?: { page?: number; perPage?: number }) => {
                const page = params?.page || 1;
                const perPage = params?.perPage || 1000000;
                return {
                    url: `chat/conversation/conversation-list?page=${page}&perPage=${perPage}`,
                    method: "GET",
                };
            },
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