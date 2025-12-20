'use client'
import React from 'react'
import ErrorHandler from "@/components/shared/ErrorHandler";
import PracticeCard from "@/components/shared/practice-card";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {PracticesCombine} from "@/types/practice";
import {LanguageToggle} from "@/components/shared/language-toggle";

interface PracticeItemsProps {
    practice: PracticesCombine
}

const PracticeItems: React.FC<PracticeItemsProps> = ({practice}) => {
    if (!practice) {
        return <ErrorHandler error="Failed to load practices"/>
    }

    return (
        <div className={cn('grid grid-cols-3 gap-7')}>
            {practice.data.length > 0 ? (
                practice.data.map(item => (
                    <PracticeCard key={item.documentId} practice={item}>
                        {item.title == 'i18n' ?  <div className={`mt-4`}> <LanguageToggle/> </div> : null}
                    </PracticeCard>
                ))
            ) : (
                <div className="col-span-3 text-center py-12 text-gray-500">
                    No practices found for selected skills
                </div>
            )}
        </div>
    )
}
export default PracticeItems
