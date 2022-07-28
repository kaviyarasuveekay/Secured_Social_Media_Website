import "./share.css";
import { PermMedia, Cancel } from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import axios from "axios";

import { AuthContext } from "../../contexts/AuthContext";
import { encryptByDES } from "../../helpers/des";

const Share = () => {
  const apiURL = process.env.REACT_APP_API_URL;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const key = process.env.REACT_APP_DES_KEY;

  const { user } = useContext(AuthContext);

  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    const cipherText = encryptByDES(desc.current.value, key);
    const newPost = {
      userId: user._id,
      desc: cipherText,
    };

    if (file) {
      const data = new FormData();
      const fileName = Date.now() + "." + file.name.split(".").pop();
      data.append("name", fileName);
      data.append("file", file);
      newPost.img = fileName;
      // console.log(newPost);
      try {
        await axios.post(`${apiURL}upload/`, data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      await axios.post(`${apiURL}post/`, newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "avatars/noAvatar.png"
            }
            alt=""
            className="shareProfileImg"
          />
          <input
            className="shareInput"
            placeholder={`What's in your mind ${user.username}?`}
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="lightgreen" className="shareIcon" />
              <span className="shareOptionText">Choose Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
          <button className="shareButton" type="submit">
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default Share;
