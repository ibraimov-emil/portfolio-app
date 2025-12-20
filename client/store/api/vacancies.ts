import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { 
  VacanciesCombine, 
  VacancyItem, 
  VacancyCreatePayload, 
  VacancyUpdatePayload 
} from '@/types/vacancy';
import { getCookie, COOKIE_NAMES } from '@/lib/cookies';

export const vacanciesApi = createApi({
  reducerPath: 'vacanciesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      const token = getCookie(COOKIE_NAMES.AUTH_TOKEN);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Vacancy'],
  endpoints: (builder) => ({
    getVacancies: builder.query<VacanciesCombine, {
      page?: number;
      pageSize?: number;
      filters?: Record<string, any>;
      populate?: string[] | Record<string, any>;
    }>({
      query: ({ page = 1, pageSize = 25, filters, populate }) => ({
        url: '/vacancies',
        params: {
          pagination: { page, pageSize },
          filters,
          populate: populate || {
            company: {
              fields: ['name', 'shortDescription'],
              populate: { photo: true }
            },
            photo: true
          }
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ documentId }) => ({ type: 'Vacancy' as const, id: documentId })),
              { type: 'Vacancy', id: 'LIST' },
            ]
          : [{ type: 'Vacancy', id: 'LIST' }],
    }),

    getVacancyById: builder.query<{ data: VacancyItem }, string>({
      query: (id) => ({
        url: `/vacancies/${id}`,
        params: {
          populate: {
            company: {
              populate: { photo: true }
            },
            photo: true
          }
        },
      }),
      providesTags: (result, error, id) => [{ type: 'Vacancy', id }],
    }),

    createVacancy: builder.mutation<{ data: VacancyItem }, VacancyCreatePayload>({
      query: (payload) => ({
        url: '/vacancies',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Vacancy', id: 'LIST' }],
    }),

    updateVacancy: builder.mutation<
      { data: VacancyItem },
      { id: string; payload: VacancyUpdatePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/vacancies/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Vacancy', id },
        { type: 'Vacancy', id: 'LIST' },
      ],
    }),

    deleteVacancy: builder.mutation<void, string>({
      query: (id) => ({
        url: `/vacancies/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Vacancy', id },
        { type: 'Vacancy', id: 'LIST' },
      ],
    }),

    uploadVacancyPhoto: builder.mutation<
      { data: VacancyItem },
      { vacancyId: string; file: File }
    >({
      query: ({ vacancyId, file }) => {
        const formData = new FormData();
        formData.append('data', JSON.stringify({}));
        formData.append('files.photo', file, file.name);

        return {
          url: `/vacancies/${vacancyId}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { vacancyId }) => [
        { type: 'Vacancy', id: vacancyId },
        { type: 'Vacancy', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetVacanciesQuery,
  useGetVacancyByIdQuery,
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
  useUploadVacancyPhotoMutation,
} = vacanciesApi;