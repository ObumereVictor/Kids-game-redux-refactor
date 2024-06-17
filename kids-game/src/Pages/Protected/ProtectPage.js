import { Navigate, Outlet } from "react-router-dom";

const ProtectPage = ({ children, data }) => {
  if (!data) {
    return <Navigate to="/login" replace={true} />;
  }
  return <Outlet>{children}</Outlet>;
};

export default ProtectPage;
