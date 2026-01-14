import { Link } from "react-router-dom";

const Empty = () => {
    return (
        <div className="flex items-center h-[200px] justify-center text-[15px]">
            <p className="text-center text-gray-500">Không có sản phẩm yêu thích nào!</p>
            <Link to={'/'} className="p-2 text-center rounded-md text-blue-600">Tiếp tục mua sắm</Link>
        </div>
    )
}
export default Empty;