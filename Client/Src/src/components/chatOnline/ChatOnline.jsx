import "./chatOnline.css";

const ChatOnline = ({ user }) => {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  return (
    <div className="chatOnline">
      <div className="chatOnlineFriend">
        <div className="chatOnlineImgContainer">
          <img
            src={
              user?.profilePicture
                ? PF + user?.profilePicture
                : PF + "avatars/noAvatar.png"
            }
            alt=""
            className="chatOnlineImg"
          />
        </div>
        <div className="chatOnlineName">{user?.username}</div>
      </div>
    </div>
  );
};

export default ChatOnline;
