import { api } from '../api'
import { transactionsStore, type Transaction } from '@/lib/transactionsStore'

export const transactionsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query<Transaction[], void>({
      queryFn: async () => ({ data: transactionsStore.list() }),
      providesTags: ['Transactions'],
    }),
  }),
})

export const { useGetTransactionsQuery } = transactionsApi
