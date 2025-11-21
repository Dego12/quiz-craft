import { Modal, PrimaryButton, TextField } from "@fluentui/react";
import { FC, useState } from "react"
import "../styles/ChangeGuestLimitModalStyle.css"
import "../styles/ForgotPasswordModalStyle.css";
import settings from "../resources/settings.json";
import { getCookie } from "../resources/Utilities";
import constants from "../resources/constants.json";

export const ChangeGuestLimitModal: FC<{
    setModalOpen: any;
    roomId: string | undefined;
    setLimitOfPlayers: any;
}> = ({ setModalOpen, roomId, setLimitOfPlayers }) => {

    const [limit, setLimit] = useState<string>();

    return (
        <Modal
            containerClassName="changeGuestLimitModal"
            isOpen={true}
            onDismiss={() => setModalOpen(false)}
            isBlocking={false}
        >
            <div className="questionModalTitle">
                {constants.GuestLimitModalTitle}
            </div>
            
            <br />

            <p className="modalDescription">
                {constants.GuestLimitModalDescription}
            </p>

            <TextField
                className="limitField"
                type="number"
                onChange={(e) => setLimit(e.currentTarget.value)}
                value={limit}
            />

            <br />

            <div className="limitModalButtonContainer">
                <PrimaryButton
                    className="submitLimitButton"
                    disabled={limit === undefined || limit.trim() === "" || parseInt(limit) <= 0}
                    onClick={handleClick}
                >
                    {constants.Submit}
                </PrimaryButton>
                <PrimaryButton
                    className="cancelLimitButton"
                    onClick={() => setModalOpen(false)}
                >
                    {constants.CancelButton}
                </PrimaryButton>
            </div>
        </Modal>
    )

    async function handleClick() {
        if (roomId !== undefined) {

            let roomLimitDTO = {
                RoomId: roomId,
                Limit: limit
            };

            fetch(settings.BaseUrl + settings.Room + settings.ChangePlayerLimit, {
                method: "PUT",
                mode: "cors",
                headers: {
                    Accept: "text/plain",
                    token: `${getCookie(settings.token)}`,
                    "Content-type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
                body: JSON.stringify(roomLimitDTO)
            }).then((response) => {
                return response.json();
            }).then(response => {
                setLimitOfPlayers(response.limitOfPlayers);
                setModalOpen(false);
            })
        } else {
            setModalOpen(false);
        }

        
    }
}