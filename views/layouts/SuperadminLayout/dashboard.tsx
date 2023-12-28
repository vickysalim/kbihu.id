import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuilding, faEye, faPenToSquare, faUser, faTrashCan } from '@fortawesome/free-regular-svg-icons'
import { faMap, faXmark, faUser as faUserSolid, faPhone, faGavel } from '@fortawesome/free-solid-svg-icons'
import Card from '@/views/components/Card'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Dialog } from '@headlessui/react'
import SuperadminInsertCompanyLayout from './company/insert'
import SuperadminEditCompanyLayout from './company/edit'

const SuperadminIndexLayout: React.FC = () => {
    const [message, setMessage] = useState('')

    const companyModel = {
        id: '',
        name: '',
        street: '',
        district: '',
        subdistrict: '',
        city: '',
        province: '',
        postal_code: '',
        phone_number: '',
        leader: '',
        license: '',
    }

    const [data, setData] = useState({
        company: 0,
        user: 0
    })

    const [company, setCompany] = useState([companyModel])

    const [detailModalOpen, setDetailModalOpen] = useState(false)
    const [detailCompany, setDetailCompany] = useState(companyModel)

    const handleOpenDetailModal = (item: any) => {
        setDetailModalOpen(true)
        setDetailCompany(item)
    }

    const handleCloseDetailModal = () => {
        setDetailModalOpen(false)
        setDetailCompany(companyModel)
    }

    const [editModalOpen, setEditModalOpen] = useState(false)
    const [editCompany, setEditCompany] = useState(companyModel)

    const handleOpenEditModal = (item: any) => {
        setEditModalOpen(true)
        setEditCompany(item)
    }

    const setEditMessage = (message: any) => {
        setMessage(message)
        handleCloseEditModal()
    }

    const handleCloseEditModal = () => {
        setEditModalOpen(false)
        setEditCompany(companyModel)
    }

    const handleDelete = async (id: string) => {
        if(confirm('Apakah anda yakin ingin menghapus data ini?')) {
            try {
                await axios.delete('/api/company/delete', {
                    data: {
                        id: id
                    }
                })
    
                loadMainData()
            } catch (error) {
                console.log(error)
            }
        }
    }

    const countData = async () => {
        try {
            const response = await axios.get('/api/count/getCompanyAndUser')

            setData(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const companyData = async () => {
        try {
            const response = await axios.get('/api/company/getAll')

            setCompany(response.data.data.company)
        } catch (error) {
            console.log(error)
        }
    }

    const loadMainData = () => {
        countData()
        companyData()
    }
    
    useEffect(() => {
        loadMainData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>        
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-4'>
                <Card>
                    <div className="relative w-12 h-12 bg-gray-100 text-blue-500 rounded-full mb-3">
                        <FontAwesomeIcon icon={faBuilding} className="absolute text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h2 className='text-2xl font-bold'>{data.company}</h2>
                    <h2 className='text-sm text-slate-500'>KBIHU Terdaftar</h2>
                </Card>
                <Card>
                    <div className="relative w-12 h-12 bg-gray-100 text-blue-500 rounded-full mb-3">
                        <FontAwesomeIcon icon={faUser} className="absolute text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h2 className='text-2xl font-bold'>{data.user}</h2>
                    <h2 className='text-sm text-slate-500'>Jemaah Haji</h2>
                </Card>
            </div>
            <div>
                <h1 className='text-lg font-bold'>Kelola KBIHU</h1>

                <SuperadminInsertCompanyLayout loadData={loadMainData} setMessage={setMessage}/>
                
                { message && <p className={`${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'} text-white mt-2 p-4 rounded-lg`}>{message}</p> }

                <div className="w-full overflow-hidden rounded-lg shadow-xs mt-2">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full whitespace-no-wrap">
                            <thead>
                                <tr className="text-xs font-semibold tracking-wide text-left uppercase border-b bg-blue-500 text-white">
                                <th className="px-4 py-3">Nama KBIHU</th>
                                <th className="px-4 py-3">Alamat</th>
                                <th className="px-4 py-3">Nomor Izin</th>
                                <th className="px-4 py-3">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {company.map((item, index) => (
                                    <tr key={index} className="text-gray-700">
                                        <td className="px-4 py-3 text-sm">{item.name}</td>
                                        <td className="px-4 py-3 text-sm">{item.street}, Kel. {item.subdistrict}, Kec. {item.district}, Kota {item.city}, {item.province}, {item.postal_code}</td>
                                        <td className="px-4 py-3 text-sm">{item.license}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1" onClick={() => handleOpenDetailModal(item)}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                    <span className='ml-1'>Detail</span>
                                                </button>
                                                <button className="bg-gray-500 text-white active:bg-gray-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1" onClick={() => handleOpenEditModal(item)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} />
                                                    <span className='ml-1'>Ubah</span>
                                                </button>
                                                <button className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none mr-1 mb-1" onClick={() => handleDelete(item.id)}>
                                                    <FontAwesomeIcon icon={faTrashCan} />
                                                    <span className='ml-1'>Hapus</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            { /* modal detail */ }
            <Dialog open={detailModalOpen} onClose={() => handleCloseDetailModal()} className='relative z-50'>
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg p-6 rounded-lg bg-white">
                        <Dialog.Title className='flex flex-row justify-between pb-4 border-b-2'>
                            <h2 className='text-xl font-semibold mb-2'>Detail KBIHU</h2>
                            <button onClick={() => handleCloseDetailModal()}>
                                <FontAwesomeIcon icon={faXmark} className='text-gray-500'/>
                            </button>
                        </Dialog.Title>
                        <Dialog.Description className='mt-4 flex flex-col'>
                            <p className='text-lg font-semibold mb-2'>{detailCompany.name}</p>
                            <p className='flex flex-row w-full items-center mb-1'>
                                <FontAwesomeIcon icon={faMap} className='w-4 text-blue-500 mr-3'/>
                                {detailCompany.street}, Kel. {detailCompany.subdistrict}, Kec. {detailCompany.district}, Kota {detailCompany.city}, {detailCompany.province}, {detailCompany.postal_code}
                            </p>
                            <p className='flex flex-row w-full items-center mb-1'>
                                <FontAwesomeIcon icon={faGavel} className='w-4 text-blue-500 mr-3'/>
                                {detailCompany.license}
                            </p>
                            <p className='flex flex-row w-full items-center mb-1'>
                                <FontAwesomeIcon icon={faUserSolid} className='w-4 text-blue-500 mr-3'/>
                                {detailCompany.leader}
                            </p>
                            <p className='flex flex-row w-full items-center'>
                                <FontAwesomeIcon icon={faPhone} className='w-4 text-blue-500 mr-3'/>
                                {detailCompany.phone_number}
                            </p>
                        </Dialog.Description>
                    </Dialog.Panel>
                </div>
            </Dialog>

            { /* modal edit */ }
            <Dialog open={editModalOpen} onClose={() => handleCloseEditModal()} className='relative z-50'>
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg p-6 rounded-lg bg-white">
                        <Dialog.Title className='flex flex-row justify-between pb-4 border-b-2'>
                            <h2 className='text-xl font-semibold mb-2'>Edit KBIHU</h2>
                            <button onClick={() => handleCloseEditModal()}>
                                <FontAwesomeIcon icon={faXmark} className='text-gray-500'/>
                            </button>
                        </Dialog.Title>
                        <Dialog.Description className='mt-4 flex flex-col'>
                            <SuperadminEditCompanyLayout loadData={loadMainData} company={editCompany} setMessage={setEditMessage}/>
                        </Dialog.Description>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    )
}

export default SuperadminIndexLayout