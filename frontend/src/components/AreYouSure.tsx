import React from "react";
import { Modal, PrimaryButton } from "@fluentui/react";
import { IAreYouSureProps } from "../models/IAreYouSureProps";
import "../styles/AreYouSureStyle.css";
import { useBoolean } from "@fluentui/react-hooks";
import constants from "../resources/constants.json";

const AreYouSure = ({
  onCancelClick,
  onOkClick,
  onClose,
  text,
  isModalVisible,
}: IAreYouSureProps) => {

  return (
    <Modal
      containerClassName="modalStyle"
      isOpen={true}
      onDismiss={() => {
        isModalVisible(false);
      }}
      isBlocking={false}
      onDismissed={() => {
        if (onClose !== undefined) onClose();
      }}
    >
      <br />
      <div>
        {text !== undefined ? text : constants.AreYouSureModalText}
      </div>
      <br />
      <div className="buttonsArea">
        <PrimaryButton
          className="OkCancelbuttons yesButton"
          onClick={() => {
            isModalVisible(false);
            !!onOkClick && onOkClick();
          }}
        >
          {constants.DeleteModalYesButton}
        </PrimaryButton>

        <PrimaryButton
          className="OkCancelbuttons cancelButton"
          onClick={() => {
            isModalVisible(false);
            !!onCancelClick && onCancelClick();
          }}
        >
          {constants.DeleteModalCancelButton}
        </PrimaryButton>
      </div>
    </Modal>
  );
};

export default AreYouSure;
