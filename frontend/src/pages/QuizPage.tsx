import {
  DefaultButton,
  removeIndex,
  ScrollablePane,
  TextField,
} from "@fluentui/react";
import "../styles/CreateQuizPageStyle.css";
import { PrimaryButton } from "@fluentui/react";
import React, { FC, useEffect, useState } from "react";
import { QuestionComponent } from "../components/QuestionComponent";
import { QuestionModal } from "../components/QuestionModal";
import { Question } from "../models/Question";
import redirects from "../resources/redirects.json";
import { useNavigate, useParams } from "react-router-dom";
import settings from "../resources/settings.json";
import { getCookie } from "../resources/Utilities";
import { Quiz } from "../models/Quiz";
import { ScrollablePaneComponent } from "../components/ScrollablePaneComponent";
import { toast } from "react-toastify";
import AreYouSure from "../components/AreYouSure";
import constants from "../resources/constants.json";

export const QuizPage: FC = () => {
  const quizId = useParams()[redirects.QuizIdParam];
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalVisibleCloseButton, setModalVisibleCloseButton] = useState(false);
  const [modalVisibleDeleteQuestion, setModalVisibleDeleteQuestion] = useState(false);
  const [lastQuestionSelected, setLastQuestionSelected] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>();
  //const Toggle = () => setIsModalOpen(!isModalOpen);
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [readOnly, setReadOnly] = useState<boolean>();
  const [numberOfPlays, setNumberOfPlays] = useState<number>();
  const [authoried, setAuthorized] = useState<boolean>(true);

  const handleInputChange = (e: any) => {
    const { id, value } = e.target;
    if (id === "name") setName(value);
    if (id === "description") setDescription(value);
  };

  useEffect(() => {
    if (quizId !== undefined) {
      const data = async () => {
        await fetch(settings.BaseUrl + settings.Quiz + quizId, {
          method: "GET",
          mode: "cors",
          headers: {
            Accept: "text/plain",
            token: `${getCookie(settings.token)}`,
            "Content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        })
          .then(async (response) => {
            if (
              response.status === 403 ||
              response.status === 404 ||
              response.status === 400
            ) {
              throw new Error(response.statusText);
            } else {
              return await response.json();
            }
          })
          .then((response: Quiz) => {
            setName(response.title);
            setNumberOfPlays(response.numberOfPlays);
            setDescription(response.description);
            if (response.questions) {
              setQuestions(response.questions);
            }
          })
          .catch(async (response: Response) => {
            if (!response.ok) {
              navigate(redirects.MainPage);
            }
          });
      };

      data();
    }
  }, []);

  let quiz: Quiz = {
    id: quizId!,
    title: name!,
    description: description!,
    questions: questions,
    numberOfPlays: numberOfPlays!,
    readOnly: readOnly!,
  };

  const deleteQuestion = (index: number) => () => {
    setQuestions((questions) => questions.filter((_, i) => i !== index));
  };

  const editQuestion = (index: number) => () => {
    setSelectedQuestion(questions[index]);
    setIsModalOpen(true);
  };

  const handleClick = () => {
    fetch(settings.BaseUrl + settings.Quiz, {
      method: quizId === undefined ? "POST" : "PUT",
      mode: "cors",
      headers: {
        Accept: "text/plain",
        token: `${getCookie(settings.token)}`,
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(quiz),
    }).then(async (response) => {
      if (response.status === 409) {
        toast.error(constants.UpdateFailed, {
          autoClose: 1500
        });
      } else {
        toast.success(constants.ToastSavedMessage, {
          autoClose: 1500
        });
      }
      navigate(redirects.MainPage);
    })
      .catch(async (response) => {
        if (response === 403) {
          setAuthorized(false);
          navigate(redirects.Login);
        }
      });

  };

  const questionAreas = questions.map((question, i) => {
    return (
      <div className="questionItem" key={i}>
        <QuestionComponent
          props={question}
          onDelete={() => {
            setModalVisibleDeleteQuestion(true)
            setLastQuestionSelected(i)
          }
          }
          onEdit={editQuestion(i)}
        />
      </div>
    );
  });

  return (
    <div id="content">
      {modalVisibleCloseButton === true && (
        <AreYouSure
          text={constants.AreYouSureCloseQuiz}
          isModalVisible={setModalVisibleCloseButton}
          onOkClick={() => navigate(redirects.MainPage)}
        />
      )}
      {modalVisibleDeleteQuestion === true && (
        <AreYouSure
          text={constants.AreYouSureDeleteQuestion}
          isModalVisible={setModalVisibleDeleteQuestion}
          onOkClick={deleteQuestion(lastQuestionSelected)}
        />
      )}
      {isModalOpen && (
        <QuestionModal
          props={questions}
          setModalOpen={setIsModalOpen}
          setQuestion={setQuestions}
          question={selectedQuestion}
        />
      )}
      <div className="wrapperCloseQuiz">
      </div>
      <div className="createQuizTitle">
        <h1>
          {quizId === undefined ? constants.CreateQuiz : constants.EditQuiz}
        </h1>
      </div>
      <div className="createQuiz">
        <div className="textFields">
          <TextField
            id="name"
            placeholder={constants.Name}
            onChange={(e) => handleInputChange(e)}
            value={name}
            required
          />
          <br />
          <TextField
            id="description"
            placeholder={constants.Description}
            onChange={(e) => handleInputChange(e)}
            value={description}
            multiline rows={3}
          />
        </div>
        <div className="parentWrapper">
          <div className="sticky">
            <PrimaryButton
              className="addButton"
              onClick={() => {
                setSelectedQuestion(null);
                setIsModalOpen(true);
                //Toggle();
              }}
            >
              {constants.AddQuestion}
            </PrimaryButton>
          </div>
        </div>
        <div className="questionPane">
        <ScrollablePaneComponent props={questionAreas} height="100%" />
        </div>
        <div className="actionButtons">
          <PrimaryButton className="actionButton"
            onClick={() => handleClick()}
            disabled={!name?.trim() || questions.length === 0}
          >
            {constants.Save}
          </PrimaryButton>
          <PrimaryButton className="actionButton"
            onClick={() => {
              setModalVisibleCloseButton(true);
            }}
          >
            {constants.CloseQuiz}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
