'use client'
import React from 'react'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {PracticeItem} from "@/types/practice";
import Image from "next/image";

interface PracticeCardProps {
    practice: PracticeItem,
    children?: React.ReactNode,
}

const PracticeCard: React.FC<PracticeCardProps> = ({practice, children}) => {
    const previewImage = practice.Preview?.[0]
    const skills = practice.skills || []

    return (
        <Card className="h-full hover:shadow-lg transition-shadow flex flex-col">
            {previewImage && (
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                        src={process.env.NEXT_PUBLIC_API_URL_IMAGE + previewImage.url}
                        alt={practice.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <CardHeader>
                <CardTitle>{practice.title}</CardTitle>
            </CardHeader>
            <CardContent className={`h-full flex flex-col justify-between`}>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-auto">
                    {practice.description}
                </p>
                {skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {skills.slice(0, 3).map(skill => (
                            <span
                                key={skill.documentId}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-md"
                            >
                                {skill.name}
                            </span>
                        ))}
                        {skills.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                                +{skills.length - 3}
                            </span>
                        )}
                    </div>
                )}
                {children}
            </CardContent>
            {practice.link && (
                <CardFooter>
                    <a
                        href={`/practice/${practice.link}`}
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                    >
                        View Project →
                    </a>
                </CardFooter>
            )}
        </Card>
    )
}
export default PracticeCard
