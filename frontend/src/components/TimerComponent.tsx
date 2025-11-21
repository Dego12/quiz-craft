import { FC, useEffect } from "react";

export const TimerComponent: FC<{
  props: number,
  setProps: any,
  setIsTimeUp: Function,
  disabled?: boolean,
  className?: string
}> = ({ props, setProps, setIsTimeUp, disabled, className }) => {

  let timer: any;

  useEffect(() => {
    if (!disabled) {
      props > 0 && timeout()
      if (props === 0)
        finishedCounting();
      return () => {
        clearTimeout(timer);
      }
    }
  }, [props, disabled]);

  function finishedCounting() {
    setIsTimeUp();
  }

  function timeout() {
    return timer = window.setTimeout(() => { setProps(props - 1) }, 1000)
  }

  return (
    <div className={`timerComponent ${className}`} >
      <div className="timerPoligon">
      </div>
      <div className="timerCounter">
        {props}
      </div>
    </div>
  );
}

