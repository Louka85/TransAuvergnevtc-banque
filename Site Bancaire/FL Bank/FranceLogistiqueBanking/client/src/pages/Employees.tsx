import { useState } from "react";
import { EmployeeCard } from "@/components/EmployeeCard";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { EditEmployeeDialog } from "@/components/EditEmployeeDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// TODO: Replace mock data with real backend data.
const mockEmployees = [
  {
    id: "1",
    firstName: "Marie",
    lastName: "Martin",
    email: "marie.martin@fl.fr",
    role: "Gestionnaire",
    balance: "0.00",
    bonus: 0,
    status: "active",
  },
];

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState(mockEmployees);
  const [editingEmployee, setEditingEmployee] =
    useState<(typeof mockEmployees)[0] | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    const emp = employees.find((e) => e.id === id);
    if (emp) {
      setEditingEmployee(emp);
      setEditOpen(true);
    }
  };

  const handleSave = (updatedEmployee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) => {
    setEmployees((current) =>
      current.map((emp) =>
        emp.id === updatedEmployee.id
          ? { ...emp, ...updatedEmployee }
          : emp
      )
    );
    setEditOpen(false);
  };

  const handleDelete = (id: string) => {
    setEmployees((current) => current.filter((emp) => emp.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1
            className="text-3xl font-bold font-display"
            data-testid="text-page-title"
          >
            Employés
          </h1>
        </div>

        <AddEmployeeDialog />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un employé..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-employee"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <EmployeeCard
            key={employee.id}
            {...employee}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun employé trouvé</p>
        </div>
      )}

      <EditEmployeeDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        employee={editingEmployee}
        onSave={handleSave}
      />
    </div>
  );
}
