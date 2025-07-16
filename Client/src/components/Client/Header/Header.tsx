import logo from "../../../assets/images/Logo thời trang D-Wear.png";
import ico_search from "../../../assets/images/ico_search.png";
import ico_heart from "../../../assets/images/ico_heart.png";
import ico_user from "../../../assets/images/ico_user.png";
import ico_bag from "../../../assets/images/ico_bag.png";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountMenu from "./MenuAccount";
import type { RootState } from "../../../redux/store";


// import CartModal from "../../../pages/client/Cart/CartModal";
import '../../../styles/activeMenu.css'
const Header = () => {
  const cartItemsCount = useSelector((state: RootState) => state.cartSlice.cartItems.length);

  const isLogin = useSelector((state: RootState) => state.authenSlice.isLogin);

  // const [openCart, setOpenCart] = useState(false);

  const listMenu = [
    { title: "Home", to: "/" },
    { title: "Product", to: "/product" },
    { title: "Blog", to: "/blog" },
    { title: "About", to: "/about" },
    { title: "Contact", to: "/contact" },
  ];

  return (
    <>


      <header className="py-5 lg:py-8 sticky top-0 z-10 bg-white shadow-lg">
        <div className="container flex items-center">
          <h1 className="flex-shrink-0 mr-5">
            <Link className="block max-w-[130px]" to={"/"}>
              <img className="w-full h-auto " src={logo} alt="D-Wear" />
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

          <nav className="mr-28 hidden lg:flex ml-auto items-center">
            <ul className="flex items-center gap-10 mt-5">
              {listMenu.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      isActive
                        ? "text-black font-semibold py-2 relative transition-all duration-300 ease-in-out active-menu-item block"
                        : "text-gray-600 hover:text-black hover:font-medium py-2 relative transition-all duration-300 ease-in-out menu-item block"
                    }
                  >
                    {item.title}
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-black transition-all duration-300 ease-in-out w-0 hover:w-full"></span>
                  </NavLink>
                </li>
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
              <Link to={"login"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <img className="size-5" src={ico_user} alt="" />
                <span className="text-sm text-gray-600">
                  {localStorage.getItem("userName")}
                </span>
              </Link>
            )}

            <Link to={"wish-list"} className="relative hover:opacity-80 transition-opacity">
              <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
                10
              </span>
              <img className="size-5" src={ico_heart} alt="" />
            </Link>

            <div

              className="relative cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Link to={`/shopping-cart`}>
                <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-black text-white rounded-full text-xs grid place-items-center">
                  {cartItemsCount}
                </span>
                <img className="size-5" src={ico_bag} alt="Cart" /></Link>
            </div>
          </div>
        </div>
      </header>

      {/* <CartModal open={openCart} onClose={() => setOpenCart(false)} /> */}
    </>
  );
};

export default Header;