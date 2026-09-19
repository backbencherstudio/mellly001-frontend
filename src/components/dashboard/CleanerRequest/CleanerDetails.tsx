import React from 'react'

export default function CleanerDetails({cleaner}:any) {
    console.log(cleaner,"dfdf")
  return (
    <div className='px-4 grid grid-cols-1 md:grid-cols-2 gap-4'>

      <p className='text-lg font-medium leadining-150%'>{cleaner?.name}</p>
      <p className='mt-0 '>{cleaner?.email}</p>
      <p>{cleaner?.phone_number}</p>
      <p>{cleaner?.earnings}</p>
      <p>{cleaner?.status}</p>
      <p>{cleaner?.phone_number}</p>
      <p>{cleaner?.jobs?.total}</p>
      <p>{cleaner?.joined_at}</p>

    </div>
  )
}
