import React from "react";
import styles from "./Roomcard.module.css";
import { useNavigate } from "react-router-dom";
import bubbleIcon from "../../images/bubble-icon.png";
import userBlue from "../../images/user-blue.png";

const RoomCard = ({ room, setEnterRoomModal }) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles.card}
      onClick={() => {
        if (room?.roomType === "private") {
          setEnterRoomModal({ status: true, room: room });
          return;
        } else {
          navigate(`/room/${room.id}`);
        }
      }}
    >
      <h3 className={styles.topic}>{room.topic}</h3>
      <div
        className={`${styles.speakers} ${
          room.speakers.length === 1 ? styles.singleSpeaker : ""
        }`}
      >
        <div className={styles.avatars}>
          {room.speakers.slice(0, 2).map((sp, ind) => (
            <img
              src={`http://localhost:4000${sp.avatar}`}
              key={ind}
              alt="spvtr"
            />
          ))}
        </div>
        <div className={styles.names}>
          {room.speakers.slice(0, 2).map((speaker, ind) => (
            <div key={speaker.id} className={styles.nameWrapper}>
              <span>{speaker.name}</span>
              <img key={ind} src={bubbleIcon} alt="chat-bubble" />
            </div>
          ))}
        </div>
      </div>
      <span className={styles.speakerNumber}>{room?.speakers.length}</span>
      <img src={userBlue} alt="user-icon" />
    </div>
  );
};

export default RoomCard;
