import "./groupMember.css";

import { useEffect, useState } from "react";
import axios from "axios";

const GroupMember = ({ memberId }) => {
  const [member, setMember] = useState(null);

  const apiURL = process.env.REACT_APP_API_URL;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(`${apiURL}user?userId=${memberId}`);
        setMember(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [memberId, apiURL]);

  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            src={
              member?.profilePicture
                ? PF + member?.profilePicture
                : PF + "avatars/noAvatar.png"
            }
            alt=""
            className="chatOnlineImg"
          />
        </div>
        <div className="chatOnlineName">{member?.username}</div>
      </div>
    </div>
  );
};

export default GroupMember;
