import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";

const UpdateEmployees = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cin: "",
    // role: "USER",
    phone: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Définir l'URL de base de l'API
  const API_BASE_URL = "http://localhost:8000/api";

  useEffect(() => {
    const loadEmployeeData = async () => {
      setIsLoading(true);
      try {
        // Si les données sont passées via le state
        if (state?.employee) {
          setFormData({
            firstName: state.employee.first_name,
            lastName: state.employee.last_name,
            email: state.employee.work_email,
            cin: state.employee.cin,
            phone: state.employee.work_phone,
            role: state.employee.role || "USER"
          });
        } else {
          // Sinon, faire un appel API pour récupérer les données
          const response = await axios.get(`${API_BASE_URL}/employees/${id}`);
          const employee = response.data;
          setFormData({
            firstName: employee.first_name,
            lastName: employee.last_name,
            email: employee.work_email,
            cin: employee.cin,
            phone: employee.work_phone,
            // role: employee.role || "USER"
          });
        }
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadEmployeeData();
  }, [id, state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${API_BASE_URL}/employees/${id}`, {
        id: id, // Ajout explicite de l'ID dans le corps de la requête
        first_name: formData.firstName,
        last_name: formData.lastName,
        work_email: formData.email,
        cin: formData.cin,
        work_phone: formData.phone,
        // role: formData.role
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setSuccessMessage("Employé modifié avec succès !");
        setTimeout(() => navigate("/employees-management"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 
              err.response?.data?.error || 
              "Erreur lors de la modification");
      console.error("Erreur détaillée:", {
        message: err.message,
        response: err.response?.data,
        stack: err.stack
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) return (
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
            <h2 className="text-xl font-bold">Modifier un employé</h2>
            <button
              onClick={() => navigate("/employees-management")}
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
                Prénom
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CIN
              </label>
              <input
                type="text"
                name="cin"
                value={formData.cin}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="USER">Utilisateur</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPERADMIN">Super Admin</option>
              </select>
            </div> */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/employees-management")}
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

export default UpdateEmployees;