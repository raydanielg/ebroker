import React from 'react'

const FullScreenSpinLoader = () => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid primaryBorderColor !border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        </div>
    )
}

export default FullScreenSpinLoader