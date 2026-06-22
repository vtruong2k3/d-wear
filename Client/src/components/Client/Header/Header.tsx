import logo from "../../../assets/images/Logo thời trang D-Wear.png";
import ico_search from "../../../assets/images/ico_search.png";
import ico_heart from "../../../assets/images/ico_heart.png";
import ico_user from "../../../assets/images/ico_user.png";
import ico_bag from "../../../assets/images/ico_bag.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AccountMenu from "./MenuAccount";
import type { RootState } from "../../../redux/store";
import { AutoComplete, Input } from "antd";
import { useState, useEffect, useCallback } from "react";
import apiServiceProduct from "../../../services/client/apiServiceProduct";
import NotificationDropdownClient from "../Notification/NotificationDropdownClient";

import "../../../styles/activeMenu.css";
import "../../../styles/Header.css";
import type { SearchType } from "../../../types/IProducts";

const Header = () => {
  const cartItemsCount = useSelector(
    (state: RootState) => state.cartSlice.cartItems.length
  );
  const isLogin = useSelector((state: RootState) => state.authenSlice.isLogin);
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [options, setOptions] = useState<SearchType[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const listMenu = [
    { title: "Home", to: "/" },
    { title: "Product", to: "/product" },
    { title: "Blog", to: "/blog" },
    { title: "About", to: "/about" },
    { title: "Contact", to: "/contact" },
  ];

  // Scroll detection for header effect
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (searchText.trim()) {
        try {
          const res = await apiServiceProduct.searchProducts({
            keyword: searchText,
          });

          const products = res.data?.products?.slice(0, 5) || [];

          const mappedOptions = [
            {
              label: (
                <span className="text-gray-500 italic">
                  Tìm kiếm: <strong>{searchText}</strong>
                </span>
              ),
              value: searchText,
            },
            ...products.map((item: SearchType) => ({
              value: item.product_name,
              label: (
                <div className="flex items-center gap-3 text-sm">
                  <img
                    src={item.image}
                    alt={item.product_name}
                    className="w-10 h-10 object-cover rounded-md border border-gray-200"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{item.product_name}</span>
                    <span className="text-gray-400 text-xs">Sản phẩm</span>
                  </div>
                </div>
              ),
              productId: item._id,
              slug: item._id,
            })),
          ];

          setOptions(mappedOptions);
        } catch (error) {
          console.error("Lỗi gợi ý tìm kiếm:", error);
          setOptions([]);
        }
      } else {
        setOptions([]);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [searchText]);

  const handleSelect = (value: string, option: SearchType) => {
    if (option.productId) {
      navigate(`/product/${option.slug}`);
    } else {
      navigate(`/product?q=${encodeURIComponent(value)}`);
    }
    setSearchText("");
  };

  return (
    <>
      <header
        className={`py-3 lg:py-4 sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "header-scrolled" : "shadow-sm"
        }`}
      >
        <div className="container flex items-center">
          {/* Logo */}
          <h1 className="flex-shrink-0 mr-5">
            <Link className="block max-w-[120px] lg:max-w-[130px]" to={"/"}>
              <img className="w-full h-auto" src={logo} alt="D-Wear" />
            </Link>
          </h1>

          {/* 🔍 Search Bar */}
          <div className="relative ml-auto lg:mr-16 max-w-[420px] w-full hidden xl:block">
            <AutoComplete
              popupClassName="custom-search-dropdown"
              options={options}
              onSearch={setSearchText}
              onSelect={handleSelect}
              value={searchText}
              onChange={setSearchText}
              className="w-full"
            >
              <div className="relative w-full">
                <Input
                  placeholder="Tìm sản phẩm..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onPressEnter={() => {
                    navigate(`/product?q=${encodeURIComponent(searchText)}`);
                    setSearchText("");
                  }}
                  className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent hover:border-amber-300 transition-all duration-300"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <img className="size-5 opacity-50" src={ico_search} alt="Search" />
                </div>
              </div>
            </AutoComplete>
          </div>

          {/* Navigation Menu */}
          <nav className="mr-20 hidden lg:flex ml-auto items-center">
            <ul className="flex items-center gap-8">
              {listMenu.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `relative py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                        isActive
                          ? "text-gray-900"
                          : "text-gray-500 hover:text-gray-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {item.title}
                        <span
                          className={`absolute -bottom-0.5 left-0 h-[2px] bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300 rounded-full ${
                            isActive ? "w-full" : "w-0 group-hover:w-full"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-5 ml-auto lg:ml-0 shrink-0">
            {/* Mobile search */}
            <a href="#none" className="lg:hidden opacity-70 hover:opacity-100 transition-opacity">
              <img className="size-5" src={ico_search} alt="Search" />
            </a>

            {/* Mobile hamburger */}
            <button
              className="lg:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>

            {/* User */}
            {isLogin ? (
              <AccountMenu />
            ) : (
              <Link
                to={"login"}
                className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity"
              >
                <img className="size-5" src={ico_user} alt="Account" />
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {localStorage.getItem("userName")}
                </span>
              </Link>
            )}

            {/* Notification */}
            {isLogin && <NotificationDropdownClient />}

            {/* Wishlist */}
            <Link
              to={"wish-list"}
              className="relative opacity-70 hover:opacity-100 transition-opacity"
            >
              <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-amber-600 text-white rounded-full text-xs grid place-items-center font-medium">
                10
              </span>
              <img className="size-5" src={ico_heart} alt="Wishlist" />
            </Link>

            {/* Cart */}
            <div className="relative cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
              <Link to={`/shopping-cart`}>
                <span className="absolute -top-[8px] -right-[10px] size-[18px] bg-amber-600 text-white rounded-full text-xs grid place-items-center font-medium">
                  {cartItemsCount}
                </span>
                <img className="size-5" src={ico_bag} alt="Cart" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="absolute top-0 right-0 w-72 h-full bg-white shadow-2xl p-8 pt-20 auth-slide-in-left"
            style={{ animationDirection: "reverse", animationName: "slideInLeft", transform: "translateX(0)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-6 right-6 text-gray-500 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col gap-6">
              {listMenu.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `text-lg font-medium transition-colors ${
                      isActive ? "text-amber-600" : "text-gray-700 hover:text-amber-600"
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
