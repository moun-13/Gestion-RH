import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Edit, Trash2, Plus, Search } from "lucide-react";

const DepartementManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/departments?with=company,chief");
        setDepartements(response.data.map(dept => ({
          ...dept,
          company: dept.company || null,
          chief_id: dept.chief_id || null,
          chief_name: dept.chief ? `${dept.chief.first_name} ${dept.chief.last_name}` : null
        })));
      } catch (err) {
        setError("Erreur lors du chargement des départements");
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartements();
  }, [location.state]);

  const filteredDepartements = departements.filter((departement) => {
    const searchTerm = search.toLowerCase();
    return (
      departement.name.toLowerCase().includes(searchTerm) ||
      (departement.company?.rc?.toLowerCase().includes(searchTerm)) ||
      (departement.chief_id?.toString().includes(searchTerm))
  )});

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce département ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/departments/${id}`);
        setDepartements(departements.filter(d => d.id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleEdit = (departement) => {
    navigate(`/edit-departments/${departement.id}`, {
      state: { departement }
    });
  };

  const handleAddDepartement = () => {
    navigate("/add-departments");
  };

  if (loading) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">Chargement en cours...</div>
    </div>
  );

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Départements</h1>

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
            onClick={handleAddDepartement}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <Plus className="mr-2" />
            Ajouter
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Société</th>
                <th className="px-6 py-3 text-left">Chef </th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepartements.map(departement => (
                <tr key={departement.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{departement.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {departement.company?.rc || 'Non attribué'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {departement?.chief_id }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEdit(departement)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      title="Modifier"
                    >
                      <Edit className="inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(departement.id)}
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

export default DepartementManagement;