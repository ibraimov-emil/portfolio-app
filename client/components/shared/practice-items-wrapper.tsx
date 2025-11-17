'use server'
import React, {Suspense} from 'react'
import {getPractice} from "@/services/practice";
import ErrorHandler from "@/components/shared/ErrorHandler";
import PracticeItemsWrapperClient from "@/components/shared/practice-items-wrapper-client";

const PracticeItemsWrapper = async () => {
    let practice
    try {
        // Load all practices, filtering will happen on client side via context
        practice = await getPractice()
    } catch (error) {
        return <ErrorHandler error={error?.toString()}/>
    }

    return <PracticeItemsWrapperClient practice={practice} />
}
export default PracticeItemsWrapper

