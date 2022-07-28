import "./conversation.css";

import { useEffect, useState } from "react";
import axios from "axios";

const Conversation = ({ conversation, isCurrent, currentUser, isGroup }) => {
  const [user, setUser] = useState(null);

  const apiURL = process.env.REACT_APP_API_URL;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await axios.get(`${apiURL}user?userId=${friendId}`);
        // console.log(res.data);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [conversation, currentUser, apiURL]);

  return (
    <div className={isCurrent ? "conversation current" : "conversation"}>
      <img
        src={
          isGroup
            ? conversation?.groupPicture
              ? PF + conversation.groupPicture
              : PF + "avatars/noAvatarGroup.png"
            : user?.profilePicture
            ? PF + user.profilePicture
            : PF + "avatars/noAvatar.png"
        }
        alt=""
        className="conversationImg"
      />
      <span className="conversationName">
        {isGroup ? conversation.groupName : user?.username}
      </span>
    </div>
  );
};

export default Conversation;
