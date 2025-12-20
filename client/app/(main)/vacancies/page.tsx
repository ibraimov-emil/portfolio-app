'use client';

import { useGetVacanciesQuery, useDeleteVacancyMutation } from '@/store/api/vacancies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Edit, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function VacanciesPage() {
  const { data, isLoading, error } = useGetVacanciesQuery({ page: 1, pageSize: 10 });
  const [deleteVacancy, { isLoading: isDeleting }] = useDeleteVacancyMutation();

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this vacancy?')) {
      try {
        await deleteVacancy(id).unwrap();
      } catch (err) {
        console.error('Failed to delete vacancy:', err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading vacancies</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Vacancies</h1>
        <Link href="/vacancies/create">
          <Button>Create Vacancy</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data?.data.map((vacancy) => (
          <Card key={vacancy.documentId}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="line-clamp-1">{vacancy.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {vacancy.company?.name}
                  </CardDescription>
                </div>
                {vacancy.hot && (
                  <Badge variant="destructive" className="ml-2">Hot</Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{vacancy.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{vacancy.workFormat}</span>
                </div>
                {vacancy.salaryMin && vacancy.salaryMax && (
                  <p className="font-semibold">
                    ${vacancy.salaryMin.toLocaleString()} - ${vacancy.salaryMax.toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Link href={`/vacancies/${vacancy.documentId}`} className="flex-1">
                <Button variant="outline" className="w-full">View</Button>
              </Link>
              <Link href={`/vacancies/${vacancy.documentId}/edit`}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleDelete(vacancy.documentId)}
                disabled={isDeleting}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {data?.data.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No vacancies found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}