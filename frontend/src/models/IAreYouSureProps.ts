import { useState } from "react";

export interface IAreYouSureProps {
  onOkClick?: Function;
  onCancelClick?: Function;
  onClose?: Function;
  text?: string;
  isModalVisible: any;
}
