import React, {Suspense} from 'react'
import {Title} from "@/components/shared/title";
import PracticeItemsWrapper from "@/components/shared/practice-items-wrapper";

interface Props {
    items?: any[]
    className?: string
    skillIds?: string[]
}

const PracticeGroupList: React.FC<Props> = (props) => {
    const {items, className} = props

    return (
        <div className={className}>
            <Title text={'Practice'} size={'lg'} className={'mb-6 font-semibold'}/>
            <Suspense fallback={<div>Loading practices...</div>}>
                <PracticeItemsWrapper />
            </Suspense>
        </div>
    )
}
export default PracticeGroupList
