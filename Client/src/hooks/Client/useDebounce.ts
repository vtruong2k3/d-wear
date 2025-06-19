import { useEffect, useState } from "react";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      // hủy thời gian chờ nếu giá trị thay đổi.
      // ngăn chặn việc cập nhật giá trị nếu giá trị thay đổi
      // trong khoảng thời gian delay thì thời gian chờ sẽ được xóa và khởi động lai
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
