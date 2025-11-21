import { PrimaryButton } from "@fluentui/react";
import { FC, useCallback, useEffect, useState } from "react";
import { Answer } from "../models/Answer";
import { Guest } from "../models/Guest";
import { Question } from "../models/Question";
import settings from "../resources/settings.json";
import { getCookie } from "../resources/Utilities";
import { AnswerDTO } from "../models/AnswerDTO";
import "../styles/AnswerComponentStyle.css";
import constants from "../resources/constants.json";

export const AnswerComponent: FC<{
    question: Question;
    guest?: Guest;
    timer?: number;
    revealAnswer: boolean;
    shouldAppear: boolean;
    isHostView?: boolean;
}> = ({ question, guest, timer, revealAnswer, shouldAppear, isHostView }) => {

    const [shuffleNumber, setShuffleNumber] = useState<number>(0);
    const [chosenAnswerNumber, setChosenAnswerNumber] = useState<number>(0);
    const [selectTime, setSelectTime] = useState<number | undefined>(0);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        setShuffleNumber(Math.floor(Math.random() * settings.NumberOfQuestions));
        setChosenAnswerNumber(0);
        setSelectTime(0);
        setScore(0);
    }, [shouldAppear]);

    useEffect(() => {
        if (timer === question.timer) {
            submitAnswer();
        } 
    }, [timer])

    function renderAnswerButtons() {
        const final = [];

        for (let i : number = 1; i <= settings.NumberOfQuestions; i++) {
            final.push(
                <AnswerButton
                    answer={question.answers?.at((shuffleNumber + i) % settings.NumberOfQuestions)}
                    isSelected={chosenAnswerNumber == i}
                    revealAnswer={revealAnswer}
                    onSelected = {() => {selectAnswer(i)}}
                    isHostView={isHostView}
                />
            );
        }

        return final;
    }

    return (
        <div className="positionBox" style={{ opacity: shouldAppear ? 1 : 0 }} >
            <div className="infoText" style={{ display: (revealAnswer && !isHostView) ? "" : "none" }} >
                <span style={{ display: (revealAnswer && chosenAnswerNumber == 0) ? "" : "none" }} >
                    {constants.NoAnswerSelected}
                </span>
                <br></br>
                <span style={{ display: revealAnswer ? "" : "none" }}>
                    {constants.YourScoreIs} {score}
                </span>
            </div>
            <div className="answerBox">
                {(() => renderAnswerButtons())()}
            </div>
        </div>
    );

    function selectAnswer(answerNumber: number) {
        console.log(answerNumber)
        setChosenAnswerNumber(answerNumber);
        setSelectTime(timer);
    }

    function submitAnswer() {
        if (isHostView) return

        if (guest && chosenAnswerNumber !== 0 && selectTime !== undefined) {
            let answerChosen = question.answers?.at((shuffleNumber + chosenAnswerNumber) % 4);

            let guestAnswer: AnswerDTO = {
                "questionId": question.id,
                "answerId": answerChosen?.id,
                "time": selectTime
            }
            fetch(settings.BaseUrl + settings.Guest + guest.id, {
                method: "PUT",
                mode: "cors",
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(guestAnswer)
            })
                .then(response => response.json())
                .then(response => {
                    guest.score = response;
                    localStorage.removeItem(settings.Guest);
                    localStorage.setItem(settings.Guest, JSON.stringify(guest));
                    setScore(response);
                });
        }
    }
}

const AnswerButton: FC<{
    answer?: Answer,
    isSelected: boolean,
    revealAnswer?: boolean,
    onSelected?: any,
    isHostView?: boolean
}> = ({ answer, isSelected, revealAnswer, onSelected, isHostView }) => {

    useEffect(() => {

    }, [isSelected])

    return (
        <PrimaryButton className={`answerButton answerText ${getStyle()}`}
            onClick={onSelected}
            disabled={isSelected || revealAnswer || isHostView}
            text={answer?.text}
        >
        </PrimaryButton>
    );

    function getStyle(): string {
        if (isHostView) {
            if (revealAnswer) {
                if (answer?.isCorrect) {
                    return " answerButtonCorrect";
                } else {
                    return " answerButtonWrong";
                }
            } else {
                return " hostButton";
            }
        }

        let selectedAnswerClass: string = "answerButtonSelected";
        if (revealAnswer) {
            if (answer?.isCorrect) {
                if(isSelected)
                    return "answerButtonCorrect";
                else
                    return " answerButtonShowCorrect"
            } else {
                if (isSelected) {
                    return " answerButtonWrong";
                } else {
                    return " answerButtonNotAnswered";
                }
            }
        } else {
            if (isSelected) {
                return selectedAnswerClass;
            }
            return "";
        }
    }
}