import Head from 'next/head';

const PageTitle: React.FC<{ title: string }> = ({ title }) => {
    return (
        <Head>
            <title>{title}</title>
        </Head>
    )
}

export default PageTitle;