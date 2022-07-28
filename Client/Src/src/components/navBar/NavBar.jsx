import "./navBar.css";

import {
  Search,
  Chat,
  ExitToApp,
  Settings,
  Home,
  Group,
  Security,
} from "@material-ui/icons";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { AuthContext } from "../../contexts/AuthContext";

const NavBar = () => {
  const { user } = useContext(AuthContext);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const apiURL = process.env.REACT_APP_API_URL;

  const [searching, setSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchUsers, setSearchUsers] = useState([]);

  const logOutHandler = () => {
    localStorage.clear();
    window.location.reload();
  };

  const profileHandler = (username) => {
    console.log(username);
  };

  useEffect(() => {
    const searchFunc = async () => {
      setSearching(true);
      if (searchQuery.length !== 0) {
        const res = await axios.get(`${apiURL}user/search/${searchQuery}`);

        const userList = res.data;

        setSearchUsers(userList);
      }
    };
    searchFunc();
  }, [searchQuery, apiURL]);

  return (
    <div className="navBarContainer">
      <div className="navBarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">SecureMedia</span>
        </Link>
      </div>
      <div className="navBarCenter">
        <div className="searchBar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friends"
            className="searchInput"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searching && searchQuery.length !== 0 && (
            <div className="searchResults">
              {searchUsers.map((u) => (
                <div className="result" key={u._id}>
                  <img
                    src={
                      u.profilePicture
                        ? PF + u.profilePicture
                        : PF + "avatars/noAvatar.png"
                    }
                    alt=""
                    className="resultImg"
                  />
                  <span className="resultName">{u.username}</span>
                  <Link
                    to={`/profile/${u.username}`}
                    style={{ textDecoration: "none" }}
                  >
                    <span className="resultLink">View Profile</span>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="navBarRight">
        <div className="navBarIcons">
          <div className="navBarIconItem">
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <Home />
            </Link>
          </div>
          <div className="navBarIconItem">
            <Link
              to="/group"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Group />
            </Link>
          </div>
          <div className="navBarIconItem">
            <Link
              to="/messenger"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Chat />
            </Link>
          </div>
          <div className="navBarIconItem">
            <Link
              to="/secretMessenger"
              style={{ textDecoration: "none", color: "white" }}
            >
              <Security />
            </Link>
          </div>
          <div className="navBarIconItem">
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <Settings />
            </Link>
          </div>
          <div className="navBarIconItem">
            {/* <Link
              to="/logout"
              style={{ textDecoration: "none", color: "white" }}
            > */}
            <ExitToApp onClick={logOutHandler} />
            {/* </Link> */}
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "avatars/noAvatar.png"
            }
            alt=""
            className="navBarImg"
          />
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
