const AdminPilgrimsTabLayout: React.FC = () => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            <button className='border-b-4 border-b-blue-500 text-blue-500 rounded-lg p-2 mb-4 text-center font-semibold'>Data Jemaah Haji</button>
            <button className='border-b-4 text-slate-800 rounded-lg p-2 mb-4 text-center font-semibold'>Data Pembayaran</button>
            <button className='border-b-4 rounded-lg p-2 mb-4 text-center font-semibold'>Data Dokumen</button>
            <button className='border-b-4 rounded-lg p-2 mb-4 text-center font-semibold'>Data Fasilitas</button>
        </div>
    )
}

export default AdminPilgrimsTabLayout