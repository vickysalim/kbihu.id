import Header from '../components/Header'
import Breadcrumb from '../components/Breadcrumb'
import PageTitle from '@/lib/pageTitle'

interface DashboardLayoutProps {
  pageName: string
  children: React.ReactNode
}

export default function DashboardLayout({
  pageName,
  children
}: DashboardLayoutProps) {
  return (
    <div className='flex flex-col min-h-screen'>
      <PageTitle title={`${pageName} | KBIHU.id`}/>
      <Header />
      <div className='max-w-screen-xl mx-auto w-full overflow-hidden'>
        <div className='my-4 mx-4 xl:mx-0'>
          <Breadcrumb pageName={pageName} />
          {children}
        </div>
      </div>
    </div>
  )
}