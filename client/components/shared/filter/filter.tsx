import React, {Suspense} from 'react'
import {cn} from "@/lib/utils";
import {Title} from "@/components/shared/title";
import FilterItems from "@/components/shared/filter/filter-items";

interface Props {
    className?: string
}

export const dynamic = 'force-dynamic'

const Filter: React.FC<Props> = ({className}) => {
    // const {isPending, error, data, refetch} = useQuery({
    //     queryKey: ['skills'],
    //     queryFn: () => getSkills()
    // })

    // const skills = await getSkills()


    return (
        <div
            className={cn('w-full bg-gray-100 rounded-xl p-3 dark:prose-invert dark:bg-opacity-0 dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]', className)}>
                <div className={'flex items-center justify-between'}>
                <Title text={'My skills'} size={'lg'} className={'font-semibold'}/> add selected to cart
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                {/*{skills.data.map(item => item.attributes.name)}*/}
                <FilterItems/>
            </Suspense>
            {/*{error ? <ErrorHandler refetch={refetch}/> : ''}*/}
            {/*{isPending ? <div>Loading...</div> : ''}*/}
            {/*{data ? 'dfds' : ''}*/}
        </div>
    )
}
export default Filter
