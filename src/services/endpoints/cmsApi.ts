import { api } from '../api'
import { cmsStore, type CmsDoc } from '@/lib/cmsStore'

export const cmsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getCmsDocs: build.query<CmsDoc[], void>({
      queryFn: async () => ({ data: cmsStore.list() }),
      providesTags: ['Cms'],
    }),
    getCmsDoc: build.query<CmsDoc | null, string>({
      queryFn: async (slug) => ({ data: cmsStore.get(slug) }),
      providesTags: ['Cms'],
    }),
    saveCmsDoc: build.mutation<CmsDoc | null, { slug: string } & Partial<CmsDoc>>({
      queryFn: async ({ slug, ...patch }) => ({ data: cmsStore.save(slug, patch) }),
      invalidatesTags: ['Cms'],
    }),
  }),
})

export const { useGetCmsDocsQuery, useGetCmsDocQuery, useSaveCmsDocMutation } = cmsApi
