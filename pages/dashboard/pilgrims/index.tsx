import Loader from '@/views/components/Loader'
import DashboardLayout from '@/views/layouts/DashboardLayout'
import { faEye, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import DataTable from "react-data-table-component"
import { dataTableStyle } from '@/lib/dataTable/style'
import { multipleDataInclude } from '@/lib/data/include'

const DashboardPilgrims: React.FC = () => {
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

    const pilgrimsModel = {
        id: '',
        username: '',
        phone_number: '',
        user_profile: {
            id:'',
            departure_year:'',
            reg_number:'',
            portion_number:'',
            bank:'',
            bank_branch:'',
            name:'',
            nasab_name:'',
            gender:'',
            marital_status:'',
            blood_type:'',
            pob:'',
            dob:'',
            street:'',
            postal_code:'',
            subdistrict:'',
            district:'',
            city:'',
            province:'',
            education:'',
            job:'',
            passport_number:'',
            passport_name:'',
            passport_pob:'',
            passport_dob:'',
            passport_issue_date:'',
            passport_expiry_date:'',
            passport_issue_office:'',
            passport_endorsement:'',
            identity_number:''
        }
    }

    const [pilgrims, setPilgrims] = useState([pilgrimsModel])

    const pilgrimsData = async () => {
        try {
            await axios.get(`/api/pilgrims/getAll/${user.company_id}`).then((res) => {
                setPilgrims(res.data.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const columns = useMemo(() => [
        {
            name: 'Aksi',
            cell: (row: any) => {
                return (
                    <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1" onClick={(e) => alert(`ID Pengguna: ${row.id}`)}>
                        <FontAwesomeIcon icon={faEye} />
                        <span className='ml-1'>Detail</span>
                    </button>
                )
            },
            width: '125px',
        },
        {
            name: 'Nama',
            cell: (row: any) => {
                return (
                    <div className='flex flex-col'>
                        <div>{row.user_profile.name}</div>
                        <div>
                            <span className='font-light'>{row.user_profile.gender == 'Laki-laki' ? ('Bin') : ('Binti')} </span>
                            <span>{row.user_profile.nasab_name}</span>
                        </div>
                    </div>
                )
            },
            width: '200px',
            sortable: true,
        },
        {
            name: 'Nomor Porsi',
            cell: (row: any) => {
                return row.user_profile.portion_number
            },
            width: '150px',
            sortable: true,
        },
        {
            name: 'Bank',
            cell: (row: any) => {
                return row.user_profile.bank
            },
            width: '150px',
            sortable: true,
        },
        {
            name: 'Jenis Kelamin',
            cell: (row: any) => {
                return row.user_profile.gender
            },
            width: '150px',
            sortable: true,
        },
        {
            name: 'Tempat Lahir',
            cell: (row: any) => {
                return row.user_profile.pob
            },
            width: '150px',
            sortable: true,
        },
        {
            name: 'Tanggal Lahir',
            cell: (row: any) => {
                return new Date(row.user_profile.dob).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
            },
            width: '150px',
            sortable: true,
        },
        {
            name: 'Alamat',
            cell: (row) => {
                return row.user_profile.street.concat(", Kel. ", row.user_profile.subdistrict, ", Kec. ", row.user_profile.district, ", Kota ", row.user_profile.city, ", ", row.user_profile.province, ", ", row.user_profile.postal_code)
            },
            width: '300px',
            sortable: true,
        },
        {
            name: 'Nomor Paspor',
            cell: (row) => {
                return row.user_profile.passport_number
            },
            width: '150px',
            sortable: true,
        },
        {
            name: 'Nama Paspor',
            cell: (row) => {
                return row.user_profile.passport_name
            },
            width: '200px',
            sortable: true,
        },
        {
            name: 'Tempat Lahir Paspor',
            cell: (row) => {
                return row.user_profile.passport_pob
            },
            width: '175px',
            sortable: true,
        },
        {
            name: 'Tanggal Lahir Paspor',
            cell: (row) => {
                return new Date(row.user_profile.passport_dob).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
            },
            width: '175px',
            sortable: true,
        },
        {
            name: 'Tanggal Penerbitan Paspor',
            cell: (row) => {
                return new Date(row.user_profile.passport_issue_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
            },
            width: '225px',
            sortable: true,
        },
        {
            name: 'Tanggal Berakhir Paspor',
            cell: (row) => {
                return new Date(row.user_profile.passport_expiry_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
            },
            width: '200px',
            sortable: true,
        },
        {
            name: 'Kantor Penerbit Paspor',
            cell: (row) => {
                return row.user_profile.passport_issue_office
            },
            width: '200px',
            sortable: true,
        },
        {
            name: 'Nomor KTP',
            cell: (row) => {
                return row.user_profile.identity_number
            },
            width: '175px',
            sortable: true,
        }
    ], [])

    const [searchPilgrims, setSearchPilgrims] = useState('')

    useEffect(() => {
        if(!localStorage.getItem('token')) window.location.href = '/auth/login'
        else {
            if(!isAuth) checkToken()
        }

        pilgrimsData()
    }, [isAuth, user])

    const tableStyle: {} = dataTableStyle
    
    if(isAuth) return (
        <DashboardLayout pageName='Jemaah Haji' role={user.role}>

            <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                <FontAwesomeIcon icon={faPlus} />
                <span className='ml-1'>Tambah Jemaah Haji Baru</span>
            </button>
            <div className="w-full mx-auto py-5">
                <input type="text" value={searchPilgrims} onChange={(e) => setSearchPilgrims(e.target.value)} placeholder='Cari Nama, No. Porsi, No. KTP, atau No. Paspor' className='w-1/4 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 mb-2'/>

                { pilgrims.length > 0 ? (
                    <DataTable
                        columns={columns}
                        data={pilgrims.filter((item) => {
                            if(searchPilgrims === '') return item
                            else if(multipleDataInclude([item.user_profile.name, item.user_profile.nasab_name, item.user_profile.portion_number, item.user_profile.passport_number, item.user_profile.identity_number], searchPilgrims)) return item
                        })}
                        pagination={true}
                        customStyles={tableStyle}
                    />
                ) : ('') }
            </div>
        </DashboardLayout>
    ); else return (
        <Loader />
    )
}

export default DashboardPilgrims