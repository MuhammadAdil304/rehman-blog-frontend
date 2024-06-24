import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function MAOnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser && (currentUser.data?.user?.isAdmin || currentUser.isAdmin) ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
}
