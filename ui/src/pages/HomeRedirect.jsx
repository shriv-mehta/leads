import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

const HomeRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user.role === ROLES.ADMIN ? "/admin/dashboard" : "/leads"} replace />;
};

export default HomeRedirect;
