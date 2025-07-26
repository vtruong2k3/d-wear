import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { doLogout } from "../../../redux/features/client/authenSlice.ts";
import { type AppDispatch, type RootState } from "../../../redux/store.ts";
import { useNavigate } from "react-router-dom";
import { ShoppingBagIcon } from "lucide-react";
import { fetchUserProfile } from "../../../redux/features/client/thunks/authUserThunk.ts";

export default function AccountMenu() {

  const user = useSelector((state: RootState) => state.authenSlice.user);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const open = Boolean(anchorEl);


  const avatarSrc = React.useMemo(() => {
    const avatar = user?.avatar;
    if (!avatar) return undefined;

    if (avatar instanceof File) {
      return URL.createObjectURL(avatar);
    }

    if (typeof avatar === "string") {
      if (avatar.startsWith("http")) {
        return avatar;
      }
      // Nếu là đường dẫn tương đối từ backend
      const normalized = avatar.startsWith("/")
        ? avatar
        : `/${avatar}`;
      return `http://localhost:5000${normalized.replace(/\\/g, "/")}`;
    }

    return undefined;
  }, [user?.avatar]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(doLogout());
  };
  React.useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);
  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              sx={{ width: 32, height: 32 }}
              src={avatarSrc}
            >
              {!avatarSrc && (user?.username?.[0]?.toUpperCase() || "?")}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/profile"); // ← thay đổi tại đây
          }}
        >
          <Avatar /> Profile
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem>
        <Divider />
        {/* ✅ Thêm mục Đơn hàng ở đây */}
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/orders"); // hoặc bất kỳ URL nào bạn định nghĩa
          }}
        >
          <ListItemIcon>
            <ShoppingBagIcon fontSize="small" />
          </ListItemIcon>
          Đơn hàng của tôi
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
