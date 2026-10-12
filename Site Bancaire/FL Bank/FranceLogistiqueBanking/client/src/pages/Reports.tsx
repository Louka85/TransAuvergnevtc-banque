import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Euro } from "lucide-react";

//todo: remove mock functionality
const mockReportData = {
  totalTransactions: 0,
  totalVolume: "€0.00",
  averageTransactionValue: "€0.00",
  activeEmployees: 47,
  monthlyGrowth: "+0%",
  topSpenders: [] as { name: string; amount: string }[],
  recentActivity: "0 transactions ce mois",
};

export default function Reports() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display" data-testid="text-page-title">
          Rapports
        </h1>
        <p className="text-muted-foreground mt-1">
          Statistiques et analyses financières
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Total Transactions
            </h3>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">
              {mockReportData.totalTransactions}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {mockReportData.recentActivity}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Volume Total
            </h3>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">
              {mockReportData.totalVolume}
            </div>
            <p className="text-xs mt-1" style={{color: '#09E4A0'}}>
              {mockReportData.monthlyGrowth}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Valeur Moyenne
            </h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">
              {mockReportData.averageTransactionValue}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Par transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Employés Actifs
            </h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold font-display">
              {mockReportData.activeEmployees}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Dans le système</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Employés par Volume</CardTitle>
          </CardHeader>
          <CardContent>
            {mockReportData.topSpenders.length > 0 ? (
              <div className="space-y-4">
                {mockReportData.topSpenders.map((spender, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center pb-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {index + 1}
                        </span>
                      </div>
                      <span className="font-medium">{spender.name}</span>
                    </div>
                    <span className="font-bold font-mono text-primary">
                      {spender.amount}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucune donnée disponible</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activité Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune donnée disponible</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
