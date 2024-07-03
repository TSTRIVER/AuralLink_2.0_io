import React, { useState } from "react";
import Card from "../../../../Components/Shared/Card/Card";
import Button from "../../../../Components/Shared/Button/Button";
import styles from "../StepPhoneEmail.module.css";
import TextInput from "../../../../Components/Shared/TextInput/TextInput";
import { useDispatch } from "react-redux";
import { sendOTP } from "../../../../Components/Http";
import { setOTP } from "../../../../store/authSlice";
import toast, { Toaster } from "react-hot-toast";

const Phone = ({ onNext }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const dispatch = useDispatch();

  const onSubmit = async () => {
    if (!phoneNumber) {
      toast("Please enter a valid phone number", {
        style: {
          backgroundColor: "#000000",
          color: "red",
        },
      });
      return;
    }
    try {
      const { data } = await sendOTP({
        phone: phoneNumber,
        flag: "phone",
        email: "",
      });
      if(data) {
        dispatch(setOTP(data));
        onNext();
      }

    } catch (error) {
      console.log(error);
      console.log("Arre yahin kuch gadbad hai");
      toast(error, {
        style: {
          backgroundColor: "#000000",
          color: "red",
        },
      });
    }
  };

  return (
  
      <Card title="Enter Your Freaking Phone Number">
      <Toaster />
        <TextInput
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div>
          <div className={styles.actionButtonWrap}>
            <Button text="Next" onClick={() => onSubmit()} />
          </div>
          <p className={styles.bottomParagraph}>
            By entering your number, you’re agreeing to our Terms of Service and
            Privacy Policy. Thanks!
          </p>
        </div>
      </Card>
    
  );
};
//prop drilling
export default Phone;
