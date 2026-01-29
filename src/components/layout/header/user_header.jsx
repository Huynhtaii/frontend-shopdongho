import { Link } from 'react-router-dom';
import { IoSearchOutline } from 'react-icons/io5';
import { AiOutlineUser } from 'react-icons/ai';
import { RiBox3Line } from 'react-icons/ri';
import { LuShoppingCart } from 'react-icons/lu';
import { MdFavoriteBorder } from 'react-icons/md';
import UserMenu from './user_menu';
import SearchResult from './search_result';
import { useState } from 'react';
import { useFavorite } from '../../../context/favorite_context';
import UserService from '../../../services/user_service';
import AuthContext from '../../../context/auth.context';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../../../context/cart_context';
import { toast } from 'react-toastify';

const UserHeader = () => {
   const { count } = useFavorite();
   const { countItem: countCartItem } = useCart();
   const [keyword, setKeyword] = useState('');
   const [showSearchResult, setShowSearchResult] = useState(false);
   const { auth, setAuth } = useContext(AuthContext);
   const navigate = useNavigate();
   const handleSearch = (e) => {
      setKeyword(e.target.value);
      setShowSearchResult(true);
   };
   const handleLogout = async () => {
      const response = await UserService.logOutUser();
      if (response && response.EC === '0') {
         toast.success('Đăng xuất thành công!');
         localStorage.removeItem('access_token');
         localStorage.removeItem('userId');
         localStorage.removeItem('userEmail');
         localStorage.removeItem('userName');
         setAuth({ isAuthenticated: false });
         navigate('/');
      }
   };
   return (
      <div className="bg-[#f1f3f4] relative z-[1000]">
         <div className="layout-container flex items-center gap-3">
            <Link to={'/'} className="hidden lg:flex">
               <img src="/logo-watchstore.webp" alt="" className="w-[200px] h-auto" />
            </Link>
            <UserMenu />
            <div className="options flex gap-3 items-center">
               <div className="relative hidden md:flex">
                  <IoSearchOutline
                     size={22}
                     className="text-[#494949] absolute top-1/2 left-1 -translate-y-1/2 cursor-pointer"
                  />
                  <input
                     type="text"
                     placeholder="Tìm là thấy"
                     className="w-[200px] text-sm p-2 outline-none rounded-md pr-3 pl-7"
                     value={keyword}
                     onChange={handleSearch}
                     onClick={() => setShowSearchResult(true)}
                  />
                  {showSearchResult && (
                     <SearchResult
                        keyword={keyword}
                        setShowSearchResult={setShowSearchResult}
                        setKeyword={setKeyword}
                     />
                  )}
               </div>
               {auth.isAuthenticated && <div className="hidden md:flex">Xin Chào {auth.user.name}</div>}
               <div className="relative account">
                  <AiOutlineUser size={28} className="text-[#494949] cursor-pointer" />
                  {/* <div className="account-menu-popup absolute -bottom-16 left-1/2 -translate-x-1/2 bg-[#363636] rounded-md text-white text-sm flex flex-col w-[90px] z-[999]">
                            <Link to={'/login'} className="hover:bg-[#666] duration-100 p-2 py-1 rounded-t-md">Đăng nhập</Link>
                            <Link to={'/register'} className="hover:bg-[#666] duration-100 p-2 py-1 rounded-b-md">Đăng ký</Link>
                        </div> */}
                  {auth.isAuthenticated ? (
                     <div className="account-menu-popup absolute -bottom-16 left-1/2 -translate-x-1/2 bg-[#363636] rounded-md text-white text-sm flex flex-col w-[90px] z-[999]">
                        <Link to={'/account'} className="hover:bg-[#666] duration-100 p-2 py-1 rounded-t-md">
                           Tài khoản
                        </Link>
                        <Link
                           to={'/'}
                           className="hover:bg-[#666] duration-100 p-2 py-1 rounded-b-md"
                           onClick={handleLogout}
                        >
                           Đăng xuất
                        </Link>
                     </div>
                  ) : (
                     <div className="account-menu-popup absolute -bottom-16 left-1/2 -translate-x-1/2 bg-[#363636] rounded-md text-white text-sm flex flex-col w-[90px] z-[999]">
                        <Link to={'/login'} className="hover:bg-[#666] duration-100 p-2 py-1 rounded-t-md">
                           Đăng nhập
                        </Link>
                        <Link to={'/register'} className="hover:bg-[#666] duration-100 p-2 py-1 rounded-b-md">
                           Đăng ký
                        </Link>
                     </div>
                  )}
               </div>
               <Link to={'/cart'} className="relative hidden sm:flex">
                  <LuShoppingCart size={28} className="text-[#494949] cursor-pointer" />
                  <span className="absolute top-0 -right-2 bg-primary rounded-full w-3.5 h-3.5 text-[11px] flex items-center justify-center z-[-2]">
                     {countCartItem || 0}
                  </span>
               </Link>
               <Link to={'/favorite'} className="relative hidden sm:flex">
                  <MdFavoriteBorder size={28} className="text-[#494949] cursor-pointer" />
                  <span className="absolute top-0 -right-2 bg-primary rounded-full w-3.5 h-3.5 text-[11px] flex items-center justify-center z-[-2]">
                     {count}
                  </span>
               </Link>
                {auth?.user?.role === '1' && (
                  <Link to={'/admin'} className="relative hidden sm:flex">
                     <RiBox3Line size={28} className="text-[#494949] cursor-pointer" />
                  </Link>
               )}
            </div>
         </div>
      </div>
   );
};

export default UserHeader;
