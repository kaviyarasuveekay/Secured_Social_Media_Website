import "./post.css";

import { Link } from "react-router-dom";
import { MoreVert } from "@material-ui/icons";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { format } from "timeago.js";

import { AuthContext } from "../../contexts/AuthContext";
import { decryptByDES } from "../../helpers/des";

const Post = ({ post }) => {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const [desc, setDesc] = useState("");

  const [options, setOptions] = useState(false);

  const apiURL = process.env.REACT_APP_API_URL;
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const key = process.env.REACT_APP_DES_KEY;

  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`${apiURL}user?userId=${post.userId}`);
      // console.log(res.data);
      setUser(res.data);
    };
    fetchUser();

    const plainText = decryptByDES(post.desc, key);

    setDesc(plainText)

  }, [post, apiURL, key]);

  const likeHandler = () => {
    try {
      axios.put(`${apiURL}post/${post._id}/like`, { userId: currentUser._id });
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const optionHandler = () => {
    setOptions(!options);
  };

  const deleteHandler = async () => {
    if (window.confirm("Do you really want to delete this post ?")) {
      try {
        const data = {
          userId: user._id,
        };
        await axios.delete(`${apiURL}post/${post._id}`, {
          data: data,
        });

        window.location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  const editHandler = () => {
    alert("Edit Clicked" + post._id);
  };

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "avatars/noAvatar.png"
                }
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            {currentUser._id === post.userId && (
              <MoreVert onClick={optionHandler} />
            )}
            {options && (
              <div className="postOptions">
                {/* <div className="postOption" onClick={editHandler}>
                  Edit
                </div> */}
                <div className="postOption" onClick={deleteHandler}>
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{desc}</span>
          {post.img ? (
            <img className="postImg" src={`${PF}posts/${post.img}`} alt="" />
          ) : (
            ""
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              src={isLiked ? `${PF}heart.png` : `${PF}heart-outline.png`}
              alt=""
              onClick={likeHandler}
              className="likeIcon"
            />
            <span className="postLikeCounter">
              {isLiked
                ? `You and ${like - 1} others like this post`
                : `${like} likes`}
            </span>
          </div>
          <div className="postBottomRight">
            {/* <span className="postCommentText">15 comments</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
