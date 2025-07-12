import React, { useEffect, useReducer, useState } from "react";
import useFetchGetDataAllCategory from "../../../hooks/Client/useFetchGetDataAllCategory";
import useFetchGetDataProduct from "../../../hooks/Client/useFetchGetDataProduct";
import BoxProduct from "../../../components/Client/BoxProduct/BoxProduct";
import { Pagination } from "@mui/material";
import BannerProductList from "./BannerProductList";
import {
  filterProductReducer,
  initialState,
  TYPE_ACTION,
} from "./Reducer/FilterProductReducer";
import useHandleChange from "../../../hooks/Client/useHandleChange";
import useDebounce from "../../../hooks/Client/useDebounce";
import { useSearchParams } from "react-router-dom";

// Định nghĩa interfaces
interface Category {
  id: string | number;
  name: string;
  slug: string;
}

interface Product {
  id: string | number;
  title: string;
  price: number;
  // Thêm các properties khác nếu cần
}

interface FilterState {
  limit: number;
  sortBy?: string;
  order?: string;
  q?: string;
  skip?: number;
}

const ListProduct = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useFetchGetDataAllCategory();
  const [category, setCategory] = useState("");
  const [filterProduct, dispatch] = useReducer(
    filterProductReducer,
    initialState
  );
  const { formData, handleChange } = useHandleChange({ valueSearch: "" });
  const { products, totalProduct } = useFetchGetDataProduct(
    category,
    filterProduct
  );
  const debouncedValue = useDebounce(formData.valueSearch, 500);

  // Sửa kiểu parameter cho handleChangeSort
  const handleChangeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value.split(",");
    console.log(value, "value");
    dispatch({
      type: TYPE_ACTION.CHANGE_SORT,
      payload: {
        sortBy: value[0],
        order: value[1],
      },
    });
  };

  // Sửa kiểu parameter cho handleChangePage
  const handleChangePage = (page: number) => {
    dispatch({
      type: TYPE_ACTION.CHANGE_PAGE,
      payload: (page - 1) * 12,
    });
  };

  useEffect(() => {
    if (debouncedValue) {
      dispatch({
        type: TYPE_ACTION.CHANGE_QUERY,
        payload: debouncedValue,
      });
    } else {
      dispatch({
        type: TYPE_ACTION.CHANGE_QUERY,
        payload: "",
      });
    }
  }, [debouncedValue]);

  useEffect(() => {
    if (filterProduct) {
      const stringJson = JSON.stringify({ ...filterProduct });
      const dataFilterJson = JSON.parse(stringJson);
      setSearchParams(new URLSearchParams(dataFilterJson));
    }
  }, [filterProduct]);

  useEffect(() => {
    // Sửa khai báo với kiểu FilterState
    let tmpDataFilter: FilterState = {
      limit: 12,
    };
    
    if (searchParams.size > 0) {
      const dataFromSearchParams = JSON.parse(
        '{"' +
          decodeURI(
            searchParams.toString().replace(/&/g, '","').replace(/=/g, '":"')
          ) +
          '"}'
      );

      tmpDataFilter = {
        limit: dataFromSearchParams["limit"] || 12,
        sortBy: dataFromSearchParams["sortBy"],
        order: dataFromSearchParams["order"],
        q: dataFromSearchParams["q"]?.replace(/\+/g, " "),
        skip: dataFromSearchParams["skip"],
      };
      dispatch({
        type: TYPE_ACTION.CHANGE_INITIAL,
        payload: { ...tmpDataFilter },
      });
    }
  }, []);

  const handleReset = () => {
    dispatch({
      type: TYPE_ACTION.CHANGE_RESET,
      payload: 12,
    });
  };

  return (
    <>
      <BannerProductList />
      <section className="pt-12 pb-12">
        <div className="container">
          <div className="lg:grid grid-cols-5">
            <div className="col-span-1 p-0 lg:p-4">
              <div className="">
                <h2 className="text-lg font-semibold">Category</h2>
                <ul className="mt-4 space-y-3">
                  <li>
                    <p
                      onClick={() => setCategory("")}
                      className={`${
                        category
                          ? "text-black font-medium "
                          : "text-blue-700 font-bold"
                      } cursor-pointer   text-sm hover:text-black transition-all`}
                    >
                      Tất cả
                    </p>
                  </li>
                  {categories.map((item: Category, index: number) => (
                    <li key={index}>
                      <p
                        onClick={() => setCategory(item.slug)}
                        className={`${
                          item.slug !== category
                            ? "text-black font-medium"
                            : "text-blue-700 font-bold"
                        } cursor-pointer text-sm hover:text-black transition-all`}
                      >
                        {item.name}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-5">
                <h2 className="text-lg font-semibold">Availability</h2>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href="#none"
                      className="font-medium text-black text-sm hover:text-black transition-all"
                    >
                      In stock (16)
                    </a>
                  </li>
                  <li>
                    <a
                      href="#none"
                      className="font-medium text-lightGray text-sm hover:text-black transition-all"
                    >
                      Out of stock (1)
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-span-4 mt-6 lg:mt-0">
              {category ? (
                ""
              ) : (
                <div className="flex gap-4">
                  <div className="py-2 px-3 border rounded-full cursor-pointer w-max">
                    <select
                      onChange={handleChangeSort}
                      name=""
                      id=""
                      className="w-full text-sm outline-none"
                      value={`${filterProduct.sortBy},${filterProduct.order}`}
                    >
                      <option value="">Mặc định</option>
                      <option value="price,desc">Giảm dần theo giá</option>
                      <option value="price,asc">Tăng dần theo giá</option>
                      <option value="title,asc">A-Z</option>
                      <option value="title,desc">Z-A</option>
                    </select>
                  </div>
                  <input
                    placeholder="Search..."
                    className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    type="text"
                    onChange={handleChange}
                    name="valueSearch"
                    value={filterProduct.q}
                  ></input>
                  <button onClick={handleReset}>Reset</button>
                </div>
              )}

              <ul className="lg:grid grid-cols-3 gap-5 mt-9 space-y-3 lg:space-y-0">
                {products.length > 0 &&
                  products.map((item: Product) => (
                    <BoxProduct key={item.id} item={item} />
                  ))}
              </ul>
              {!category && (
                <div className="mt-10 flex justify-center">
                  <Pagination
                    onChange={(_, page: number) => handleChangePage(page)}
                    count={Math.ceil(totalProduct / 12)}
                    variant="outlined"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ListProduct;