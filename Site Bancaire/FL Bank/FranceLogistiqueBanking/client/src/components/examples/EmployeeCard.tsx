import { EmployeeCard } from '../EmployeeCard';

export default function EmployeeCardExample() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      <EmployeeCard
        id="1"
        firstName="Jean"
        lastName="Dupont"
        email="jean.dupont@fl.fr"
        role="Chauffeur"
        balance="1,250.00"
        onEdit={(id) => console.log('Edit employee', id)}
        onDelete={(id) => console.log('Delete employee', id)}
      />
      <EmployeeCard
        id="2"
        firstName="Marie"
        lastName="Martin"
        email="marie.martin@fl.fr"
        role="Gestionnaire"
        balance="2,450.50"
        onEdit={(id) => console.log('Edit employee', id)}
        onDelete={(id) => console.log('Delete employee', id)}
      />
    </div>
  );
}
