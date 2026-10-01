import { baseApi } from "../../api/baseApi";

export type CancelCleanerRequestArgs = {
  id: string;
  reason?: string;
};

export const dashboardOverViewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardOverview: builder.query({
      query: () => {
        return {
          url: "dashboard/overview",
          method: "GET",
        };
      },
    }),

    getActivities: builder.query({
      query: (params) => ({
        url: "dashboard/activities",
        params,
      }),
    }),

    getHomeowners: builder.query({
      query: (params) => {
        return {
          url: "dashboard/homeowners/details",
          method: "GET",
          params,
        };
      },
      providesTags: ["Homeowners"],
    }),

    updateHomeowners: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `dashboard/homeowners/actions?userId=${id}&status=${status}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Homeowners"],
    }),

    getCleaners: builder.query({
      query: () => {
        return {
          url: "dashboard/cleaners/details",
          method: "GET",
        };
      },
      providesTags: ["Cleaners"],
    }),

    updateCleaners: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `dashboard/cleaners/actions?userId=${id}&status=${status}`,
          method: "PATCH",
        };
      },
      invalidatesTags: ["Cleaners"],
    }),

    getCleanerRequest: builder.query({
      query: () => {
        return {
          url: "dashboard/cleaners/request",
          method: "GET",
        };
      },
      providesTags: ["CleanerRequest"],
    }),

    getClearnerRequestById: builder.query({
      query: (id) => {
        return {
          url: `dashboard/cleaners/request/${id}`,
          method: "GET",
        };
      },
      providesTags: ["CleanerRequest"],
    }),

    updateCleanerRequest: builder.mutation({
      query: ({ id, status, rejected_reason }) => ({
        url: `dashboard/cleaners/request/${id}`,
        method: "PATCH",
        body: {
          status,
          rejected_reason,
        },
      }),
      invalidatesTags: ["CleanerRequest"],
    }),

    getBookingDetaials: builder.query({
      query: (params) => ({
        url: "dashboard/bookings",
        method: "GET",
        params,
      }),
      providesTags: ["Bookings"],
    }),

    updateBookingStatus: builder.mutation({
      query: ({ id, status }: { id: string; status: string }) => ({
        url: `dashboard/bookings/actions?bookingId=${id}&status=${status}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Bookings"],
    }),

    assignBookingCleaner: builder.mutation({
      query: ({ id, cleaner_id, cleaner_name }: { id: string; cleaner_id: string; cleaner_name?: string }) => ({
        url: `dashboard/bookings/assign-cleaner?bookingId=${id}&cleanerId=${cleaner_id}`,
        method: "PATCH",
        body: { booking_id: id, cleaner_id, cleaner_name },
      }),
      invalidatesTags: ["Bookings"],
    }),

    updateBooking: builder.mutation({
      query: ({ id, ...body }: { id: string; [key: string]: any }) => ({
        url: `dashboard/bookings/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Bookings"],
    }),

    getUsers: builder.query({
      query: (params) => ({
        url: "/users",
        params,
      }),
    }),

    getJobApproval: builder.query({
      query: (params) => ({
        url: "dashboard/job-approvals",
        params,
      }),
      providesTags: ["JobApproval"],
    }),

    // getJobApprovalUpdate: builder.mutation({
    //     query: ({ id, status }) => ({
    //         url: `dashboard/job-approvals/${id}`,
    //         method: "PATCH",
    //         body: { status },
    //     }),
    //     invalidatesTags: ["JobApproval"],
    // }),

    getJobApprovalUpdate: builder.mutation({
      query: ({ id, status }) => ({
        url: `dashboard/job-approvals/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["JobApproval"],
    }),

    getDangerRequest: builder.query({
      query: () => {
        return {
          url: "dashboard/danger/request",
          method: "GET",
        };
      },
      providesTags: ["DangerRequest"],
    }),

    updateDangerRequest: builder.mutation({
      query: ({ id, status }) => {
        return {
          url: `dashboard/danger/request/${id}`,
          method: "PATCH",
          body: { status },
        };
      },
      invalidatesTags: ["DangerRequest"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetDashboardOverviewQuery,
  useGetActivitiesQuery,
  useGetHomeownersQuery,
  useUpdateHomeownersMutation,
  useGetCleanersQuery,
  useUpdateCleanersMutation,
  useGetClearnerRequestByIdQuery,
  useGetCleanerRequestQuery,
  useUpdateCleanerRequestMutation,
  useGetBookingDetaialsQuery,
  useUpdateBookingStatusMutation,
  useAssignBookingCleanerMutation,
  useUpdateBookingMutation,
  useGetJobApprovalQuery,
  useGetJobApprovalUpdateMutation,
  useGetDangerRequestQuery,
  useUpdateDangerRequestMutation,
} = dashboardOverViewApi;
