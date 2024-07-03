import React, { useState } from "react";
import Card from "../../../../Components/Shared/Card/Card";
import Button from "../../../../Components/Shared/Button/Button";
import styles from "../StepPhoneEmail.module.css";
import TextInput from "../../../../Components/Shared/TextInput/TextInput";
import { sendOTP } from "../../../../Components/Http";
import { setOTP } from "../../../../store/authSlice";
import { useDispatch } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

const Email = ({ onNext }) => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const onSubmit = async () => {
    if (!email) {
      toast("Please enter a valid email", {
        style: {
          backgroundColor: "#000000",
          color: "red",
        },
      });
      return;
    }
    try {
      const { data } = await sendOTP({
        phone: "",
        flag: "email",
        email: email,
      });
      console.log(data);
      dispatch(setOTP(data));
      onNext();
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
      <Card title="Enter Your Email">
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} />
        <div>
          <div className={styles.actionButtonWrap}>
            <Button text="Next" onClick={() => onSubmit()} />
          </div>
          <p className={styles.bottomParagraph}>
            By entering your email, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
        </div>
      </Card>
    </>
  );
};

export default Email;
