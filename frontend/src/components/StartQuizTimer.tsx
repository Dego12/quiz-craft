import { useBoolean } from "@fluentui/react-hooks";
import { FC, useEffect, useRef, useState } from "react";
import "../styles/StartQuizTimer.css"

export const StartQuizTimer: FC<{
        secondsRemained: number
    }> = ({secondsRemained}) => {

        const [seconds, setSeconds] = useState(secondsRemained);
        const disabled = useRef<boolean>(false);
        useEffect(() => {
            if(!disabled.current){
                setTimeout(() => setSeconds(seconds - 1), 1000);
                if(seconds===1){
                    disabled.current = true;
                }
            }
        }, [seconds]);
        
        return (
            <div className="timerComponent startTimer">
                <div className="timerPoligon startTimer">
                </div>
                <div className="timerCounter startTimer">
                    {seconds!=0 ? seconds : "Start"}
                </div>
            </div>
        );
}