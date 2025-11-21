import {
  ITextFieldStyles,
  PrimaryButton,
  TextField
} from "@fluentui/react";
import { FC, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import { Guest } from "../models/Guest";
import { Room } from "../models/Room";
import redirects from "../resources/redirects.json";
import { RoomState } from "../resources/RoomState";
import settings from "../resources/settings.json";
import constants from "../resources/constants.json";

injectStyle();

export const Header: FC = () => {
  const navigate = useNavigate();
  let pinError = "";
  const [isError, setIsError] = useState<boolean>(false);
  const pinTextFieldRef = useRef<any>();

  const checkPinValidity = async (pin: number) => {

    toast.dismiss();
    if (localStorage.getItem(settings.Guest) !== null) {
      const guest: Guest = JSON.parse(localStorage.getItem(settings.Guest)!);
      const roomId = guest.roomId;
      await fetch(settings.BaseUrl + settings.Guest + "rooms/" + roomId, {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "text/plain",
          guestRoomId: roomId,
          "Content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }).then(async (response) => {
        if (response.status === 200) {
          return await response.json();
        }
      }
      ).then((room: Room) => {
        if (room && room.state !== RoomState.Finished) {
          navigate(redirects.PlayQuizPage + "/" + roomId);
        }
      })
        .catch((e: Error) => {
          localStorage.removeItem("guest");
        })
    }

    await fetch(settings.BaseUrl + settings.Guest + settings.Connect + pin, {
      method: "GET",
      mode: "cors",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then(async (response) => {
        if (response.status === 400) {
          throw new Error("invalid pin");
        } else if (response.status === 404) {
          throw new Error(constants.PinError);
        } else if (response.status === 409) {
          throw new Error(constants.QuizInProgress);
        }

        navigate(redirects.GuestEnterPage + `/${pin}`);
      })
      .catch((e: Error) => {
        pinError = e.message;
        setIsError(true);
        notify();
      });
  };

  const notify = () => {
    toast(
      pinTextFieldRef.current.value.toString() === ""
        ? constants.NoProvidedPin
        : pinError,
      {
        position: "top-right",
        autoClose: 1500,
        className: "",
        type: "error",
      }
    );
  };

  return (
    <div>
      <div className="buttons">
        <PrimaryButton
          className="headerRedirectButton"
          onClick={() => {
            navigate(redirects.Login);
          }}
        >
          {constants.Login}
        </PrimaryButton>
        <PrimaryButton
          className="headerRedirectButton"
          onClick={() => {
            navigate(redirects.Signup);
          }}
        >
          {constants.Signup}
        </PrimaryButton>
      </div>
      <div>
        <h1>{constants.QuizCraft}</h1>
      </div>
      <div className="enterRoom">
        <TextField
          componentRef={pinTextFieldRef}
          className="pin"
          type="number"
          style={{
            WebkitAppearance: "none",
            fontFamily: "Roboto",
            fontSize: "21px",
            textAlign: "center",
          }}
          styles={isError === false ? textFieldStyles : textFieldErrorStyles}
          placeholder={constants.GamePin}
          onWheel={event => { event.currentTarget.blur(); }}
        />
        <PrimaryButton
          id="enter"
          className="enterButton"
          style={{
            fontFamily: "Roboto",
            fontSize: "21px",
            marginLeft: 0
          }}
          text={constants.Enter}
          onClick={() => checkPinValidity(pinTextFieldRef.current.value)}
        />
      </div>
    </div>
  );
};

const textFieldStyles: Partial<ITextFieldStyles> = {
  root: {
    border: "2px solid transparent",
  },
  field: {
    color: "black",
  },
};

const textFieldErrorStyles: Partial<ITextFieldStyles> = {
  fieldGroup: {
    border: "none",
    selectors: {
      ":after": {
        border: "2px solid transparent",
      },
    },
  },

  field: {
    color: "black",
  },

  root: {
    border: "2px solid rgb(238,34,76,0.85)",
  },
};
