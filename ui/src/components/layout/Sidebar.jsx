import { NavLink } from "react-router-dom";
import { NAV_ITEMS } from "./navConfig";
import Logo from "../common/Logo";

const Sidebar = ({ role, isOpen, onClose }) => {
  const items = NAV_ITEMS[role] || [];

  return (
    <>
      {isOpen && <div className="app-sidebar__scrim" onClick={onClose} />}
      <aside className={`app-sidebar ${isOpen ? "app-sidebar--open" : ""}`}>
        <div className="app-sidebar__logo">
          <Logo size={28} />
        </div>
        <nav className="stack">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `app-nav__link ${isActive ? "app-nav__link--active" : ""}`}
              onClick={onClose}
            >
              <span aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
