import { StatCard } from "@/components/StatCard";
import { TransactionTable } from "@/components/TransactionTable";
import { Users, ArrowLeftRight, CreditCard, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

//todo: remove mock functionality
const mockStats = {
  totalEmployees: 47,
  pendingTransfers: 0,
  totalBalance: "0.00",
  monthlyGrowth: "+0%",
};

//todo: remove mock functionality
const mockRecentTransactions: any[] = [];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display" data-testid="text-page-title">
          Tableau de Bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de votre gestion bancaire virtuelle
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employés"
          value={mockStats.totalEmployees}
          icon={Users}
          description="Actifs dans le système"
        />
        <StatCard
          title="Transferts en Attente"
          value={mockStats.pendingTransfers}
          icon={ArrowLeftRight}
          description="À valider"
        />
        <StatCard
          title="Solde Total"
          value={`€${mockStats.totalBalance}`}
          icon={CreditCard}
          trend={{ value: mockStats.monthlyGrowth, isPositive: true }}
        />
        <StatCard
          title="Croissance"
          value={mockStats.monthlyGrowth}
          icon={TrendingUp}
          description="Ce mois-ci"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions Récentes</CardTitle>
        </CardHeader>
        <CardContent>
          {mockRecentTransactions.length > 0 ? (
            <TransactionTable transactions={mockRecentTransactions} />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune transaction pour le moment</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
