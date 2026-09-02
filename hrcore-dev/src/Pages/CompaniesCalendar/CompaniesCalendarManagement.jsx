import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Sidebar } from "../../components/Sidebar";
import { Edit, Trash2, Plus, Search } from "lucide-react";

const CompaniesCalendarManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [calendars, setCalendars] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [calendarsRes, companiesRes, schedulesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/company-schedules"),
          axios.get("http://localhost:8000/api/companies"),
          axios.get("http://localhost:8000/api/schedules")
        ]);

        // Combiner les données
        const combinedData = calendarsRes.data.map(calendar => {
          const company = companiesRes.data.find(c => c.id === calendar.company_id);
          const schedule = schedulesRes.data.find(s => s.id === calendar.schedule_id);
          
          return {
            ...calendar,
            company_name: company?.rc || 'Inconnu',
            schedule_name: schedule?.name || 'Inconnu'
          };
        });

        setCalendars(combinedData);
        setCompanies(companiesRes.data);
        setSchedules(schedulesRes.data);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.refresh) {
      fetchData();
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      fetchData();
    }
  }, [location.state]);

  const filteredCalendars = calendars.filter(calendar => {
    const companyName = calendar.company_name.toLowerCase();
    const scheduleName = calendar.schedule_name.toLowerCase();
    
    return (
      companyName.includes(search.toLowerCase()) ||
      scheduleName.includes(search.toLowerCase())
    );
  });

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce calendrier d'entreprise ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/company-calendars/${id}`);
        setCalendars(calendars.filter(c => c.id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (loading) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">Chargement en cours...</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Calendriers d'Entreprise</h1>

        <div className="flex justify-between mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={() => navigate("/add-company-calendar")}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <Plus className="mr-2" />
            Ajouter
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Entreprise</th>
                <th className="px-6 py-3 text-left">Horaire</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCalendars.map(calendar => (
                <tr key={calendar.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{calendar.company_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{calendar.schedule_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => navigate(`/edit-company-calendar/${calendar.id}`, {
                        state: { 
                          calendar,
                          companies,
                          schedules 
                        }
                      })}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      title="Modifier"
                    >
                      <Edit className="inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(calendar.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Supprimer"
                    >
                      <Trash2 className="inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CompaniesCalendarManagement;