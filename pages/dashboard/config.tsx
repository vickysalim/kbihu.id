import Loader from '@/views/components/Loader'
import DashboardLayout from '@/views/layouts/DashboardLayout'
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import DataTable from "react-data-table-component"
import { dataTableStyle } from '@/lib/dataTable/style'
import { Disclosure } from '@headlessui/react'
import AdminDocumentConfigLayout from '@/views/layouts/SuperadminLayout/config/document'

const DashboardConfiguration: React.FC = () => {
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
    
    if(!isAuth) return <Loader />
    return (
        <DashboardLayout pageName='Pengaturan Data' role={user.role}>
            <AdminDocumentConfigLayout id={user.id} company_id={user.company_id}/>
        </DashboardLayout>
    )
}

export default DashboardConfiguration