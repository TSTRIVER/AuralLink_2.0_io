import React, { useState } from "react";
import Card from ".././../../Components/Shared/Card/Card";
import Button from ".././../../Components/Shared/Button/Button";
import styles from "./StepAvatar.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setAvatar } from "../../../store/activateSlice";
import { activate } from "../../../Components/Http/index";
import { setAuth } from "../../../store/authSlice";

const StepAvatar = ({ onNext }) => {
  const dispatch = useDispatch();
  const { name, avatar } = useSelector((state) => state.activate);
  const [image, setImage] = useState(
    "https://png.pngtree.com/background/20230528/original/pngtree-the-avatar-of-a-man-with-headphones-in-front-of-a-picture-image_2772528.jpg?alt=search"
  );

  function captureImage(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function () {
      setImage(reader.result);
      dispatch(setAvatar(reader.result));
    };
  }
  async function submit() {
    if (!name || !avatar) return;
    try {
      const { data } = await activate({ name, avatar });
      console.log(data);
      if (data.auth) {
        dispatch(setAuth(data));
      }
      console.log(data);
    } catch (err) {
      console.log("Ye wala axios ka panauti block execute hua");
      console.log(err);
    }
  }
  return (
    <>
      <Card title={`Okay, ${name}`}>
        <p className={styles.subHeading}>How’s this photo?</p>
        <div className={styles.avatarWrapper}>
          <img className={styles.avatarImage} src={image} alt="avatar" />
        </div>
        <div>
          <input
            onChange={captureImage}
            id="avatarInput"
            type="file"
            className={styles.avatarInput}
          />
          <label className={styles.avatarLabel} htmlFor="avatarInput">
            Choose a different photo
          </label>
        </div>
        <div>
          <Button onClick={() => submit()} text="Next" />
        </div>
      </Card>
    </>
  );
};

export default StepAvatar;
