import { Transition } from '@headlessui/react'
import Link from 'next/link'
import { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-white border-b border-grayscale-200 sticky top-0 z-50">
        <div className="max-w-screen-xl mx-auto">
            <div className="flex items-center h-16 w-full">
                <div className="flex items items-center mx-4 lg:mx-0 justify-between w-full">
                    <div className="flex justify-center items-center flex-shrink-0">
                        Dashboard
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-4">
                            <Link className="cursor-pointer text-grayscale-700 font-light px-3 py-2 text-md hover:text-grayscale-800" href="/">
                                Beranda
                            </Link>
                        </div>
                    </div>
                    <div className="hidden md:block">
                        <div className="flex items-baseline space-x-4">
                            <Link className="cursor-pointer text-primary-500 font-light px-4 py-1.5 rounded-md text-md hover:text-primary-600 border border-primary-500" href="/login">
                                Login
                            </Link>
                        </div>
                    </div>
                    
                    <div className="flex md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} type="button" className="inline-flex items-center justify-center p-2 focus:outline-none focus:ring-offset-2 focus:ring-offset-primary-500 focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span className="sr-only">Open main menu</span>
                            { !isOpen ? (
                                <svg className="block h-6 w-6" xmlns="http://w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            ) : (
                                <svg className="block h-6 w-6" xmlns="http://w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            ) }
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Transition
            show={isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div className="md:hidden id=mobile-menu">
                <div className="bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <Link className="cursor-pointer text-grayscale-700 font-light px-3 py-2 text-md hover:text-grayscale-500 block" href="/">
                        Beranda
                    </Link>
                    <div className="flex items items-center px-3 py-2 justify-between w-full gap-4">
                        <Link className="cursor-pointer text-primary-500 font-light px-4 py-1.5 rounded-md text-md hover:text-primary-600 border border-primary-500 w-full justify-center inline-block text-center" href="/login">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </Transition>
    </nav>
  )
}

export default Header