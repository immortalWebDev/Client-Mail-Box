import { setMailsLoading } from "../store/mailSlice";
import { useDispatch } from "react-redux";
import { useCallback, useEffect } from "react";
import { showNotification } from "../store/authSlice";
import axios from "axios";

const useFetch = () => {
  const dispatch = useDispatch();
  const fetchData = useCallback(
    async (urls, method, data = null, onSuccess) => {
      if (Array.isArray(urls)) {
        dispatch(setMailsLoading(true));
      }

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
        if (!error.response) {
          dispatch(
            showNotification({
              message:
                "Retrying to connect...You'll be notified when reconnected",
              variant: "danger",
            })
          );
        } else {
          const { data } = error.response;
          console.log(data.error.message);
        }
      } finally {
        if (Array.isArray(urls)) {
          dispatch(setMailsLoading(false));
        }
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const handleOnline = () => {
      dispatch(
        showNotification({ message: "Back online again!", variant: "success" })
      );
    };

    const handleOffline = () => {
      dispatch(
        showNotification({ message: "You are offline!", variant: "danger" })
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  return { fetchData };
};

export default useFetch;
