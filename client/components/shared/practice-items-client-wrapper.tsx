'use client'
import React from 'react'
import {PracticesCombine} from "@/types/practice";
import PracticeItems from "@/components/shared/practice-items";

interface PracticeItemsClientWrapperProps {
    practice: PracticesCombine
}

const PracticeItemsClientWrapper: React.FC<PracticeItemsClientWrapperProps> = ({practice}) => {
    return <PracticeItems practice={practice} />
}

export default PracticeItemsClientWrapper

