import "./notFound.css"

import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="wrapper">
      <img src="https://i.imgur.com/qIufhof.png" className="img" alt="" />
      <h1>404 - Not Found!</h1>
      <Link className="link" to="/">Go Home</Link>
    </div>
  );
};

export default NotFound;
