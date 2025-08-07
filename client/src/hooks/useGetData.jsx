import { useState, useEffect } from "react";
import axios from "axios";
const backendHost = process.env.REACT_APP_BACKENDHOST;
export function useGetDataHook({
  url,
  defaultValue = null,
  method = "GET",
  body = {},
  headers = {},
  callback = null,}) {

  const [data, setData] = useState(defaultValue);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = {
          method: method.toUpperCase(),
          url:backendHost+url,
          headers: {
            "Content-Type": "application/json",
            ...headers, // optional headers
          },
        };

        if (config.method === "POST") {
          config.data = body;
        }

        const response = await axios(config);

        if (callback) callback(response.data, data, setData);
        else setData(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err);
      }
    };

    fetchData();
  }, [url, method, JSON.stringify(body), JSON.stringify(headers)]); // rerun if inputs change

  return { data, error };
}
