import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios"; // Importez axios

const AddEmployes = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    cin:"",
    role: "USER",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false); // Pour gérer l'état de chargement
  const [error, setError] = useState(null); // Pour gérer les erreurs
  const [successMessage, setSuccessMessage] = useState(null);// Nouvel état pour le message de succès

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Envoyez les données à l'API Laravel
      const response = await axios.post("http://localhost:8000/api/employees", {
        first_name: formData.firstName, // Adaptez les noms de champs à votre API
        last_name: formData.lastName,
        cin: formData.cin,
        work_email: formData.email,
        // role: formData.role,
        work_phone: formData.phone,
      });

      // Redirigez après un succès
       if (response.status === 201) {
        setSuccessMessage("L'employé a été ajouté avec succès !");
        
        // Redirection après 2 secondes pour laisser voir le message
        setTimeout(() => {
          navigate("/employees-management");
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout");
      console.error("Erreur API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Ajouter un utilisateur</h2>
            <button
              onClick={() => navigate("/employees-management")}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Affichez les erreurs */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

           {/* Afficher le message de succès */}
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
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
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
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                cin
              </label>
              <input
                type="text"
                value={formData.cin}
                onChange={(e) =>
                  setFormData({ ...formData, cin: e.target.value })
                }
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
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
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
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
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
                {isLoading ? "Envoi en cours..." : "Ajouter"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployes;