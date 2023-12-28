import { faPen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { z } from 'zod'
import { useState } from 'react'
import axios from 'axios'

const validation = z.object({
    name: z.string().min(1, { message: `Nama KBIHU wajib dimasukkan` }),
    street: z.string().min(1, { message: `Alamat wajib dimasukkan` }),
    district: z.string().min(1, { message: `Kecamatan wajib dimasukkan` }),
    subdistrict: z.string().min(1, { message: `Kelurahan wajib dimasukkan` }),
    city: z.string().min(1, { message: `Kota wajib dimasukkan` }),
    province: z.string().min(1, { message: `Provinsi wajib dimasukkan` }),
    postal_code: z.coerce.number().min(1, { message: `Kode pos wajib dimasukkan` }),
    phone_number: z.string().min(1, { message: `Nomor telepon wajib dimasukkan` }),
    leader: z.string().min(1, { message: `Pimpinan wajib dimasukkan` }),
    license: z.string().min(1, { message: `Nomor izin wajib dimasukkan` }),
})

const SuperadminEditCompanyLayout = ({ loadData, company, setMessage }: any): JSX.Element => {

    const [validationMessage, setValidationMessage] = useState<{ [key: string]: string}>({})

    const [name, setName] = useState(company.name)
    const [street, setStreet] = useState(company.street)
    const [district, setDistrict] = useState(company.district)
    const [subdistrict, setSubdistrict] = useState(company.subdistrict)
    const [city, setCity] = useState(company.city)
    const [province, setProvince] = useState(company.province)
    const [postalCode, setPostalCode] = useState(company.postal_code)
    const [phoneNumber, setPhoneNumber] = useState(company.phone_number)
    const [leader, setLeader] = useState(company.leader)
    const [license, setLicense] = useState(company.license)

    const validateEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setValidationMessage({})

        try {
            validation.parse({ name, street, district, subdistrict, city, province, postal_code: postalCode, phone_number: phoneNumber, leader, license })

            handleEdit()
        } catch (error) {
            if(error instanceof z.ZodError) {
                const errorMap: { [key: string]: string } = {}
                error.errors.forEach((err) => {
                    if (err.path) {
                        errorMap[err.path[0]] = err.message
                    }
                })
                setValidationMessage(errorMap)
            } else {
                setMessage(`Unknown error`)
            }
        }
    }

    const handleEdit = async () => {
        try {
            const { data } = await axios.put(`/api/company/update/${company.id}`, {
                name,
                street,
                district,
                subdistrict,
                city,
                province,
                postal_code: postalCode,
                phone_number: phoneNumber,
                leader,
                license
            })

            console.log(data)

            setMessage(data.message)

            setName('')
            setStreet('')
            setDistrict('')
            setSubdistrict('')
            setCity('')
            setProvince('')
            setPostalCode('')
            setPhoneNumber('')
            setLeader('')
            setLicense('')

            loadData()
        } catch (error: any) {
            if(error.response) {
                const fieldError = error.response.data.message
                setMessage(`Error: ${fieldError}`)
            } else {
                setMessage(`Unknown Error`)
            }
        }
    }
    
    return (
        <>
            <form onSubmit={validateEdit}>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4'>
                    <div className='flex flex-col'>
                        <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Nama KBIHU</label>
                        <input
                            type='text'
                            id='name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500' />
                        { validationMessage.name && <p className='text-sm text-red-500'>{validationMessage.name}</p> }
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='street' className='text-sm font-semibold text-gray-500'>Alamat</label>
                        <input
                            type='text'
                            id='street'
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500' />
                        { validationMessage.street && <p className='text-sm text-red-500'>{validationMessage.street}</p> }
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='district' className='text-sm font-semibold text-gray-500'>Kecamatan</label>
                        <input
                            type='text'
                            id='district'
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500' />
                        { validationMessage.district && <p className='text-sm text-red-500'>{validationMessage.district}</p> }
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='subdistrict' className='text-sm font-semibold text-gray-500'>Kelurahan</label>
                        <input
                            type='text'
                            id='subdistrict'
                            value={subdistrict}
                            onChange={(e) => setSubdistrict(e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500' />
                        { validationMessage.subdistrict && <p className='text-sm text-red-500'>{validationMessage.subdistrict}</p> }
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='city' className='text-sm font-semibold text-gray-500'>Kota</label>
                        <input
                            type='text'
                            id='city'
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500' />
                        { validationMessage.city && <p className='text-sm text-red-500'>{validationMessage.city}</p> }
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='province' className='text-sm font-semibold text-gray-500'>Provinsi</label>
                        <input
                            type='text'
                            id='province'
                            value={province}
                            onChange={(e) => setProvince(e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500' />
                        { validationMessage.province && <p className='text-sm text-red-500'>{validationMessage.province}</p> }
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='postal_code' className='text-sm font-semibold text-gray-500'>Kode Pos</label>
                        <input
                            type='number'
                            id='postal_code'
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500' />
                        { validationMessage.postal_code && <p className='text-sm text-red-500'>{validationMessage.postal_code}</p> }
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='phone_number' className='text-sm font-semibold text-gray-500'>Nomor Telepon</label>
                        <input
                            type='text'
                            id='phone_number'
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500' />
                        { validationMessage.phone_number && <p className='text-sm text-red-500'>{validationMessage.phone_number}</p> }
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='leader' className='text-sm font-semibold text-gray-500'>Pimpinan</label>
                        <input
                            type='text'
                            id='leader'
                            value={leader}
                            onChange={(e) => setLeader(e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500' />
                        { validationMessage.leader && <p className='text-sm text-red-500'>{validationMessage.leader}</p> }
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor='license' className='text-sm font-semibold text-gray-500'>Nomor Izin KBIHU</label>
                        <input
                            type='text'
                            id='license'
                            value={license}
                            onChange={(e) => setLicense(e.target.value)}
                            className='rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500' />
                        { validationMessage.license && <p className='text-sm text-red-500'>{validationMessage.license}</p> }
                    </div>
                </div>
                <button className="mt-2 bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                    <FontAwesomeIcon icon={faPen} />
                    <span className='ml-1'>Edit</span>
                </button>
            </form>
        </>
    )
}

export default SuperadminEditCompanyLayout