import Login from "./Pages/account/Login";
import EmployesManagement from "./Pages/Employees/EmployesManagement";
import CompaniesManagement from "./Pages/Sociétés/CompaniesManagement";
import AddEmployes from "./Pages/Employees/AddEmployes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UpdateCompany from "./Pages/Sociétés/UpdateCompanies";
import "./App.css";
import UpdateEmployees from "./Pages/Employees/UpdateEmployees";
import DepartementManagement from "./Pages/Departement/DepartementManagement";
import AddDepartements from "./Pages/Departement/AddDepartement";
import AddCompanies from "./Pages/Sociétés/AddCompanies";
import UpdateDepartement from "./Pages/Departement/UpdateDepartement";
import RolesManagement from "./Pages/Roles/RolesManagement";
import AddRoles from "./Pages/Roles/AddRoles";
import UpdateRoles from "./Pages/Roles/UpdateRoles";
import UpdateEmployeesCalendar from "./Pages/PresenceEmployees/UpdatePresenceEmployees";
import CompaniesCalendarManagement from "./Pages/CompaniesCalendar/CompaniesCalendarManagement";
import AddCompaniesCalendar from "./Pages/CompaniesCalendar/AddCompaniesCalendar";
import UpdateCompaniesCalendar from "./Pages/CompaniesCalendar/UpdateCompaniesCalendar";
import DemandesAbsencesManage from "./Pages/DemandesAbsences/DemandesAbsencesManage";
import AddDemandesAbse from "./Pages/DemandesAbsences/AddDemandesAbse";
import UpdateDemandesAbse from "./Pages/DemandesAbsences/UpdateDemandesAbse";
import CalendrierManagement from "./Pages/Calendrier/CalendrierManagement";
import AddCalendrier from "./Pages/Calendrier/AddCalendrier";
import UpdateCalendrier from "./Pages/Calendrier/UpdateCalendrier";
import EmployeesPresenceManagement from "./Pages/PresenceEmployees/EmployeesPresenceManagement";
import AddPresenceEmployees from "./Pages/PresenceEmployees/AddPresenceEmployees";
import UpdatePresenceEmployees from "./Pages/PresenceEmployees/UpdatePresenceEmployees";
import CongesManagement from "./Pages/Conges/CongesManagement";
import AddConges from "./Pages/Conges/AddConges";
import UpdateConges from "./Pages/Conges/UpdateConges";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route de base */}
          <Route path="/login" element={<Login />} />

          {/* Gestion des employees */}
          <Route path="/employees-management" element={<EmployesManagement />} />
          <Route path="/add-employees" element={<AddEmployes />} />
          <Route path="/edit-employee/:id" element={<UpdateEmployees />} />

          {/* Gestion des sociétés */}
          <Route path="/companies-management" element={<CompaniesManagement />} />
          <Route path="/add-company" element={<AddCompanies/>} />
          <Route path="/edit-company/:id" element={<UpdateCompany />} />

          {/* Gestion des departement */}
          <Route path="/departments-management" element={<DepartementManagement />} />
          <Route path="/add-departments" element={<AddDepartements />} />
          <Route path="/edit-departments/:id" element={<UpdateDepartement />} />

          {/* Gestion des roles */}
          <Route path="/roles-management" element={<RolesManagement />} />
          <Route path="/add-roles" element={<AddRoles />} />
          <Route path="/edit-roles/:id" element={<UpdateRoles />} />

          {/* Gestion des calendrier */}
          <Route path="/calendrier-management" element={<CalendrierManagement />} />
          <Route path="/add-calendrier" element={<AddCalendrier />} />
          <Route path="/edit-calendrier/:id" element={<UpdateCalendrier />} />

          {/* Gestion de Presence des employees */}
          <Route path="/employees-presence-management" element={<EmployeesPresenceManagement />} />
          <Route path="/add-presence-employees" element={<AddPresenceEmployees />} />
          <Route path="/edit-presence-employees/:id" element={<UpdatePresenceEmployees />} />

          {/* Gestion des calendrier des companies */}
          <Route path="/companies-calendars-management" element={<CompaniesCalendarManagement />} />
          <Route path="/add-company-calendar" element={<AddCompaniesCalendar />} />
          <Route path="/edit-company-calendar/:id" element={<UpdateCompaniesCalendar />} />

          {/* Gestion des demandes d'absences */}
          <Route path="/demande-absence-management" element={<DemandesAbsencesManage />} />
          <Route path="/add-demande-absence" element={<AddDemandesAbse />} />
          <Route path="/edit-demande-absence/:id" element={<UpdateDemandesAbse />} />

          {/* Gestion des conges   */}
          <Route path="/conges-management" element={<CongesManagement />} />
          <Route path="/add-conges" element={<AddConges />} />
          <Route path="/edit-conges/:id" element={<UpdateConges />} />

          {/* Route par défaut pour les URLs non reconnues */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
