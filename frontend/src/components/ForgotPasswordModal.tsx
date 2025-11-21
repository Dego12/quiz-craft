import { Modal, PrimaryButton, TextField } from "@fluentui/react";
import { FC, useState } from "react";
import { checkEmailFormat } from "../resources/Utilities";
import settings from "../resources/settings.json";
import { toast } from "react-toastify";
import "../styles/ForgotPasswordModalStyle.css";
import constants from "../resources/constants.json";

export const ForgotPasswordModal: FC<{
  setModalOpen: any;
}> = ({ setModalOpen }) => {

  const [email, setEmail] = useState<string>();
  const [errors, setErrors] = useState<string>();
  const [buttonText, setButtonText] = useState<string>(constants.ForgotPasswordModalButton);
  const [disabled, setDisabled] = useState<boolean>(false);

  const handleSendResetLink = async () => {
    setButtonText(constants.Loading);
    setDisabled(true);
    await fetch(settings.BaseUrl + settings.User + settings.SendResetLink, {
      method: "PUT",
      mode: "cors",
      headers: {
        Accept: "text/plain",
        email: `${email}`,
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }).then(async (response) => {
      if (response.status === 400 || response.status == 404) {
        setErrors(constants.InvalidEmail);
        setButtonText(constants.ForgotPasswordModalButton);
        setDisabled(false);
      } else {
        setModalOpen(false);
        toast.success(constants.ToastEmailSent, {
          autoClose: 1500,
        });
      }
    });
  };

  return (
    <Modal
      containerClassName="forgetPassModal"
      isOpen={true}
      onDismiss={() => setModalOpen(false)}
      isBlocking={false}
    >
      <br />
      <div className="questionModalTitle">
        {constants.ForgotPassword}
      </div>

      <div className="modalDescription">
        {constants.ForgotPasswordDescription}
      </div>

      <TextField
        className="emailField"
        placeholder={constants.Email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        value={email}
      >
      </TextField>

      <div className="modalExample">
        {constants.EmailExample}
      </div>
      <div className="emailError">{errors}</div>
      <div className="modalButtonContainer">
        <PrimaryButton
          className="sendLinkButton"
          disabled={!email?.trim() || !checkEmailFormat(email) || disabled}
          onClick={handleSendResetLink}
        >
          {buttonText}
        </PrimaryButton>
        <PrimaryButton
          className="sendLinkButton cancel"
          onClick={() => setModalOpen(false)}
        >
          {constants.CancelButton}
        </PrimaryButton>
      </div>
    </Modal>
  )
}

