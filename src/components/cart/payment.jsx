import { useState } from "react";

const Payment = () => {
    const [formData, setFormData] = useState({
        gender: 'male',
        fullName: '',
        phone: '',
        email: '',
        city: '',
        district: '',
        ward: '',
        address: '',
        note: '',
        paymentMethod: 'cod'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="flex flex-col">
            <div className="mt-5 border-b pb-5">
                <div className="flex gap-3 mb-3">
                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="gender"
                            id="male"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleChange}
                        />
                        <label htmlFor="male" className="text-sm">Anh</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="radio"
                            name="gender"
                            id="female"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleChange}
                        />
                        <label htmlFor="female" className="text-sm">Chị</label>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Họ và Tên"
                        className="border rounded-md p-2 text-sm"
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Số điện thoại"
                        className="border rounded-md p-2 text-sm"
                    />
                </div>
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full border rounded-md p-2 text-sm mb-3"
                />
                <div className="grid grid-cols-3 gap-3 mb-3">
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Hà Nội"
                        className="border rounded-md p-2 text-sm"
                    />
                    <input
                        type="text"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        placeholder="Huyện Quốc Oai"
                        className="border rounded-md p-2 text-sm"
                    />
                    <input
                        type="text"
                        name="ward"
                        value={formData.ward}
                        onChange={handleChange}
                        placeholder="Chọn Xã phường"
                        className="border rounded-md p-2 text-sm"
                    />
                </div>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Số nhà, tên đường..."
                    className="w-full border rounded-md p-2 text-sm mb-3"
                />
                <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    placeholder="Ghi chú thêm (nếu có)..."
                    className="w-full border rounded-md p-2 text-sm h-24 resize-none"
                ></textarea>
            </div>
            <div className="flex justify-between border-b py-5">
                <h3 className="text-[14px] font-[600]">Cần thanh toán:</h3>
                <p className="text-[#ed1c24] font-[600] text-[14px]">2.800.000đ</p>
            </div>
            <PaymentOption formData={formData} handleChange={handleChange} />
            <button className="bg-blue-600 py-3 px-5 text-white rounded-md m-auto flex flex-col items-center text-[20px]">
                <h1 className="font-[500]">Đặt hàng</h1>
                <span className="text-xs pb-2">(Bằng cách đặt hàng bạn đồng ý với các điều khoản của chúng tôi)</span>
            </button>
        </div>
    )
}

const PaymentOption = ({ formData, handleChange }) => {
    return (
        <div className="py-5">
            <h3 className="text-[14px] font-[600] mb-3">Phương thức thanh toán</h3>
            <div className="flex flex-col gap-3">
                <div className="border p-2 cursor-pointer rounded-md flex items-center gap-2">
                    <input
                        type="radio"
                        name="paymentMethod"
                        id="cod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                    />
                    <label htmlFor="cod" className="text-sm">Thanh toán tiền mặt khi nhận hàng (COD)</label>
                </div>
                <div className="border p-2 cursor-pointer rounded-md flex items-center gap-2">
                    <input
                        type="radio"
                        name="paymentMethod"
                        id="momo"
                        value="momo"
                        checked={formData.paymentMethod === 'momo'}
                        onChange={handleChange}
                    />
                    <label htmlFor="momo" className="text-sm">Thanh toán qua ví điện tử Momo</label>
                </div>
            </div>
        </div>
    )
}

export default Payment;