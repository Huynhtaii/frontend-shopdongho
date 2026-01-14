import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation } from 'swiper/modules';

import ProductCard from "./card/product_card";
import { Link } from 'react-router-dom';

import { MdNavigateNext } from "react-icons/md";

const ProductListSlider = ({ title = '', col = 5 }) => {
    return (
        <div className='layout-container'>
            {title && (
                <div className='flex justify-between items-center'>
                    <h1 className='uppercase text-[20px] text-[#333] pb-[20px]'>{title}</h1>
                    <Link to={''} className='flex items-center text-sm hover:text-blue-500 duration-50'>Xem tất cả<MdNavigateNext size={18} /></Link>
                </div>
            )}
            <Swiper
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                breakpoints={{
                    320: { slidesPerView: 2 },  // Điện thoại nhỏ
                    480: { slidesPerView: 3 },  // Điện thoại lớn
                    768: { slidesPerView: 4 },  // Tablet
                    1024: { slidesPerView: col }, // Laptop
                }}
                className="mySwiper"
            >
                <SwiperSlide><ProductCard /></SwiperSlide>
                <SwiperSlide><ProductCard /></SwiperSlide>
                <SwiperSlide><ProductCard /></SwiperSlide>
                <SwiperSlide><ProductCard /></SwiperSlide>
                <SwiperSlide><ProductCard /></SwiperSlide>
                <SwiperSlide><ProductCard /></SwiperSlide>
            </Swiper>
        </div>
    );
};
export default ProductListSlider;