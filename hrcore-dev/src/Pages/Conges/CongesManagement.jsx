import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { Sidebar } from "../../components/Sidebar";

const CongesManagement = () => {
  const [conges, setConges] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [congesRes, employeesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/conges"),
          axios.get("http://localhost:8000/api/employees")
        ]);
        setConges(congesRes.data);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette demande de congé ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/conges/${id}`);
        setConges(conges.filter(c => c.id !== id));
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
          <h1 className="text-2xl font-bold">Gestion des Congés</h1>
          <Link
            to="/add-conges"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un congé
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
                <th className="px-6 py-3 text-left">Date début</th>
                <th className="px-6 py-3 text-left">Date fin</th>
                <th className="px-6 py-3 text-left">Motif</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {conges.map(conge => (
                <tr key={conge.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEmployeeName(conge.employee_id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(conge.date_debut)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(conge.date_fin)}
                  </td>
                  <td className="px-6 py-4">
                    {conge.reason || "Non spécifié"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => navigate(`/edit-conges/${conge.id}`)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(conge.id)}
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

export default CongesManagement;