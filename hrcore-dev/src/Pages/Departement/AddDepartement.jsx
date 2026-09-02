import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";

const AddDepartements = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    company_id: "",
    chief_id: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesRes, employeesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/companies"),
          axios.get("http://localhost:8000/api/employees")
        ]);
        setCompanies(companiesRes.data);
        setEmployees(employeesRes.data);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Erreur lors du chargement des données");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.name || !formData.company_id) {
      setError("Veuillez remplir tous les champs obligatoires");
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        name: formData.name,
        company_id: formData.company_id,
        chief_id: formData.chief_id
      };

      const response = await axios.post("http://localhost:8000/api/departments", payload);

      if (response.status === 201) {
        setSuccessMessage("Département ajouté avec succès !");
        setTimeout(() => navigate("/departments-management"), 2000);
      }
    } catch (err) {
      console.error("Erreur:", err.response?.data);
      setError(err.response?.data?.message || "Erreur lors de l'ajout du département");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Ajouter un département</h2>
            <button
              onClick={() => navigate("/departments-management")}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {error && (
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
                Nom du département *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Société *
              </label>
              <select
                value={formData.company_id}
                onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Sélectionnez une société</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.rc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chef de département
              </label>
              <select
                value={formData.chief_id || ""}
                onChange={(e) => setFormData({
                  ...formData, 
                  chief_id: e.target.value ? parseInt(e.target.value) : null
                })}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">Sélectionnez un chef </option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.id} 
                  </option>
                ))} 
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/departments-management")}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Envoi en cours..." : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDepartements;