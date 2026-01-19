import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react"
import CategoryService from "../services/category_service";

const Categories = () => {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                setLoading(true);
                const data = await CategoryService.getAllCategories()
                setCategories(data.DT);
                setError(null);
            } catch (err) {
                setError(err.message || "Có lỗi xảy ra khi tải sản phẩm")
            } finally {
                setLoading(false);
            }
        }
        fetchAllCategories()
    }, [])

    if (loading) return <div className="layout-container"><div className="mt-10 w-[70%] m-auto">Đang tải...</div></div>
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
                                            className="w-full h-[100px] rounded-lg hover:shadow-lg shadow-black duration-100 object-cover"
                                            alt={categories[i].name} />
                                    </Link>
                                    <h3 className="text-center text-sm mt-1 text-[#3a3a3a]">{categories[i].name}</h3>
                                </div>
                                {categories[i + 1] && (
                                    <div className="mt-5">
                                        <Link to={''} >
                                            <img src={categories[i + 1].image}
                                                className="w-full h-[100px] rounded-lg hover:shadow-lg shadow-black duration-100 object-cover"
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