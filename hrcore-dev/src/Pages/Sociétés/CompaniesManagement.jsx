import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Edit, Trash2, Plus, Search } from "lucide-react";

const CompaniesManagement = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/companies");
        setCompanies(response.data || []);
      } catch (err) {
        setError("Erreur lors du chargement des sociétés");
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };

    if (location.state?.refresh) {
      fetchCompanies();
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      fetchCompanies();
    }
  }, [location.state]);

  const filteredCompanies = companies.filter((company) => {
    if (!company) return false;
    
    const rc = company.rc ? company.rc.toLowerCase() : "";
    const address = company.address ? company.address.toLowerCase() : "";
    
    return (
      rc.includes(search.toLowerCase()) ||
      address.includes(search.toLowerCase())
    );
  });

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cette société ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/companies/${id}`);
        setCompanies(companies.filter((c) => c.id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleAddCompany = () => {
    navigate("/add-company");
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
        <h1 className="text-2xl font-bold mb-6">Gestion des sociétés</h1>

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
            onClick={handleAddCompany}
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
                <th className="px-6 py-3 text-left">RC</th>
                <th className="px-6 py-3 text-left">Adresse</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{company.rc}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{company.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => navigate(`/edit-company/${company.id}`, {
                        state: { company }
                      })}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      title="Modifier"
                    >
                      <Edit className="inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(company.id)}
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

export default CompaniesManagement;