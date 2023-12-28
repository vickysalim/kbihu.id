import Loader from '@/views/components/Loader'
import AdminCompanyProfileLayout from '@/views/layouts/AdminLayout/company-profile'
import DashboardLayout from '@/views/layouts/DashboardLayout'
import axios from 'axios'
import { useEffect, useState } from 'react'

const DashboardCompanyProfile: React.FC = () => {
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

            if(response.data.data.role != 'Admin') {
                window.location.href = '/dashboard'
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
                <DashboardLayout pageName='Profil KBIHU' role={user.role}>
                    <AdminCompanyProfileLayout id={user.company_id}/>
                </DashboardLayout>
            ) : (
                <Loader />
            )}
        </>
    )
}

export default DashboardCompanyProfile