import React, {FC} from 'react'
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    href: string;
    icon: React.ReactNode
    label: string
}

const MenuItem: FC<Props> = ({href, icon, label, ...props}) => {
    return (
        <Link href={href}>
            <Button variant={'outline'} className={cn('flex w-full justify-start', props.className)} {...props}>
                <div className={cn({'mr-3': icon})}>{icon}</div>
                {label}
            </Button>
        </Link>
    )
}
export default MenuItem
