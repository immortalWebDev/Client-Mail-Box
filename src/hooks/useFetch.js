import axios from "axios";

const useFetch = () => {
  const fetchData = async (urls, method, data = null, onSuccess) => {
    try {
      let responses;
      if (Array.isArray(urls)) {
        const requests = urls.map((url) =>
          axios({
            method: method,
            url: url,
            data: data ? data : null,
          })
        );

        responses = await Promise.all(requests);
      } else if (typeof urls === "string") {
        const response = await axios({
          method: method,
          url: urls,
          data: data,
        });
        responses = response;
      }

      if (onSuccess) {
        onSuccess(responses);
      }
    } catch (error) {
      const { data } = error.response;
      console.log(data.error.message);
    }
  };

  return { fetchData };
};

export default useFetch;
