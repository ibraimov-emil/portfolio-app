import React, {FC} from 'react'
import {Ban, RotateCw} from "lucide-react";

interface Props {
    error?: any
    refetch?: () => void
}

const ErrorHandler: FC<Props> = ({refetch, error}) => {
    return (
        // eslint-disable-next-line react/jsx-no-undef
        <div className={`flex justify-center flex-col items-center gap-4`}>
            <div className={`w-full flex justify-center items-center gap-2 font-bold text-2xl`}>
                Error {error}
                <Ban color={'red'}/>
            </div>
            {refetch ? <button>
                <RotateCw onClick={refetch}/>
            </button> : null}
        </div>

    )
}
export default ErrorHandler
