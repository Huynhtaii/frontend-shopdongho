import { useState } from "react";

import { IoIosArrowDown } from "react-icons/io";
import { FaCheck } from "react-icons/fa6";

const ProductFilters = () => {
    const [priceRange, setPriceRange] = useState('all');
    const [brand, setBrand] = useState('all');
    const [type, setType] = useState('all');
    const [rating, setRating] = useState('all');
    const [showFilter, setShowFilter] = useState({
        price: false,
        brand: false,
        type: false,
        rating: false
    });

    const brands = [
        { id: 'all', name: 'Tất cả' },
        { id: 'hublot', name: 'Hublot' },
        { id: 'rolex', name: 'Rolex' },
        { id: 'omega', name: 'Omega' },
        { id: 'cartier', name: 'Cartier' },
    ];

    const prices = [
        { id: 'all', name: 'Tất cả' },
        { id: '0-1000000', name: 'Dưới 1 triệu' },
        { id: '1000000-5000000', name: '1 triệu - 5 triệu' },
        { id: '5000000-10000000', name: '5 triệu - 10 triệu' },
        { id: '10000000-20000000', name: '10 triệu - 20 triệu' },
        { id: '20000000', name: 'Trên 20 triệu' },
    ];

    const types = [
        { id: 'all', name: 'Tất cả' },
        { id: 'nam', name: 'Đồng hồ Nam' },
        { id: 'nu', name: 'Đồng hồ Nữ' },
        { id: 'doi', name: 'Đồng hồ Đôi' },
        { id: 'treo-tuong', name: 'Đồng hồ Treo tường' },
    ];

    const ratings = [
        { id: 'all', name: 'Tất cả' },
        { id: '1', name: '1 sao' },
        { id: '2', name: '2 sao' },
        { id: '3', name: '3 sao' },
        { id: '4', name: '4 sao' },
        { id: '5', name: '5 sao' },
    ];


    const toggleFilter = (filter) => {
        setShowFilter(prev => ({
            price: false,
            brand: false,
            type: false,
            rating: false,
            [filter]: !prev[filter]
        }));
    };

    return (
        <div className="layout-container py-8">
            <h1 className="mt-6 mb-1">Lọc sản phẩm</h1>
            <div className="flex flex-wrap gap-4">
                {/* Filter by Brand */}
                <div className="relative">
                    <button
                        onClick={() => toggleFilter('brand')}
                        className="flex items-center gap-2 px-4 py-2 border rounded-md hover:border-primary"
                    >
                        <span className="text-sm">Hãng</span>
                        <IoIosArrowDown className={`transition-transform duration-300 ${showFilter.brand ? 'rotate-180' : ''}`} />
                    </button>
                    {showFilter.brand && (
                        <div className="absolute z-10 w-48 mt-2 bg-white border rounded-md shadow-lg">
                            {brands.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setBrand(item.id);
                                        toggleFilter('brand');
                                    }}
                                    className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50"
                                >
                                    <span className="text-sm">{item.name}</span>
                                    {brand === item.id && <FaCheck className="text-primary" size={12} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Filter by Price */}
                <div className="relative">
                    <button
                        onClick={() => toggleFilter('price')}
                        className="flex items-center gap-2 px-4 py-2 border rounded-md hover:border-primary"
                    >
                        <span className="text-sm">Giá</span>
                        <IoIosArrowDown className={`transition-transform duration-300 ${showFilter.price ? 'rotate-180' : ''}`} />
                    </button>
                    {showFilter.price && (
                        <div className="absolute z-10 w-48 mt-2 bg-white border rounded-md shadow-lg">
                            {prices.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setPriceRange(item.id);
                                        toggleFilter('price');
                                    }}
                                    className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50"
                                >
                                    <span className="text-sm">{item.name}</span>
                                    {priceRange === item.id && <FaCheck className="text-primary" size={12} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Filter by Type */}
                <div className="relative">
                    <button
                        onClick={() => toggleFilter('type')}
                        className="flex items-center gap-2 px-4 py-2 border rounded-md hover:border-primary"
                    >
                        <span className="text-sm">Loại</span>
                        <IoIosArrowDown className={`transition-transform duration-300 ${showFilter.type ? 'rotate-180' : ''}`} />
                    </button>
                    {showFilter.type && (
                        <div className="absolute z-10 w-48 mt-2 bg-white border rounded-md shadow-lg">
                            {types.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setType(item.id);
                                        toggleFilter('type');
                                    }}
                                    className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50"
                                >
                                    <span className="text-sm">{item.name}</span>
                                    {type === item.id && <FaCheck className="text-primary" size={12} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Filter by Rating */}
                <div className="relative">
                    <button
                        onClick={() => toggleFilter('rating')}
                        className="flex items-center gap-2 px-4 py-2 border rounded-md hover:border-primary"
                    >
                        <span className="text-sm">Đánh giá</span>
                        <IoIosArrowDown className={`transition-transform duration-300 ${showFilter.rating ? 'rotate-180' : ''}`} />
                    </button>
                    {showFilter.rating && (
                        <div className="absolute z-10 w-48 mt-2 bg-white border rounded-md shadow-lg">
                            {ratings.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => {
                                        setRating(item.id);
                                        toggleFilter('rating');
                                    }}
                                    className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-50"
                                >
                                    <span className="text-sm">{item.name}</span>
                                    {rating === item.id && <FaCheck className="text-primary" size={12} />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Selected Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
                {brand !== 'all' && (
                    <div className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-full">
                        <span>Hãng: {brands.find(x => x.id === brand)?.name}</span>
                        <button
                            onClick={() => setBrand('all')}
                            className="text-gray-500 hover:text-red-500"
                        >
                            ×
                        </button>
                    </div>
                )}
                {priceRange !== 'all' && (
                    <div className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-full">
                        <span>Giá: {prices.find(x => x.id === priceRange)?.name}</span>
                        <button
                            onClick={() => setPriceRange('all')}
                            className="text-gray-500 hover:text-red-500"
                        >
                            ×
                        </button>
                    </div>
                )}
                {type !== 'all' && (
                    <div className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-full">
                        <span>Loại: {types.find(x => x.id === type)?.name}</span>
                        <button
                            onClick={() => setType('all')}
                            className="text-gray-500 hover:text-red-500"
                        >
                            ×
                        </button>
                    </div>
                )}
                {rating !== 'all' && (
                    <div className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 rounded-full">
                        <span>Đánh giá: {ratings.find(x => x.id === rating)?.name}</span>
                        <button
                            onClick={() => setRating('all')}
                            className="text-gray-500 hover:text-red-500"
                        >
                            ×
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductFilters;