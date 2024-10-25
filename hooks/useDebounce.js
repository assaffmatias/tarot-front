import { useEffect, useState } from "react";

const useDebounce = (value = "", time = 1000) => {
  const [state, setState] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setState(value);
    }, time);

    return () => {
      clearTimeout(handler);
    };
  }, [value, time]);

  return state;
};

export default useDebounce;
