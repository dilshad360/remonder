import React from 'react'
import Image from 'next/image'

function Loader() {
  return (
    <div className='fixed top-0 left-0 w-full h-full flex justify-center items-center'>
        <Image width={60} height={60} src="/tail-spin.svg" alt="Loading..."></Image>
    </div>
  )
}

export default Loader