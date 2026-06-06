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
        getHomeowners: builder.query({
            query: (params) => {
                return {
                    url: "dashboard/homeowners/details",
                    method: "GET",
                    params
                }
            }
        }),
        getCleaners: builder.query({
            query: () => {
                return {
                    url: "dashboard/cleaners/details",
                    method: "GET"
                }
            }
        }),
        getCleanerRequest: builder.query({
            query: () => {
                return {
                    url: "dashboard/cleaners/request",
                    method: "GET",
                }
            },
            providesTags: ["CleanerRequest"],
        }),
        updateCleanerRequest: builder.mutation({
            query: ({ id, status }) => ({
                url: `dashboard/cleaners/request/${id}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["CleanerRequest"],
        }),

        getBookingDetaials: builder.query({
            query: (params) => ({
                url: "dashboard/bookings/details",
                method: "GET",
                params,
            }),
        }),
    }),
});

export const { useGetDashboardOverviewQuery, useGetHomeownersQuery, useGetCleanersQuery, useGetCleanerRequestQuery, useUpdateCleanerRequestMutation, useGetBookingDetaialsQuery, } = dashboardOverViewApi;

