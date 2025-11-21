import {
    DefaultButton,
    IButtonStyles,
    Icon,
    IIconProps,
    ITextFieldStyles,
    PrimaryButton,
    TextField,
    TooltipHost,
} from "@fluentui/react";
import * as signalR from "@microsoft/signalr";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Question } from "../models/Question";
import { Guest } from "../models/Guest";
import { Room } from "../models/Room";
import redirects from "../resources/redirects.json";
import { RoomState } from "../resources/RoomState";
import settings from "../resources/settings.json";
import { getCookie } from "../resources/Utilities";
import { TimerComponent } from "../components/TimerComponent";
import { PlayingRoomState } from "../resources/PlayingRoomState";
import "../styles/HostStyle.css";
import { AnswerComponent } from "../components/AnswerComponent";
import { QuestionTextComponent } from "../components/QuestionTextComponent";
import "../styles/PlayQuizStyle.css";
import { LeaderboardComponent } from "../components/LeaderboardComponent";
import { ScrollablePaneComponent } from "../components/ScrollablePaneComponent";
import { ChangeGuestLimitModal } from "../components/ChangeGuestLimitModal";
import constants from "../resources/constants.json";

export const HostPage: FC = () => {
    const [connection, setConnection] = useState<signalR.HubConnection>(new signalR.HubConnectionBuilder()
        .withUrl(settings.SignalRConnection)
        .withAutomaticReconnect()
        .build());
    const roomId = useParams()[redirects.RoomIdParam];
    const [room, setRoom] = useState<Room>();
    const [questions, setQuestions] = useState<Array<Question>>();
    let [connectionWithPin, setConnectionWithPin] = useState<string>("");
    const textFieldPinRef = useRef<any>();
    const [copyPinIcon, setCopyPinIcon] = useState<IIconProps>(copyIcon);
    const [showResults, setShowResults] = useState<boolean>(false);

    const [guests, setGuests] = useState<Guest[]>([]);
    const [guestJoined, setGuestJoined] = useState<boolean>(false);
    const [index, setIndex] = useState<number>(Math.max(Number(localStorage.getItem("index")) - 1, 0));

    const [playingRoomState, setPlayingRoomState] = useState<PlayingRoomState>(PlayingRoomState.Waiting);
    const [counter, setCounter] = useState<number>(0);

    const [reveal, setReveal] = useState<boolean>(false);
    const [shouldAnswersAppear, setShouldAnswersAppear] = useState<boolean>(false);
    const [questionStartTimer, setQuestionStartTimer] = useState<number>(4);
    const [finishReveal, setFinishReveal] = useState<boolean>(false);

    const [isGuestLimitModalOpen, setIsGuestLimitModalOpen] = useState<boolean>(false);
    const [limitOfPlayers, setLimitOfPlayers] = useState<number | null>(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetch(settings.BaseUrl + settings.Room + roomId, {
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
                return response.json();
            })
            .then((response) => {
                setQuestions(response.quiz.questions);
                setRoom(response);
                setLimitOfPlayers(response.limitOfPlayers);
                setPlayingRoomState(localStorage.getItem("index") === '0' ? PlayingRoomState.Waiting : parseInt(localStorage.getItem('index')!) <= response.quiz.questions.length ? (() => {
                    return PlayingRoomState.NextMessage
                }) : PlayingRoomState.FinishMessage);
                setConnectionWithPin(
                    constants.ApplicationLink +
                    redirects.GuestEnterPage +
                    "/" +
                    response?.pin.toString()
                );
                setFinishReveal(parseInt(localStorage.getItem("index")!) >= response.quiz.questions.length ? true : false);
            });

        fetch(settings.BaseUrl + settings.Guest + roomId, {
            method: "GET",
            mode: "cors",
            headers: {
                Accept: "text/plain",
                "Content-type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
        })
        .then(async (response) => await response.json())
        .then((response) => {
            console.log("guestssssss")
            setGuests(response);
            setGuestJoined(false);
        });
    
    }, []);

    useEffect(() => {
        connection.start()
            .then(async () => {
                connection.on(settings.SignalRSendGuestJoinedToRoom, () => {
                    setGuestJoined(true);
                })
            });
    })

    useEffect(() => {
        if (playingRoomState === PlayingRoomState.Waiting)
        {
            setTimeout(() => fetch(settings.BaseUrl + settings.Guest + roomId, {
                method: "GET",
                mode: "cors",
                headers: {
                    Accept: "text/plain",
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            })
            .then(async (response) => await response.json())
            .then((response) => {
                console.log("guestssssss")
                setGuests(response);
                setGuestJoined(false);
            }), 3000);
        }
    })

    const handleStartClick = async () => {
        console.log(
            connection.invoke("SendMessageToRoom", roomId, PlayingRoomState.StartMessage)
        );
        localStorage.setItem("index", "0");
        setPlayingRoomState(PlayingRoomState.StartMessage);
        setCounter(4);
    };

    const handleNextClick = async () => {
        await connection.invoke(
            "SendMessageQuestionToRoom",
            roomId,
            PlayingRoomState.NextMessage,
            questions?.at(Number(localStorage.getItem("index")))
        ).then(() => console.log(connection.state));
        setPlayingRoomState(PlayingRoomState.NextMessage);
        setCounter(questions?.at(index)?.timer!);
        setQuestionStartTimer(3);
        localStorage.setItem("index", (index + 1).toString());
        setShouldAnswersAppear(false);
        setReveal(false);
        setShowResults(false);
        if ((index + 1) >= questions?.length!) {
            setFinishReveal(true);
        }
    }

    const handleShowResults = async () => {
        await connection.invoke(
            "SendMessageToRoom",
            roomId,
            PlayingRoomState.ShowResults
        ).then(() => console.log(connection.state));
        setShowResults(true);
        setIndex(Number(localStorage.getItem("index")));
    };

    const handleFinishClick = async () => {
        console.log(
            connection.invoke("SendMessageToRoom", roomId, RoomState.Finished)
        );
        await connection.invoke(
            "SendMessageToRoom",
            roomId,
            PlayingRoomState.FinishMessage
        ).then(() => console.log(connection.state));
        setPlayingRoomState(PlayingRoomState.FinishMessage);
        setShowResults(true);
    };

    const guestArea = guests.map((guest, i) => {
        return <div className="playerJoined" key={i}><li>{guest.name}</li></div>;
    });

    return (
        <div>
            {(() => {
                switch (playingRoomState) {
                    case PlayingRoomState.Waiting:
                        return (
                            <div className="pageContent">
                                {isGuestLimitModalOpen && (
                                    <ChangeGuestLimitModal setModalOpen={setIsGuestLimitModalOpen} roomId={roomId} setLimitOfPlayers={setLimitOfPlayers} />
                                )}
                                <div className="hostPageHeader">
                                    <div className="pageTitle">
                                        <div>{constants.WelcomeTo} {room?.quiz.title} !</div>
                                    </div>
                                    <div className="hostPageCopyPin">
                                        <p style={{ fontSize: "25px" }}>{constants.GamePin}: {room?.pin}</p>
                                        <p style={{ marginTop: "0" }}>{constants.ShareWithOthers}</p>
                                        <div className="hostPageCopyPinActions">
                                            <TextField
                                                disabled
                                                componentRef={textFieldPinRef}
                                                value={connectionWithPin}
                                                styles={joinRoomTextField}
                                            />
                                            <TooltipHost
                                                content={"Copied!"}
                                                hidden={copyPinIcon === succesIcon ? false : true}
                                            >
                                                <DefaultButton
                                                    styles={joinRoomCopyButton}
                                                    iconProps={copyPinIcon}
                                                    onClick={() => {
                                                        setCopyPinIcon(succesIcon);
                                                        navigator.clipboard.writeText(connectionWithPin);
                                                    }}

                                                />
                                            </TooltipHost>
                                        </div>
                                    </div>
                                </div>
                                <div className="heroSection">
                                    <div className="hostPagehostButton">
                                        <div className="playerCountArea">
                                            <div className="hostPageIcons" style={{ display: "flex", justifyContent: "center", alignContent: "center" }}>
                                                <div className="icons">
                                                    <Icon iconName="Contact" className="personIcon"/>
                                                    <span className="numberOfPlayers">{`${guestArea.length} ${limitOfPlayers!=null ? "/ " + limitOfPlayers : ""}`}</span>
                                                </div>

                                            </div>
                                            <PrimaryButton
                                                className="changeLimitButton"
                                                onClick={() => setIsGuestLimitModalOpen(true)}
                                            >
                                                {constants.ChangeGuestLimit}
                                            </PrimaryButton>
                                        </div>

                                        <PrimaryButton
                                            styles={hostButton}
                                            onClick={() => {
                                                handleStartClick();
                                            }}
                                        >
                                            {constants.Start}
                                        </PrimaryButton>
                                    </div>
                                </div>
                                {(() => {
                                    if (guestArea.length === 0) {
                                        return (<div className="waitingForPlayers">{constants.WaitingPlayers}</div>)
                                    }
                                    else {
                                        return (<div className="joinedGuests">
                                            {constants.JoinedPlayers}
                                            {guestArea}
                                        </div>)
                                    }
                                })()}
                            </div>
                        )
                    case PlayingRoomState.StartMessage:
                        return (
                            <div className="hostButtons">
                                <TimerComponent props={counter} setProps={setCounter} setIsTimeUp={() => {
                                    handleNextClick();
                                }} />
                            </div>
                        )
                    case PlayingRoomState.NextMessage:
                        return (
                            <>
                                {(() => {
                                    if (!showResults) {
                                        return (
                                            <div className="page">
                                                <div style={{ display: "none" }}>
                                                    <TimerComponent
                                                        props={questionStartTimer}
                                                        setProps={setQuestionStartTimer}
                                                        setIsTimeUp={() => {
                                                            setShouldAnswersAppear(true);
                                                        }}
                                                    />
                                                </div>
                                                <div className="questionsAndTimer">
                                                    <div className="questionTextEnterPage">
                                                        <div className="hostQuestionHeader">
                                                            <QuestionTextComponent
                                                                props={
                                                                    room?.quiz.questions?.at(index)?.text!
                                                                }
                                                            />
                                                        </div>

                                                        <div
                                                            className={`timerComponentCenter`}
                                                        >
                                                            <div
                                                                className={`${reveal === true &&
                                                                    "hideTimer hideTimerOnMobile"
                                                                    }`}
                                                            >
                                                                <TimerComponent
                                                                    props={counter!}
                                                                    setProps={setCounter}
                                                                    setIsTimeUp={() => {
                                                                        setReveal(true);
                                                                    }}
                                                                    disabled={!shouldAnswersAppear}
                                                                />
                                                            </div>
                                                            <div
                                                                style={{
                                                                    display: !finishReveal && reveal ? "" : "none",
                                                                }}
                                                            >
                                                                <PrimaryButton
                                                                    className="viewResultsButton"
                                                                    onClick={() => {
                                                                        handleShowResults();
                                                                    }}
                                                                >
                                                                    {constants.ViewResults}
                                                                </PrimaryButton>
                                                            </div>
                                                            <div style={{ display: finishReveal && reveal ? "" : "none" }}>
                                                                <PrimaryButton
                                                                    className="viewResultsButton"
                                                                    onClick={() => {
                                                                        handleFinishClick();
                                                                    }}
                                                                >
                                                                    {constants.Finish}
                                                                </PrimaryButton>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <AnswerComponent
                                                    question={
                                                        room?.quiz.questions?.at(index)!
                                                    }
                                                    revealAnswer={reveal}
                                                    shouldAppear={shouldAnswersAppear}
                                                    isHostView={true}
                                                />
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div className="showResults">
                                                <PrimaryButton className="nextQuestionButton" onClick={room?.quiz.questions?.length === 1 ? handleFinishClick : handleNextClick}>
                                                    {room?.quiz.questions?.length === 1 ? constants.Finish : constants.Next}
                                                </PrimaryButton>
                                                <div className="leaderBoardHost">
                                                    <ScrollablePaneComponent props={
                                                        [<LeaderboardComponent></LeaderboardComponent>]
                                                    } height={"80vh"} />
                                                </div>
                                            </div>
                                        )
                                    }
                                })()}
                            </>
                        )
                    case PlayingRoomState.FinishMessage:
                        return (
                            <div className="showResults">
                                <div className="exitButtonContainer">
                                    <PrimaryButton className="exitButton"
                                        onClick={() => {
                                            navigate(redirects.MainPage, { replace: true });
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
    );
}

const copyIcon: IIconProps = { iconName: "Copy" };
const succesIcon: IIconProps = { iconName: "CheckMark" };
const userIcon: IIconProps = { iconName: "User" };

const joinRoomTextField: Partial<ITextFieldStyles> = {
    root: {
        height: "",
        fontFamily: "Roboto",
    },

    field: {
        color: "#4e4e4e",
        backgroundColor: "transparent",
        minWidth: "20vw",
    },

    fieldGroup: {
        display: "flex",
        justifyContent: "center",
        borderRadius: "6px",
    },
};

const joinRoomCopyButton: Partial<IButtonStyles> = {
    root: {
        marginTop: "-0.5px",
        borderRadius: "5px",
        minWidth: "0px",
        height: "33px",
        marginLeft: "-10px",
    },
};

const hostButton: Partial<IButtonStyles> = {
    root: {
        backgroundColor: "#0097b9",
        borderColor: "#0097b9",
        marginInlineEnd: "10px",
        fontSize: "15px",
        width: "50px",
        height: "35px",
        display: "flex",
        justifyContent: "center",
        borderRadius: "5px",
        "&&:hover": {
            backgroundColor: "#017c97",
            borderColor: "#017c97",
        }
    }
}