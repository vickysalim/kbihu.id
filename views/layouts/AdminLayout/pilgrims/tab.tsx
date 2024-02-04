interface AdminPilgrimsTabLayoutProps {
    activeTab: 'data' | 'payment' | 'document' | 'facility'
    id: string | string[] | undefined
}

const AdminPilgrimsTabLayout = ({ id, activeTab }: AdminPilgrimsTabLayoutProps) => {
    const activeTabStyle = 'border-b-blue-500 text-blue-500'
    const inactiveTabStyle = 'text-slate-800'
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
            <button
                className={`border-b-4 ${activeTab == 'data' ? activeTabStyle : inactiveTabStyle} rounded-lg p-2 mb-4 text-center font-semibold`}
                onClick={() => window.location.href = `/dashboard/pilgrims/${id}`}>
                    Data Jemaah Haji
            </button>
            <button
                className={`border-b-4 ${activeTab == 'payment' ? activeTabStyle : inactiveTabStyle} rounded-lg p-2 mb-4 text-center font-semibold`}
                onClick={() => window.location.href = `/dashboard/pilgrims/payment/${id}`}>
                    Data Pembayaran
            </button>
            <button
                className={`border-b-4 ${activeTab == 'document' ? activeTabStyle : inactiveTabStyle} rounded-lg p-2 mb-4 text-center font-semibold`}
                onClick={() => window.location.href = `/dashboard/pilgrims/document/${id}`}
                >
                    Data Dokumen
            </button>
            <button
                className={`border-b-4 ${activeTab == 'facility' ? activeTabStyle : inactiveTabStyle} rounded-lg p-2 mb-4 text-center font-semibold`}
                >
                    Data Fasilitas
            </button>
        </div>
    )
}

export default AdminPilgrimsTabLayout