import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Landmark, Info, Phone, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Seal({ size = 52 }) {
  return (
    <img
      src="/assets/wu-logo.png"
      alt="Wallaga University seal"
      width={size}
      height={size}
      className="rounded-full object-contain"
      style={{ width: size, height: size }}
    />
  );
}

function NavLink({ icon: Icon, label, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold transition-colors ${
        active ? "bg-white/10 text-white" : "text-white/80 hover:text-white"
      }`}
    >
      <Icon size={16} /> {label}
    </button>
  );
}

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const onLanding = location.pathname === "/";

  function scrollTo(id) {
    if (!onLanding) {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 60);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="bg-navy text-white sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <Seal />
          <div>
            <div className="font-display text-lg md:text-xl font-bold leading-tight tracking-wide">WALLAGA UNIVERSITY</div>
            <div className="text-gold-soft text-xs md:text-sm font-bold tracking-wider">DEPARTMENT SELECTION SYSTEM</div>
            <div className="text-white/60 text-[11px] italic">For Pre-Engineering Students</div>
          </div>
        </div>

        <nav className="flex items-center gap-1 flex-wrap">
          <NavLink icon={Home} label="Home" active={onLanding} onClick={() => navigate("/")} />
          <NavLink icon={Landmark} label="Departments" onClick={() => scrollTo("departments")} />
          <NavLink icon={Info} label="About" onClick={() => scrollTo("about")} />
          <NavLink icon={Phone} label="Contact" onClick={() => scrollTo("contact")} />
        </nav>

        {user ? (
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="border border-white/30 rounded px-3.5 py-2 text-sm flex items-center gap-1.5"
          >
            <LogOut size={14} /> Log out ({user.role})
          </button>
        ) : (
          <button
            onClick={() => scrollTo("get-started")}
            
          >
            
          </button>
        )}
      </div>
    </div>
  );
}
