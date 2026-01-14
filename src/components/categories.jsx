import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"

const Categories = () => {
    const categories = [
        {
            id: 1,
            name: 'Đồng hồ nam',
            image: 'https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-xu-huong-2024_1725589299.webp'
        },
        {
            id: 2,
            name: 'Đồng hồ nữ',
            image: 'https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-xu-huong-2024_1725589299.webp'
        },
        {
            id: 3,
            name: 'Đồng hồ địa kỷ',
            image: 'https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-xu-huong-2024_1725589299.webp'
        },
        {
            id: 4,
            name: 'Đồng hồ địa kỷ',
            image: 'https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-xu-huong-2024_1725589299.webp'
        },
        {
            id: 5,
            name: 'Đồng hồ địa kỷ',
            image: 'https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-xu-huong-2024_1725589299.webp'
        },
        {
            id: 6,
            name: 'Đồng hồ địa kỷ',
            image: 'https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-xu-huong-2024_1725589299.webp'
        },
        {
            id: 7,
            name: 'Đồng hồ địa kỷ',
            image: 'https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-xu-huong-2024_1725589299.webp'
        },
        {
            id: 8,
            name: 'Đồng hồ địa kỷ',
            image: 'https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-xu-huong-2024_1725589299.webp'
        },
        {
            id: 9,
            name: 'Đồng hồ địa kỷ',
            image: 'https://www.watchstore.vn/images/collections_home/2024/09/06/resized/small-web-banner-xu-huong-2024_1725589299.webp'
        },
    ]
    return (
        <div className="layout-container">
            <div className="mt-10 w-[70%] m-auto">
                <div className="flex items-center flex-col">
                    <h1 className='uppercase text-[20px] text-[#333] text-center'>Chọn đồng hồ phù hợp</h1>
                    <span className='text-center text-sm mt-2 text-[#3a3a3a]'>WatchStore cung cấp đa dạng mẫu đồng hồ theo nhiều phong cách khác nhau</span>
                </div>
                <Swiper
                    spaceBetween={10}
                    breakpoints={{
                        320: { slidesPerView: 1 },  // Điện thoại nhỏ
                        480: { slidesPerView: 2 },  // Điện thoại lớn
                        768: { slidesPerView: 3 },  // Tablet
                        1024: { slidesPerView: 4 }, // Laptop
                    }}
                >
                    {Array.from({ length: Math.ceil(categories.length / 2) }, (_, i) => i * 2).map(i => (
                        <SwiperSlide key={categories[i].id}>
                            <div>
                                <div className="mt-5">
                                    <Link to={''} >
                                        <img src={categories[i].image}
                                            className="w-full rounded-lg hover:shadow-lg shadow-black duration-100 object-cover"
                                            alt={categories[i].name} />
                                    </Link>
                                    <h3 className="text-center text-sm mt-1 text-[#3a3a3a]">{categories[i].name}</h3>
                                </div>
                                {categories[i + 1] && (
                                    <div className="mt-5">
                                        <Link to={''} >
                                            <img src={categories[i + 1].image}
                                                className="w-full rounded-lg hover:shadow-lg shadow-black duration-100 object-cover"
                                                alt={categories[i + 1].name} />
                                        </Link>
                                        <h3 className="text-center text-sm mt-1 text-[#3a3a3a]">{categories[i + 1].name}</h3>
                                    </div>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default Categories