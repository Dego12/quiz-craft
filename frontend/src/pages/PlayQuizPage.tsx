import { PrimaryButton } from "@fluentui/react";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Id, toast } from "react-toastify";
import { AnswerComponent } from "../components/AnswerComponent";
import { LeaderboardComponent } from "../components/LeaderboardComponent";
import { QuestionTextComponent } from "../components/QuestionTextComponent";
import { ScrollablePaneComponent } from "../components/ScrollablePaneComponent";
import { StartQuizTimer } from "../components/StartQuizTimer";
import { TimerComponent } from "../components/TimerComponent";
import { Guest } from "../models/Guest";
import { Question } from "../models/Question";
import { Room } from "../models/Room";
import { PlayingRoomState } from "../resources/PlayingRoomState";
import redirects from "../resources/redirects.json";
import { RoomState } from "../resources/RoomState";
import settings from "../resources/settings.json";
import "../styles/HostStyle.css";
import "../styles/PlayQuizStyle.css";
import "../styles/TimerComponentStyle.css";
import constants from "../resources/constants.json";

export const PlayQuizPage: FC = () => {

  const navigate = useNavigate();
  const [roomConnection, setRoomConnection] = useState<signalR.HubConnection>(new HubConnectionBuilder()
    .withUrl(settings.SignalRConnection)
    .withAutomaticReconnect()
    .build());
  const [guest, setGuest] = useState<Guest>();
  const [question, setQuestion] = useState<Question | undefined>();
  const [roomState, setRoomState] = useState<PlayingRoomState>(PlayingRoomState.Waiting);
  const [startQuestionTimer, setStartQuestionTimer] = useState<number>(0);
  const [shouldAnswersAppear, setShouldAnswersAppear] = useState<boolean>(false);
  const [reveal, setReveal] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const hostLeftToastId = useRef<Id>();
  const ErrorToastSent = useRef<boolean>(false);
  const roomId = useParams()[redirects.RoomIdParam];
  const [waitingMessage, setWaitingMessage] = useState<String>(constants.WaitingToStart);

  useEffect(() => {
    try {
      if (localStorage.getItem(settings.Guest) === null)
        throw new Error(constants.AccessDeniedError);
      setGuest(JSON.parse(localStorage.getItem(settings.Guest)!));
      const guest2: Guest = JSON.parse(localStorage.getItem(settings.Guest)!);

      fetch(settings.BaseUrl + settings.Guest + "rooms/" + roomId, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "text/plain",
          guestRoomId: guest2.roomId,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }).then(async (response) => {
        if (response.status === 404) {
          throw new Error(constants.AccessDeniedError);
        }
        else if (response.status === 400) {
          throw new Error(constants.RoomDoesntExist);
        }
        return await response.json();
      }
      ).then((data: Room) => {
        if (data.state === RoomState.Finished) {
          ErrorNotify(constants.AccessDeniedError);
          navigate(redirects.LandingPage);
        }
        else if(data.state === RoomState.Started){
          setWaitingMessage(constants.ReconnectWaitingToStart);
        }
      })
        .catch((e: Error) => {
          navigate(redirects.LandingPage);
          enterErrorNotify(e);
        })
    }
    catch (e: any) {
      navigate(redirects.LandingPage);
      enterErrorNotify(e);
    }
  }, [])

  roomConnection.onreconnecting(() => {
    if (ErrorToastSent.current === false) {
      ErrorNotify(constants.LostConnection, 0);
      ErrorToastSent.current = true;
    }
  })

  roomConnection.onreconnected(() => {
    toast.dismiss();
    ErrorToastSent.current = false;
    setRoomConnection(
      new HubConnectionBuilder()
        .withUrl(settings.SignalRConnection)
        .withAutomaticReconnect()
        .build());
  })

  const enterErrorNotify = (e: Error) => {
    toast((e.message),
      {
        position: "top-right",
        type: "error",
        autoClose: 1500,
        pauseOnHover: true,
        closeOnClick: true,
        closeButton: true,
      })
  }

  const quizEndedHostLeftNotify = () => {
    toast(constants.QuizEndHostLeaveMessage,
      {
        position: "top-right",
        autoClose: 3000,
        type: "error",
        closeOnClick: false,
      })
  }

  useEffect(() => {
    if (roomConnection !== undefined && guest !== undefined) {
      roomConnection.start()
        .then(async () => {
          try {
            console.log(roomConnection.connectionId);
            await roomConnection.invoke(settings.SignalRJoinRoom, guest!.roomId);
            await roomConnection.invoke(settings.SignalRSendGuestJoinedToRoom, guest!.roomId);
          }

          catch (e) {
            ErrorNotify(e as string);
          }

          roomConnection.on(settings.SignalRSendMessageToSpecificUser, (message: PlayingRoomState) => {
            setRoomState(message);
          })

          roomConnection.on(settings.SignalRSendMessageQuestionToRoom, (message, question: Question) => {
            setRoomState(message);
            setQuestion(question);
            setShouldAnswersAppear(false);
            setReveal(false);
            setStartQuestionTimer(3);
            setCounter(question.timer);
          });
          roomConnection.on(settings.SignalRSendMessageToRoom, (message) => {
              setRoomState(message);
          });
        })
        .catch((error) => ErrorNotify(error as string));
    }
  }, [guest]);



  const ErrorNotify = (message: string, autoClose?: number) => {
    toast(message, {
      position: "top-right",
      autoClose: autoClose === 0 ? false : 1500,
      className: "",
      type: "error",
    });
  };

  return (
    <div id="content">
      {(() => {
        switch (roomState) {
          case PlayingRoomState.StartMessage:
            return (<StartQuizTimer secondsRemained={3}></StartQuizTimer>);
          case PlayingRoomState.Waiting:
            return (
              <div className="waitTextBox">
                <h1>{waitingMessage}</h1>
              </div>
            );
          case PlayingRoomState.NextMessage:
            return (
              <div className="page">
                <div style={{ display: "none" }}>
                  <TimerComponent
                    props={startQuestionTimer}
                    setProps={setStartQuestionTimer}
                    setIsTimeUp={() => { setShouldAnswersAppear(true); }}
                  />
                </div>
                <div className="questionsAndTimer">
                  <div className="questionTextEnterPage" >
                    <QuestionTextComponent props={question!.text} />
                    <div className={`timerComponentCenter ${reveal === true && "hideTimer hideTimerOnMobile"}`}>
                      <TimerComponent
                        props={counter!}
                        setProps={setCounter}
                        setIsTimeUp={() => {
                          setReveal(true)
                          setGuest(JSON.parse(localStorage.getItem(settings.Guest)!));
                        }}
                        disabled={!shouldAnswersAppear}
                      />
                    </div>
                  </div>
                </div>
                <AnswerComponent
                  question={question!}
                  timer={question!.timer - counter!}
                  revealAnswer={reveal}
                  shouldAppear={shouldAnswersAppear}
                  guest={guest!}
                />
              </div>
            )
          case PlayingRoomState.ShowResults:
            return (
              <div className="leaderBoardGuest">
                <ScrollablePaneComponent props={
                  [<LeaderboardComponent></LeaderboardComponent>]
                } height={"80vh"} />
              </div>
            )
          case PlayingRoomState.FinishMessage:
            return (
              <div className="showResults">
                <div className="exitButtonContainer">
                  <PrimaryButton className="exitButton"
                    onClick={() => {
                      navigate(redirects.LandingPage);
                    }}
                  >
                    {constants.Exit}
                  </PrimaryButton>
                </div>
                <div className="leaderBoardHost">
                  <ScrollablePaneComponent props={
                    [<LeaderboardComponent></LeaderboardComponent>]
                  } height={"80vh"} />
                </div>
              </div>
            )
        }
      })()}
    </div>
  )
}