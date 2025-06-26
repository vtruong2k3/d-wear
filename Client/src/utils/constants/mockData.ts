import ico_freeship from "../../assets/images/ico_freeship.svg";
import ico_quality from "../../assets/images/ico_quality.svg";
import ico_return from "../../assets/images/ico_return.svg";
import ico_support from "../../assets/images/ico_support.svg";

import img_collection from "../../assets/images/img_collection.jpg";
import img_collection1 from "../../assets/images/img_collection2.png";
import img_collection2 from "../../assets/images/img_collection3.png";

// Kiểu dữ liệu cho từng service
export type ServiceItem = {
  url: string;
  title: string;
};

// Mảng dịch vụ
export const dataSectionService: ServiceItem[] = [
  {
    url: ico_freeship,
    title: "Free Shipping Over $50",
  },
  {
    url: ico_quality,
    title: "Quality Assurance",
  },
  {
    url: ico_return,
    title: "Return within 14 days",
  },
  {
    url: ico_support,
    title: "Support 24/7",
  },
];

// Mảng ảnh đại diện (avatar)
export const avatarFake: string[] = [
  img_collection,
  img_collection1,
  img_collection2,
  img_collection1,
  img_collection2,
  img_collection1,
  img_collection2,
  img_collection1,
];
