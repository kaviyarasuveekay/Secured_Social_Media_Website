import Share from "../share/Share";
import Post from "../post/Post";

import "./feedBar.css";

import { useState, useEffect, useContext } from "react";
import axios from "axios";

import { AuthContext } from "../../contexts/AuthContext";

const FeedBar = ({ username }) => {
  const apiURL = process.env.REACT_APP_API_URL;
  const [posts, setPosts] = useState([]);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get(`${apiURL}post/user/${username}`)
        : await axios.get(`${apiURL}post/timeline/${user._id}`);
      // console.log(res.data);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user, apiURL]);

  return (
    <div className="feedBar">
      <div className="feedBarWrapper">
        {(!username ||username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}; 

export default FeedBar;
