import { v4 as uuid } from "uuid"

import { BsWatch } from "react-icons/bs";
import { IoRocketSharp, IoShieldCheckmark } from "react-icons/io5";
import { RiResetLeftLine } from "react-icons/ri";
import { BsPatchCheck } from "react-icons/bs";

export const Benefits_NAV = [
    {
        id: uuid(),
        icon: <BsWatch size={30} />,
        title: 'Mẫu mã đa dạng nhất',
        description: 'Hoàn tiền nếu phát hiện bán hàng giả',
    },
    {
        id: uuid(),
        icon: <IoRocketSharp size={30} />,
        title: 'Miễn phí vận chuyển',
        description: 'Giao hàng nhanh, đóng gói cẩn thận',
    },
    {
        id: uuid(),
        icon: <RiResetLeftLine size={30} />,
        title: 'Đổi hàng 7 ngày',
        description: '1 đổi 1 trong 7 ngày với sản phẩm lỗi',
    },
    {
        id: uuid(),
        icon: <IoShieldCheckmark size={30} />,
        title: 'Bảo hành 5 năm',
        description: 'Thụ tục nhanh gọn, thay pin miễn phí',
    },
    {
        id: uuid(),
        icon: <BsPatchCheck size={30} />,
        title: 'Đeo trước trả sau',
        description: 'Trả trước 1 phần, 2 phần còn lại trả sau',
    }
]