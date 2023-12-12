import Loader from '@/views/components/Loader'
import DashboardLayout from '@/views/layouts/DashboardLayout'
import { useEffect, useState } from 'react'

const DashboardIndex: React.FC = () => {
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        if(!localStorage.getItem('token')) window.location.href = '/auth/login'
        else setIsAuth(true)
    }, [])
    
    return (
        <>
        { isAuth ? (
            <DashboardLayout pageName='Dashboard'>
                <div className='flex flex-col'>
                    <p className='text-sm text-blue-500'>Welcome to your dashboard</p>
                </div>
            </DashboardLayout>
        ) : (
            <Loader />
        )}
        </>
    )
}

export default DashboardIndex