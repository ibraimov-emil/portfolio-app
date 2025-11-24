import React from 'react'
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {CompanyItem} from "@/types/company";
import Image from "next/image";

interface IProps {
    company: CompanyItem
}

const CompanyCard = ({company}: IProps) => {
    return (
        <Card key={company.id} className={'group cursor-pointer h-full'}>
            <CardHeader className="flex space-y-6">
                {company.attributes.photo.data && <div className={'w-100 h-[300px] relative rounded-lg overflow-hidden'}>
                    <Image
                        src={process.env.NEXT_PUBLIC_API_URL_IMAGE + company.attributes.photo.data[0].attributes.url}
                        alt={''} fill={true} objectFit={'cover'}
                        className={'group-hover:scale-115 transition-transform duration-500 '}/>
                </div>}
                <CardTitle>{company.attributes.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {company.attributes.shortDescription}
                </p>
            </CardContent>
        </Card>
    )
}
export default CompanyCard
