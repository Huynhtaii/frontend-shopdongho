const BottomBanner = () => {
    return (
        <div className="bg-black mt-10">
            <div className="layout-container">
                <div className="py-5 flex gap-6 items-center">
                    <img src="/gioithieu-home-desktop.webp" alt="" className="w-[550px] rounded-md object-cover" />
                    <div className="text-white flex flex-col gap-5 items-center justify-center font-[500]">
                        <img src="/logo-w2.webp" alt="" className="w-[150px] h-auto" />
                        <h1 className="text-[32px] text-[#fdaf17]">Cửa hàng đồng hồ đeo tay chính hãng</h1>
                        <p className="text-center text-sm">Được thành lập vào năm 2020, trải qua 4 năm hoạt động và phát triển, chuỗi cửa hàng đồng hồ WatchStore trở thành đại lý ủy quyền cho rất nhiều thương hiệu đến từ Nhật Bản và Thụy Sỹ chuyên bán đồng hồ đeo tay chính hãng.</p>
                        <p className="text-center text-sm">Chính sách bảo hành 5 năm cùng với các chương trình giảm giá tốt sẽ giúp bạn mua sắm dễ dàng. Với đội ngũ nhân viên tận tình, am hiểu kiến thức, các tiệm đồng hồ WatchStore rất vui được phục vụ quý khách. WatchStore hứa sẽ hoàn thiện hơn mỗi ngày để mang đến trải nghiệm tuyệt vời nhất có thể cho mọi khách hàng. Chúc quý khách mọi điều tốt lành!</p>
                        <button className="bg-white text-[#fdaf17] px-4 py-2 rounded-md">Xem thêm</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BottomBanner;    