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
                <button onClick={() => setIsClosed(true)} className='float-right'>
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    </svg>
                </button>
            </div>
        </Transition>
    )
}

export default Alert