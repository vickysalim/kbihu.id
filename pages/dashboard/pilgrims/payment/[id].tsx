import { dataTableStyle } from '@/lib/dataTable/style'
import { formatDate } from '@/lib/date/format'
import { downloadFile } from '@/lib/download'
import Loader from '@/views/components/Loader'
import AdminPilgrimsTabLayout from '@/views/layouts/AdminLayout/pilgrims/tab'
import DashboardLayout from '@/views/layouts/DashboardLayout'
import { faDownload, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Disclosure } from '@headlessui/react'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import DataTable from 'react-data-table-component'

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

    const paymentModel = {
        id: '',
        amount: '',
        note: '',
        proof_file: '',
        transaction_date: ''
    }

    const [payment, setPayment] = useState([paymentModel])
    const [addPayment, setAddPayment] = useState(paymentModel)

    const paymentData = async () => {
        if(router.query.id != undefined) {
            try {
                await axios.get(`/api/pilgrims/payment/get/${router.query.id}`).then((res) => {
                    setPayment(res.data.data)
                    setLoading(false)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    const downloadProof = async (proof_file: string) => {
        if(proof_file) await downloadFile(`/upload_files/pilgrims/payment/${proof_file}`, proof_file)
    }

    const columns = useMemo(() => [
        {
            name: 'Aksi',
            cell: (row: any) => {
                return (
                    <button className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1">
                        <FontAwesomeIcon icon={faTrashCan} />
                        <span className='ml-1'>Hapus</span>
                    </button>
                )
            },
            width: '200px',
        },
        {
            name: 'Jumlah Pembayaran',
            cell: (row: any) => {
                return (
                    <>
                        Rp. {row.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')} 
                    </>
                )
            },
        },
        {
            name: 'Keterangan',
            cell: (row: any) => {
                return row.note
            },
        },
        {
            name: 'Tanggal Transaksi',
            cell: (row: any) => {
                return formatDate(row.transaction_date)
            },
        },
        {
            name: 'Bukti Pembayaran',
            cell: (row: any) => {
                return (
                    <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1 disabled:bg-gray-500 disabled:active:bg-gray-600" disabled={!row.proof_file} onClick={() => downloadProof(row.proof_file)}>
                        <FontAwesomeIcon icon={faDownload} />
                        <span className='ml-1'>{row.proof_file ? 'Unduh Bukti' : 'Tidak Tersedia'}</span>
                    </button>
                )
            }
        }
    ], [])

    useEffect(() => {
        if(!localStorage.getItem('token')) window.location.href = '/auth/login'
        else {
            if(!isAuth) checkToken()
        }

        paymentData()
    }, [isAuth, user])

    const tableStyle: {} = dataTableStyle
    
    if(loading || !isAuth) return <Loader />
    return (
        <DashboardLayout pageName='Data Pembayaran Jemaah Haji' role='Admin'>
            <AdminPilgrimsTabLayout id={router.query.id} activeTab='payment'/>

            <div className='mb-2'>
                <Disclosure>
                    <Disclosure.Button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                        <FontAwesomeIcon icon={faPlus} />
                        <span className='ml-1'>Tambah Data Pembayaran</span>
                    </Disclosure.Button>
                    <Disclosure.Panel className="mt-2 text-gray-500 bg-white rounded-lg p-4">
                        <form>
                            <div className='grid grid-cols-1 gap-4'>
                                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4'>
                                    <div className='flex flex-col'>
                                        <label htmlFor='transaction_date' className='text-sm font-semibold text-gray-500'>Tanggal Pembayaran</label>
                                        <input
                                            type='date'
                                            id='transaction_date'
                                            value={addPayment.transaction_date}
                                            onChange={(e) => setAddPayment({...addPayment, transaction_date: e.target.value})}
                                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                        />
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor='amount' className='text-sm font-semibold text-gray-500'>Jumlah Pembayaran</label>
                                        <div className="relative">
                                            <span className='absolute top-2 bottom-2 left-3'>Rp.</span>
                                            <input
                                                type='number'
                                                id='amount'
                                                value={addPayment.amount}
                                                onChange={(e) => setAddPayment({...addPayment, amount: e.target.value})}
                                                className='w-full rounded-lg border border-gray-300 p-2 pl-10 focus:outline-none focus:border-blue-500'
                                            />
                                        </div>
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Upload Bukti Pembayaran</label>
                                        <input
                                            type='file'
                                            id='logo'
                                            className='bg-white p-2 w-full text-slate-500 text-sm rounded-lg leading-6 border border-gray-300 focus:border-blue-500 file:bg-blue-500 file:text-white file:font-bold file:font-uppercase file:text-xs file:px-4 file:py-1 file:active:bg-blue-600 file:border-none file:mr-4 file:rounded'/>
                                    </div>
                                    <div className='flex flex-col'>
                                        <label htmlFor='note' className='text-sm font-semibold text-gray-500'>Keterangan</label>
                                        <input
                                            type='text'
                                            id='note'
                                            value={addPayment.note}
                                            onChange={(e) => setAddPayment({...addPayment, note: e.target.value})}
                                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                        />
                                    </div>
                                </div>
                            </div>
                            <button className="mt-3 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                                <FontAwesomeIcon icon={faPlus} />
                                <span className='ml-1'>Tambah</span>
                            </button>
                        </form>
                    </Disclosure.Panel>
                </Disclosure>
            </div>

            { payment.length > 0 ? (
                <DataTable
                    columns={columns}
                    data={payment}
                    pagination={true}
                    customStyles={tableStyle}
                />
            ) : ('Belum ada data pembayaran') }
        </DashboardLayout>
    )
}

export default DashboardPilgrimsPaymentDetail