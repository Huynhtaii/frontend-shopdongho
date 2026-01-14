import React from 'react'
import { Benefits_NAV } from '../constants/benefits'

export default function Benefits() {
    return (
        <div className='layout-container'>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 items-center gap-3">
                {Benefits_NAV.map(item => (
                    <div key={item.id} className='flex h-full'>
                        <div className='benefits-icon bg-[#fdaf17] text-white h-full flex items-center justify-end w-[40px] rounded-l-md'>
                            {item.icon}
                        </div>
                        <div className='bg-[#ecfbe5] flex-1 pl-5 pr-2 py-1 h-full rounded-r-md'>
                            <h3 className='text-[15px] font-[600] text-black'>{item.title}</h3>
                            <p className='text-xs text-[#838383]'>{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
