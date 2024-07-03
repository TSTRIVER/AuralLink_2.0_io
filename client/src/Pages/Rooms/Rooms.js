import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Rooms.module.css";
import RoomCard from "../../Components/RoomCard/RoomCard";
import AddRoomModal from "../../Components/RoomModal/AddRoomModal";
import { getAllRooms } from "../../Components/Http";
import signal from "../../images/signal.png";
import search from "../../images/search-icon.png";
import closeIcon from "../../images/close-icon.png";

const Rooms = () => {
  const [showModal, setShowModal] = useState(false);
  const [roomKey, setRoomKey] = useState("");
  const [roomType, setRoomType] = useState("open");
  const [enterRoomModal, setEnterRoomModal] = useState({
    status: false,
    room: {},
  });
  const navigate = useNavigate();

  function openModal() {
    setShowModal(true);
  }

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const accessAllRooms = async () => {
      const { data } = await getAllRooms();
      setRooms(data);
      console.log(data);
    };
    accessAllRooms();
  }, []);

  return (
    <>
      <div className="container">
        <div className={styles.roomsHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All voice rooms</span>
            <div className={styles.searchBox}>
              <img src={search} alt="search" />
              <input type="text" className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.right}>
            <button
              className={styles.startRoomButton}
              onClick={() => openModal()}
            >
              <img src={signal} alt="add-room" />
              <span>Start a room</span>
            </button>
          </div>
        </div>

        <div className={styles.toggleDiv}>
          <div
            className={
              roomType === "open"
                ? `${styles.toggles} ${styles.active}`
                : `${styles.toggles} ${styles.inactive}`
            }
            onClick={() => setRoomType("open")}
          >
            Open Rooms
          </div>
          <div
            className={
              roomType === "private"
                ? `${styles.toggles} ${styles.active}`
                : `${styles.toggles} ${styles.inactive}`
            }
            onClick={() => setRoomType("private")}
          >
            Private Rooms
          </div>
        </div>
        <div className={styles.roomList}>
          {rooms.map((room) => (
            roomType === room.roomType &&
            <RoomCard
              key={room.id}
              room={room}
              setEnterRoomModal={setEnterRoomModal}
            />
          ))}
        </div>
      </div>
      {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
      {enterRoomModal.status && (
        <div className={styles.modalMask}>
          <div className={styles.modalBody}>
            <button
              onClick={() => setEnterRoomModal({ status: false, room: {} })}
              className={styles.keyCloseBtn}
            >
              <img
                src={closeIcon}
                alt="close"
                style={{ height: "25px", width: "25px" }}
              />
            </button>
            <h2>
              Enter{" "}
              <span className={styles.roomcol}>
                {enterRoomModal?.room?.topic}'s
              </span>{" "}
              Room Key
            </h2>
            <input
              type="text"
              name="roomKey"
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value)}
            />
            <button
              onClick={() => {
                if (roomKey === enterRoomModal?.room?.roomToken) {
                  navigate(`/room/${enterRoomModal?.room?.id}`);
                } else {
                  alert("Invalid Key");
                }
              }}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Rooms;
