import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  //   const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.authenSlice.isLogin);

  console.log(isLogin, "isLoginisLogin");

  const requireAuth = (action) => {
    if (isLogin) {
      action();
    } else {
      navigate("/login");
    }
  };

  return { requireAuth, isAuthenticated: isLogin };
};

export default useAuth;
