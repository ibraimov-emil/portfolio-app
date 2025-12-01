import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CompanyCardSkeleton() {
    return (
        <Card className="h-full">
            <CardHeader className="space-y-6">
                {/* Image skeleton */}
                <Skeleton className="h-[200px] w-full rounded-lg" />
                {/* Title skeleton */}
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
                {/* Description skeleton - 3 lines */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </CardContent>
        </Card>
    );
}