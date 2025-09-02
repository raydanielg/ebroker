import React from 'react'
import Image from 'next/image'
import SomethingWentWrong from '@/assets/something_went_wrong.svg'

const SomthingWentWrong = () => {
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <Image src={SomethingWentWrong} alt='Something went wrong' width={500} height={500} />
      <h1 className='text-2xl font-bold'>Something went wrong</h1>
      <p className='text-gray-500'>Please try again later</p>
    </div>
  )
}

export default SomthingWentWrong