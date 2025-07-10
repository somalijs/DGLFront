import { useState } from 'react';
import useFetch from './useFetch';
import { message } from 'antd';

const useFetchData = () => {
  const { Fetch, isLoading, errorMessage } = useFetch();
  const [data, setData] = useState<[]>([]);

  const fetchData = async ({
    url,
    v = 1,
    alert = false,
  }: {
    url: string;
    v?: number;
    alert?: boolean;
  }) => {
    const res = await Fetch({
      url: url,
      v: v,
    });
    if (!res.ok) {
      if (alert) {
        message.error(res.message);
      }
      setData([]);
      return;
    }
    setData(res.data);
    return res.data;
  };

  return {
    fetchData,
    errorMessage,
    isLoading,
    data,
    setData,
  };
};

export default useFetchData;
