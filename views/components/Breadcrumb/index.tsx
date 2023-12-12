import Link from 'next/link'

interface BreadcrumbProps {
    pageName: string
}

const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
    return (
        <div className='flex flex-col md:flex-row items-center justify-between mb-8'>
            <h1 className='text-2xl font-bold'>{pageName}</h1>
            <div className='text-sm text-gray-500'>
              <Link href='/dashboard'>Dashboard</Link> /
              <span className='text-blue-500'> {pageName}</span>
            </div>
        </div>
    )
}

export default Breadcrumb