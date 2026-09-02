import { useParams, useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";

const UpdateCompaniesCalendar = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company_id: "",
    schedule_id: ""
  });
  const [companies, setCompanies] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [calendarRes, companiesRes, schedulesRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/company-schedules/${id}`),
          axios.get("http://localhost:8000/api/companies"),
          axios.get("http://localhost:8000/api/schedules")
        ]);

        setFormData(calendarRes.data);
        setCompanies(companiesRes.data);
        setSchedules(schedulesRes.data);
      } catch (err) {
        setError("Erreur lors du chargement des données");
        console.error("Erreur:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (state?.calendar) {
      setFormData(state.calendar);
      setCompanies(state.companies || []);
      setSchedules(state.schedules || []);
    } else {
      fetchData();
    }
  }, [id, state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.put(`http://localhost:8000/api/company-schedules/${id}`, formData);
      setSuccessMessage("Calendrier mis à jour avec succès !");
      setTimeout(() => {
        navigate("/companies-calendars-management", { state: { refresh: true } });
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
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
            <h2 className="text-xl font-bold">Modifier le calendrier</h2>
            <button
              onClick={() => navigate("/companies-calendars-management")}
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
                Entreprise
              </label>
              <select
                value={formData.company_id}
                onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Sélectionnez une entreprise</option>
                {companies.map(company => (
                  <option key={company.id} value={company.id}>
                    {company.rc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Horaire
              </label>
              <select
                value={formData.schedule_id}
                onChange={(e) => setFormData({...formData, schedule_id: e.target.value})}
                className="w-full border rounded-md px-3 py-2"
                required
              >
                <option value="">Sélectionnez un horaire</option>
                {schedules.map(schedule => (
                  <option key={schedule.id} value={schedule.id}>
                    {schedule.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/companies-calendars-management")}
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

export default UpdateCompaniesCalendar;