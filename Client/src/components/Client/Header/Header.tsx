import logo from "../../../assets/images/Logo thời trang D-Wear.png";
import ico_search from "../../../assets/images/ico_search.png";
import ico_heart from "../../../assets/images/ico_heart.png";
import ico_user from "../../../assets/images/ico_user.png";
import ico_bag from "../../../assets/images/ico_bag.png";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountMenu from "./MenuAccount";
import type { RootState } from "../../../redux/store";

import { useState } from "react";
import CartModal from "../../../pages/client/Cart/CartModal";


const Header = () => {
  const cartItems = useSelector((state: RootState) => state.cartSlice.cartItems);
  const isLogin = useSelector((state: RootState) => state.authenSlice.isLogin);


  const [openCart, setOpenCart] = useState(false);


  const listMenu = [
    {
      title: "Home",
      to: "/",
    },
    { title: "Product", to: "product" },
    { title: "Blog", to: "Blog" },
    { title: "Cart", to: "shopping-cart" },
    { title: "Profile", to: "profile" },
  ];

  return (

    <>
      <header className="py-5 lg:py-8 sticky top-0 z-10 bg-white shadow-lg">
        <div className="container flex items-center">
          <h1 className="flex-shrink-0 mr-5">
            <Link className="block max-w-[130px]" to={"/"}>
              <img className="max-w-full" src={logo} alt="Darion" />
            </Link>
          </h1>

          <div className="relative ml-auto lg:mr-20 max-w-[500px] w-full hidden xl:block">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span>
                <img className="size-5" src={ico_search} alt="" />
              </span>
            </div>
          </div>

          <nav className="mr-28 hidden lg:block ml-auto">
            <ul className="flex items-center gap-10">
              {listMenu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {item.title}
                </NavLink>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-6 ml-auto lg:ml-0 shrink-0">
            <a href="#none" className="lg:hidden">
              <img className="size-5" src={ico_search} alt="" />
            </a>

            {isLogin ? (
              <AccountMenu />
            ) : (
              <Link to={"login"}>
                <img className="size-5" src={ico_user} alt="" />
                {localStorage.getItem("userName")}
              </Link>
            )}

            <Link to={"wish-list"} className="relative">
              <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
                {/* {wishList.length} */}
                10
              </span>
              <img className="size-5" src={ico_heart} alt="" />
            </Link>

            {/* <Link to={"shopping-cart"} className="relative">
              <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
                {cartItems.length}
              </span>
              <img className="size-5" src={ico_bag} alt="" />
            </Link> */}

            <div
              onClick={() => setOpenCart(true)}
              className="relative cursor-pointer"
            >
              <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
                {cartItems.length}
              </span>
              <img className="size-5" src={ico_bag} alt="Cart" />
            </div>
          </div>
        </div>
      </header>

      <CartModal open={openCart} onClose={() => setOpenCart(false)} />
    </>

    // <header className="py-5 lg:py-8 sticky top-0 z-10 bg-white shadow-lg">
    //   <div className="container flex items-center">
    //     <h1 className="flex-shrink-0 mr-5">
    //       <Link className="block max-w-[130px]" to={"/"}>
    //         <img className="max-w-full" src={logo} alt="Darion" />
    //       </Link>
    //     </h1>

    //     <div className="relative ml-auto lg:mr-20 max-w-[500px] w-full hidden xl:block">
    //       <input
    //         type="text"
    //         placeholder="Search..."
    //         className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    //       />
    //       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    //         <span>
    //           <img className="size-5" src={ico_search} alt="" />
    //         </span>
    //       </div>
    //     </div>

    //     <nav className="mr-28 hidden lg:block ml-auto">
    //       <ul className="flex items-center gap-10">
    //         {listMenu.map((item) => (
    //           <NavLink
    //             key={item.to}
    //             to={item.to}
    //             className={({ isActive }) => (isActive ? "active" : "")}
    //           >
    //             {item.title}
    //           </NavLink>
    //         ))}
    //       </ul>
    //     </nav>

    //     <div className="flex items-center gap-6 ml-auto lg:ml-0 shrink-0">
    //       <a href="#none" className="lg:hidden">
    //         <img className="size-5" src={ico_search} alt="" />
    //       </a>

    //       {isLogin ? (
    //         <AccountMenu />
    //       ) : (
    //         <Link to={"login"}>
    //           <img className="size-5" src={ico_user} alt="" />
    //           {localStorage.getItem("userName")}
    //         </Link>
    //       )}

    //       <Link to={"wish-list"} className="relative">
    //         <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
    //           {/* {wishList.length} */}
    //           10
    //         </span>
    //         <img className="size-5" src={ico_heart} alt="" />
    //       </Link>
    //       <Link to={"shopping-cart"} className="relative">
    //         <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
    //           {cartItems.length}
    //         </span>
    //         <img className="size-5" src={ico_bag} alt="" />
    //       </Link>
    //     </div>
    //   </div>
    // </header>

  );
};

export default Header;
