import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Edit, Trash2, Plus, Search } from "lucide-react";

const RolesManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Récupérer les rôles depuis l'API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/roles");
        setRoles(response.data || []);
      } catch (err) {
        setError("Erreur lors du chargement des rôles");
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.refresh) {
      fetchRoles();
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      fetchRoles();
    }
  }, [location.state]);

  const filteredRoles = roles.filter((role) => {
    if (!role) return false;
    const name = role.name ? role.name.toLowerCase() : "";
    const companyName = role.company?.name ? role.company.name.toLowerCase() : "";
    return (
      name.includes(search.toLowerCase()) ||
      companyName.includes(search.toLowerCase())
    );
  });

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce rôle ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/roles/${id}`);
        setRoles(roles.filter(r => r.id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleAddRole = () => {
    navigate("/add-roles");
  };

  const handleEdit = (role) => {
    navigate(`/edit-roles/${role.id}`, {
      state: { role }
    });
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
        <h1 className="text-2xl font-bold mb-6">Gestion des Rôles</h1>

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
            onClick={handleAddRole}
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
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRoles.map((role) => (
                <tr key={`role-${role.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{role.name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {role.company.rc || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEdit(role)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      title="Modifier"
                    >
                      <Edit className="inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(role.id)}
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

export default RolesManagement;