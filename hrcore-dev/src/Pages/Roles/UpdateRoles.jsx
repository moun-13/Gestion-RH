import { useParams, useNavigate, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";

const UpdateRoles = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    nom: "",
    company_id: ""
  });
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState({
    page: true,
    submit: false
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Charger les données initiales
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les entreprises
        const companiesResponse = await axios.get("http://localhost:8000/api/companies");
        setCompanies(companiesResponse.data);

        // Vérifier si les données sont passées via le state
        if (location.state?.role) {
          setFormData({
            nom: location.state.role.name || location.state.role.nom || "",
            company_id: location.state.role.company_id || ""
          });
        } else {
          // Sinon charger depuis l'API
          const roleResponse = await axios.get(`http://localhost:8000/api/roles/${id}`);
          setFormData({
            nom: roleResponse.data.name || roleResponse.data.nom || "",
            company_id: roleResponse.data.company_id || ""
          });
        }
      } catch (err) {
        console.error("Erreur chargement:", err);
        setError(err.response?.data?.message || "Erreur lors du chargement des données");
        
        if (err.response?.status === 404) {
          setTimeout(() => navigate("/roles-management", { 
            state: { error: `Le rôle #${id} n'existe pas` }
          }), 2000);
        }
      } finally {
        setIsLoading(prev => ({...prev, page: false}));
      }
    };

    fetchData();
  }, [id, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nom.trim() || !formData.company_id) {
      setError("Veuillez remplir tous les champs obligatoires");
      return;
    }

    setIsLoading(prev => ({...prev, submit: true}));
    setError(null);

    try {
      const response = await axios.put(`http://localhost:8000/api/roles/${id}`, {
        name: formData.nom,  // Utilisez 'name' si c'est le champ attendu par l'API
        company_id: formData.company_id
      });

      if (response.status === 200) {
        setSuccessMessage("Rôle modifié avec succès !");
        setTimeout(() => {
          navigate("/roles-management", { 
            state: { 
              success: "Rôle modifié avec succès",
              updatedRole: response.data
            } 
          });
        }, 1500);
      }
    } catch (err) {
      console.error("Erreur modification:", err);
      setError(err.response?.data?.message || "Erreur lors de la modification du rôle");
    } finally {
      setIsLoading(prev => ({...prev, submit: false}));
    }
  };

  if (isLoading.page) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p>Chargement en cours...</p>
        </div>
      </div>
    );
  }

  if (error?.includes("n'existe pas")) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500 text-center">
            <p>{error}</p>
            <p>Redirection en cours...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Modifier le rôle</h2>
            <button
              onClick={() => navigate("/roles-management")}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && !error.includes("n'existe pas") && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom du rôle 
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Société associée 
              </label>
              <select
                value={formData.company_id}
                onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Sélectionnez une société</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.rc || `Société ${company.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/roles-management")}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isLoading.submit || !formData.nom.trim() || !formData.company_id}
              >
                {isLoading.submit ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateRoles;