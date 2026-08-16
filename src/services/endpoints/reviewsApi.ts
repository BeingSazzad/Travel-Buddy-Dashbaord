import { api } from '../api'
import { reviewsStore, type Review } from '@/lib/reviewsStore'

export const reviewsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getReviews: build.query<Review[], void>({
      queryFn: async () => ({ data: reviewsStore.list() }),
      providesTags: ['Reviews'],
    }),
    setReviewFlag: build.mutation<Review | null, { id: string; flagged: boolean }>({
      queryFn: async ({ id, flagged }) => ({ data: reviewsStore.patch(id, { flagged }) }),
      invalidatesTags: ['Reviews'],
    }),
  }),
})

export const { useGetReviewsQuery, useSetReviewFlagMutation } = reviewsApi
