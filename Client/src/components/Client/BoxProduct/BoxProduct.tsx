import { useEffect, useState } from "react";
import ico_heart from "../../../assets/images/ico_heart.png";
import ico_reload from "../../../assets/images/ico_reload.png";
import ico_search from "../../../assets/images/ico_search.png";
import { useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { Grow } from "@mui/material";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/features/client/cartSlice";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/Client/useAuth";
import { formatCurrency } from "../../../utils/Format";

const BoxProduct = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { requireAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Ngăn lan click sang navigate
    requireAuth(() => {
      dispatch(
        addToCart({
          ...item,
          quantity: 1,
        })
      );
      toast.success(`Thêm thành công ${item.product_name}`);
    });
  };

  useEffect(() => {
    if (item) {
      setTimeout(() => {
        setIsLoading(true);
      }, 1000);
    }
  }, [item]);

  return isLoading ? (
    <Grow in={true} {...(true ? { timeout: 1000 } : {})}>
      <li
        className="mt-6 md:mt-0 text-center group relative cursor-pointer"
        onClick={() => navigate(`/product/${item._id}`)}
      >
        <ul className="absolute bottom-28 left-4 z-10 flex flex-col gap-3">
          <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            <button type="button" className="shadow-lg p-3 rounded-full bg-white block hover:bg-slate-200 transition-all">
              <img src={ico_heart} className="image size-4 rounded-full" alt="heart" />
            </button>
          </li>
          <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-100">
            <button type="button" className="shadow-lg p-3 rounded-full bg-white block hover:bg-slate-200 transition-all">
              <img src={ico_reload} className="image size-4 rounded-full" alt="reload" />
            </button>
          </li>
          <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-200">
            <button type="button" className="shadow-lg p-3 rounded-full bg-white block hover:bg-slate-200 transition-all">
              <img src={ico_search} className="image size-4 rounded-full" alt="search" />
            </button>
          </li>
        </ul>

        <div className="rounded-xl overflow-hidden bg-white lg:h-[385px]">
          <img
            className="block size-full object-cover"
            src={
              item.imageUrls && item.imageUrls.length > 0
                ? item.imageUrls[0].startsWith("http")
                  ? item.imageUrls[0]
                  : `http://localhost:5000/${item.imageUrls[0].replace(/\\/g, "/")}`
                : "/default.png"
            }
            alt={item.product_name}
          />
        </div>

        <h3 className="text-15 mt-2">{item.product_name}</h3>

        <div className="mt-2 relative h-5 overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 group-hover:bottom-0 -bottom-5 transition-all duration-300">
            <div className="flex items-center justify-center font-bold text-15 text-center">
              <span className="text-red-600">{formatCurrency(item.basePrice)}</span>
            </div>
            <button
              onClick={handleAddToCart}
              className="uppercase text-xs font-medium tracking-widest relative before:absolute before:bottom-0 before:w-0 before:h-[1px] before:bg-black before:left-0 hover:before:w-full before:transition-all before:duration-500"
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </li>
    </Grow>
  ) : (
    <li className="mt-6 md:mt-0 text-center group relative">
      <div className="rounded-xl overflow-hidden bg-white lg:h-[385px]">
        <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
      </div>
    </li>
  );
};

export default BoxProduct;
