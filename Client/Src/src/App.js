import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Messenger from "./pages/messenger/Messenger";
import GroupMessenger from "./pages/groupMessenger/GroupMessenger";
import SecretMessenger from "./pages/secretMessenger/SecretMessenger";
import NotFound from "./pages/404/NotFound";
import GroupAdd from "./pages/groupAdd/GroupAdd";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "./contexts/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Register />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/messenger"
          element={!user ? <Navigate to="/" /> : <Messenger />}
        />
        <Route
          path="/secretMessenger"
          element={!user ? <Navigate to="/" /> : <SecretMessenger />}
        />
        <Route
          path="/profile/:username"
          element={!user ? <Navigate to="/" /> : <Profile />}
        />
        <Route
          path="/group"
          element={!user ? <Navigate to="/" /> : <GroupMessenger />}
        />
        <Route
          path="/group/new"
          element={!user ? <Navigate to="/" /> : <GroupAdd />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
