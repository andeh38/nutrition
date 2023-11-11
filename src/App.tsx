import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAppSelector } from "./hooks/hooks";
import Home from "./home";
import Navigator from "./home/Navigator";
import Analytics from "./analytics/Analytics";
import Authentication from "./auth/Authentication";

const NavigatorWrapper = () => (
  <>
    <Navigator />
    <Outlet />
  </>
);

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAppSelector((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const RequireNoAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAppSelector((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Routes>
        <Route
          path="auth"
          element={
            <RequireNoAuth>
              <Authentication />
            </RequireNoAuth>
          }
        />
        <Route path="/" element={<NavigatorWrapper />}>
          <Route
            index
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
          <Route
            path="analytics"
            element={
              <RequireAuth>
                <Analytics />
              </RequireAuth>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
