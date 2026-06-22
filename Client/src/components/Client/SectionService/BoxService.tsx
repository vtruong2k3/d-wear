
interface Item {
  title: string;
  url: string;
}

const BoxService = ({
  data,
  isLast,
}: {
  data: Item;
  isLast?: boolean;
}) => {
  return (
    <li
      className={`flex items-center lg:justify-center gap-4 py-3 lg:py-0 group cursor-default ${
        !isLast ? "lg:border-r lg:border-gray-200" : ""
      }`}
    >
      <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110">
        <img src={data.url} alt="" className="w-6 h-6" />
      </div>
      <span className="text-sm lg:text-[15px] font-semibold text-gray-800">
        {data.title}
      </span>
    </li>
  );
};

export default BoxService;
