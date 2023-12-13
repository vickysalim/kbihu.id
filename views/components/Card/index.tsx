import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
}

const Card = ({ children }: CardProps) => {
    return (
        <div className='bg-white min-h-full flex flex-col rounded-lg px-4 py-3'>
            {children}
        </div>
    )
}

export default Card