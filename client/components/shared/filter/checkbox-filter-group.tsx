'use client'
import React, {FC} from 'react'
import {SkillsCombine} from "@/types/skill";
import FilterCheckbox from "@/components/shared/filter/filter-checkbox";
import {useFilters} from "@/hooks/use-filters";
import {Title} from "@/components/shared/title";
import {useTranslations} from "next-intl";

interface Props {
    items?: SkillsCombine
}

const CheckboxFilterGroup: FC<Props> = (props) => {
    const {items} = props
    const filters = useFilters()
    const t = useTranslations('dictionary');

    const advancedSkills = items?.data.filter(item => item.type === 'advanced')
    const mediumSkills = items?.data.filter(item => item.type === 'medium')
    const startSkills = items?.data.filter(item => item.type === 'start')

    return (
        <div className={`flex flex-col gap-x-4 gap-y-5 mt-5`}>
            {advancedSkills?.length ? <div>
                    <Title text={t('advanced')} size={'md'} className={'mb-4'}/>
                    <div className={`flex gap-x-4 gap-y-5 flex-wrap`}>
                        {advancedSkills?.map(item =>
                            <FilterCheckbox
                                key={item.id}
                                text={item.name}
                                value={item.id}
                                onCheckedChange={() => filters.setSelectedSkills(item.id.toString())}
                                checked={filters.selectedSkills?.has(item.id.toString())}
                                name="skill"
                            />
                        )}
                    </div>
                </div>
                : null}

            {mediumSkills?.length ? <div>
                <Title text={t('medium')} size={'md'} className={'mb-4'}/>
                <div className={`flex gap-x-4 gap-y-5 flex-wrap`}>
                    {mediumSkills?.map(item =>
                        <FilterCheckbox
                            key={item.id}
                            text={item.name}
                            value={item.id}
                            onCheckedChange={() => filters.setSelectedSkills(item.id.toString())}
                            checked={filters.selectedSkills?.has(item.id.toString())}
                            name="skill"
                        />
                    )}
                </div>
            </div> : null}

            {startSkills?.length ? <div>
                <Title text={t('start')} size={'md'} className={'mb-4'}/>
                <div className={`flex gap-x-4 gap-y-5 flex-wrap`}>
                    {startSkills?.map(item =>
                        <FilterCheckbox
                            key={item.id}
                            text={item.name}
                            value={item.id}
                            onCheckedChange={() => filters.setSelectedSkills(item.id.toString())}
                            checked={filters.selectedSkills?.has(item.id.toString())}
                            name="skill"
                        />
                    )}
                </div>
            </div> : null}
        </div>
    )
}

export default CheckboxFilterGroup
