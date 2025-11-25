"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCompanies } from "@/services/company";

interface UseCompaniesInfiniteParams {
    search?: string;
    pageSize?: number;
}

export function useCompaniesInfinite({ search = "", pageSize = 12 }: UseCompaniesInfiniteParams = {}) {
    return useInfiniteQuery({
        queryKey: ["companies", "infinite", search],
        queryFn: ({ pageParam = 1 }) =>
            getCompanies({
                populate: "*",
                "pagination[page]": pageParam,
                "pagination[pageSize]": pageSize,
                ...(search && {
                    "filters[name][$containsi]": search,
                }),
            }),
        getNextPageParam: (lastPage) => {
            const { page, pageCount } = lastPage.meta.pagination;
            return page < pageCount ? page + 1 : undefined;
        },
        initialPageParam: 1,
    });
}