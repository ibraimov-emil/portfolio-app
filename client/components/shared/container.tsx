import React from 'react';
import {cn} from "@/lib/utils";

interface Props {
    className?: string;
}

export const Container: React.FC<React.PropsWithChildren<Props>> = ({ className, children }) => {
    return <div className={cn('mx-auto max-w-[1780px] px-4 md:px-7 pb-28 pt-8', className)}>{children}</div>;
};
