import React from 'react'
import {getPractice} from "@/services/practice";
import ErrorHandler from "@/components/shared/ErrorHandler";
import PracticeCard from "@/components/shared/practice-card";
import {cn} from "@/lib/utils";
import Link from "next/link";

const PracticeItems = async () => {
    let practice
    try {
        practice = await getPractice()
    } catch (error) {
        return <ErrorHandler error={error?.toString()}/>
    }

    return (
        <div className={cn('grid grid-cols-3 gap-7')}>
            {practice.data.map(item => <Link key={item.id} href={`/practice/${item.id}`}><PracticeCard key={item.id} /></Link>)}
        </div>
    )
}
export default PracticeItems
