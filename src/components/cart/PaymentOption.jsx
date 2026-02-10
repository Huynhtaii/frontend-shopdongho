import React from 'react';

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
               <label htmlFor="cod" className="text-sm cursor-pointer">
                  Thanh toán tiền mặt khi nhận hàng (COD)
               </label>
            </div>
            <div className="border p-2 cursor-pointer rounded-md flex items-center gap-2">
               <input
                  type="radio"
                  name="paymentMethod"
                  id="qr_code"
                  value="qr_code"
                  checked={paymentMethod === 'qr_code'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
               />
               <label htmlFor="qr_code" className="text-sm cursor-pointer">
                  Thanh toán Bằng Ngân Hàng Qua QR Code
               </label>
            </div>
         </div>
      </div>
   );
};

export default PaymentOption;
