import "./online.css";

const Online = ({ group }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <li className="rightBarFriend">
      <div className="rightBarProfileImgContainer">
        <img
          className="rightBarProfileImg"
          src={
            group.groupPicture
              ? PF + group?.groupPicture
              : PF + "avatars/group/group3.png"
          }
          alt=""
        />
        {/* <span className="rightBarOnline"></span> */}
      </div>
      <span className="rightBarUsername">{group?.groupName}</span>
    </li>
  );
};

export default Online;
