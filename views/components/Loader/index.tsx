const Loader = () => {
    return (
        <div className='flex h-screen items-center justify-center'>
            <div className='animate-spin'>
                <svg width='48' height='48' fill='none' stroke='currentColor' stroke-width='1.5' viewBox='0 0 24 24' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'>
                    <path d='M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12'>
                    </path>
                </svg>
            </div>
        </div>
    );
  };
  
  export default Loader;
  