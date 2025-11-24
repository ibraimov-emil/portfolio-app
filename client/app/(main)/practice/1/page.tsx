'use client'
import React from 'react'
import {Container} from "@/components/shared/container";
import {useQuery} from "@tanstack/react-query";
import {getCompanies} from "@/services/company";
import CompanyCard from "@/app/(main)/practice/1/_components/CompanyCard";
import {Button} from "@/components/ui/button";
import Link from "next/link";

const Page = () => {
    const {isPending, isError, data: companies, error} = useQuery({
        queryKey: ['companies'],
        queryFn: () => getCompanies({populate: '*'})
    })
    return (
        <Container>
            <Link href={`/practice/1/company/create`}><Button variant="outline" className={'mb-7'}>Create company</Button></Link>
            <div className="grid 2xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-7">
                {companies?.data.map((company) =>
                    <Link href={`/practice/1/company/${company.id}`} key={company.id}>
                        <CompanyCard company={company}/>
                    </Link>
                )}
            </div>
        </Container>
    )
}
export default Page
