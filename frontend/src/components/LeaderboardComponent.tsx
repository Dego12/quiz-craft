import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Guest } from "../models/Guest";
import redirects from "../resources/redirects.json"
import settings from "../resources/settings.json"
import constants from "../resources/constants.json";

export const LeaderboardComponent: FC = () => {

  const roomId = useParams()[redirects.RoomIdParam];
  const [guests, setGuests] = useState<Guest[]>();
  var index = 0;

  useEffect(() => {
    fetch(settings.BaseUrl + settings.Guest + roomId, {
      method: "GET",
      mode: "cors",
      headers: {
        Accept: "text/plain",
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },

    }).then(response => response.json())
      .then(response => {
        setGuests(response)
      })
  }, [])

  return (
    <div className="leaderboardPage">
      <div id="leaderboard">
        <div id="leaderboardTitle">
          {constants.LeaderboardTitle}
        </div>
        
        <div id="scores">
          <div className="playerTable">
            <div>{constants.LeaderboardPlace}</div>
            <div>{constants.LeaderboardName}</div>
            <div>{constants.LeaderboardScore}</div>
          </div>
          <div className="scoreList">
            {guests?.map(() => {
              if (index === 0) {
                index++;
                return (
                  <div id="firstPlace">
                        <span className="rank"> {index}</span>
                        <span className="nickname">
                          {guests?.at(0)?.name}
                        </span>
                        <span className="score">
                          {guests?.at(0)?.score}
                        </span>
                  </div>
                )
              }
              else if (index === 1) {
                index++;
                return (
                  <div id="secondPlace">
                      <span className="rank"> {index}</span>
                      <span className="nickname">
                        {guests?.at(1)?.name}
                      </span>
                      <span className="score">
                        {guests?.at(1)?.score}
                      </span>
                  </div>
                )
              }
              else if (index === 2) {
                index++;
                return (
                  <div id="thirdPlace">
                      <span className="rank">{index}</span>
                      <span className="nickname">
                        {guests?.at(2)?.name}
                      </span>
                      <span className="score">
                        {guests?.at(2)?.score}
                      </span>
                  </div>
                )
              }
              else {
                index++;
                return (
                  <div className="leftoverScores">
                      <span className="rank"> {index} </span>
                      <span className="nickname">
                        {guests?.at(index - 1)?.name}
                      </span>
                      <span className="score">
                        {guests?.at(index - 1)?.score}
                      </span>
                  </div>
                )
              }
            })}
        </div>
        </div>
      </div>
    </div>
  )
}