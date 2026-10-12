import { AddTransactionDialog } from '../AddTransactionDialog';

export default function AddTransactionDialogExample() {
  return (
    <div className="p-6 flex gap-4">
      <AddTransactionDialog
        type="transfer"
        onAdd={(transaction) => console.log('New transfer:', transaction)}
      />
      <AddTransactionDialog
        type="payment"
        onAdd={(transaction) => console.log('New payment:', transaction)}
      />
    </div>
  );
}
