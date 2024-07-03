import React from "react";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";
import Card from "../../Components/Shared/Card/Card";
import Button from "../../Components/Shared/Button/Button";

const Home = () => {
  const signInLinkStyle = {
    color: "#0077ff",
    fontWeight: "bold",
    textDecoration: "none",
    marginLeft: "10px",
  };
  const navigate = useNavigate();
  function startRegister() {
    navigate("/authenticate");
  }
  return (
    <div className={styles.cardWrapper}>
        <Card title="Welcome to AuralLink">
        <p className={styles.text}>
          We’re working hard to get AuralLink ready for everyone! While we wrap
          up the finishing touches, we’re adding people gradually to make sure
          nothing breaks. We will be back soon
        </p>
        <div>
          <Button onClick = {()=>startRegister()} text={"Lets Go !"}/>
        </div>
        <div className={styles.signinWrapper}>
          <span className={styles.hasInvite}>Have an invite text?</span>

        </div>
        </Card>
      </div>
  );
};

export default Home;
