import axios from "axios";
import type { IVariants } from "../../types/IVariants";

export const getAllVariants = async (): Promise<IVariants[]> => {
  const res = await axios.get(`/api/variant`);
  const variants = Array.isArray(res.data?.variants) ? res.data.variants : [];

  return variants.map((v: IVariants) => ({
    ...v,
    id: v._id,
    image: Array.isArray(v.image)
      ? v.image.map((img: string) =>
          img.startsWith("http")
            ? img
            : `http://localhost:5000/${img.replace(/\\/g, "/")}`
        )
      : [],
  }));
};
// variantServices.ts
// export const createVariant = async (
//   data: VariantFormValues,
//   imageFiles: File[]
// ) => {
//   const formData = new FormData();

//   Object.entries(data).forEach(([key, value]) => {
//     formData.append(key, value.toString());
//   });

//   imageFiles.forEach((file) => {
//     formData.append("imageVariant", file);
//   });

//   // ✅ In thử xem có file trong FormData chưa
//   for (const pair of formData.entries()) {
//     console.log(pair[0], pair[1]);
//   }

//   const res = await axios.post("/api/variant", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });
//   return res.data;
// };

// // Cập nhật biến thể
// export const updateVariant = async (
//   id: string | number,
//   data: VariantFormValues,
//   imageFiles: File[]
// ) => {
//   const formData = new FormData();

//   Object.entries(data).forEach(([key, value]) => {
//     if (value !== undefined && value !== null) {
//       formData.append(key, String(value));
//     }
//   });

//   (imageFiles || []).forEach((file) => {
//     formData.append("imageVariant", file);
//   });

//   const res = await axios.put(`/api/variant/${id}`, formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   });

//   return res.data;
// };

// Xoá biến thể
export const deleteVariant = async (id: string | number) => {
  const res = await axios.delete(`/api/variant/${id}`);
  return res.data;
};
