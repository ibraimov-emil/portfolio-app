import React, {Suspense} from 'react'
import {Container} from "@/components/shared/container";
import {Title} from "@/components/shared/title";
import Filter from "@/components/shared/filter/filter";
import PracticeGroupList from "@/components/shared/practice-group-list";
import {getSkills} from "@/services/skill";
import {Metadata} from "next";
import ShareResumeButtonWrapper from "@/components/shared/share-resume-button-wrapper";
import SelectedSkillsSummary from "@/components/shared/selected-skills-summary";
import PracticeItemsWrapper from "@/components/shared/practice-items-wrapper";
import SkillsCartWrapper from "@/components/shared/skills-cart-wrapper";

export const metadata: Metadata = {
    title: "Resume | Emil Ibraimov",
    description: "Emil Ibraimov - Front-end Developer Resume",
};

export const dynamic = 'force-dynamic'

export default async function ResumePage() {
    const skills = await getSkills()

    return (
        <div className="min-h-screen py-12">
            <Container>
                <div className="mb-12 text-center">
                    <Title text="My Resume" size="2xl" className="font-bold mb-4 text-5xl"/>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
                        Select skills to customize your view and share this resume with potential employers
                    </p>
                    <Suspense fallback={null}>
                        <ShareResumeButtonWrapper />
                    </Suspense>
                </div>

                <div className="grid grid-cols-12 gap-[1.875rem] mb-12">
                    <div className="col-span-3">
                        <Filter />
                    </div>
                    <div className="col-span-9">
                        <PracticeGroupList />
                    </div>
                </div>

                <Suspense fallback={null}>
                    <SelectedSkillsSummary skills={skills} />
                </Suspense>
            </Container>
        </div>
    )
}





