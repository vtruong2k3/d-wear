import React, { useEffect, useRef, useState } from "react";
import ico_eye from "../../../assets/images/ico_eye.png";
import ico_fire from "../../../assets/images/ico_fire.png";
import ico_checked from "../../../assets/images/ico_checked.png";
import ico_heart from "../../../assets/images/ico_heart.png";
import ico_reload from "../../../assets/images/ico_reload.png";
import ico_question from "../../../assets/images/ico_question.png";
import ico_shipping from "../../../assets/images/ico_shipping.png";
import ico_shipping2 from "../../../assets/images/ico_shipping2.png";
import ico_share from "../../../assets/images/ico_share.png";
import ico_check from "../../../assets/images/ico_check.png";
import img_payment from "../../../assets/images/img_payment.avif";
import { useNavigate, useParams } from "react-router-dom";
import apiServiceProduct from "../../../services/apiServiceProduct";
import { Backdrop, CircularProgress, Grow } from "@mui/material";
import BoxProduct from "../../../components/Client/BoxProduct/BoxProduct";

import { useDispatch } from "react-redux";



import useFetchGetDataProduct from "../../../hooks/Client/useFetchGetDataProduct";
import useAuth from "../../../hooks/Client/useAuth";


import { addToCart } from "../../../redux/features/cartSlice";
import { toast } from "react-toastify";


