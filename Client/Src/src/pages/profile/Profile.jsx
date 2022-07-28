import "./profile.css";
import NavBar from "../../components/navBar/NavBar";
import LeftBar from "../../components/leftBar/LeftBar";
import FeedBar from "../../components/feedBar/FeedBar";
import RightBar from "../../components/rightBar/RightBar";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router";

const Profile = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const [user, setUser] = useState({});
  const username = useParams().username;

  const apiURL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${apiURL}user?username=${username}`);
      // console.log(res.data);
      setUser(res.data);
    };
    fetchUser();
  }, [apiURL, username]);

  return (
    <>
      <NavBar />
      <div className="profile">
        <LeftBar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "noCover.png"
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "avatars/noAvatar.png"
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <FeedBar username={username} />
            <RightBar user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
