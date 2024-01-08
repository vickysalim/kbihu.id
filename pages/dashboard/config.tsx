import Loader from '@/views/components/Loader'
import DashboardLayout from '@/views/layouts/DashboardLayout'
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import DataTable from "react-data-table-component"
import { dataTableStyle } from '@/lib/dataTable/style'
import { Disclosure } from '@headlessui/react'

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

    // Document

    const [documentLoading, setDocumentLoading] = useState(true)

    const documentModel = {
        id: '',
        name: '',
        company_document_year: [{
            id: '',
            year: ''
        }]
    }

    const [document, setDocument] = useState([documentModel])

    const getDocument = async () => {
        try {
            await axios.get(`/api/document/getAll/${user.company_id}`).then((res) => {
                setDocument(res.data.data)
                setDocumentLoading(false)
                console.log(res.data.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    
    const documentColumns = useMemo(() => [
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
            width: '150px'
        },
        {
            name: 'Nama Dokumen',
            cell: (row: any) => {
                return row.name
            }
        },
        {
            name: 'Tahun Keberangkatan',
            cell: (row: any) => {
                return row.company_document_year.map((item, index) => (
                    <div className='bg-blue-500 text-white px-2 py-1 mr-1 rounded' key={index}>
                        {item.year}
                    </div>
                ))
            }
        }
    ], [])

    const [insertDocumentYear, setInsertDocumentYear] = useState<number[]>([0])

    const addDocumentYearField = () => {
        setInsertDocumentYear((prevData) => [...prevData, 0])
    }

    const removeDocumentYearField = (index: number) => {
        setInsertDocumentYear((prevData) => prevData.filter((_, i) => i !== index))
    }

    const handleDocumentYearChange = (value: string, index: number) => {
        const numericValue = value !== '0' ? value.replace(/^0+/, '') : value;
        
        const newField = [...insertDocumentYear]
        newField[index] = Number(numericValue)
        
        setInsertDocumentYear(newField)
    }

    useEffect(() => {
        if(!localStorage.getItem('token')) window.location.href = '/auth/login'
        else {
            if(!isAuth) checkToken()
        }

        getDocument()
    }, [isAuth, user])

    const tableStyle: {} = dataTableStyle
    
    if(documentLoading || !isAuth) return <Loader />
    if(!isAuth) return <Loader />
    return (
        <DashboardLayout pageName='Pengaturan Data' role={user.role}>
            <div className='w-full mb-8'>
                <h1 className='text-lg font-bold mb-2'>Pengaturan Data Dokumen</h1>
                <div className="mb-2">
                    <Disclosure>
                        <Disclosure.Button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                            <FontAwesomeIcon icon={faPlus} />
                            <span className='ml-1'>Tambah Data Pengaturan Dokumen</span>
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 text-gray-500 bg-white rounded-lg p-4">
                            <form>
                                <div className="mb-2">
                                    <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Nama Dokumen</label>
                                    <input
                                        type='text'
                                        id='name'
                                        className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                    />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor='document_year' className='text-sm font-semibold text-gray-500'>Tahun Keberangkatan</label>
                                    { insertDocumentYear.map((item, index) => {
                                        return (
                                            <div key={index} className='mb-2'>
                                                <div className="relative">
                                                    <input
                                                        type='number'
                                                        id='document_year'
                                                        value={item === 0 ? '0' : item.toString()}
                                                        onChange={(e) => handleDocumentYearChange(e.target.value, index)}
                                                        className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 slider-none'
                                                    />
                                                    { index !== 0 && (
                                                        <button type='button' className='absolute top-2 bottom-2 right-3 text-red-500 font-bold uppercase text-xs outline-none focus:outline-none px-3' onClick={() => removeDocumentYearField(index)}>
                                                            Hapus
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <button type='button' onClick={addDocumentYearField} className="text-blue-500 active:text-blue-600 font-bold uppercase text-xs py-1 rounded outline-none focus:outline-none">
                                        Tambah Kolom Tahun Keberangkatan
                                    </button>
                                </div>
                                <button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                                    <FontAwesomeIcon icon={faPlus} />
                                    <span className='ml-2'>Tambah</span>
                                </button>
                            </form>
                        </Disclosure.Panel>
                    </Disclosure>
                </div>
                { document.length > 0 ? (
                    <DataTable
                        columns={documentColumns}
                        data={document}
                        pagination={true}
                        customStyles={tableStyle}
                    />
            ) : ('Tidak ada data dokumen') }
            </div>
        </DashboardLayout>
    )
}

export default DashboardConfiguration