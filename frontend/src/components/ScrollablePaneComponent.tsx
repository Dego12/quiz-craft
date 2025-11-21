import { ScrollablePane } from "@fluentui/react";
import { FC } from "react";

export const ScrollablePaneComponent: FC<{ props: JSX.Element[], height: string }> = ({
  props,
  height
}) => {
  return (
    <div
      style={{
        overflowX: "hidden",
        overflowY: "auto",
        height: height,
      }}
    >
      {props}
    </div>
  );
};
