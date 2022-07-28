import React from "react";

import NavBar from "../../components/navBar/NavBar";
import LeftBar from "../../components/leftBar/LeftBar";
import RightBar from "../../components/rightBar/RightBar";
import FeedBar from "../../components/feedBar/FeedBar";

import "./home.css";

const Home = () => {
  return (
    <>
      <NavBar />
      <div className="homeContainer">
        <LeftBar />
        <FeedBar />
        <RightBar />
      </div>
    </>
  );
};

export default Home;
