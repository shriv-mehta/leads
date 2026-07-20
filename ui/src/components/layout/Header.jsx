import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="app-header">
      <div className="row">
        <button className="app-header__menu-btn" onClick={onMenuClick} aria-label="Open menu">
          ☰
        </button>
        <span className="app-header__brand">Field Lead Tracker</span>
      </div>
      <div className="app-header__user">
        <span className="app-header__user-name">
          {user?.name} · {user?.role}
        </span>
        <Button variant="ghost" size="sm" label="Log out" onClick={handleLogout} />
      </div>
    </header>
  );
};

export default Header;
