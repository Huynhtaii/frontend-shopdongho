import { useEffect, useState } from "react";
import AccountService from "../../services/account_service";

const Payment = ({ totalPrice }) => {
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [user, setUser] = useState(null);
    const user_id_fake = 1;

    useEffect(() => {
        const fetchUser = async () => {
            const response = await AccountService.getInforAccount(user_id_fake);
            if (response.EC === "0") {
                setUser(response.DT);
            }
        }
        fetchUser();
    }, []);

    return (
        <div className="flex flex-col">
            <div className="mt-5 border-b pb-5">
                <div className="flex gap-3 mb-3">
                    <h3 className="text-[14px] text-gray-500 font-[500]">
                        *Thông tin được lấy từ tài khoản của bạn vui lòng nhập đầy đủ thông tin để đặt hàng <br /> (có thể thay đổi ở trang cá nhân)*
                    </h3>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                    <p className="border rounded-md p-2 text-sm">{user?.name}</p>
                    <p className="border rounded-md p-2 text-sm">{user?.phone}</p>
                </div>
                <div className="mb-3">
                    <p className="border rounded-md p-2 text-sm">{user?.email}</p>
                </div>
                <div className="mb-3">
                    <p className="border rounded-md p-2 text-sm">{user?.address}</p>
                </div>
            </div>
            <div className="flex justify-between border-b py-5">
                <h3 className="text-[14px] font-[600]">Cần thanh toán:</h3>
                <p className="text-[#ed1c24] font-[600] text-[14px]">{totalPrice.toLocaleString()}đ</p>
            </div>
            <PaymentOption paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
            <button className="bg-blue-600 py-3 px-5 text-white rounded-md m-auto flex flex-col items-center text-[20px]">
                <h1 className="font-[500]">Đặt hàng</h1>
                <span className="text-xs pb-2">(Bằng cách đặt hàng bạn đồng ý với các điều khoản của chúng tôi)</span>
            </button>
        </div>
    )
}

const PaymentOption = ({ paymentMethod, setPaymentMethod }) => {
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
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="cod" className="text-sm cursor-pointer">Thanh toán tiền mặt khi nhận hàng (COD)</label>
                </div>
                <div className="border p-2 cursor-pointer rounded-md flex items-center gap-2">
                    <input
                        type="radio"
                        name="paymentMethod"
                        id="momo"
                        value="momo"
                        checked={paymentMethod === 'momo'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <label htmlFor="momo" className="text-sm cursor-pointer">Thanh toán qua ví điện tử Momo</label>
                </div>
            </div>
        </div>
    )
}

export default Payment;