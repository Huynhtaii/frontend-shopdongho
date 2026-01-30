import { v4 as uuid } from 'uuid';
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from 'react-router-dom';
import { memo } from 'react';

const CategoryBanner = () => {
    const banners = [
        {
            id: uuid(),
            image: '/banner_collection4.webp',
            url: '/category/all'
        },
        {
            id: uuid(),
            image: '/banner_collection5.webp',
            url: '/category/all'
        },
        {
            id: uuid(),
            image: '/banner_collection6.webp',
            url: '/category/all'
        },
    ]
    return (
        <div className="layout-container">
            <Swiper
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                breakpoints={{
                    320: { slidesPerView: 1 },  // Điện thoại nhỏ
                    480: { slidesPerView: 1 },  // Điện thoại lớn
                    768: { slidesPerView: 2 },  // Tablet
                    1024: { slidesPerView: 3 }, // Laptop
                }}
                className="mySwiper"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <Link to={banner.url} className='rounded-lg object-cover'>
                            <img src={banner.image} alt="" className='rounded-lg object-cover' />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
export default memo(CategoryBanner);
