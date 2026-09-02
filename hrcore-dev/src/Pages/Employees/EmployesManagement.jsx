import { useState, useEffect } from "react";
import { Sidebar } from "../../components/Sidebar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, UserPlus, Search } from "lucide-react";

const EmployesManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  // Récupérer les employés depuis l'API Laravel
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/employees");
        const formattedUsers = response.data.map(employee => ({
          id: employee.id,
          firstName: employee.first_name || employee.firstName,
          lastName: employee.last_name || employee.lastName,
          email: employee.work_email || employee.email,
          role: employee.role || "USER",
          phone: employee.work_phone || employee.phone,
          cin: employee.cin
        }));
        setUsers(formattedUsers);
      } catch (err) {
        setError("Erreur lors du chargement des employés");
        console.error("Erreur API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    user.phone.includes(search) ||
    user.cin.includes(search)
  );

  const handleDelete = async (id) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      try {
        await axios.delete(`http://localhost:8000/api/employees/${id}`);
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleAddUser = () => {
    navigate("/add-employees");
  };

  const handleEdit = (user) => {
  navigate(`/edit-employee/${user.id}`, {
    state: {
      employee: {
        first_name: user.firstName,
        last_name: user.lastName,
        cin: user.cin,
        work_email: user.email,
        work_phone: user.phone,
        // role: user.role
      }
    }
  });
};

  if (loading) return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-6">Chargement en cours...</div>
    </div>
  );

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des Employés</h1>

        <div className="flex justify-between mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher..."
              className="pl-10 pr-4 py-2 border rounded-md w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleAddUser}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <UserPlus className="mr-2" />
            Ajouter
          </button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left">Prénom</th>
                <th className="px-6 py-3 text-left">Nom</th>
                <th className="px-6 py-3 text-left">CIN</th>
                <th className="px-6 py-3 text-left">Email</th>
                {/* <th className="px-6 py-3 text-left">Rôle</th> */}
                <th className="px-6 py-3 text-left">Téléphone</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{user.firstName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.cin}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">{user.role}</td> */}
                  <td className="px-6 py-4 whitespace-nowrap">{user.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-blue-500 hover:text-blue-700 mr-3"
                      title="Modifier"
                    >
                      <Edit className="inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Supprimer"
                    >
                      <Trash2 className="inline" />
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

export default EmployesManagement;