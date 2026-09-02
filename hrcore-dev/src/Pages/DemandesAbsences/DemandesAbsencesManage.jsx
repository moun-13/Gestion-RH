import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, FileText, Download, Upload } from "lucide-react";
import axios from "axios";
import { Sidebar } from "../../components/Sidebar";

const DemandesAbsencesManage = () => {
  const [demandes, setDemandes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [demandesRes, employeesRes] = await Promise.all([
          axios.get("http://localhost:8000/api/absences"),
          axios.get("http://localhost:8000/api/employees")
        ]);
        
        setDemandes(demandesRes.data);
        setEmployees(employeesRes.data);
      } catch (error) {
        console.error("Erreur:", error);
        setError("Impossible de charger les données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/absences/${id}`);
      setDemandes(demandes.filter(demande => demande.id !== id));
    } catch (error) {
      console.error("Erreur suppression:", error);
      setError("Erreur lors de la suppression");
    }
  };

  const getEmployeeName = (employeeId) => {
    if (!employeeId) return "Non attribué";
    
    const id = typeof employeeId === 'string' ? parseInt(employeeId) : employeeId;
    
    const employee = employees.find(emp => emp.id === id);
    
    if (!employee) {
      console.warn(`Employé non trouvé avec l'ID: ${employeeId}`);
      return "Employé inconnu";
    }
    
    return `${employee.first_name} ${employee.last_name}`.trim() || "Nom non disponible";
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };
    return `${date.toLocaleDateString('fr-FR', optionsDate)} ${date.toLocaleTimeString('fr-FR', optionsTime)}`;
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
          <h1 className="text-2xl font-bold">Gestion des Demandes d'Absence</h1>

          <Link
            to="/add-demande-absence"
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            <Plus className="h-5 w-5 mr-2" />
            Ajouter une demande
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Début
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {demandes.map((demande) => (
                  <tr key={demande.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getEmployeeName(demande.employee_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDateTime(demande.start_time)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDateTime(demande.end_time)}
                    </td>
                    <td className="px-6 py-4">
                      {demande.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {demande.doc ? (
                        <div className="flex items-center">
                          <FileText className="text-blue-500 mr-2" size={20} />
                          <a 
                            href={`http://localhost:8000/storage/${demande.doc}`} 
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
                        <span className="text-gray-400">Aucun document</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => navigate(`/edit-demande-absence/${demande.id}`, { state: { demande } })}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(demande.id)}
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
    </div>
  );
};

export default DemandesAbsencesManage;