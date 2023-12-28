import Loader from '@/views/components/Loader'
import DashboardLayout from '@/views/layouts/DashboardLayout'
import SuperadminIndexLayout from '@/views/layouts/SuperadminLayout/dashboard'
import AdminIndexLayout from '@/views/layouts/AdminLayout/dashboard'
import axios from 'axios'
import { useEffect, useState } from 'react'

const DashboardIndex: React.FC = () => {
    const [isAuth, setIsAuth] = useState(false)

    const [user, setUser] = useState({
        id: null,
        username: null,
        phone_number: null,
        role: null,
        company_id: null
    })

    const checkToken = async () => {
        const token = localStorage.getItem('token')
        try {
            const response = await axios.post('/api/auth/verify', {
                userData: 'true'
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if(response.data.data.role == 'User') {
                localStorage.removeItem('token')
                window.location.href = '/auth/login'
            } else {
                setUser(response.data.data)
                setIsAuth(true)
            }
        } catch (error) {
            localStorage.removeItem('token')
            window.location.href = '/auth/login'
        }
    }

    useEffect(() => {
        if(!localStorage.getItem('token')) window.location.href = '/auth/login'
        else {
            if(!isAuth) checkToken()
        }
    }, [isAuth, user])
    
    return (
        <>
            { isAuth ? (
                <DashboardLayout pageName='Dashboard' role={user.role}>
                    { user.role == 'Superadmin' ? (
                        <SuperadminIndexLayout/>
                    ) : user.role == 'Admin' ? (
                        <AdminIndexLayout/>
                    ) : (
                        <p>You are not authorized</p>
                    ) }
                </DashboardLayout>
            ) : (
                <Loader />
            )}
        </>
    )
}

export default DashboardIndex