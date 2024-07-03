import jwt from "jsonwebtoken";
import { RefreshTokens } from "../models/refreshModel.js";

export const generateTokens = (payload) => {
  const jwtAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "1m",
  });

  const jwtRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: "1y",
  });

  return { jwtAccessToken, jwtRefreshToken };
};

export const storeRefreshToken = async (token, userId) => {
  try {
    await RefreshTokens.create({
      token,
      userId,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const verifyAccessToken = async (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
};

export const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
};

export const findRefreshToken = async (userId, refreshToken) => {
  return await RefreshTokens.findOne({
    userId: userId,
    token: refreshToken,
  });
};

export const updateRefreshToken = async (userId, refreshToken) => {
  return await RefreshTokens.updateOne(
    { userId: userId },
    { token: refreshToken }
  );
};

export const removeToken = async (refreshToken) => {
  return await RefreshTokens.deleteOne({ token: refreshToken });
};
