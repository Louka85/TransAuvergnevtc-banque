import { AddEmployeeDialog } from '../AddEmployeeDialog';

export default function AddEmployeeDialogExample() {
  return (
    <div className="p-6">
      <AddEmployeeDialog
        onAdd={(employee) => console.log('New employee:', employee)}
      />
    </div>
  );
}
