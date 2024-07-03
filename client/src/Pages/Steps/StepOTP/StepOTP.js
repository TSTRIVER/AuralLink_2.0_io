import React, { useState } from "react";
import Card from "../../../Components/Shared/Card/Card";
import Button from "../../../Components/Shared/Button/Button";
import TextInput from "../../../Components/Shared/TextInput/TextInput";
import styles from "./StepOTP.module.css";
import { verifyOTP } from "../../../Components/Http";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../store/authSlice";
import toast, { Toaster } from "react-hot-toast";

const StepOTP = ({ onNext }) => {
  const { phone, hash, email, flag } = useSelector((state) => state.auth.otp);
  const [otp, setOtp] = useState("");

  const dispatch = useDispatch();

  const onSubmit = async () => {
    try {
      if (flag === "phone") {
        if (!otp || !phone || !hash) return;
      }
      if (flag === "email") {
        if (!otp || !email || !hash) return;
      }

      const { data } = await verifyOTP({ otp, phone, hash, email, flag });
      console.log(data);
      dispatch(setAuth(data));
    } catch (err) {
      toast(err, {
        style: {
          backgroundColor: "#000000",
          color: "red",
        },
      });
    }
  };

  return (
    <>
      <Toaster />
      <div className={styles.cardWrapper}>
        <Card title="Enter the code we just texted you" icon="lock-emoji">
          <TextInput value={otp} onChange={(e) => setOtp(e.target.value)} />
          <div className={styles.actionButtonWrap}>
            <Button text="Next" onClick={() => onSubmit()} />
          </div>
          <p className={styles.bottomParagraph}>
            By entering your number/email, you’re agreeing to our Terms of
            Service and Privacy Policy. Thanks!
          </p>
        </Card>
      </div>
    </>
  );
};

export default StepOTP;
