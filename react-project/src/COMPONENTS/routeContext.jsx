import { useLocation } from "react-router-dom";
import { AuthProvider } from "../CONTEXT/authContext";

function RouteContext({ children }) {
  const location = useLocation();

  return <AuthProvider currentPath={location.pathname}>{children}</AuthProvider>;
}

export default RouteContext;
