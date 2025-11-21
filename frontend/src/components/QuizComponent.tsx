import { PrimaryButton } from "@fluentui/react";
import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Quiz } from "../models/Quiz";
import redirects from "../resources/redirects.json";
import settings from "../resources/settings.json";
import { getCookie } from "../resources/Utilities";
import "../styles/QuizStyle.css";
import constants from "../resources/constants.json";

export const QuizComponent: FC<{
  props: Quiz;
  onDelete: Function;
}> = ({ props, onDelete }) => {
  const navigate = useNavigate();

  const [playButton, setPlayButton] = useState<string>("");
  const [method, setMethod] = useState<string>("");

  useEffect(() => {
    fetch(settings.BaseUrl + settings.Room + "rooms/" + props.id, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "text/plain",
        token: `${getCookie(settings.token)}`,
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (response.status === 204) {
          setPlayButton(constants.QuizPlay);
          setMethod("POST");
        }
        else if (response.status === 200) {
          setPlayButton(constants.QuizReconnect);
          setMethod("GET");
        }
      })
  }, []);

  function fetchRoom(method: string) {
    let url = (method === "GET") ? "/rooms/" : "/";
    fetch(settings.BaseUrl + "Room" + url + props.id, {
      method: method,
      mode: "cors",
      headers: {
        Accept: "text/plain",
        token: `${getCookie(settings.token)}`,
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then(response => response.json())
      .then((response) => {
        navigate(redirects.HostPage + "/" + response.id);
      }
      )
  }
  return (
    <div className="quiz">
      <div className="quizDetails">
        <div className="quizComponentDetails">
          {constants.QuizTitle} {props.title}
        </div>
        <div className="quizComponentDetails" hidden={!props.description?.trim()}>
          {constants.QuizDescription} {props.description}
        </div>
        <div className="quizComponentDetails">
          {constants.QuizQuestion} {getNumberOfQuestions()}
        </div>
        <div className="quizComponentDetails">
          {constants.QuizNumberOfPlays} {props.numberOfPlays}
        </div>
      </div>
      <div className="quizbuttons">
        <PrimaryButton
          className="play-button quizActionButton"
          onClick={() => {
            fetchRoom(method);
            if (playButton === constants.QuizPlay) {
              localStorage.setItem("index", "0");
            }
          }}
        >
          {(() => {
            if (playButton === constants.QuizPlay) {
              return (<div>{constants.QuizPlay}</div>)
            }
            else if (playButton === constants.QuizReconnect) {
              return (<div>{constants.QuizReconnect}</div>)
            }
          })()}
        </PrimaryButton>
        <PrimaryButton
          className="button-edit quizActionButton"
          onClick={() => navigate(redirects.QuizPage + "/" + props.id)}
          disabled={
            props.readOnly === true
          }
        >
          {constants.QuizEdit}
        </PrimaryButton>
        <PrimaryButton
          className="button-delete quizActionButton"
          onClick={() => {
            return onDelete();
          }}
          disabled={
            props.readOnly === true
          }
        >
          {constants.QuizDelete}
        </PrimaryButton>
      </div>
    </div>
  );

  function getNumberOfQuestions(): number {
    if (props.questions) {
      return props.questions?.length;
    } else {
      return 0;
    }
  }
};
