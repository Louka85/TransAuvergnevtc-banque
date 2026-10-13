
import { useEffect, useState } from "react";
import { EmployeeCard } from "@/components/EmployeeCard";
import { AddEmployeeDialog } from "@/components/AddEmployeeDialog";
import { EditEmployeeDialog } from "@/components/EditEmployeeDialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  balance: string;
  bonus: number;
  status: string;
};

export default function Employees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingEmployee, setEditingEmployee] =
    useState<Employee | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadEmployees() {
      try {
        const response = await fetch("/api/employees");

        if (!response.ok) {
          throw new Error("Impossible de charger les employés");
        }

        const data: Employee[] = await response.json();

        if (!cancelled) {
          setEmployees(data);
          setError(false);
        }
      } catch (err) {
        console.error("Erreur de chargement des employés :", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadEmployees();

    return () => {
      cancelled = true;
    };
  }, []);

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

        <AddEmployeeDialog
  onAdd={(newEmployee) => {
    setEmployees((current) => [newEmployee, ...current]);
  }}
/>
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

      {error && (
        <p className="text-destructive">
          Impossible de charger les employés depuis le serveur.
        </p>
      )}

      {loading ? (
        <p className="text-muted-foreground">Chargement des employés...</p>
      ) : (
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
      )}

      {!loading && !error && filteredEmployees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery
              ? "Aucun employé ne correspond à la recherche."
              : "Aucun employé enregistré pour le moment."}
          </p>
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
