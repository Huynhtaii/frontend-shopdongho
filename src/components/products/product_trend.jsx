import React from 'react'
import { Link } from 'react-router-dom'
import ProductListSlider from './product_list_slider'

export default function ProductListTrend() {
    return (
        <div className='layout-container !mt-6'>
            <div className='bg-[#fe7902] flex flex-col items-center'>
                <img src="/banner-xu-huong-home.webp" alt="" className='object-cover' />
                <div className='w-full p-3'>
                    <ProductListSlider />
                </div>
                <Link to={''} className='rounded-md bg-white text-[#418fde] text-[14px] px-8 py-2 font-[500] mb-4 mt-1'>Khám phá xu hướng 2025</Link>
            </div>
        </div>
    )
}
