import { useParams, useLocation, useNavigate } from "react-router-dom";
import { X, FileText, Download, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";

const UpdateDemandesAbse = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    employee_id: "",
    start_date: "",
    start_time: "09:00",
    end_date: "",
    end_time: "17:00",
    reason: "",
    doc: null,
    current_doc: ""
  });
  const [employees, setEmployees] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [employeesResponse, demandeResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/employees"),
          state?.demande 
            ? Promise.resolve({ data: state.demande })
            : axios.get(`http://localhost:8000/api/absences/${id}?with=employee`)
        ]);

        const demandeData = demandeResponse.data;
        const startDateTime = new Date(demandeData.start_time);
        const endDateTime = new Date(demandeData.end_time);

        setEmployees(employeesResponse.data);
        setFormData({
          employee_id: demandeData.employee_id,
          start_date: startDateTime.toISOString().split('T')[0],
          start_time: startDateTime.toTimeString().substring(0, 5),
          end_date: endDateTime.toISOString().split('T')[0],
          end_time: endDateTime.toTimeString().substring(0, 5),
          reason: demandeData.reason,
          doc: null,
          current_doc: demandeData.doc || ""
        });
      } catch (error) {
        console.error("Erreur:", error);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, doc: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const startDateTime = `${formData.start_date}T${formData.start_time}:00`;
      const endDateTime = `${formData.end_date}T${formData.end_time}:00`;

      const formDataToSend = new FormData();
      formDataToSend.append("employee_id", formData.employee_id);
      formDataToSend.append("start_time", startDateTime);
      formDataToSend.append("end_time", endDateTime);
      formDataToSend.append("reason", formData.reason);
      
      if (formData.doc) {
        formDataToSend.append("doc", formData.doc);
      }
      
      formDataToSend.append("_method", "PUT");

      const response = await axios.post(
        `http://localhost:8000/api/absences/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setSuccessMessage("Demande d'absence modifiée avec succès!");
      
      setTimeout(() => {
        navigate("/demande-absence-management", { 
          state: { 
            shouldRefresh: true,
            success: "Demande d'absence modifiée avec succès!" 
          } 
        });
      }, 1500);
      
    } catch (error) {
      console.error("Erreur modification:", error);
      setError(error.response?.data?.message || "Erreur lors de la modification");
    } finally {
      setLoading(false);
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
            <h2 className="text-xl font-bold">Modifier la demande d'absence</h2>
            <button
              onClick={() => navigate("/demande-absence-management")}
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de début *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de début *
                </label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                  min={formData.start_date}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Heure de fin *
                </label>
                <input
                  type="time"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motif *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
                rows="3"
                required
                placeholder="Décrivez le motif de l'absence"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document actuel
              </label>
              {formData.current_doc ? (
                <div className="flex items-center">
                  <FileText className="text-blue-500 mr-2" size={20} />
                  <a 
                    href={`http://localhost:8000/api/absences/${id}/document`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center"
                    download
                  >
                    <Download className="mr-1" size={16} />
                    Télécharger
                  </a>
                </div>
              ) : (
                <p className="text-gray-400">Aucun document</p>
              )}
              
              <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
                Nouveau document (optionnel)
              </label>
              <div className="flex items-center">
                <label className="flex items-center px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50">
                  <Upload className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-sm">
                    {formData.doc ? formData.doc.name : "Choisir un fichier"}
                  </span>
                  <input
                    type="file"
                    name="doc"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              {formData.doc && (
                <p className="text-xs text-gray-500 mt-1">
                  Fichier sélectionné: {formData.doc.name} ({(formData.doc.size / 1024).toFixed(2)} KB)
                </p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate("/demande-absence-management")}
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

export default UpdateDemandesAbse;