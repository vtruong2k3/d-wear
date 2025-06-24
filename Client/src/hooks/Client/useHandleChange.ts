import { useState } from "react";

const useHandleChange = (initialState) => {
  const [formData, setFormData] = useState(initialState);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  return {
    formData,
    handleChange,
  };
};
export default useHandleChange;
