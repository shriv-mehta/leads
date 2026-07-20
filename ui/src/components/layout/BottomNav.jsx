import { NavLink } from "react-router-dom";
import { BOTTOM_NAV_ITEMS } from "./navConfig";

const BottomNav = ({ role }) => {
  const items = BOTTOM_NAV_ITEMS[role] || [];

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `bottom-nav__item ${isActive ? "bottom-nav__item--active" : ""}`}
        >
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
