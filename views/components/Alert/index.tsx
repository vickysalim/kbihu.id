import { Transition } from '@headlessui/react'
import { ReactNode, useState } from 'react'

interface AlertProps {
    children: ReactNode
    type: 'success' | 'error' | 'warning' | null
}

const Alert = ({ children, type }: AlertProps) => {
    const [isClosed, setIsClosed] = useState(false)

    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'

    return (
        <Transition
            show={!isClosed}
            leave='transition-opacity duration-150'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
            >
            <div className={`flex justify-between ${bgColor} text-white p-4 rounded-lg gap-2`}>
                <div>
                    {children}
                </div>
            </div>
        </Transition>
    )
}

export default Alert