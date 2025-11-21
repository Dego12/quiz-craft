import { ITextFieldStyles, Modal, PrimaryButton, TextField } from "@fluentui/react";
import { FC, useEffect, useState } from "react";
import constants from "../resources/constants.json";
import Combobox from "react-widgets/Combobox";
import { Question } from "../models/Question";
import { TimerValues } from "../resources/TimerValues";
import "../styles/QuestionModalStyle.css";

export const QuestionModal: FC<{
  props: Object[];
  setModalOpen: any;
  setQuestion: any;
  question?: any | null;
}> = ({ props, setModalOpen, setQuestion, question }) => {
  const [text, setText] = useState<string>();
  const [timer, setTimer] = useState<number | TimerValues>();
  const [timerErrorMessage, setTimerErrorMessage] = useState<string>('');
  const [firstAnswer, setFirstAnswer] = useState<string>();
  const [secondAnswer, setSecondAnswer] = useState<string>();
  const [thirdAnswer, setThirdAnswer] = useState<string>();
  const [fourthAnswer, setFourthAnswer] = useState<string>();

  const handleInput = (e: any) => {
    const { id, value } = e.target;
    if (id === "questionState") setText(value);
    if (id === "correctAnswer") setFirstAnswer(value);
    if (id === "answer2") setSecondAnswer(value);
    if (id === "answer3") setThirdAnswer(value);
    if (id === "answer4") setFourthAnswer(value);
  };

  useEffect(() => {
    const fillFieldsIfQuestion = () => {
      if (question === null || question === undefined) {
        return;
      }
      // target:HTMLTextAreaElement = {}
      // Object.entries(question).map(field => handleInput())
      setText(question.text);
      setFirstAnswer(question.answers![0].text);
      setSecondAnswer(question.answers![1].text);
      setThirdAnswer(question.answers![2].text);
      setFourthAnswer(question.answers![3].text);
      setTimer(question.timer);
    };
    fillFieldsIfQuestion();
  }, []);

  function addQuestion() {
    let question = {
      text: text!,
      timer: parseInt(timer?.toString()!),
      answers: [
        {
          text: firstAnswer!,
          isCorrect: true,
        },
        {
          text: secondAnswer,
          isCorrect: false,
        },
        {
          text: thirdAnswer,
          isCorrect: false,
        },
        {
          text: fourthAnswer,
          isCorrect: false,
        },
      ],
    };
    props.push(question);
  }

  function updateQuestion() {
    if (question !== null) {
      question.text = text;
      question.answers = [
        { isCorrect: true, text: firstAnswer },
        { isCorrect: false, text: secondAnswer },
        { isCorrect: false, text: thirdAnswer },
        { isCorrect: false, text: fourthAnswer },
      ];
      question.timer = timer;
    }
  }

  return (
    <div>
      <Modal
        containerClassName="questionModal"
        isOpen={true}
        onDismiss={() => setModalOpen(false)}
        isBlocking={false}
      >
        <br />
        <div className="questionModalTitle">
          {question === null
          ? constants.QuestionModalAdd
          : constants.QuestionModalEdit}
        </div>
        
        <div className="questionFields">
          <TextField
            id="questionState"
            placeholder={constants.QuestionTextField}
            onChange={(e) => handleInput(e)}
            value={text}
            required
            styles={textFieldStyles}
          ></TextField>
          <Combobox
            id="comboTimer"
            placeholder={constants.EnterTimer}
            value={timer?.toString()}
            onChange={(e) => {
              let time = Number(e!.split(" ")[0]);
              if (Number(time) < 10) {
                setTimerErrorMessage(constants.Below10sError);
                setTimer(time);
              }
              else if (Number(time) > 120) {
                setTimerErrorMessage(constants.Over120sError);
                setTimer(time);
              }
              else if (!Number.isInteger(Number(time))) {
                setTimerErrorMessage(constants.WordError);
                setTimer(0);
              }
              else {
                setTimerErrorMessage('');
                setTimer(time);
              }
            }}
            hideEmptyPopup
            data={[TimerValues["10s"], TimerValues["20s"], TimerValues["30s"], TimerValues["45s"], TimerValues["60s"], TimerValues["120s"]]}
          />
          <div className="error">{timerErrorMessage}</div>
          <div className="modalTextFields" style={{ marginBottom: "-5px" }}>
            <br />
            {question === null
              ? constants.AddAnswers
              : constants.QuestionModalAnswersEdit}
            <TextField
              className="mb-5"
              id="correctAnswer"
              placeholder={constants.CorrectAnswerField}
              onChange={(e) => handleInput(e)}
              value={firstAnswer}
              required
              styles={textFieldStyles}
            />
            <TextField
              id="answer2"
              className="mb-5"
              placeholder={constants.Answer2Field}
              onChange={(e) => handleInput(e)}
              value={secondAnswer}
              required
              styles={textFieldStyles}

            />
            <TextField
              id="answer3"
              className="mb-5"
              placeholder={constants.Answer3Field}
              onChange={(e) => handleInput(e)}
              value={thirdAnswer}
              required
              styles={textFieldStyles}

            />
            <TextField
              id="answer4"
              placeholder={constants.Answer4Field}
              onChange={(e) => handleInput(e)}
              value={fourthAnswer}
              required
              styles={textFieldStyles}

            />
          </div>
        </div>
        <div>
          <PrimaryButton
            className="button start-button"
            onClick={() => {
              setModalOpen(false);
              if (question === undefined || question === null) {
                addQuestion();
              } else {
                updateQuestion();
              }
              setQuestion(props);
            }}
            style={{ fontSize: "20px" }}
            disabled={
              !text?.trim() ||
              !timer?.toString().trim() ||
              Number(timer) < 10 ||
              Number(timer) > 120 ||
              !Number.isInteger(Number(timer)) ||
              !firstAnswer?.trim() ||
              !secondAnswer?.trim() ||
              !thirdAnswer?.trim() ||
              !fourthAnswer?.trim()
            }
          >
            {constants.AddButton}
          </PrimaryButton>
          <PrimaryButton
            className="button-danger button"
            onClick={() => {
              setModalOpen(false);
            }}
            style={{ fontSize: "20px" }}
          >
            {constants.CancelButton}
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
};

const textFieldStyles: Partial<ITextFieldStyles> = {
  root: {
    width: "100.3%",
    borderRadius: "15px",
  },
  field: {
    marginLeft: "8px",
    color: "black",
    fontSize: "17px",
  },
  fieldGroup: {
    backgroundColor: "#fff",
    height: "36px",
    borderRadius: "5px",
  }
};