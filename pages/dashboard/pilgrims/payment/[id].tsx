import Loader from '@/views/components/Loader'
import AdminPilgrimsTabLayout from '@/views/layouts/AdminLayout/pilgrims/tab'
import DashboardLayout from '@/views/layouts/DashboardLayout'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const DashboardPilgrimsPaymentDetail: React.FC = () => {
    const [isAuth, setIsAuth] = useState(false)
    const [loading, setLoading] = useState(true)

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
    
    const router = useRouter()

    const paymentData = async () => {
        if(router.query.id != undefined) {
            try {
                await axios.get(`/api/pilgrims/get/${router.query.id}`).then((res) => {
                    setLoading(false)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    useEffect(() => {
        if(!localStorage.getItem('token')) window.location.href = '/auth/login'
        else {
            if(!isAuth) checkToken()
        }

        paymentData()
    }, [isAuth, user])
    
    if(loading || !isAuth) return <Loader />
    return (
        <DashboardLayout pageName='Data Pembayaran Jemaah Haji' role='Admin'>
            <AdminPilgrimsTabLayout id={router.query.id}/>
        </DashboardLayout>
    )
}

export default DashboardPilgrimsPaymentDetail