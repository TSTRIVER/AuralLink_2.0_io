import React, { useEffect, useState } from "react";
import { useSelector} from "react-redux";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./Room.module.css";
import { getRoomById} from "../../Components/Http";
import arrowBack from "../../images/arrow-back.png";
import exitIcon from "../../images/exit-icon.png";
import micOn from "../../images/mic-on.png";
import micOff from "../../images/mic-off.png";
import { updateRoom } from "../../Components/Http";

const Room = () => {
  const { user } = useSelector((state) => state.auth);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  const [isMuted, setMuted] = useState(true);
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  
  const handleManualLeave = () => {
    navigate("/rooms");
  };

  useEffect(() => {
    const fetchRoom = async () => {
      const { data } = await getRoomById(roomId);
      setRoom((prev) => data);
    };
    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    handleMute(isMuted, user.id);
  }, [isMuted]);

  const handleMuteClick = (clientId) => {
    if (clientId !== user.id) {
      return;
    }
    setMuted((prev) => !prev);
  };

  useEffect(() => {
     const updateRoomData = async () => {
        await updateRoom({roomId, currentSpeakerId: user.id});
     }
     updateRoomData();
  },[])

  return (
    <div>
      <div className={styles.backContainer}>
        <button onClick={() => handleManualLeave()} className={styles.goBack}>
          <img src={arrowBack} alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          {room && <h2 className={styles.topic}>{room.topic}</h2>}
          <div className={styles.actions}>
            <button
              onClick={() => handleManualLeave()}
              className={styles.actionBtn}
            >
              <img src={exitIcon} alt="exit-icon" />
              <span>Leave quietly</span>
            </button>
          </div>
        </div>
        <div className={styles.clientsList}>
          {clients.map((client) => {
            return (
              <div className={styles.client} key={client.id}>
                <div className={styles.userHead}>
                  <img
                    className={styles.userAvatar}
                    src={client.avatar}
                    alt=""
                  />
                  <audio
                    autoPlay
                    ref={(instance) => {
                      provideRef(instance, client.id);
                    }}
                  />
                  <button
                    onClick={() => handleMuteClick(client.id)}
                    className={styles.micBtn}
                  >
                    {client.muted ? (
                      <img className={styles.mic} src={micOff} alt="mic" />
                    ) : (
                      <img className={styles.micImg} src={micOn} alt="mic" />
                    )}
                  </button>
                </div>
                <h4>{client.name}</h4>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Room;
