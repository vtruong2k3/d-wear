

import BoxService from "./BoxService";

import { dataSectionService } from "../../../utils/constants/mockData";
const SectionService = () => {

  return (
    <div>
      <section className="bg-gray">
        <div className="container">
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-5 items-center py-14">
            {dataSectionService.map((item: any) => (
              <BoxService key={item.title} data={item} />
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default SectionService;
