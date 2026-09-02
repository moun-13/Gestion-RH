import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";

const AddCompanies = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rc: "",
    address: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:8000/api/companies", {
        rc: formData.rc,
        address: formData.address
      });

      if (response.status === 201) {
        setSuccessMessage("La société a été ajoutée avec succès !");
        setTimeout(() => {
          navigate("/companies-management", { state: { refresh: true } });
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'ajout de la société");
      console.error("Erreur API:", err);
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
            <h2 className="text-xl font-bold">Ajouter une société</h2>
            <button
              onClick={() => navigate("/companies-management")}
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
                 RC
              </label>
              <input
                type="text"
                value={formData.rc}
                onChange={(e) =>
                  setFormData({ ...formData, rc: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <textarea
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full border rounded-md px-3 py-2"
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/companies-management")}
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

export default AddCompanies;