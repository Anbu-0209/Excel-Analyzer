import { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Box,
  Menu,
  MenuItem,
  useTheme,
  Avatar,
} from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import {
  Search as SearchIcon,
  NotificationsOutlined as NotificationsIcon,
  LightModeOutlined,
  DarkModeOutlined,
  SettingsOutlined as SettingsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import ProfileImg from "../../Assets/avatar.avif";

// Dynamic Search Box Styling
const Search = styled("div")(({ theme }) => {
  const isLight = theme.palette.mode === "light";
  return {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(isLight ? "#000" : "#fff", 0.10),
    "&:hover": {
      backgroundColor: alpha(isLight ? "#000" : "#fff", 0.20),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(3),
      width: "auto",
    },
    transition: "background-color 0.3s ease",
  };
});

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.mode === "light" ? "#000" : "#fff",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          navigate("/");
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          backgroundColor: theme.palette.mode === "light" ? "#c2d3ed" : colors.primary[400],
          transition: "background-color 0.3s ease",
        }}
      >
        <Toolbar>
          <Search>
            <SearchIconWrapper>
              <SearchIcon sx={{ color: theme.palette.mode === "light" ? "#000" : "#fff" }} />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ "aria-label": "search" }} />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? (
                <DarkModeOutlined sx={{ color: "#fff" }} />
              ) : (
                <LightModeOutlined sx={{ color: "#000" }} />
              )}
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={5} color="error">
                <NotificationsIcon sx={{ color: theme.palette.mode === "light" ? "#000" : "#fff" }} />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <SettingsIcon sx={{ color: theme.palette.mode === "light" ? "#000" : "#fff" }} />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar
                alt="User"
                src={ProfileImg}
                sx={{
                  width: 32,
                  height: 32,
                  border: `2px solid ${theme.palette.mode === "light" ? "#000" : "#fff"}`,
                  transition: "border 0.3s ease",
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};

export default Topbar;
