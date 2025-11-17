'use client'
import React from 'react'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {PracticeItem} from "@/types/practice";
import Image from "next/image";

interface PracticeCardProps {
    practice: PracticeItem
}

const PracticeCard: React.FC<PracticeCardProps> = ({practice}) => {
    const previewImage = practice.attributes.Preview?.data?.[0]
    const skills = practice.attributes.skills?.data || []

    return (
        <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            {previewImage && (
                <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                    <Image
                        src={previewImage.attributes.url}
                        alt={practice.attributes.title}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <CardHeader>
                <CardTitle>{practice.attributes.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                    {practice.attributes.description}
                </p>
                {skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                        {skills.slice(0, 3).map(skill => (
                            <span
                                key={skill.id}
                                className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-md"
                            >
                                {skill.attributes.name}
                            </span>
                        ))}
                        {skills.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-500">
                                +{skills.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </CardContent>
            {practice.attributes.link && (
                <CardFooter>
                    <a
                        href={practice.attributes.link}
                        target="_blank"
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
