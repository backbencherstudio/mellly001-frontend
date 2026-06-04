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
            query: () => {
                return {
                    url: "dashboard/homeowners/details",
                    method: "GET"
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
                    method: "GET"
                }
            }
        })
    }),
});

export const { useGetDashboardOverviewQuery, useGetHomeownersQuery, useGetCleanersQuery, useGetCleanerRequestQuery } = dashboardOverViewApi;

