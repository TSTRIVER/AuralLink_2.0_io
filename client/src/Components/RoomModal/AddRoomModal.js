import React, { useState } from "react";
import styles from "./RoomModal.module.css";
import TextInput from "../Shared/TextInput/TextInput";
import earthIcon from "../../images/earth-icon.png";
import lockIcon from "../../images/lock-icon.png";
import closeIcon from "../../images/close-icon.png";
import { createRooms as create } from "../Http/index";
import { useNavigate } from "react-router-dom";
import playIcon from "../../images/play-icon.png";

const AddRoomModal = ({ onClose }) => {
  const [topic, setTopic] = useState("");
  const [roomType, setRoomType] = useState("open");
  const [roomToken, setRoomToken] = useState(null);
  const navigate = useNavigate();

  const generateToken = () => {
    let random_token = Array.from(Array(20), () =>
      Math.floor(Math.random() * 36).toString(36)
    ).join("");
    setRoomToken(random_token);
    return;
  };

  const createRoom = async () => {
    try {
      if (!topic || !roomType) {
        return;
      }
      const { data } = await create({ topic, roomType, roomToken });
      navigate(`/room/${data.id}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={styles.modalMask}>
      <div className={styles.modalBody}>
        <button onClick={onClose} className={styles.closeButton}>
          <img src={closeIcon} alt="close" />
        </button>
        <div className={styles.modalHeader}>
          <h3 className={styles.heading}>Enter the topic to be discussed</h3>
          <TextInput
            fullwidth="true"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <h2 className={styles.subHeading}>Room types</h2>
          <div className={styles.roomTypes}>
            <div
              onClick={() => setRoomType("open")}
              className={`${styles.typeBox} ${
                roomType === "open" ? styles.active : ""
              }`}
            >
              <img src={earthIcon} alt="globe" style={{width: "100px", height:"100px"}}/>
              <span>Open</span>
            </div>
            <div
              onClick={() => {
                setRoomType("private");
                generateToken();
              }}
              className={`${styles.typeBox} ${
                roomType === "private" ? styles.active : ""
              }`}
            >
              <img src={lockIcon} alt="lock" style={{width: "100px", height:"100px"}}/>
              <span>Private</span>
            </div>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <h2>
            {roomType === "open"
              ? "Start a Room, Open To Everyone"
              : "Start a Restricted Access Room"}
          </h2>
          {roomType === "private" && (
            <>
              <div className={styles.copyToClipboard}>
                <div id="tokenDiv">{roomToken}</div>
                <button
                  onClick={() => {
                    const tokenText =
                      document.getElementById("tokenDiv").innerText;
                    navigator.clipboard.writeText(tokenText).then(
                      () => {
                        alert("Copied the text: " + tokenText);
                      },
                      (err) => {
                        console.error("Could not copy text: ", err);
                      }
                    );
                  }}
                  className={styles.copyBtn}
                >
                  Copy
                </button>
              </div>
            </>
          )}
          <button className={styles.footerButton} onClick={() => createRoom()}>
            <img src={playIcon} alt="create" />
            <span>Let's go</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRoomModal;
