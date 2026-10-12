import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, ArrowUpRight } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount: string;
  fromEmployee?: string;
  toEmployee?: string;
  description: string;
  status: string;
  date: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé";
      case "pending":
        return "En attente";
      case "failed":
        return "Échoué";
      default:
        return status;
    }
  };

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>De / À</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Montant</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id} data-testid={`row-transaction-${transaction.id}`}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {transaction.type === "transfer" ? (
                    <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">
                    {transaction.type === "transfer" ? "Transfert" : "Paiement"}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  {transaction.fromEmployee && (
                    <div className="text-muted-foreground">De: {transaction.fromEmployee}</div>
                  )}
                  {transaction.toEmployee && (
                    <div>À: {transaction.toEmployee}</div>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate" data-testid={`text-description-${transaction.id}`}>
                {transaction.description}
              </TableCell>
              <TableCell className="text-right">
                <span className="font-bold font-mono text-primary" data-testid={`text-amount-${transaction.id}`}>
                  €{transaction.amount}
                </span>
              </TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(transaction.status)} data-testid={`badge-status-${transaction.id}`}>
                  {getStatusLabel(transaction.status)}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground" data-testid={`text-date-${transaction.id}`}>
                {transaction.date}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
