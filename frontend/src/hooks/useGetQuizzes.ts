import { useCallback, useEffect, useState } from "react";
import { Quiz } from "../models/Quiz";
import settings from "../resources/settings.json";
import { getCookie } from "../resources/Utilities";
export const useGetQuizzes = () => {
  const [shouldUpdateQuizzes, setShouldUpdateQuizzes] = useState<boolean>(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [fetched, setFetched] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(true);

  useEffect(() => {
    if (shouldUpdateQuizzes === false) {
      return;
    }

    const data = async () => {
      await fetch(`${settings.BaseUrl + settings.Quiz}`, {
        headers: {
          token: `${getCookie(settings.token)}`,
        },
        method: "GET",
      })
        .then(async (response) => {
          if (response.status === 403 || response.status === 401) {
            throw new Error(response.statusText);
          }
          return await response.json();
        })
        .then(async (response: Quiz[]) => {
          setFetched(true);
          setQuizzes(response);
        })

        .catch(async (response: Response) => {
          if (!response.ok) {
            setAuthorized(false);
          }
        });
    };

    data();
    setShouldUpdateQuizzes(false);
  }, [shouldUpdateQuizzes]);

  return { quizzes, setShouldUpdateQuizzes, authorized, fetched };
};
