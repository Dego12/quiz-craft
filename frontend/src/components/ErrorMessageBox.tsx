import React from "react";
import { MessageBar, MessageBarType } from "@fluentui/react";
interface IMessageBoxProps {
  message: string;
}

function ErrorMessageBox(props: IMessageBoxProps) {
  return (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      dismissButtonAriaLabel="X"
    >
      {props.message}
    </MessageBar>
  );
}

export default ErrorMessageBox;
