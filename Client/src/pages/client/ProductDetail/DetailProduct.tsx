import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Backdrop, CircularProgress, Grow } from "@mui/material";
import { toast } from "react-toastify";

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

import apiServiceProduct from "../../../services/apiServiceProduct";
import useAuth from "../../../hooks/Client/useAuth";
import { addToCart } from "../../../redux/features/client/cartSlice";
import BoxProduct from "../../../components/Client/BoxProduct/BoxProduct";
import type { IProducts } from "../../../types/IProducts";
import useFetchGetDataProduct from "../../../hooks/Client/useFetchGetDataProduct";

const DetailProduct = () => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { requireAuth } = useAuth();

  const [dataDetail, setDataDetail] = useState<IProducts | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const { products } = useFetchGetDataProduct(
    dataDetail ? dataDetail.category_id : null,
    dataDetail ? dataDetail.id : null
  );
  useEffect(() => {
    if (id) {
      divRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      const fetchDataDetailProduct = async () => {
        setIsLoading(true);
        try {
          const res = await apiServiceProduct.getDetailProduct(id);
          if (res.status === 200) {
            setDataDetail(res.data);
            setCategory(res.data.category);
          } else {
            setDataDetail(null);
          }
        } catch (err) {
          console.error("Error fetching product detail", err);
          setDataDetail(null);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDataDetailProduct();
    }
  }, [id]);

  const handleAddToCart = (item: any) => {
    requireAuth(() => {
      dispatch(addToCart({ ...item, quantity }));
      toast.success(`Đã thêm ${item.product_name} vào giỏ hàng`);
      navigate("/shopping-cart");
    });
  };

  return (
    <>
      {dataDetail ? (
        <div className="container" ref={divRef}>
          <ul className="flex gap-2 items-center py-4">
            <li>
              <a className="text-sm" href="/">
                Home /
              </a>
            </li>
            <li>
              <a className="text-sm" href="#none">
                {dataDetail.category_id} /
              </a>
            </li>
            <li>
              <a className="text-sm">{dataDetail.product_name}</a>
            </li>
          </ul>

          <div className="lg:grid grid-cols-5 gap-7 mt-4">
            <div className="col-span-3 flex gap-3">
              <ul className="flex flex-col gap-4">
                {dataDetail.imagesUrls?.length ? (
                  dataDetail.images.map((url) => (
                    <li
                      key={url}
                      className="w-[82px] p-[10px] rounded-md border cursor-pointer"
                    >
                      <img src={url} alt="" className="image" />
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-400">Không có hình ảnh</li>
                )}
              </ul>
              <div className="rounded-xl overflow-hidden">
                <Grow in={true} timeout={1000}>
                  <img src={dataDetail.thumbnail} className="image" alt="" />
                </Grow>
              </div>
            </div>

            <div className="col-span-2 mt-6">
              <h2 className="text-xl lg:text-3xl font-semibold">
                {dataDetail.title}
              </h2>
              <ul className="flex items-center gap-1 mt-4">
                {[...Array(4)].map((_, i) => (
                  <li key={i}>
                    <img
                      className="size-[16px]"
                      src="./images/ico_star_active.png"
                      alt=""
                    />
                  </li>
                ))}
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
                  <img className="w-5 animate-flicker" src={ico_eye} alt="" />
                  <span className="text-sm font-medium">
                    35 people are viewing this right now
                  </span>
                </p>
                <p className="flex items-center gap-2 mt-4">
                  <img
                    className="w-5 animate-zoomInOut"
                    src={ico_fire}
                    alt=""
                  />
                  <span className="text-sm font-medium text-red-600">
                    35 sold in last 18 hours
                  </span>
                </p>
                <p className="flex items-center gap-2 mt-6">
                  <img className="w-5" src={ico_checked} alt="" />
                  <span className="text-sm font-medium text-green">
                    In stock
                  </span>
                </p>
                <p className="mt-5 text-midGray">{dataDetail.description}</p>

                <div className="mt-6 flex gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="absolute left-4 text-2xl"
                    >
                      -
                    </button>
                    <input
                      readOnly
                      className="w-[120px] h-[50px] border rounded-full text-center px-10"
                      value={quantity}
                    />
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="absolute right-4 text-2xl"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleAddToCart(dataDetail)}
                    className="h-[50px] bg-black text-white rounded-full px-4 flex-1 hover:bg-white hover:text-black hover:border hover:border-black"
                  >
                    Add To Cart
                  </button>
                  <button className="p-4 bg-white border rounded-full">
                    <img className="w-4" src={ico_heart} alt="" />
                  </button>
                </div>

                {/* Các nút action nhỏ */}
                <ul className="flex gap-4 mt-6">
                  <li>
                    <button className="flex gap-2 text-sm">
                      <img className="w-4" src={ico_reload} alt="" />
                      Compare
                    </button>
                  </li>
                  <li>
                    <button className="flex gap-2 text-sm">
                      <img className="w-4" src={ico_question} alt="" />
                      Question
                    </button>
                  </li>
                  <li>
                    <button className="flex gap-2 text-sm">
                      <img className="w-4" src={ico_shipping} alt="" />
                      Shipping info
                    </button>
                  </li>
                  <li>
                    <button className="flex gap-2 text-sm">
                      <img className="w-4" src={ico_share} alt="" />
                      Share
                    </button>
                  </li>
                </ul>

                {/* Shipping + info */}
                <div className="flex mt-6 mb-6 pt-6 pb-6 border-t border-b">
                  <img className="w-9" src={ico_shipping2} alt="" />
                  <p className="ml-4 pl-4 border-l text-sm">
                    Order in the next 22 hours 45 minutes to get it between
                    <br />
                    <span className="font-semibold underline">
                      Tuesday, Oct 22
                    </span>
                    <span className="mx-2">and</span>
                    <span className="font-semibold underline">
                      Saturday, Oct 26
                    </span>
                  </p>
                </div>

                <div className="p-4 border rounded-xl flex gap-3">
                  <img src={ico_check} className="w-6" alt="" />
                  <div className="text-sm">
                    <p>
                      Pickup available at{" "}
                      <span className="font-semibold">Akaze store</span>
                    </p>
                    <p className="text-xs">Usually ready in 24 hours</p>
                    <button className="underline text-xs mt-1">
                      View store information
                    </button>
                  </div>
                </div>

                <div className="text-center mt-6 p-6 bg-[#f6f6f6] rounded-lg">
                  <p className="text-sm tracking-widest">Guaranteed Checkout</p>
                  <img className="mt-3" src={img_payment} alt="" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-24 mb-32">
            <h2 className="text-center text-xl lg:text-3xl font-semibold">
              Sản phẩm liên quan
            </h2>
            <ul className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              {products.length ? (
                products.map((item) => <BoxProduct key={item.id} item={item} />)
              ) : (
                <li className="col-span-full text-center text-gray-400">
                  Không có sản phẩm liên quan
                </li>
              )}
            </ul>
          </div>
        </div>
      ) : (
        !isLoading && (
          <div className="container text-center py-10 text-gray-500">
            Không tìm thấy sản phẩm
          </div>
        )
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default DetailProduct;
