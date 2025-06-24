import { useEffect, useState } from "react";
import apiServiceCategory from "../../services/apiServiceCategory";

const useFetchGetDataAllCategory = () => {
  const [categories, setCategories] = useState([]);
  const fetchDataCategory = async () => {
    const res = await apiServiceCategory.getAllCategories();
    if (res.length > 0) {
      setCategories(res);
    }
  };
  useEffect(() => {
    fetchDataCategory();
  }, []);
  return {categories};
};
export default useFetchGetDataAllCategory;
