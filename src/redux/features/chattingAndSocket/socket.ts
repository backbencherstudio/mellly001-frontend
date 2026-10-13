import { baseApi } from "../../api/baseApi";

export interface NotificationItem {
  id: string;
  created_at: string;
  type: string;
  text: string;
  isRead?: boolean;
  is_read?: boolean;
  targetUrl?: string;
  entityId?: string;
  bookingId?: string;
  applicationId?: string;
  homeownerId?: string;
  cleanerId?: string;
  jobApprovalId?: string;
  dangerRequestId?: string;
  sender?: { name?: string } | null;
}

export interface NotificationResponse {
  success: boolean;
  message: string;
  data: NotificationItem[];
  unread_count?: number;
  pagination: {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  count: number;
}

export const Socket = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createConversation: builder.mutation({
      query: (body) => ({
        url: "chat/message/open-or-create-conversation",
        method: "POST",
        body,
      }),
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

    // 1. Fetch notifications (paginated, with unread_count, optional is_read & type filter)
    GetAllNotification: builder.query<
      NotificationResponse,
      { page?: number; perPage?: number; is_read?: boolean; type?: string } | void
    >({
      query: (params) => {
        const page = params?.page ?? 1;
        const perPage = params?.perPage ?? 10;
        let url = `notification?page=${page}&perPage=${perPage}`;
        if (params?.is_read !== undefined) {
          url += `&is_read=${params.is_read}`;
        }
        if (params?.type) {
          url += `&type=${encodeURIComponent(params.type)}`;
        }
        return {
          url,
          method: "GET",
        };
      },
      providesTags: ["Notification"],
    }),

    // 2. Get total unread count: { success: true, count: 3 }
    GetUnreadNotificationCount: builder.query<UnreadCountResponse, void>({
      query: () => ({
        url: "notification/unread-count",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    // 3. Mark all notifications as read for current user
    MarkAllNotificationsAsRead: builder.mutation<{ success: boolean; message?: string }, void>({
      query: () => ({
        url: "notification/read-all",
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    // 4. Mark a single notification as read
    MarkNotificationAsRead: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `notification/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

    // 5. Delete a single notification
    DeleteNotification: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({
        url: `notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    // 6. Delete all notifications for current user
    DeleteAllNotifications: builder.mutation<{ success: boolean; message?: string }, void>({
      query: () => ({
        url: "notification",
        method: "DELETE",
      }),
      invalidatesTags: ["Notification"],
    }),

    // 7. Get single notification by id
    GetSingleNotification: builder.query<
      { success: boolean; data: NotificationItem; message?: string },
      string
    >({
      query: (id) => ({
        url: `notification/${id}`,
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),
  }),
});

export const {
  useCreateConversationMutation,
  useAllConversationIdQuery,
  useAllConversationUserQuery,
  useSendConversationMessageMutation,
  useGetAllNotificationQuery,
  useLazyGetAllNotificationQuery,
  useGetUnreadNotificationCountQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useDeleteNotificationMutation,
  useDeleteAllNotificationsMutation,
  useGetSingleNotificationQuery,
  useLazyGetSingleNotificationQuery,
} = Socket;