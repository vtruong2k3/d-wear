import axios from "axios";

export const fetchUpdateUserProfile = async (formData: FormData) => {
  const res = await axios.put("/api/users/profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
