
import { useEffect, useState } from "react";
import { StatCard } from "@/components/StatCard";
import { TransactionTable } from "@/components/TransactionTable";
import {
  Users,
  ArrowLeftRight,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardData = {
  totalEmployees: number;
  pendingTransfers: number;
  totalBalance: string;
  monthlyGrowth: string;
  recentTransactions: any[];
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardData>({
    totalEmployees: 0,
    pendingTransfers: 0,
    totalBalance: "0.00",
    monthlyGrowth: "+0%",
    recentTransactions: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const response = await fetch("/api/dashboard");

        if (!response.ok) {
          throw new Error("Erreur API");
        }

        const data: DashboardData = await response.json();

        if (!cancelled) {
          setStats(data);
          setError(false);
        }
      } catch (err) {
        console.error("Erreur de chargement du tableau de bord :", err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1
          className="text-3xl font-bold font-display"
          data-testid="text-page-title"
        >
          Tableau de Bord
        </h1>
        <p className="text-muted-foreground mt-1">
          Vue d'ensemble de votre gestion bancaire virtuelle
        </p>
      </div>

      {error && (
        <p className="text-destructive">
          Impossible de charger les données. Vérifiez la connexion au serveur.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Employés"
          value={loading ? "..." : stats.totalEmployees}
          icon={Users}
          description="Employés enregistrés"
        />

        <StatCard
          title="Transferts en Attente"
          value={loading ? "..." : stats.pendingTransfers}
          icon={ArrowLeftRight}
          description="À valider"
        />

        <StatCard
          title="Solde Total"
          value={loading ? "..." : `€${stats.totalBalance}`}
          icon={CreditCard}
          trend={{ value: stats.monthlyGrowth, isPositive: true }}
        />

        <StatCard
          title="Croissance"
          value={loading ? "..." : stats.monthlyGrowth}
          icon={TrendingUp}
          description="Ce mois-ci"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transactions Récentes</CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Chargement des transactions...
              </p>
            </div>
          ) : stats.recentTransactions.length > 0 ? (
            <TransactionTable
              transactions={stats.recentTransactions}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucune transaction pour le moment
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
