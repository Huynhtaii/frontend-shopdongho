import { v4 as uuid } from "uuid"

export const USER_MENU_NAV = [
    {
        id: uuid(),
        name: 'Xu hướng 2025',
        icon: '',
        link: '',
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
                link: '',
                subMenu: [
                    { id: uuid(), name: 'Casio', link: '', subMenu: [] },
                    { id: uuid(), name: 'Orient', link: '', subMenu: [] },
                    { id: uuid(), name: 'Seiko', link: '', subMenu: [] },
                    { id: uuid(), name: 'Citizen', link: '', subMenu: [] }
                ]
            },
            {
                id: uuid(),
                name: 'Dây Da Tổng Hợp',
                link: '',
                subMenu: [
                    { id: uuid(), name: 'Dây Da Tổng Hợp', link: '', subMenu: [] },
                    { id: uuid(), name: 'Dây Kim Loại', link: '', subMenu: [] },
                    { id: uuid(), name: 'Dây Vải/Canvas', link: '', subMenu: [] }
                ]
            },
            {
                id: uuid(),
                name: 'Phong Cách',
                link: '',
                subMenu: [
                    { id: uuid(), name: 'Quân Đội', link: '', subMenu: [] },
                    { id: uuid(), name: 'Công Sở', link: '', subMenu: [] },
                    { id: uuid(), name: 'Mặt Vương', link: '', subMenu: [] }
                ]
            },
            {
                id: uuid(),
                name: 'Hãng Cao Cấp',
                link: '',
                subMenu: [
                    { id: uuid(), name: 'Tissot', link: '', subMenu: [] },
                    { id: uuid(), name: 'Frederique Constant', link: '', subMenu: [] },
                    { id: uuid(), name: 'Longines', link: '', subMenu: [] }
                ]
            }
        ]
    },
    {
        id: uuid(),
        name: 'Nam',
        icon: '',
        link: '',
        active: false,
        subMenu: []
    },
    {
        id: uuid(),
        name: 'Nữ',
        icon: '',
        link: '',
        active: false,
        subMenu: []
    },
    {
        id: uuid(),
        name: 'Cũ cao cấp',
        icon: '',
        link: '',
        active: false,
        subMenu: []
    },
    {
        id: uuid(),
        name: 'Treo tường',
        icon: '',
        link: '',
        active: false,
        subMenu: []
    },
]