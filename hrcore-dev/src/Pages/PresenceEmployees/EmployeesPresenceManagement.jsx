import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import axios from "axios";
import { Sidebar } from "../../components/Sidebar";

const EmployeesPresenceManagement = () => {
  const [presences, setPresences] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [presencesRes, employeesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/attendance"),
          axios.get("http://localhost:8000/api/employees")
        ]);
        setPresences(presencesRes.data);
        setEmployees(employeesRes.data);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? `${employee.first_name} ${employee.last_name}` : "Inconnu";
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(timeString).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cet enregistrement de présence ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/attendance/${id}`);
        setPresences(presences.filter(p => p.id !== id));
      } catch (err) {
        console.error("Erreur suppression:", err);
        setError("Erreur lors de la suppression");
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Présences</h1>
          <Link
            to="/add-presence-employees"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter une présence
          </Link>
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
                <th className="px-6 py-3 text-left">Employé</th>
                <th className="px-6 py-3 text-left">Heure d'entrée</th>
                <th className="px-6 py-3 text-left">Début pause</th>
                <th className="px-6 py-3 text-left">Fin pause</th>
                <th className="px-6 py-3 text-left">Heure de sortie</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {presences.map(presence => (
                <tr key={presence.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEmployeeName(presence.employee_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="mr-2 text-green-500" size={16} />
                      {formatTime(presence.check_in_time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(presence.break_start_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(presence.break_end_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="mr-2 text-red-500" size={16} />
                      {formatTime(presence.check_out_time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => navigate(`/edit-presence-employees/${presence.id}`)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(presence.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
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

export default EmployeesPresenceManagement;