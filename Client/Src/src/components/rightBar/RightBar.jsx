import "./rightBar.css";

import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Remove, Add } from "@material-ui/icons";

import Online from "../online/Online";
import { AuthContext } from "../../contexts/AuthContext";

const RightBar = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const apiURL = process.env.REACT_APP_API_URL;

  const [friends, setFriends] = useState([]);
  const [conversations, setConversations] = useState([]);

  const { user: currentUser, dispatch } = useContext(AuthContext);

  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          `${apiURL}conversation/group/${currentUser?._id}`
        );
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [currentUser, apiURL]);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get(`${apiURL}user/friends/${user._id}`);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
    if (user) setFollowed(currentUser.followings.includes(user._id));
  }, [user, currentUser, apiURL]);

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`${apiURL}user/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`${apiURL}user/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(followed, currentUser, user._id);

  const HomeRightBar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img src={PF + "birthday.png"} alt="" className="birthdayImg" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have their birthday
            today.
          </span>
        </div>

        <hr className="rightBarHr" />

        <h4 className="rightBarTitle">Your Groups</h4>
        <ul className="rightBarFriendList">
          {conversations.map((c) => (
            <Online group={c}/>
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightBar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightBarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? (
              <Remove className="rightBarFollowIcon" />
            ) : (
              <Add className="rightBarFollowIcon" />
            )}
          </button>
        )}
        <h4 className="rightBarTitle">User information</h4>
        <div className="rightBarInfo">
          <div className="rightBarInfoItem">
            <span className="rightBarInfoKey">City:</span>
            <span className="rightBarInfoValue">{user.city || "N/A"}</span>
          </div>
          <div className="rightBarInfoItem">
            <span className="rightBarInfoKey">Gender:</span>
            <span className="rightBarInfoValue">{user.gender || "N/A"}</span>
          </div>
          <div className="rightBarInfoItem">
            <span className="rightBarInfoKey">Relationship:</span>
            <span className="rightBarInfoValue">
              {user.relationship || "N/A"}
            </span>
          </div>
        </div>
        <hr className="rightBarHr" />

        <h4 className="rightBarTitle">User friends</h4>
        <div className="rightBarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{
                textDecoration: "none",
                textAlign: "center",
                color: "black",
              }}
            >
              <div className="rightBarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "avatars/noAvatar.png"
                  }
                  alt=""
                  className="rightBarFollowingImg"
                />
                <span className="rightBarFollowingName">{friend.username}</span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightBar">
      <div className="rightBarWrapper">
        {user ? <ProfileRightBar /> : <HomeRightBar />}
      </div>
    </div>
  );
};

export default RightBar;
