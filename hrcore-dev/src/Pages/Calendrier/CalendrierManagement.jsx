import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, Clock } from "lucide-react";
import axios from "axios";
import { Sidebar } from "../../components/Sidebar";

const CalendrierManagement = () => {
  const [calendriers, setCalendriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCalendriers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/schedules");
        setCalendriers(response.data);
      } catch (err) {
        setError("Erreur lors du chargement des calendriers");
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendriers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer ce calendrier ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/schedules/${id}`);
        setCalendriers(calendriers.filter(c => c.id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '-';
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">Chargement en cours...</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des horaires</h1>
          <Link
            to="/add-calendrier"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un horaire
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">Heure d'entrée</th>
                <th className="px-6 py-3 text-left">Heure de sortie</th>
                <th className="px-6 py-3 text-left">Début pause</th>
                <th className="px-6 py-3 text-left">Fin pause</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {calendriers.map(calendrier => (
                <tr key={calendrier.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{calendrier.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="mr-2 text-blue-500" size={16} />
                      {formatTime(calendrier.entry_time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="mr-2 text-blue-500" size={16} />
                      {formatTime(calendrier.exit_time)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(calendrier.break_start_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatTime(calendrier.break_end_time)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => navigate(`/edit-calendrier/${calendrier.id}`)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(calendrier.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
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

export default CalendrierManagement;