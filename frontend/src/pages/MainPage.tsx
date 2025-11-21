import { PrimaryButton } from "@fluentui/react";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AreYouSure from "../components/AreYouSure";
import { QuizComponent } from "../components/QuizComponent";
import { ScrollablePaneComponent } from "../components/ScrollablePaneComponent";
import { useGetQuizzes } from "../hooks/useGetQuizzes";
import redirects from "../resources/redirects.json";
import settings from "../resources/settings.json";
import { deleteAllCookies, getCookie } from "../resources/Utilities";
import constants from "../resources/constants.json";

export const MainPage: FC = () => {
  const navigate = useNavigate();
  const { quizzes, setShouldUpdateQuizzes, authorized, fetched } =
    useGetQuizzes();

  const [modalVisible, setModalVisible] = useState(false);
  const [lastQuizSelected, setLastQuizSelected] = useState("");

  const deleteQuiz = async (id: string) => {
    let quizIndex: number = quizzes.findIndex((q) => q.id === id);
    await fetch(`${settings.BaseUrl + settings.Quiz + id}`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        token: `${getCookie(settings.token)}`,
      },
    }).then(async (response) => {
      if (response.status == 409) {
        toast.error(constants.DeleteFailed, {
          autoClose: 1500
        })
      } else {
        toast.success(constants.ToastDeletedMessage, {
          autoClose: 1500
        });
      }
    }

    );
    if (quizIndex !== -1) {
      setShouldUpdateQuizzes(true);
    }
  };

  if (authorized === false) {
    navigate(redirects.Login);
  }

  const quizAreas = quizzes.map((quiz, i) => {
    return (
      <div className="item" key={i}>
        <QuizComponent
          props={quiz}
          onDelete={() => {
            setModalVisible(true);
            setLastQuizSelected(quiz.id);
          }}
        />
      </div>
    );
  });

  return (
    <div id="content">
      {modalVisible === true && (
        <AreYouSure
          text={constants.AreYouSureDeleteQuiz}
          isModalVisible={setModalVisible}
          onOkClick={() => deleteQuiz(lastQuizSelected)}
        />
      )}
      <div className="mainPageButtons">
        <PrimaryButton className="logoutButton"
          onClick={async () => {
            await fetch(settings.BaseUrl + settings.User + settings.Logout, {
              method: "PUT",
              mode: "cors",
              headers: {
                Accept: "text/plain",
                token: `${getCookie(settings.token)}`,
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
              },
            });
            deleteAllCookies();
            navigate(redirects.Login);
          }}
        >
          {constants.Logout}
        </PrimaryButton>
      </div>

      {(() => {
        if (fetched === false) {
          return <></>;
        }
        if (quizzes.length === 0) {
          return (
            <>
              <div>
                <h1 className="textCenter">{constants.NoQuiz}</h1>
                <div className="createQuizContainer">
                <PrimaryButton
                  id="createQuizButtonCenter"
                  onClick={() => {
                    navigate(redirects.QuizPage);
                  }}
                >
                  {constants.CreateQuiz}
                </PrimaryButton>
                </div>
              </div>
            </>
          );
        } else {
          return (
            <div className="mainPageContainer">
              <h1 className="mainPageTitle">{constants.AllQuizes}</h1>
              <div>
                <PrimaryButton
                  className="createQuizButton"
                  onClick={() => {
                    navigate(redirects.QuizPage);
                  }}
                >
                  {constants.CreateQuiz}
                </PrimaryButton>
              </div>
              <div className="pane">
                <ScrollablePaneComponent props={quizAreas} height="50vh" />
              </div>
            </div>
          );
        }
      })()}
    </div>
  );
};
