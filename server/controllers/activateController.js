import jimp from "jimp";
import UserDto from "../dtos/user-dto.js";
import path from "path";
import { User } from "../models/userModel.js";
import { fileURLToPath } from "url";
import { dirname } from "path";

export const activateUser = async (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const buffer = Buffer.from(
    avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
    "base64"
  );
  const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  try {
    const jimResp = await jimp.read(buffer);
    jimResp
      .resize(150, jimp.AUTO)
      .write(path.resolve(__dirname, `../storage/${imagePath}`));
  } catch (err) {
    console.log(err, "pehle wala block");
    return res.status(500).json({ message: "Could not process the image" });
  }

  const userId = req.user._id;

  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    user.activated = true;
    user.name = name;
    user.avatar = `/storage/${imagePath}`;

    await user.save();

    res.json({ user: new UserDto(user), auth: true });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong!" });
  }
};
