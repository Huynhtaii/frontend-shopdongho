import { v4 as uuid } from "uuid"

export const USER_MENU_NAV = [
    {
        id: uuid(),
        name: 'Xu hướng 2025',
        icon: '',
        link: '/category/Xu hướng 2025',
        active: false,
        subMenu: []
    },
    {
        id: uuid(),
        name: 'Menu',
        icon: '',
        link: '',
        active: false,
        subMenu: [
            {
                id: uuid(),
                name: 'Phổ biến',
                link: '/category/all',
                subMenu: [
                    { id: uuid(), name: 'Casio', link: '/category/all', subMenu: [] },
                    { id: uuid(), name: 'Orient', link: '/category/all', subMenu: [] },
                    { id: uuid(), name: 'Seiko', link: '/category/all', subMenu: [] },
                    { id: uuid(), name: 'Citizen', link: '/category/all', subMenu: [] }
                ]
            },
            {
                id: uuid(),
                name: 'Dây Da Tổng Hợp',
                link: '/category/all',
                subMenu: [
                    { id: uuid(), name: 'Dây Da Tổng Hợp', link: '/category/all', subMenu: [] },
                    { id: uuid(), name: 'Dây Kim Loại', link: '/category/all', subMenu: [] },
                    { id: uuid(), name: 'Dây Vải/Canvas', link: '/category/all', subMenu: [] }
                ]
            },
            {
                id: uuid(),
                name: 'Phong Cách',
                link: '',
                subMenu: [
                    { id: uuid(), name: 'Quân Đội', link: '/category/all', subMenu: [] },
                    { id: uuid(), name: 'Công Sở', link: '/category/all', subMenu: [] },
                    { id: uuid(), name: 'Mặt Vương', link: '/category/all', subMenu: [] }
                ]
            },
            {
                id: uuid(),
                name: 'Hãng Cao Cấp',
                link: '',
                subMenu: [
                    { id: uuid(), name: 'Tissot', link: '/category/all', subMenu: [] },
                    { id: uuid(), name: 'Frederique Constant', link: '/category/all', subMenu: [] },
                    { id: uuid(), name: 'Longines', link: '/category/all', subMenu: [] }
                ]
            }
        ]
    },
    {
        id: uuid(),
        name: 'Nam',
        icon: '',
        link: '/category/Đồng hồ nam',
        active: false,
        subMenu: []
    },
    {
        id: uuid(),
        name: 'Nữ',
        icon: '',
        link: '/category/Đồng hồ nữ',
        active: false,
        subMenu: []
    },
    {
        id: uuid(),
        name: 'Cũ cao cấp',
        icon: '',
        link: '/category/Đồng hồ cũ cao cấp',
        active: false,
        subMenu: []
    },
    {
        id: uuid(),
        name: 'Treo tường',
        icon: '',
        link: '/category/Đồng hồ treo tường',
        active: false,
        subMenu: []
    },
]