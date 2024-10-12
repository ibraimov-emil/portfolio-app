import React from 'react'
import {cn} from "@/lib/utils";
import {Title} from "@/components/shared/title";
import PracticeCard from "@/components/shared/practice-card";

interface Props {
    items?: any[]
    className?: string
}

const PracticeGroupList: React.FC<Props> = (props) => {
    const {items, className} = props

    return (
        <div className={className}>
            <Title text={'Practice'} size={'lg'} className={'mb-6 font-semibold'}/>
            <div className={cn('grid grid-cols-3 gap-7')}>
                <PracticeCard/>
                <PracticeCard/>
                <PracticeCard/>
                <PracticeCard/>
                <PracticeCard/>
                <PracticeCard/>
                <PracticeCard/>
                <PracticeCard/>
            </div>
        </div>
    )
}
export default PracticeGroupList
