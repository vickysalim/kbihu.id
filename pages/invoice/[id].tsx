import { formatDate } from '@/lib/date/format'
import Alert from '@/views/components/Alert'
import Loader from '@/views/components/Loader'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const InvoicePage: React.FC = () => {
    const [loading, setLoading] = useState(true)
    const [invalid, setInvalid] = useState(false)
    
    const router = useRouter()
    
    const paymentModel = {
        company_name: '',
        company_street: '',
        company_district: '',
        company_subdistrict: '',
        company_city: '',
        company_province: '',
        company_postal_code: '',
        company_logo: '',
        phone_number: '',
        portion_number: '',
        name: '',
        nasab_name: '',
        amount: '',
        note: '',
        proof_file: '',
        transaction_date: '',    
    }

    const [payment, setPayment] = useState(paymentModel)

    const paymentData = async () => {
        if(router.query.id != undefined) {
            try {
                await axios.get(`/api/pilgrims/payment/get/detail/${router.query.id}`).then((res) => {
                    setPayment(res.data.data)
                    setLoading(false)
                })
            } catch (error) {
                setLoading(false)
                setInvalid(true)
            }
        }
    }

    useEffect(() => {
        paymentData()
    }, [router])

    if(loading) return <Loader />
    if(invalid) return ('Data not found')
    return (
        <>
            <div className='mx-4 mt-4'>
                <div className='text-center'>
                    <div className='mb-1 text-2xl font-bold'>
                        {payment.company_name}
                    </div>
                    <div className='mb-4'>
                        {payment.company_street}, Kel. {payment.company_subdistrict}, Kec. {payment.company_district}, Kota {payment.company_city}, {payment.company_province}, {payment.company_postal_code}
                    </div>
                </div>
                <Alert type='success'>
                    <div>
                        Kode pembayaran <span className='font-bold'>valid</span> dengan keterangan:
                    </div>
                    <div>
                        - <span className='font-bold'>Nama:</span> {payment.name}
                    </div>
                    <div>
                        - <span className='font-bold'>Jumlah:</span> Rp. {payment.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
                    </div>
                    <div>
                        - <span className='font-bold'>Tanggal:</span> {formatDate(payment.transaction_date)}
                    </div>
                    <div>
                        - <span className='font-bold'>Keterangan:</span> {payment.note}
                    </div>
                </Alert>
                <div className='mt-4 text-gray-400 text-xs text-center'>
                    &copy;2024. KBIHU.id
                </div>
            </div>
        </>
    )
}

export default InvoicePage