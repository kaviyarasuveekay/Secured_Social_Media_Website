import "./message.css";

import { format } from "timeago.js";
import { useContext, useState, useEffect } from "react";
import axios from "axios";

import { AuthContext } from "../../contexts/AuthContext";
import AesCtr from "../../helpers/aes-ctr";
import { decrypt } from "../../helpers/rsa";

const Message = ({ message, own, isGroup, isSecret }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const apiURL = process.env.REACT_APP_API_URL;
  const secretImg = process.env.REACT_APP_SECRET_IMG;

  const [sender, setSender] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const getSender = async () => {
      try {
        const res = await axios.get(`${apiURL}user?userId=${message.sender}`);
        // console.log(res.data);
        setSender(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSender();

    if (isGroup) {
      const plainText = AesCtr.decrypt(message.text, "password", 256);
      setMsg(plainText);
    } else {
      const cipherText = message.text.split(",");
      let numArray = [];

      for (var i = 0; i < cipherText.length; i++)
        numArray.push(parseInt(cipherText[i]));

      const decryptedMsg = decrypt(numArray).join("");
      setMsg(decryptedMsg);
    }
  }, [message, own, apiURL, isGroup, isSecret]);

  const showMsg = () => {
    alert("Message states: " + msg);
  };

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        {!own && (
          <img
            className="messageImg"
            src={
              sender?.profilePicture
                ? PF + sender?.profilePicture
                : PF + "avatars/noAvatar.png"
            }
            alt=""
          />
        )}
        {!isSecret && <p className="messageText">{msg}</p>}
        {isSecret && (
          <img
            src={"data:image/png;base64," + secretImg}
            alt=""
            className="secretImg"
            onClick={showMsg}
          />
        )}
      </div>
      <div className="messageBottom">
        {!own && <span>{sender?.username}</span>}
        {format(message.createdAt)}
      </div>
    </div>
  );
};

export default Message;
