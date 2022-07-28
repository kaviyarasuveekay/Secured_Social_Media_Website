import "./groupAdd.css";

import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import NavBar from "../../components/navBar/NavBar";
import { AuthContext } from "../../contexts/AuthContext";

const GroupAdd = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const { user } = useContext(AuthContext);
  const history = useNavigate();

  const [friends, setFriends] = useState([]);
  const [checkedFriends, setCheckedFriends] = useState([user?._id]);

  const { id } = useParams();
  const groupName = useRef();

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

    // const getConversation = async () => {
    //   try {
    //     const conversation = await axios.get(
    //       `${apiURL}conversation/convo/${id}`
    //     );
    //     setConversation(conversation.data[0]);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    // getConversation();
  }, [user, apiURL, id]);

  const handleCheckBox = (e) => {
    const isChecked = e.target.checked;
    const friendId = e.target.value;

    if (isChecked && !checkedFriends.includes(friendId)) {
      let friendList = checkedFriends;
      friendList.push(friendId);
      setCheckedFriends([...friendList]);
    } else {
      let friendList = checkedFriends;
      const idx = friendList.indexOf(friendId);
      friendList.splice(idx, 1);
      setCheckedFriends([...friendList]);
    }

    console.log(e.target.checked, e.target.value, checkedFriends);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const i = Math.floor(Math.random() * 2) + 1;

    const newConversation = {
      members: [...checkedFriends],
      groupName: groupName.current.value,
      groupPicture: `avatars/group/group${i}.png`,
      groupAdmin: user._id,
    };

    try {
      await axios.post(`${apiURL}conversation/group`, newConversation);
      history("/group");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <NavBar />
      <div className="groupAdd">
        <form className="groupAddForm" onSubmit={handleSubmit}>
          <div className="groupIconWrapper">
            <img
              src={PF + "avatars/noAvatarGroup.png"}
              alt=""
              className="groupIcon"
            />
          </div>
          <div className="addInput">
            <label>Group Name</label>
            <input type="text" className="groupName" ref={groupName} required />
          </div>
          <div className="groupMembers">
            <span>Group Members</span>
            <div className="boxes">
              {friends?.map((friend) => (
                <div className="addInput">
                  <label>{friend.username}</label>
                  <input
                    type="checkbox"
                    key={friend._id}
                    value={friend._id}
                    onChange={(e) => handleCheckBox(e)}
                  />
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="addSubmit">
            Submit changes
          </button>
        </form>
      </div>
    </>
  );
};

export default GroupAdd;
