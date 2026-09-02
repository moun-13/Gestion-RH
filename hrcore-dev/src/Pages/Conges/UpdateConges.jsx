import { useParams, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";

const UpdateConges = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_id: "",
    date_debut: "",
    date_fin: "",
    reason: ""
  });
  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [employeesRes, congeRes] = await Promise.all([
          axios.get("http://localhost:8000/api/employees"),
          axios.get(`http://localhost:8000/api/conges/${id}`)
        ]);
        
        setEmployees(employeesRes.data);
        
        const congeData = congeRes.data;
        setFormData({
          employee_id: congeData.employee_id,
          date_debut: congeData.date_debut.split('T')[0],
          date_fin: congeData.date_fin.split('T')[0],
          reason: congeData.reason || ""
        });
      } catch (error) {
        console.error("Erreur:", error);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation des dates
    if (new Date(formData.date_fin) < new Date(formData.date_debut)) {
      setError("La date de fin doit être après la date de début");
      setLoading(false);
      return;
    }

    try {
      await axios.put(`http://localhost:8000/api/conges/${id}`, formData);
      
      setSuccessMessage("Congé mis à jour avec succès!");
      setTimeout(() => navigate("/conges-management"), 1500);
    } catch (error) {
      console.error("Erreur:", error.response?.data);
      setError(error.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading && !formData.employee_id) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">Chargement en cours...</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Modifier le congé</h2>
            <button
              onClick={() => navigate("/conges-management")}
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
                Employé *
              </label>
              <select
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Sélectionnez un employé</option>
                {employees.map(employee => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début *
              </label>
              <input
                type="date"
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de fin *
              </label>
              <input
                type="date"
                name="date_fin"
                value={formData.date_fin}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
                min={formData.date_debut}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motif
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                rows="3"
                placeholder="Raison du congé (optionnel)"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/conges-management")}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateConges;