import { dateToPass, formatDateInput } from '@/lib/date/format'
import Alert from '@/views/components/Alert'
import Loader from '@/views/components/Loader'
import DashboardLayout from '@/views/layouts/DashboardLayout'
import { faEye, faEyeSlash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const DashboardPilgrimsDetail: React.FC = () => {
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

    const [pilgrim, setPilgrim] = useState(pilgrimsModel)

    const router = useRouter()

    const pilgrimsData = async () => {
        try {
            await axios.get(`/api/pilgrims/get/${router.query.id}`).then((res) => {
                setPilgrim(res.data.data)
                setLoading(false)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const [hidePassword, setHidePassword] = useState(true)

    const [message, setMessage] = useState('')

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            await axios.put(`/api/pilgrims/update/${router.query.id}`, {
                departure_year: pilgrim.user_profile.departure_year,
                reg_number: pilgrim.user_profile.reg_number,
                portion_number: pilgrim.user_profile.portion_number,
                bank: pilgrim.user_profile.bank,
                bank_branch: pilgrim.user_profile.bank_branch,
                name: pilgrim.user_profile.name,
                nasab_name: pilgrim.user_profile.nasab_name,
                gender: pilgrim.user_profile.gender,
                marital_status: pilgrim.user_profile.marital_status,
                blood_type: pilgrim.user_profile.blood_type,
                pob: pilgrim.user_profile.pob,
                dob: pilgrim.user_profile.dob,
                street: pilgrim.user_profile.street,
                postal_code: pilgrim.user_profile.postal_code,
                subdistrict: pilgrim.user_profile.subdistrict,
                district: pilgrim.user_profile.district,
                city: pilgrim.user_profile.city,
                province: pilgrim.user_profile.province,
                education: pilgrim.user_profile.education,
                job: pilgrim.user_profile.job,
                passport_number: pilgrim.user_profile.passport_number,
                passport_name: pilgrim.user_profile.passport_name,
                passport_pob: pilgrim.user_profile.passport_pob,
                passport_dob: pilgrim.user_profile.passport_dob,
                passport_issue_date: pilgrim.user_profile.passport_issue_date,
                passport_expiry_date: pilgrim.user_profile.passport_expiry_date,
                passport_issue_office: pilgrim.user_profile.passport_issue_office,
                passport_endorsement: pilgrim.user_profile.passport_endorsement,
                identity_number: pilgrim.user_profile.identity_number,
                phone_number: pilgrim.phone_number
            }).then((res) => {
                setMessage(res.data.message)
            })
        } catch (error: any) {
            if(error.response) {
                const fieldError = error.response.data.message
                setMessage(`Error: ${fieldError}`)
            } else {
                setMessage(`Unknown Error`)
            }
        }
    }

    useEffect(() => {
        if(!localStorage.getItem('token')) window.location.href = '/auth/login'
        else {
            if(!isAuth) checkToken()
        }

        pilgrimsData()
    }, [isAuth, user])
    
    if(loading || !isAuth) return <Loader />
    return (
        <DashboardLayout pageName='Data Jemaah Haji' role='Admin'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                { /* button - working like tab */}
                <button className='border-b-4 border-b-blue-500 text-blue-500 rounded-lg p-2 mb-4 text-center font-semibold'>Data Jemaah Haji</button>
                <button className='border-b-4 text-slate-800 rounded-lg p-2 mb-4 text-center font-semibold'>Data Pembayaran</button>
                <button className='border-b-4 rounded-lg p-2 mb-4 text-center font-semibold'>Data Dokumen</button>
                <button className='border-b-4 rounded-lg p-2 mb-4 text-center font-semibold'>Data Fasilitas</button>
            </div>
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleEdit}>
                <div className="grid grid-cols-1 gap-4 h-min-content">
                    {/* Data BPIH */}
                    <div className='flex flex-col bg-white rounded-lg'>
                        <div className='bg-blue-500 text-white rounded-t-lg px-4 py-2'>
                            Data BPIH
                        </div>
                        <div className='px-4 pt-3 pb-2'>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Nomor SPPH</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.reg_number}
                                    disabled={true}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Nomor Porsi</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.portion_number}
                                    disabled={true}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Bank</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.bank}
                                    disabled={true}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Kantor Cabang Bank</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.bank_branch}
                                    disabled={true}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Paspor */}
                    <div className='flex flex-col bg-white rounded-lg'>
                        <div className='bg-blue-500 text-white rounded-t-lg px-4 py-2'>
                            Data Paspor
                        </div>
                        <div className='px-4 pt-3 pb-2'>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Nomor Paspor</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.passport_number}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_number: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Nama Paspor</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.passport_name}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_name: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Tempat Lahir Paspor</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.passport_pob}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_pob: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Tanggal Lahir Paspor</label>
                                <input
                                    type='date'
                                    id='name'
                                    value={formatDateInput(pilgrim.user_profile.passport_dob)}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_dob: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Tanggal Penerbitan Paspor</label>
                                <input
                                    type='date'
                                    id='name'
                                    value={formatDateInput(pilgrim.user_profile.passport_issue_date)}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_issue_date: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Tanggal Berakhir Paspor</label>
                                <input
                                    type='date'
                                    id='name'
                                    value={formatDateInput(pilgrim.user_profile.passport_expiry_date)}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_expiry_date: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Kantor Penerbit Paspor</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.passport_issue_office}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_issue_office: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Nama Endorsement</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.passport_endorsement}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_endorsement: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Lainnya */}
                    <div className='flex flex-col bg-white rounded-lg'>
                        <div className='bg-blue-500 text-white rounded-t-lg px-4 py-2'>
                            Data Lainnya
                        </div>
                        <div className='px-4 pt-3 pb-2'>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Nomor KTP</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.identity_number}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, identity_number: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Tahun Keberangkatan</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.departure_year}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, departure_year: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Nomor Telepon</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.phone_number}
                                    onChange={(e) => setPilgrim({...pilgrim, phone_number: e.target.value})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 h-min-content">
                    {/* Identitas Jemaah Haji */}
                    <div className='flex flex-col bg-white rounded-lg'>
                        <div className='bg-blue-500 text-white rounded-t-lg px-4 py-2'>
                            Identitas Jemaah Haji
                        </div>
                        <div className='px-4 pt-3 pb-2'>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Nama</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.name}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, name: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>{pilgrim.user_profile.gender == 'Laki-laki' ? 'Bin' : 'Binti'}</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.nasab_name}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, nasab_name: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Status Perkawinan</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.marital_status}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, marital_status: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Golongan Darah</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.blood_type}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, blood_type: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Tempat Lahir</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.pob}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, pob: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Tanggal Lahir</label>
                                <input
                                    type='date'
                                    id='name'
                                    value={formatDateInput(pilgrim.user_profile.dob)}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, dob: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Provinsi</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.province}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, province: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Kabupaten / Kota Madya</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.city}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, city: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Kecamatan</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.district}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, district: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Desa / Kelurahan</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.subdistrict}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, subdistrict: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Alamat</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.street}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, street: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Kode Pos</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.postal_code}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, postal_code: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Pendidikan</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.education}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, education: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Pekerjaan</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.job}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, job: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Data Login */}
                    <div className='flex flex-col bg-white rounded-lg'>
                        <div className='bg-blue-500 text-white rounded-t-lg px-4 py-2'>
                            Data Login Pengguna
                        </div>
                        <div className='px-4 pt-3 pb-2'>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>ID Pengguna</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.portion_number}
                                    disabled={true}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Kata Sandi</label>
                                <div className='relative'>
                                    <input
                                        type={hidePassword ? 'password' : 'text'}
                                        id='name'
                                        value={dateToPass(pilgrim.user_profile.dob)}
                                        disabled={true}
                                        className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                    />
                                    <button type='button' className="absolute top-2 bottom-2 right-3 text-blue-500 font-bold uppercase text-xs outline-none focus:outline-none px-3" onClick={() => setHidePassword(!hidePassword)}>
                                        { hidePassword ?
                                            <FontAwesomeIcon icon={faEye}/> :
                                            <FontAwesomeIcon icon={faEyeSlash}/> }
                                        
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    { /* Button Submit */ }
                    <div className='flex flex-row-reverse'>
                        <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                            <FontAwesomeIcon icon={faFloppyDisk} />
                            <span className='ml-2'>Simpan</span>
                        </button>
                    </div>
                </div>
            </form>
            <div className='mt-4'>
                { message && <Alert type={message.includes('Error') ? 'error' : 'success'}>{message}</Alert>}
            </div>
        </DashboardLayout>
    )
}

export default DashboardPilgrimsDetail