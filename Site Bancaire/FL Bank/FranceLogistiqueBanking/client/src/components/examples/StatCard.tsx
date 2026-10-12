import { StatCard } from '../StatCard';
import { Users } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Employés"
        value="24"
        icon={Users}
        description="Actifs dans le système"
      />
      <StatCard
        title="Solde Total"
        value="€45,230"
        icon={Users}
        trend={{ value: "12%", isPositive: true }}
      />
    </div>
  );
}
