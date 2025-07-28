import React from "react";
import BoxService from "./BoxService";
import { dataSectionService } from "../../../utils/constants/mockData";

// Không import Item từ antd nếu bạn đã tự định nghĩa
interface Item {
  title: string;
  url: string;
}

const SectionService: React.FC = () => {
  return (
    <section className="bg-gray">
      <div className="container">
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-5 items-center py-14">
          {dataSectionService.map((item: Item) => (
            <BoxService key={item.title} data={item} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default SectionService;
