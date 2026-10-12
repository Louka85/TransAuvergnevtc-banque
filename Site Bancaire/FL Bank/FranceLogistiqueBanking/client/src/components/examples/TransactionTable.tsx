import { TransactionTable } from '../TransactionTable';

export default function TransactionTableExample() {
  const mockTransactions = [
    {
      id: "1",
      type: "transfer",
      amount: "500.00",
      fromEmployee: "Jean Dupont",
      toEmployee: "Marie Martin",
      description: "Avance sur salaire",
      status: "completed",
      date: "2025-10-30",
    },
    {
      id: "2",
      type: "payment",
      amount: "1,250.00",
      toEmployee: "Pierre Dubois",
      description: "Salaire mensuel octobre",
      status: "pending",
      date: "2025-10-31",
    },
  ];

  return (
    <div className="p-6">
      <TransactionTable transactions={mockTransactions} />
    </div>
  );
}
