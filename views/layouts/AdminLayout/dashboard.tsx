import Card from '@/views/components/Card'
import { faBuilding } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AdminIndexLayout: React.FC = () => {
    return (
        <>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
                <Card>
                    <div className="relative w-12 h-12 bg-gray-100 text-blue-500 rounded-full mb-3">
                        <FontAwesomeIcon icon={faBuilding} className="absolute text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h2 className='text-2xl font-bold'>0</h2>
                    <h2 className='text-sm text-slate-500'>Jemaah Haji</h2>
                </Card>
                <Card>
                    <div className="relative w-12 h-12 bg-gray-100 text-blue-500 rounded-full mb-3">
                        <FontAwesomeIcon icon={faBuilding} className="absolute text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h2 className='text-2xl font-bold'>0</h2>
                    <h2 className='text-sm text-slate-500'>Data Pembayaran</h2>
                </Card>
                <Card>
                    <div className="relative w-12 h-12 bg-gray-100 text-blue-500 rounded-full mb-3">
                        <FontAwesomeIcon icon={faBuilding} className="absolute text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h2 className='text-2xl font-bold'>0</h2>
                    <h2 className='text-sm text-slate-500'>Data Dokumen</h2>
                </Card>
                <Card>
                    <div className="relative w-12 h-12 bg-gray-100 text-blue-500 rounded-full mb-3">
                        <FontAwesomeIcon icon={faBuilding} className="absolute text-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <h2 className='text-2xl font-bold'>0</h2>
                    <h2 className='text-sm text-slate-500'>Data Fasilitas Diserahkan</h2>
                </Card>
            </div>
        </>
    )
}

export default AdminIndexLayout