import React from 'react'
import {Title} from "@/components/shared/title";
import {Container} from "@/components/shared/container";
import Filter from "@/components/shared/filter/filter";
import PracticeGroupList from "@/components/shared/practice-group-list";
import HomePageLayout from './page-layout';
import {getCompanyById} from "@/services/company";
import {createServerTranslator, getServerLocale, getServerTranslations} from "@/lib/server-locale";

export default async function Page() {
    const [messages, locale] = await Promise.all([
        getServerTranslations(),
        getServerLocale()
    ]);
    const t = createServerTranslator(messages);

    return (
        <HomePageLayout>
            <section>
                <Container className={`flex flex-col items-center mt-12`}>
                    <div className={'w-1/2'}>
                        <Title text={t('main.title')} size={'2xl'} className={'font-bold'}/>
                        {/*<Title text={'Hello. I am Emil Ibraimov.'} size={'2xl'} className={'font-bold'}/>*/}
                        <p className={`whitespace-pre-line`}>
                            {t('main.description')}
                            {/*A front-end developer with 3.5 years of experience specializing in creating responsive and*/}
                            {/*user-friendly web applications using modern frameworks like React and Next.js. <br/>*/}
                            {/*I&#39;m passionate about solving complex problems, continuously learning new technologies,*/}
                            {/*and*/}
                            {/*building clean,*/}
                            {/*maintainable code. This website showcases my technical expertise and projects that highlight*/}
                            {/*my*/}
                            {/*skills in real-time applications, state management, and asynchronous operations.*/}
                        </p>
                    </div>
                </Container>
            </section>
            <section className={'mt-24'}>
                <Container>
                    <div className="grid grid-cols-12 gap-[1.875rem]">
                        <Filter className={'col-span-3'}/>
                        <PracticeGroupList className={`col-span-9`}/>
                    </div>
                </Container>
            </section>
        </HomePageLayout>
    )
}
