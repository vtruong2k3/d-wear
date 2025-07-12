import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";
const useAuth = () => {
  //   const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state: RootState) => state.authenSlice.isLogin);

  const requireAuth = (action: () => void) => {
    if (isLogin) {
      action();
    } else {
      navigate("/login");
    }
  };

  return { requireAuth, isAuthenticated: isLogin };
};

export default useAuth;
