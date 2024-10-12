'use client'
import React, {FC, useState} from 'react'
import {SkillsCombine} from "@/types/skill";
import FilterCheckbox from "@/components/shared/filter/filter-checkbox";
import {it} from "node:test";
import {useFilters} from "@/hooks/use-filters";
import {useQueryFilters} from "@/hooks/use-query-filters";
import filter from "@/components/shared/filter/filter";
import {Heading} from "lucide-react";
import {Title} from "@/components/shared/title";

interface Props {
    items?: SkillsCombine
}

const CheckboxFilterGroup: FC<Props> = (props) => {
    const {items} = props
    const filters = useFilters()
    useQueryFilters(filters)

    const advancedSkills = items?.data.filter(item => item.attributes.type === 'advanced')
    const mediumSkills = items?.data.filter(item => item.attributes.type === 'medium')
    const startSkills = items?.data.filter(item => item.attributes.type === 'start')

    return (
        <div className={`flex flex-col gap-x-4 gap-y-5 mt-5`}>
            {advancedSkills?.length ? <div>
                    <Title text={'Advanced'} size={'md'} className={'mb-4'}/>
                    <div className={`flex gap-x-4 gap-y-5 flex-wrap`}>
                        {advancedSkills?.map(item =>
                            <FilterCheckbox
                                key={item.id}
                                text={item.attributes.name}
                                value={item.id}
                                onCheckedChange={() => filters.setSelectedIngredients(item.id.toString())}
                                checked={filters.selectedIngredients?.has(item.id.toString())}
                            />
                        )}
                    </div>
                </div>
                : null}

            {mediumSkills?.length ? <div>
                <Title text={'Medium'} size={'md'} className={'mb-4'}/>
                <div className={`flex gap-x-4 gap-y-5 flex-wrap`}>
                    {mediumSkills?.map(item =>
                        <FilterCheckbox
                            key={item.id}
                            text={item.attributes.name}
                            value={item.id}
                            onCheckedChange={() => filters.setSelectedIngredients(item.id.toString())}
                            checked={filters.selectedIngredients?.has(item.id.toString())}
                        />
                    )}
                </div>
            </div> : null}

            {startSkills?.length ? <div>
                <Title text={'Start'} size={'md'} className={'mb-4'}/>
                <div className={`flex gap-x-4 gap-y-5 flex-wrap`}>
                    {startSkills?.map(item =>
                        <FilterCheckbox
                            key={item.id}
                            text={item.attributes.name}
                            value={item.id}
                            onCheckedChange={() => filters.setSelectedIngredients(item.id.toString())}
                            checked={filters.selectedIngredients?.has(item.id.toString())}
                        />
                    )}
                </div>
            </div> : null}
        </div>
    )
}

export default CheckboxFilterGroup
