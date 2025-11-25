"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Loader2, Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import CompanyCard from "./CompanyCard";
import { CompanyCardSkeleton } from "./company-card-skeleton";
import { useCompaniesInfinite } from "@/hooks/use-companies-infinite";
import { useDebounce } from "@/hooks/use-debounce";

export function CompaniesList() {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearch = useDebounce(searchQuery, 500);
    const observerTarget = useRef<HTMLDivElement>(null);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useCompaniesInfinite({ search: debouncedSearch });

    // Infinite scroll observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const allCompanies = data?.pages.flatMap((page) => page.data) ?? [];

    return (
        <div className="space-y-6">
            {/* Search and Create Button */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search companies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <Link href="/practice/1/company/create">
                    <Button variant="outline">Create company</Button>
                </Link>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <CompanyCardSkeleton key={index} />
                    ))}
                </div>
            )}

            {/* Error State */}
            {isError && (
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
                    <p className="text-sm text-destructive">
                        Failed to load companies. Please try again.
                    </p>
                </div>
            )}

            {/* Companies Grid */}
            {!isLoading && !isError && (
                <>
                    {allCompanies.length === 0 ? (
                        <div className="rounded-lg border border-dashed p-12 text-center">
                            <p className="text-muted-foreground">
                                {searchQuery
                                    ? "No companies found matching your search."
                                    : "No companies yet. Create your first company!"}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                            {allCompanies.map((company) => (
                                <Link
                                    href={`/practice/1/company/${company.id}`}
                                    key={company.id}
                                >
                                    <CompanyCard company={company} />
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Infinite Scroll Trigger */}
                    <div ref={observerTarget} className="py-4">
                        {isFetchingNextPage && (
                            <div className="flex items-center justify-center">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            </div>
                        )}
                    </div>

                    {/* End of List Message */}
                    {!hasNextPage && allCompanies.length > 0 && (
                        <div className="text-center text-sm text-muted-foreground">
                            You&#39;ve reached the end of the list
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
