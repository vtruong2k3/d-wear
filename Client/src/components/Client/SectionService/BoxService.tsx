
interface Item {
  title: string;
  url: string;
}
const BoxService = ({ data }: { data: Item }) => {

  return (
    <li className="flex items-center lg:justify-center lg:flex-1 gap-[15px]">
      <img src={data.url} alt="" />
      <span className="text-sm lg:text-base font-semibold">{data.title}</span>
    </li>
  );
};

export default BoxService;
