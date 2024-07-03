import {
  createRoomService,
  fetchRoomService,
  fetchRoomByIdService,
} from "../utils/roomService.js";
import RoomDto from "../dtos/room-dto.js";
import { Room } from "../models/roomModel.js";

export const createRooms = async (req, res) => {
  const { topic, roomType, roomToken } = req.body;

  if (!topic || !roomType) {
    return res
      .status(401)
      .json({ message: "Cannot Create Room without topic and roomtype" });
  }

  if(roomType === "private" && !roomToken){
    return res
      .status(401)
      .json({ message: "Cannot Create Private Room without Token" });
  }

  const room = await createRoomService({
    topic,
    roomType,
    roomToken,
    ownerId: req.user._id,
  });

  const newRoom = new RoomDto(room);

  return res.json(newRoom);
};

export const getAllRooms = async (req, res) => {
  const rooms = await fetchRoomService(["private", "open"]);

  const allRooms = rooms.map((room) => new RoomDto(room));
  return res.json(allRooms);
};

export const getRoom = async (req, res) => {
  console.log(req.params.id);
  const room = await fetchRoomByIdService(req.params.id);
  return res.json(room);
};

export const updateRoom = async (req, res) => {
  const { roomId, currentSpeakerId } = req.body;
  const room = await Room.findById(roomId);

  const isUserAlreadyInRoom = room.speakers.some(speakerId => speakerId.equals(currentSpeakerId));

  if (!isUserAlreadyInRoom) {
    room.speakers.push(currentSpeakerId);
    await room.save();
  } else {
    console.log("User is already a speaker in this room");
  }

  return res.status(200).json({ message: "Speaker added successfully" });
};
