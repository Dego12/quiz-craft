import { PrimaryButton } from "@fluentui/react";
import { FC } from "react";
import { Question } from "../models/Question";
import "../styles/QuestionStyle.css";
import constants from "../resources/constants.json";

export const QuestionComponent: FC<{
  props: Question;
  onDelete: Function;
  onEdit?: Function;
}> = ({ props, onDelete, onEdit }) => {

  return (
    <div className="question">
      <div className="start-animation">
        <div className="questionDetails">
          {constants.QuestionText} {props.text}
        </div>
        <div className="details">{constants.QuestionAnswers}</div>

        {props.answers?.map((answer) => {
          if (answer.isCorrect === true)
            return <li id="correctAnswer">{answer.text}</li>;
          else return <li id="wrongAnswer">{answer.text}</li>;
        })}

        <div id="timer">
          {constants.QuestionTimer} {props.timer} {constants.TimeUnit}
        </div>
      </div>
      <div className="questionbuttons">
        <div className="end-animation buttonsFadeInAndOut">
          <PrimaryButton
            className="question-button-warning button"
            onClick={() => onEdit!()}
          >
            {constants.QuizEdit}
          </PrimaryButton>
          <PrimaryButton
            className="question-button-danger button"
            onClick={() => {
              onDelete();
            }}
          >
            {constants.QuizDelete}
          </PrimaryButton>
        </div>
      </div>
    </div>
    
  );
};
