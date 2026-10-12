import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { COMPANY_EMPLOYEES } from "@/data/employees";

interface AddTransactionDialogProps {
  type: "transfer" | "payment";
  onAdd?: (transaction: {
    type: string;
    amount: string;
    fromEmployeeId?: string;
    toEmployeeId?: string;
    description: string;
  }) => void;
}

export function AddTransactionDialog({ type, onAdd }: AddTransactionDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [fromEmployeeId, setFromEmployeeId] = useState("");
  const [toEmployeeId, setToEmployeeId] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd?.({
      type,
      amount,
      fromEmployeeId: type === "transfer" ? fromEmployeeId : undefined,
      toEmployeeId,
      description,
    });
    setOpen(false);
    setAmount("");
    setFromEmployeeId("");
    setToEmployeeId("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid={`button-add-${type}`}>
          <Plus className="h-4 w-4 mr-2" />
          {type === "transfer" ? "Nouveau Transfert" : "Nouveau Paiement"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {type === "transfer" ? "Nouveau Transfert" : "Nouveau Paiement"}
            </DialogTitle>
            <DialogDescription>
              {type === "transfer"
                ? "Créez un transfert entre employés."
                : "Enregistrez un paiement vers un employé."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {type === "transfer" && (
              <div className="space-y-2">
                <Label htmlFor="fromEmployee">De (Employé)</Label>
                <Select value={fromEmployeeId} onValueChange={setFromEmployeeId} required>
                  <SelectTrigger data-testid="select-from-employee">
                    <SelectValue placeholder="Sélectionnez un employé" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_EMPLOYEES.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="toEmployee">
                {type === "transfer" ? "À (Employé)" : "Employé"}
              </Label>
              <Select value={toEmployeeId} onValueChange={setToEmployeeId} required>
                <SelectTrigger data-testid="select-to-employee">
                  <SelectValue placeholder="Sélectionnez un employé" />
                </SelectTrigger>
                <SelectContent>
                  {COMPANY_EMPLOYEES.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                data-testid="input-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description de la transaction..."
                required
                data-testid="input-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" data-testid="button-submit-transaction">
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
