const useFormatPrice = () => {
   const formatPrice = (price) => {
      return new Intl.NumberFormat('vi-VN', {
         style: 'currency',
         currency: 'VND',
         minimumFractionDigits: 0, // Không hiển thị số thập phân
      }).format(price);
   };
   return { formatPrice };
};

export default useFormatPrice;
