'use client';

import { use } from 'react';
import { useGetVacancyByIdQuery } from '@/store/api/vacancies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import type { PageParams } from '@/types/general';

export default function VacancyDetailPage({ params }: PageParams) {
  const { id } = use(params);
  const { data, isLoading, error } = useGetVacancyByIdQuery(id);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Skeleton className="h-8 w-32 mb-6" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">Error loading vacancy</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const vacancy = data.data;

  return (
    <div className="container mx-auto py-8">
      <Link href="/vacancies">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vacancies
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{vacancy.title}</CardTitle>
              <CardDescription className="text-lg mt-2">
                {vacancy.company?.name}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {vacancy.hot && <Badge variant="destructive">Hot</Badge>}
              {vacancy.isActive && <Badge>Active</Badge>}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{vacancy.location}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Work Format</p>
                <p className="font-medium">{vacancy.workFormat}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Employment Type</p>
                <p className="font-medium">{vacancy.employmentType}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Salary Range</p>
                <p className="font-medium">
                  ${vacancy.salaryMin?.toLocaleString()} - ${vacancy.salaryMax?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{vacancy.description}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Experience Level</h3>
            <p className="text-muted-foreground">{vacancy.experienceLevel}</p>
          </div>

          {vacancy.contacts && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Contacts</h3>
              <p className="text-muted-foreground">{vacancy.contacts}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Link href={`/vacancies/${vacancy.documentId}/edit`} className="flex-1">
              <Button className="w-full">Edit Vacancy</Button>
            </Link>
            <Button variant="outline">Apply Now</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}