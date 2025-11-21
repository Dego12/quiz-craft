import { ITextFieldStyles, PrimaryButton, TextField } from "@fluentui/react";
import { RepeatOneSharp } from "@material-ui/icons";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Guest } from "../models/Guest";
import { Quiz } from "../models/Quiz";
import { Room } from "../models/Room";
import redirects from "../resources/redirects.json";
import settings from "../resources/settings.json";
import constants from "../resources/constants.json";

export const EnterPage: FC = () => {
  const pin = useParams()[redirects.PINParam];
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room>();
  const [nickname, setNickname] = useState<string>();
  const handleInputChange = (e: any) => {
    setNickname(e.target.value);
  };

  const guest = useRef<Guest>();

  useEffect(() => {
    if (pin !== undefined) {
      const getRoom = async () => {
        fetch(settings.BaseUrl + settings.Guest + settings.Connect + pin, {
          method: "GET",
          mode: "cors",
        })
          .then(async (response) => {
            if (response.status == 404 || response.status == 400) {
              throw new Error(constants.PinError);
            } else if (response.status == 409) {
              throw new Error(constants.QuizInProgress);
            }
            return await response.json();
          })
          .then((response) => setRoom(response))
          .catch((e: Error) => {
            ErrorNotify(e.message);
            navigate(redirects.LandingPage);
          });
      };

      getRoom();
    }
  }, []);

  const handleSubmit = async () => {
    let thisGuest: Partial<Guest> = {
      name: nickname,
      score: 0
    }

    await fetch(settings.BaseUrl + settings.Guest + room?.id, {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "text/plain",
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(thisGuest),
    }).then(async (response) => {

      if (response.status === 400) {
        throw new Error(response.statusText);
      }
      return await (await response).json();
    })
      .then((response) => {
        guest.current = response;
        guest.current!.roomId = room!.id!;
        localStorage.removeItem(settings.Guest);
        localStorage.setItem(settings.Guest, JSON.stringify(guest.current));
        navigate(redirects.PlayQuizPage + "/" + room?.id);
      })
      .catch(() => {
        ErrorNotify(constants.RoomIsFull);
        navigate(redirects.LandingPage);
  })
  };

  const ErrorNotify = (message: string) => {
    toast(message, {
      position: "top-right",
      autoClose: 1500,
      className: "",
      type: "error",
    });
  };

  return (
    <div className="pageContent">
      <div className="pageTitle">
        <div> {constants.WelcomeTo} {room?.quiz.title} !</div>
      </div>
      <div className="fieldElements">
        <div id="fieldContainer">
          <TextField
            placeholder={constants.EnterNickname}
            onChange={(e) => handleInputChange(e)}
            styles={textFieldStyle}
          />
          <PrimaryButton id="joinButton" onClick={handleSubmit}>
            {constants.Join}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

const textFieldStyle: Partial<ITextFieldStyles> = {
  root: {
    "@media(max-width:700px)": {
      width: "50vw",
      maxWidth: "200px",
      marginBottom: "20px"
    }
  }
}