import React, {Suspense} from 'react'
import {Title} from "@/components/shared/title";
import PracticeItems from "@/components/shared/practice-items";

interface Props {
    items?: any[]
    className?: string
}

const PracticeGroupList: React.FC<Props> = (props) => {
    const {items, className} = props

    return (
        <div className={className}>
            <Title text={'Practice'} size={'lg'} className={'mb-6 font-semibold'}/>
            <Suspense fallback={<div>Loading...</div>}>
                <PracticeItems/>
            </Suspense>
        </div>
    )
}
export default PracticeGroupList
