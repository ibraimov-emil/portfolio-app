import React, {Suspense} from 'react'
import {Title} from "@/components/shared/title";
import PracticeItemsWrapper from "@/components/shared/practice-items-wrapper";
import {createServerTranslator, getServerLocale, getServerTranslations} from "@/lib/server-locale";

interface Props {
    items?: any[]
    className?: string
    skillIds?: string[]
}

const PracticeGroupList: React.FC<Props> = async (props) => {
    const {items, className} = props
    const [messages, locale] = await Promise.all([
        getServerTranslations(),
        getServerLocale()
    ]);
    const t = createServerTranslator(messages);

    return (
        <div className={className}>
            <Title text={t('dictionary.practice')} size={'lg'} className={'mb-6 font-semibold'}/>
            <Suspense fallback={<div>Loading practices...</div>}>
                <PracticeItemsWrapper />
            </Suspense>
        </div>
    )
}
export default PracticeGroupList
