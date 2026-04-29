import { baseApi } from "../../api/baseApi";

export type CancelCleanerRequestArgs = {
  id: string;
  reason?: string;
};

export const cleanerRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    cancelCleanerRequest: builder.mutation({
      query: ({ id, reason }: CancelCleanerRequestArgs) => {
        const body = reason ? { reason } : undefined;

        return {
          url: `/cleaner-request/${id}/cancel`,
          method: "POST",
          ...(body ? { body } : {}),
        };
      },
    }),
  }),
});

export const { useCancelCleanerRequestMutation } = cleanerRequestApi;

