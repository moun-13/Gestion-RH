import {
  Users,
  Building2,
  ChevronLeft,
  ChevronRight,
  CalendarX  ,
  CalendarCheck,
  ChevronDown,
  PlaneTakeoff,
  ChevronUp,
  Settings,
  Calendar,
  Key
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar({ className }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState({
    comptes: true,
    parametres: true
  });
  const location = useLocation();

  const toggleMenu = (menu) => {
    setOpenMenu(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const handleLogout = () => {
    // Exemple avec gestion de token :
  };

  return (
    <div
      className={cn(
        "h-screen bg-white border-r flex flex-col transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[250px]",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div
          className={cn(
            "flex items-center justify-between",
            isCollapsed && "justify-center"
          )}
        >
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0 rounded-md hover:bg-gray-100 flex items-center justify-center"
          >
            {isCollapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {/* Menu Comptes */}
          <div>
            <button
              onClick={() => toggleMenu("comptes")}
              className={cn(
                "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors",
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              <div className="flex items-center">
                <Users className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Comptes</span>}
              </div>
              {!isCollapsed &&
                (openMenu.comptes ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </button>

            {!isCollapsed && openMenu.comptes && (
              <div className="ml-6 mt-1 space-y-1">
                <SidebarItem
                  to="/employees-management"
                  icon={<Users className="h-4 w-4" />}
                  isActive={location.pathname === "/employees-management"}
                  isCollapsed={isCollapsed}
                >
                  Employés
                </SidebarItem>
                <SidebarItem
                  to="/employees-presence-management"
                  icon={<CalendarCheck className="h-4 w-4" />}
                  isActive={location.pathname === "/employees-presence-management"}
                  isCollapsed={isCollapsed}
                >
                  Presence_Employees
                </SidebarItem>
              </div>
            )}
          </div>

          {/* Nouveau Menu Paramètres */}
          <div>
            <button
              onClick={() => toggleMenu("parametres")}
              className={cn(
                "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors",
                isCollapsed ? "justify-center" : "justify-between"
              )}
            >
              <div className="flex items-center">
                <Settings className="h-4 w-4" />
                {!isCollapsed && <span className="ml-2">Paramètres</span>}
              </div>
              {!isCollapsed &&
                (openMenu.parametres ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                ))}
            </button>

            {!isCollapsed && openMenu.parametres && (
              <div className="ml-6 mt-1 space-y-1">
                <SidebarItem
                  to="/companies-management"
                  icon={<Building2 className="h-4 w-4" />}
                  isActive={location.pathname === "/companies-management"}
                  isCollapsed={isCollapsed}
                >
                  Société
                </SidebarItem>
                <SidebarItem
                  to="/departments-management"
                  icon={<Building2 className="h-4 w-4" />}
                  isActive={location.pathname === "/departments-management"}
                  isCollapsed={isCollapsed}
                >
                  Département
                </SidebarItem>
                <SidebarItem
                  to="/roles-management"
                  icon={<Key className="h-4 w-4" />}
                  isActive={location.pathname === "/roles-management"}
                  isCollapsed={isCollapsed}
                >
                  Rôles
                </SidebarItem>
                <SidebarItem
                  to="/calendrier-management"
                  icon={<Calendar className="h-4 w-4" />}
                  isActive={location.pathname === "/calendrier-management"}
                  isCollapsed={isCollapsed}
                >
                  Gestion_horaires
                </SidebarItem>
                <SidebarItem
                  to="/companies-calendars-management"
                  icon={<Calendar className="h-4 w-4" />}
                  isActive={location.pathname === "/companies-calendars-management"}
                  isCollapsed={isCollapsed}
                >
                  Companies_Calendrier
                </SidebarItem>
                 <SidebarItem
                  to="/demande-absence-management"
                  icon={<CalendarX  className="h-4 w-4" />}
                  isActive={location.pathname === "/demande-absence-management"}
                  isCollapsed={isCollapsed}
                >
                  Demandes_Absences
                </SidebarItem>
                <SidebarItem
                  to="/conges-management"
                  icon={<PlaneTakeoff   className="h-4 w-4" />}
                  isActive={location.pathname === "/conges-management"}
                  isCollapsed={isCollapsed}
                >
                  Conges
                </SidebarItem>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t">
        {/* Bouton Logout */}
        <button
          onClick={handleLogout}
          className={`mt-2 flex items-center rounded-md p-2 text-sm font-medium hover:bg-gray-100 transition-colors ${
            isCollapsed ? "justify-center w-full" : "justify-start"
          }`}
          title="Déconnexion"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Déconnexion</span>}
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ to, icon, children, isActive, isCollapsed }) {
  return (
    <Link
      to={to}
      className={cn(
        "w-full flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-blue-50 text-blue-600"
          : "hover:bg-gray-100 text-gray-700",
        isCollapsed ? "justify-center" : "justify-start"
      )}
    >
      <span className="mr-2">{icon}</span>
      {!isCollapsed && children}
    </Link>
  );
}