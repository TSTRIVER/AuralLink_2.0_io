import {
  generateOTP,
  sendOTPBySMS,
  verifyOTP,
  sendEmail,
} from "../utils/otpservice.js";
import { generateHash } from "../utils/hashservice.js";
import { User } from "../models/userModel.js";
import { generateTokens } from "../utils/tokenService.js";
import UserDto from "../dtos/user-dto.js";
import {
  storeRefreshToken,
  verifyRefreshToken,
  findRefreshToken,
  updateRefreshToken,
  removeToken,
} from "../utils/tokenService.js";

export const sendOtp = async (req, res) => {
  const { phone, flag, email } = req.body;

  if (flag === "phone" && !phone) {
    return res.json({
      success: false,
      message: "Please Enter Valid Phone Number",
    });
  }
  if (flag === "email" && !email) {
    return res.json({
      success: false,
      message: "Please Enter Valid Email Address",
    });
  }

  const generatedOTP = generateOTP();

  const expires = Date.now() + 1000 * 60 * 2;
  const data =
    flag === "phone"
      ? `${phone}.${generatedOTP}.${expires}`
      : `${email}.${generatedOTP}.${expires}`;
  const hash = generateHash(data);

  try {
    // await sendOTPBySMS(phone, generatedOTP);
    if (flag === "phone") {
      return res.status(201).json({
        hash: `${hash}.${expires}`,
        phone,
        generatedOTP,
        flag,
        email: "",
      });
    } else {
      sendEmail(email, generatedOTP);
      return res.status(201).json({
        hash: `${hash}.${expires}`,
        email,
        generatedOTP,
        flag,
        phone: "",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json("Failed To Send The Message");
  }
};

export const OTPVerification = async (req, res) => {
  const { hash, otp, phone, email, flag } = req.body;

  if (flag === "phone") {
    if (!otp || !phone || !hash)
      return res.json({
        success: false,
        message: "All fields are required",
      });
  }
  if (flag === "email") {
    if (!otp || !email || !hash)
      return res.json({
        success: false,
        message: "All fields are required",
      });
  }

  const [hashedOTP, expires] = hash.split(".");

  if (Date.now() > expires) {
    return res.json("Your OTP has been expired");
  }

  const data =
    flag === "phone"
      ? `${phone}.${otp}.${expires}`
      : `${email}.${otp}.${expires}`;

  const isValid = verifyOTP(hashedOTP, data);
  if (!isValid) {
    return res.json("Invalid OTP");
  }

  let user;

  if (flag === "phone") {
    user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({
        phone,
      });
    }
  } else {
    user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
      });
    }
  }

  const { jwtAccessToken, jwtRefreshToken } = generateTokens({
    _id: user._id,
    activated: false,
  });

  await storeRefreshToken(jwtRefreshToken, user._id);

  res.cookie("refreshToken", jwtRefreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 30,
  });

  res.cookie("accessToken", jwtAccessToken, {
    httpOnly: true,
    maxAge: 1000 * 60,
  });

  const userDto = new UserDto(user);

  return res.json({ jwtAccessToken, user: userDto });
};

export const updateRefreshTokens = async (req, res) => {
  // get refresh token from cookie
  const { refreshToken: refreshTokenFromCookie } = req.cookies;
  // check if token is valid
  let userData;
  try {
    userData = verifyRefreshToken(refreshTokenFromCookie);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
  // Check if token is in db
  try {
    const token = await findRefreshToken(userData._id, refreshTokenFromCookie);
    if (!token) {
      return res.status(401).json({ message: "Invalid token" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
  // check if valid user
  const user = await User.findOne({ _id: userData._id });
  if (!user) {
    return res.status(404).json({ message: "No user" });
  }
  // Generate new tokens
  const { jwtRefreshToken, jwtAccessToken } = generateTokens({
    _id: userData._id,
  });

  // Update refresh token
  try {
    await updateRefreshToken(userData._id, jwtRefreshToken);
  } catch (err) {
    return res.status(500).json({ message: "Internal error" });
  }
  // put in cookie
  res.cookie("refreshToken", jwtRefreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 30,
    httpOnly: true,
  });

  res.cookie("accessToken", jwtAccessToken, {
    maxAge: 1000 * 60,
    httpOnly: true,
  });

  // response
  const userDto = new UserDto(user);
  return res.json({ user: userDto, auth: true });
};

export const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  // delete refresh token from db
  await removeToken(refreshToken);
  // delete cookies
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.json({ user: null, auth: false });
};
