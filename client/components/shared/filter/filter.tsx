import React, {Suspense} from 'react'
import {cn} from "@/lib/utils";
import {Title} from "@/components/shared/title";
import FilterItems from "@/components/shared/filter/filter-items";
import SkillsCartWrapperServer from "@/components/shared/skills-cart-wrapper-server";

interface Props {
    className?: string
}

export const dynamic = 'force-dynamic'

const Filter: React.FC<Props> = ({className}) => {
    return (
        <div className={cn('flex flex-col gap-4', className)}>
            <div
                className={cn('w-full bg-gray-100 rounded-xl p-3 dark:prose-invert dark:bg-opacity-0 dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]')}>
                <div className={'flex items-center justify-between'}>
                    <Title text={'My skills'} size={'lg'} className={'font-semibold'}/>
                </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <FilterItems/>
                </Suspense>
            </div>
            <Suspense fallback={null}>
                <SkillsCartWrapperServer/>
            </Suspense>
        </div>
    )
}
export default Filter