interface Products {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
  images: string[];
  category: string;
}
const DetailProduct = () => {
  const divRef = useRef(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { requireAuth } = useAuth();
  // const isLogin = useSelector((state) => state.authenSlice.isLogin);
  // const [dataDetail, setDataDetail] = useState(null);
  const [dataDetail, setDataDetail] = useState<Products | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { products } = useFetchGetDataProduct(category);

  useEffect(() => {
    if (id) {
      if (divRef.current) {
        divRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      }
      setIsLoading(true);
      const fetchDataDetailProduct = async () => {
        const res = await apiServiceProduct.getDetailProduct(id);
        const { status, data } = res;
        if (status === 200) {
          setDataDetail(data);
          setIsLoading(false);
          setCategory(data.category);
        }
      };
      fetchDataDetailProduct();
    }
  }, [id, divRef]);


  const handleAddToCart = (item: Products) => {
    requireAuth(() => {
      dispatch(
        addToCart({
          ...item,
          quantity,
        })
      );
      toast.success(`Đã thêm ${item.title} vào giỏ hàng`);
      navigate("/shopping-cart");
    });
  };


  return (
    <>
      {dataDetail ? (
        <div className="container" ref={divRef}>
          <ul className="flex gap-2 items-center py-4">
            <li>
              <a className="text-sm" href="#none">
                Home /{" "}
              </a>
            </li>
            <li>
              <a className="text-sm" href="#none">
                {dataDetail.category} /{" "}
              </a>
            </li>
            <li>
              <a className="text-sm">{dataDetail.title}</a>
            </li>
          </ul>
          <div className="lg:grid grid-cols-5 gap-7 mt-4">
            <div className="col-span-3 flex gap-3">
              <ul className="flex flex-col gap-4">
                {dataDetail.images.map((url) => (
                  <li
                    key={url}
                    className="w-[82px] cursor-pointer p-[10px] rounded-md border border-black hover:border-black transition-all"
                  >
                    <img className="image" src={url} alt="" />
                  </li>
                ))}
              </ul>
              <div className="overflow-hidden">
                <div className="rounded-xl overflow-hidden">
                  <Grow {...(true ? { timeout: 1000 } : {})} in={true}>
                    <img src={dataDetail.thumbnail} className="image" alt="" />
                  </Grow>
                </div>
              </div>
            </div>
            <div className="col-span-2 mt-6">
              <h2 className="text-xl lg:text-3xl font-semibold">
                {dataDetail.title}
              </h2>
              <ul className="flex items-center gap-1 mt-4">
                <li>
                  <img
                    className="size-[16px]"
                    src="./images/ico_star_active.png"
                    alt=""
                  />
                </li>
                <li>
                  <img
                    className="size-[16px]"
                    src="./images/ico_star_active.png"
                    alt=""
                  />
                </li>
                <li>
                  <img
                    className="size-[16px]"
                    src="./images/ico_star_active.png"
                    alt=""
                  />
                </li>
                <li>
                  <img
                    className="size-[16px]"
                    src="./images/ico_star_active.png"
                    alt=""
                  />
                </li>
                <li>
                  <img
                    className="size-[16px]"
                    src="./images/ico_star_gray.png"
                    alt=""
                  />
                </li>
              </ul>

              <p className="mt-3 text-xl font-semibold">${dataDetail.price}</p>

              <div className="mt-2 pt-2 border-t border-gray">
                <p className="flex items-center gap-2 mt-2">
                  <img
                    className="w-5 block animate-flicker"
                    src={ico_eye}
                    alt=""
                  />
                  <span className="font-medium text-sm">
                    35 people are viewing this right now
                  </span>
                </p>
                <p className="flex items-center gap-2 mt-4">
                  <img
                    className="w-5 block animate-zoomInOut"
                    src={ico_fire}
                    alt=""
                  />
                  <span className="text-red-600 font-medium text-sm">
                    35 sold in last 18 hours
                  </span>
                </p>
                <p className="flex items-center gap-2 mt-6">
                  <img className="w-5 block" src={ico_checked} alt="" />
                  <span className="text-green font-medium text-sm">
                    In stock
                  </span>
                </p>

                <p className="mt-5 text-midGray">{dataDetail.description}</p>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex items-center w-max relative cursor-pointer">
                    <button
                      onClick={() => setQuantity(quantity - 1)}
                      type="button"
                      disabled={quantity === 1}
                      className="text-lg block text-[0px] absolute left-4 cursor-pointer"
                    >
                      <span className="text-2xl leading-[24px] cursor-pointer">
                        -
                      </span>
                    </button>
                    <input
                      type="text"
                      className="w-[120px] h-[50px] border px-10 border-gray rounded-full text-center"
                      value={quantity}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      type="button"
                      className="text-lg block text-[0px] absolute right-4 cursor-pointer"
                    >
                      <span className="text-2xl leading-[24px] cursor-pointer">
                        +
                      </span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleAddToCart(dataDetail)}
                    type="button"
                    className="h-[50px] bg-black text-white font-semibold text-sm px-4 flex-1 rounded-full hover:bg hover:bg-white border hover:border-black hover:text-black transition-all"
                  >
                    Add To Cart
                  </button>
                  <button
                    type="button"
                    className="p-4 bg-white border border-[#e6e6e6] rounded-full"
                  >
                    <img className="w-4" src={ico_heart} alt="" />
                  </button>
                </div>

                <ul className="flex items-center gap-4 mt-6">
                  <li>
                    <button
                      type="button"
                      className="flex items-center gap-4 text-sm font-medium"
                    >
                      <img className="w-4" src={ico_reload} alt="" />
                      Compare
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex items-center gap-4 text-sm font-medium"
                    >
                      <img className="w-4" src={ico_question} alt="" />
                      Question
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex items-center gap-4 text-sm font-medium"
                    >
                      <img className="w-4" src={ico_shipping} alt="" />
                      Shipping info
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="flex items-center gap-4 text-sm font-medium"
                    >
                      <img className="w-4" src={ico_share} alt="" />
                      Share
                    </button>
                  </li>
                </ul>

                <div className="flex items-center mt-6 mb-6 pt-6 pb-6 border-t border-b border-b-gray border-t-gray">
                  <div>
                    <img className="block w-9" src={ico_shipping2} alt="" />
                  </div>
                  <p className="flex-1 ml-4 pl-4 border-l border-l-[#d9d9d9] text-sm">
                    Order in the next 22 hours 45 minutes to get it between{" "}
                    <br />
                    <span className="font-semibold underline">
                      Tuesday, Oct 22{" "}
                    </span>{" "}
                    <span className="mx-2">and</span>
                    <span className="font-semibold underline">
                      {" "}
                      Saturday, Oct 26
                    </span>
                  </p>
                </div>

                <div className="p-[15px] rounded-xl border border-[#dedede] flex items-start gap-3">
                  <div>
                    <img src={ico_check} className="w-6 block" alt="" />
                  </div>
                  <div className="text-sm">
                    <p className="text-lightGray">
                      Pickup available at{" "}
                      <span className="font-semibold text-black">
                        {" "}
                        Akaze store
                      </span>
                    </p>
                    <p className="text-xs text-lightGray mt-1">
                      Usually ready in 24 hours
                    </p>
                    <button type="button" className="underline text-xs mt-4">
                      View store information
                    </button>
                  </div>
                </div>

                <div className="text-center mt-6 p-6 bg-[#f6f6f6] rounded-lg">
                  <p className="text-sm tracking-widest">Guaranteed Checkout</p>
                  <img className="block mt-3" src={img_payment} alt="" />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24 mb-32">
            <h2 className="text-center text-xl lg:text-3xl font-semibold">
              Sản phẩm liên quan
            </h2>
            <ul className="mt-6 grid gap-4 grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {products.map((item) => (
                <BoxProduct key={item.id} item={item} />
              ))}
            </ul>
          </div>
        </div>
      ) : (
        ""
      )}
      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default DetailProduct;
