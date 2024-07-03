import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home/Home";
import Navigation from "./Components/Shared/Navigation/Navigation";
import Authenticate from "./Pages/Authentication/Authenticate";
import Activate from "./Pages/Activate/Activate";
import Rooms from "./Pages/Rooms/Rooms";
import Room from "./Pages/Room/Room";
import { useSelector } from "react-redux";
import { useLoading } from "./hooks/useLoading";
import Loader from "./Components/Loader/Loader";

function App() {
  const { loading } = useLoading();

  return loading ? (
    <Loader />
  ) : (
    <Router>
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        <Route
          path="/authenticate"
          element={
            <GuestRoute>
              <Authenticate />
            </GuestRoute>
          }
        />
        <Route
          path="/activate"
          element={
            <SemiProtectedRoute>
              <Activate />
            </SemiProtectedRoute>
          }
        />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/room/:roomId"
          element={
            <ProtectedRoute>
              <Room />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

//protected routes

const GuestRoute = ({ children }) => {
  const { isAuth } = useSelector((state) => state.auth);

  const location = useLocation();

  if (isAuth) {
    return <Navigate to={`/rooms`} state={{ from: location }} />;
  }

  return children;
};

const SemiProtectedRoute = ({ children }) => {
  const { isAuth, user } = useSelector((state) => state.auth);

  const location = useLocation();

  if (!isAuth) {
    return <Navigate to={`/`} state={{ from: location }} />;
  }

  if (isAuth && !user.activated) {
    return children;
  }

  return <Navigate to={`/rooms`} state={{ from: location }} />;
};

const ProtectedRoute = ({ children }) => {
  const { isAuth, user } = useSelector((state) => state.auth);

  const location = useLocation();

  if (!isAuth) {
    return <Navigate to={`/`} state={{ from: location }} />;
  }

  if (isAuth && !user.activated) {
    return <Navigate to={`/activate`} state={{ from: location }} />;
  }

  return children;
};

export default App;
