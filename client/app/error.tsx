'use client'

import {Button} from "@/components/ui/button";

const error = ({error, reset}: {
    error: Error,
    reset: () => void,
}) => {
    return (
        <div>error: {error.message || 'something went wrong'} <Button onClick={reset}>Try again</Button></div>
    )
}
export default error
