import { useState } from "react";
import { TransactionTable } from "@/components/TransactionTable";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

//todo: remove mock functionality
const mockPayments: any[] = [];

export default function Payments() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayments = mockPayments.filter(
    (payment) => statusFilter === "all" || payment.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display" data-testid="text-page-title">
            Paiements
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez les paiements vers vos employés
          </p>
        </div>
        <AddTransactionDialog
          type="payment"
          onAdd={(transaction) => console.log("New payment:", transaction)}
        />
      </div>

      <div className="flex gap-4 items-end flex-wrap">
        <div className="space-y-2 w-full max-w-xs">
          <Label>Filtrer par statut</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger data-testid="select-status-filter">
              <SelectValue placeholder="Tous" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="completed">Terminés</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="failed">Échoués</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <TransactionTable transactions={filteredPayments} />

      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun paiement trouvé</p>
        </div>
      )}
    </div>
  );
}
