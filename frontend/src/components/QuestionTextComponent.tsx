import { FC } from "react";
import '../styles/QuestionTextComponentStyle.css'
export const QuestionTextComponent: FC<{ props: string }> = ({ props }) => {
    return (
        <div id="parentDiv">
            <span id="questionText">{props}</span>

        </div>
    )
}