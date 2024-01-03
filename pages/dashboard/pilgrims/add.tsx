import { dateToPass, formatDateInput } from '@/lib/date/format'
import Alert from '@/views/components/Alert'
import Loader from '@/views/components/Loader'
import DashboardLayout from '@/views/layouts/DashboardLayout'
import { faEye, faEyeSlash, faFloppyDisk } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useEffect, useState } from 'react'

const DashboardPilgrimsAdd: React.FC = () => {
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
        username: '',
        phone_number: '',
        password: '',
        company_id: '',
        user_profile: {
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

    const [hidePassword, setHidePassword] = useState(false)

    const [message, setMessage] = useState('')

    const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {

    }

    useEffect(() => {
        if(!localStorage.getItem('token')) window.location.href = '/auth/login'
        else {
            if(!isAuth) checkToken()
        }
    }, [isAuth, user])

    if(!isAuth) return <Loader />
    return (
        <DashboardLayout pageName='Tambah Jemaah Haji' role='Admin'>
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
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, reg_number: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Nomor Porsi
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.portion_number}
                                    onChange={(e) => setPilgrim({...pilgrim, username: e.target.value, user_profile: {...pilgrim.user_profile, portion_number: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Bank
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.bank}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, bank: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500'>Kantor Cabang Bank</label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.bank_branch}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, bank_branch: e.target.value}})}
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
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Nomor Paspor
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.passport_number}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_number: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Nama Paspor
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.passport_name}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_name: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Tempat Lahir Paspor
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.passport_pob}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_pob: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Tanggal Lahir Paspor
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='date'
                                    id='name'
                                    value={formatDateInput(pilgrim.user_profile.passport_dob)}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_dob: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Tanggal Penerbitan Paspor
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='date'
                                    id='name'
                                    value={formatDateInput(pilgrim.user_profile.passport_issue_date)}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_issue_date: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Tanggal Berakhir Paspor
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='date'
                                    id='name'
                                    value={formatDateInput(pilgrim.user_profile.passport_expiry_date)}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, passport_expiry_date: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Kantor Penerbit Paspor
                                    <span className='text-red-500'>*</span>
                                </label>
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
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Nomor KTP
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.identity_number}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, identity_number: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Tahun Keberangkatan
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.departure_year}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, departure_year: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Nomor Telepon
                                    <span className='text-red-500'>*</span>
                                </label>
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
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Nama
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.name}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, name: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    {
                                        pilgrim.user_profile.gender == 'Laki-laki' ? 'Bin' : 
                                        pilgrim.user_profile.gender == 'Perempuan' ? 'Binti' : 'Bin/Binti'
                                    }
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.nasab_name}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, nasab_name: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Jenis Kelamin
                                    <span className='text-red-500'>*</span>
                                </label>
                                <div className='flex flex-row gap-6'>
                                    <label htmlFor='male' className='flex items-center gap-x-1'>
                                        <input
                                            className='h-4 w-4 border-gray-300 text-blue-500 focus:text-blue-500 ring-transparent focus:ring-transparent'
                                            type='radio'
                                            id='male'
                                            value='Laki-laki'
                                            checked={pilgrim.user_profile.gender === 'Laki-laki'}
                                            onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, gender: e.target.value}})}
                                        />
                                        <span>Laki-laki</span>
                                    </label>
                                    <label htmlFor='female' className='flex items-center gap-x-1'>
                                        <input
                                            className='h-4 w-4 border-gray-300 text-blue-500 focus:text-blue-500 ring-transparent focus:ring-transparent'
                                            type='radio'
                                            id='female'
                                            value='Perempuan'
                                            checked={pilgrim.user_profile.gender === 'Perempuan'}
                                            onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, gender: e.target.value}})}
                                        />
                                        <span>Perempuan</span>
                                    </label>
                                </div>                                
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
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Tempat Lahir
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.pob}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, pob: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Tanggal Lahir
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='date'
                                    id='name'
                                    value={formatDateInput(pilgrim.user_profile.dob)}
                                    onChange={(e) => setPilgrim({...pilgrim, password: dateToPass(e.target.value), user_profile: {...pilgrim.user_profile, dob: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Provinsi
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.province}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, province: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Kabupaten/Kota
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.city}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, city: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Kecamatan
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.district}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, district: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Desa/Kelurahan
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.subdistrict}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, subdistrict: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Alamat
                                    <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    id='name'
                                    value={pilgrim.user_profile.street}
                                    onChange={(e) => setPilgrim({...pilgrim, user_profile: {...pilgrim.user_profile, street: e.target.value}})}
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500'
                                />
                            </div>
                            <div className="mb-2">
                                <label htmlFor='name' className='text-sm font-semibold text-gray-500' title='Wajib dimasukkan'>
                                    Kode Pos
                                    <span className='text-red-500'>*</span>
                                </label>
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
                                    className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100'
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
                                        className='w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100'
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
                    <div className='flex flex-row-reverse gap-4'>
                        <button className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow outline-none focus:outline-none">
                            <FontAwesomeIcon icon={faFloppyDisk} />
                            <span className='ml-2'>Simpan</span>
                        </button>
                        <button type='button' className='text-blue-500 active:text-blue-600 font-bold uppercase text-xs outline-none focus:outline-none' onClick={() => window.location.href = '/dashboard/pilgrims'}>
                            Kembali
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

export default DashboardPilgrimsAdd