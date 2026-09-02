import { useParams, useNavigate } from "react-router-dom";
import { X, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";

const UpdatePresenceEmployees = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_id: "",
    check_in_time: "",
    break_start_time: "",
    break_end_time: "",
    check_out_time: ""
  });
  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [employeesRes, presenceRes] = await Promise.all([
          axios.get("http://localhost:8000/api/employees"),
          axios.get(`http://localhost:8000/api/attendance/${id}`)
        ]);

        const presenceData = presenceRes.data;
        setEmployees(employeesRes.data);
        setFormData({
          employee_id: presenceData.employee_id,
          check_in_time: presenceData.check_in_time?.substring(11, 16) || "",
          break_start_time: presenceData.break_start_time?.substring(11, 16) || "",
          break_end_time: presenceData.break_end_time?.substring(11, 16) || "",
          check_out_time: presenceData.check_out_time?.substring(11, 16) || ""
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

    try {
      await axios.put(`http://localhost:8000/api/attendance/${id}`, formData);
      
      setSuccessMessage("Présence mise à jour avec succès!");
      setTimeout(() => navigate("/employees-presence-management"), 1500);
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
            <h2 className="text-xl font-bold">Modifier la présence</h2>
            <button
              onClick={() => navigate("/employees-presence-management")}
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
                Employé 
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
                Heure d'entrée 
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  name="check_in_time"
                  value={formData.check_in_time}
                  onChange={handleChange}
                  className="w-full border rounded-md px-10 py-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Début pause
                </label>
                <input
                  type="time"
                  name="break_start_time"
                  value={formData.break_start_time}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fin pause
                </label>
                <input
                  type="time"
                  name="break_end_time"
                  value={formData.break_end_time}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  disabled={!formData.break_start_time}
                  min={formData.break_start_time}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de sortie
                </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  name="check_out_time"
                  value={formData.check_out_time}
                  onChange={handleChange}
                  className="w-full border rounded-md px-10 py-2"
                  min={formData.check_in_time}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/employees-presence-management")}
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

export default UpdatePresenceEmployees;