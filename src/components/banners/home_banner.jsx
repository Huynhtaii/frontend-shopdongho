// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';

const HomeBanner = () => {
    const banners = [
        '/slider_1.jpg',
        '/slider_2.jpg',
        '/slider_3.jpg',
    ]
    return (
            <Swiper
                spaceBetween={30}
                effect={'fade'}
                navigation={true}
                pagination={{
                    clickable: true,
                }}
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false
                }}
            modules={[EffectFade, Navigation, Pagination, Autoplay]}
                className="mySwiper w-full"
            >
                {banners.map((url, index) => (
                    <SwiperSlide key={url + index}>
                        <img className="w-full h-full object-cover" src={url} alt="" />
                    </SwiperSlide>
                ))}
            </Swiper>
    );
}
export default HomeBanner;