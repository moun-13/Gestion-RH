import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Clock } from "lucide-react";
import axios from "axios";
import { Sidebar } from "../../components/Sidebar";

const AddCalendrier = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    entry_time: "",
    exit_time: "",
    break_start_time: "",
    break_end_time: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Validation des heures
    if (new Date(`1970-01-01T${formData.exit_time}`) <= new Date(`1970-01-01T${formData.entry_time}`)) {
      setError("L'heure de sortie doit être après l'heure d'entrée");
      setIsLoading(false);
      return;
    }

    if (formData.break_start_time && formData.break_end_time) {
      if (new Date(`1970-01-01T${formData.break_end_time}`) <= new Date(`1970-01-01T${formData.break_start_time}`)) {
        setError("L'heure de fin de pause doit être après l'heure de début");
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await axios.post("http://localhost:8000/api/schedules", formData);
      
      setSuccessMessage("Calendrier créé avec succès!");
      setTimeout(() => navigate("/calendrier-management"), 1500);
    } catch (err) {
      console.error("Erreur:", err.response?.data);
      setError(err.response?.data?.message || "Erreur lors de la création");
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
            <h2 className="text-xl font-bold">Ajouter un calendrier</h2>
            <button
              onClick={() => navigate("/calendrier-management")}
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
                Nom du calendrier *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure d'entrée *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  name="entry_time"
                  value={formData.entry_time}
                  onChange={handleChange}
                  className="w-full border rounded-md px-10 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure de sortie *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="time"
                  name="exit_time"
                  value={formData.exit_time}
                  onChange={handleChange}
                  className="w-full border rounded-md px-10 py-2"
                  required
                  min={formData.entry_time}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Début de pause
              </label>
              <input
                type="time"
                name="break_start_time"
                value={formData.break_start_time}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fin de pause
              </label>
              <input
                type="time"
                name="break_end_time"
                value={formData.break_end_time}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                min={formData.break_start_time}
                disabled={!formData.break_start_time}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/calendrier-management")}
                className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? "Création..." : "Créer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCalendrier;