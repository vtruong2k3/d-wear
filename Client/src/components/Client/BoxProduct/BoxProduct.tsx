import React, { useEffect, useState } from "react";
import ico_heart from "../../../assets/images/ico_heart.png";
import ico_reload from "../../../assets/images/ico_reload.png";
import ico_search from "../../../assets/images/ico_search.png";
import { Link, useNavigate } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";
import { Grow, Rating } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../redux/features/cartSlice";
import { toast } from "react-toastify";
import useAuth from "../../../hooks/Client/useAuth";
const BoxProduct = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { requireAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = () => {
    requireAuth(() => {
      dispatch(
        addToCart({
          ...item,
          quantity: 1,
        })
      );
      toast.success(`Mua thành công ${item.title}`)
    });
  };

  useEffect(() => {
    if (item) {
      setTimeout(() => {
        setIsLoading(true);
      }, 1000);
    }
  }, []);
  return isLoading ? (
    <Grow
      in={true}
      //   style={{ transformOrigin: "0 0 0" }}
      {...(true ? { timeout: 1000 } : {})}
    >
      <li className="mt-6 md:mt-0 text-center group relative">
        {/* <span className="absolute py-1 text-xs px-2 top-3 left-3 bg-black text-white rounded-xl">
  Out of stock
</span> */}
        <span className="absolute py-1 text-xs px-2 top-3 left-3 bg-red-600 text-white rounded-xl">
          -{item.discountPercentage}%
        </span>
        <ul className="absolute bottom-28 left-4 z-10 flex flex-col gap-3">
          <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            <button
              //   onClick={handleWishList}
              type="button"
              //   disabled={wishList.map((i) => i.id).includes(item.id)}
              //   className={`shadow-lg p-3 rounded-full ${
              //     wishList.map((i) => i.id).includes(item.id)
              //       ? "bg-red-500"
              //       : "bg-white block hover:bg-slate-200"
              //   }   transition-all`}
            >
              <img
                src={ico_heart}
                className="image size-4 rouded-full"
                alt=""
              />
            </button>
          </li>
          <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-100">
            <button
              type="button"
              className="shadow-lg p-3 rounded-full bg-white block hover:bg-slate-200 transition-all"
            >
              <img
                src={ico_reload}
                className="image size-4 rouded-full"
                alt=""
              />
            </button>
          </li>
          <li className="opacity-0 translate-y-4 duration-200 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-200">
            <button
              type="button"
              className="shadow-lg p-3 rounded-full bg-white block hover:bg-slate-200 transition-all"
            >
              <img
                src={ico_search}
                className="image size-4 rouded-full"
                alt=""
              />
            </button>
          </li>
        </ul>
        <Link to={`/product/${item.id}`} className="bg-red">
          <div
            className="rounded-xl overflow-hidden bg-white lg:h-[385px]"
            onClick={() => navigate(`/product/${item.id}`)}
          >
            <img
              className="block size-full object-cover"
              src={item.thumbnail}
              alt=""
            />
          </div>
        </Link>

        <div className="flex justify-center items-center gap-1 mt-5">
          <Rating
            name="half-rating-read"
            defaultValue={item.rating}
            precision={0.5}
            readOnly
          />
        </div>
        <h3 className="text-15 mt-2">{item.title}</h3>
        <div className="mt-2 relative h-5 overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 group-hover:bottom-0 -bottom-5 transition-all duration-300">
            <div className="flex items-center justify-center font-bold text-15 text-center">
              <span className="text-red-600">${item.price}</span>
            </div>
            <button
              onClick={handleAddToCart}
              className="uppercase text-xs font-medium tracking-widest relative before:absolute before:bottom-0 before:w-0 before:h-[1px] before:bg-black before:left-0 hover:before:w-full before:transition-all before:duration-500"
            >
              Add to cart
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
