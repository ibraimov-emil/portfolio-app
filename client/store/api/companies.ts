import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import qs from 'qs';
import { getCookie, COOKIE_NAMES } from '@/lib/cookies';
import type { CompaniesCombine } from '@/types/company';

export const companiesApi = createApi({
    reducerPath: 'companiesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL,
        prepareHeaders: (headers) => {
            const token = getCookie(COOKIE_NAMES.AUTH_TOKEN);
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
        paramsSerializer: (params) => {
            return qs.stringify(params, { encodeValuesOnly: true });
        },
    }),
    tagTypes: ['Company'],
    endpoints: (builder) => ({
        getAllCompanies: builder.query<CompaniesCombine, void>({
            query: () => ({
                url: '/companies',
                params: {
                    pagination: { pageSize: 100 }, // Fetch enough for dropdown
                    sort: ['name:asc'],
                },
            }),
            providesTags: ['Company'],
        }),
    }),
});

export const { useGetAllCompaniesQuery } = companiesApi;
