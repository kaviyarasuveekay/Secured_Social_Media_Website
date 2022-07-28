import "./leftBar.css";
import { Chat, Group, AddRounded, AccountCircle } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../contexts/AuthContext";

const LeftBar = () => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const apiURL = process.env.REACT_APP_API_URL;

  const [friends, setFriends] = useState([]);

  const { user } = useContext(AuthContext);

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
  }, [user, apiURL]);

  return (
    <div className="leftBar">
      <div className="leftBarWrapper">
        <ul className="leftBarList">
          <Link
            to={`/profile/${user.username}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <li className="leftBarListItem">
              <AccountCircle className="leftBarIcon" />
              <span className="leftBarListItemText">My Profile</span>
            </li>
          </Link>
          <Link
            to="/messenger"
            style={{ textDecoration: "none", color: "black" }}
          >
            <li className="leftBarListItem">
              <Chat className="leftBarIcon" />
              <span className="leftBarListItemText">Chats</span>
            </li>
          </Link>
          <Link to="/group" style={{ textDecoration: "none", color: "black" }}>
            <li className="leftBarListItem">
              <Group className="leftBarIcon" />
              <span className="leftBarListItemText">Groups</span>
            </li>
          </Link>
          <Link
            to="/group/new"
            style={{ textDecoration: "none", color: "black" }}
          >
            <li className="leftBarListItem">
              <AddRounded className="leftBarIcon" />
              <span className="leftBarListItemText">New Group</span>
            </li>
          </Link>
        </ul>
        <hr className="leftBarHr" />
        <ul className="leftBarFriendList">
          {friends.map((friend) => (
            <li className="leftBarFriend">
              <img
                src={
                  friend.profilePicture
                    ? PF + friend.profilePicture
                    : PF + "avatars/group/group1.png"
                }
                alt=""
                className="leftBarFriendImg"
              />
              <span className="leftBarFriendName">{friend.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeftBar;
