import { v4 as uuid } from 'uuid';
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from 'react-router-dom';

const HomeBannerCollection = () => {
    const banners = [
        {
            id: uuid(),
            image: '/banner_collection1.webp'
        },
        {
            id: uuid(),
            image: '/banner_collection2.webp'
        },
        {
            id: uuid(),
            image: '/banner_collection3.webp'
        },
    ]
    return (
        <div className="layout-container">
            <h1 className='mt-12 uppercase text-[20px] text-center text-[#333] pb-[20px]'>BỘ SƯU TẬP HÀNG LUXURY</h1>
            <Swiper
                spaceBetween={10}
                navigation={true}
                modules={[Navigation]}
                breakpoints={{
                    320: { slidesPerView: 1 },  // Điện thoại nhỏ
                    480: { slidesPerView: 1 },  // Điện thoại lớn
                    768: { slidesPerView: 2 },  // Tablet
                    1024: { slidesPerView: 2 }, // Laptop
                }}
                className="mySwiper"
            >
                {banners.map((banner) => (
                    <SwiperSlide key={banner.id}>
                        <Link to={''} className='rounded-lg object-cover'>
                            <img src={banner.image} alt="" className='rounded-lg object-cover' />
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
export default HomeBannerCollection;
