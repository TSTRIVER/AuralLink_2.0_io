import express from "express";
import { createRooms, getAllRooms, getRoom, updateRoom} from "../controllers/roomsController.js";
import { accessTokenMiddleware } from "../middlewares/authmiddleware.js";

const RoomsRouter = express.Router();

RoomsRouter.post("/rooms", accessTokenMiddleware, createRooms);
RoomsRouter.get("/rooms", accessTokenMiddleware, getAllRooms);
RoomsRouter.get("/rooms/:id", accessTokenMiddleware, getRoom);
RoomsRouter.patch("/rooms", accessTokenMiddleware, updateRoom);

export default RoomsRouter;
