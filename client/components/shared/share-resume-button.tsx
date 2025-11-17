'use client'
import React, {useState} from 'react'
import {Button} from "@/components/ui/button";
import {Copy, Check} from "lucide-react";

interface ShareResumeButtonProps {
    skills: string
}

const ShareResumeButton: React.FC<ShareResumeButtonProps> = ({skills}) => {
    const [copied, setCopied] = useState(false)

    const copyLink = async () => {
        const url = `${window.location.origin}/resume?skills=${skills}`
        try {
            await navigator.clipboard.writeText(url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    return (
        <Button
            onClick={copyLink}
            variant="outline"
            size="sm"
            className="gap-2"
        >
            {copied ? (
                <>
                    <Check className="w-4 h-4" />
                    Copied!
                </>
            ) : (
                <>
                    <Copy className="w-4 h-4" />
                    Copy Resume Link
                </>
            )}
        </Button>
    )
}

export default ShareResumeButton


