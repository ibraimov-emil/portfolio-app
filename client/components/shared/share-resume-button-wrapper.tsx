'use client'
import React from 'react'
import ShareResumeButton from "@/components/shared/share-resume-button";
import {useFilters} from "@/hooks/use-filters";

const ShareResumeButtonWrapper: React.FC = () => {
    const filters = useFilters()
    
    if (filters.selectedSkills.size === 0) {
        return null
    }

    return <ShareResumeButton skills={Array.from(filters.selectedSkills).join(',')} />
}

export default ShareResumeButtonWrapper

