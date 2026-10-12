import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash2 } from "lucide-react";

interface EmployeeCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  balance: string;
  bonus?: number;
  status?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function EmployeeCard({
  id,
  firstName,
  lastName,
  email,
  role,
  balance,
  bonus = 0,
  status = "active",
  onEdit,
  onDelete,
}: EmployeeCardProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  const fullName = `${firstName} ${lastName}`;

  return (
    <Card data-testid={`card-employee-${id}`} className="hover-elevate">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-3">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <h3 className="font-semibold text-lg" data-testid={`text-employee-name-${id}`}>
          {fullName}
        </h3>
        <p className="text-sm text-muted-foreground" data-testid={`text-employee-email-${id}`}>
          {email}
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Rôle</span>
          <span className="text-sm font-medium" data-testid={`text-employee-role-${id}`}>
            {role}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Solde</span>
          <span className="text-lg font-bold font-display text-primary" data-testid={`text-employee-balance-${id}`}>
            €{balance}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Bonus</span>
          <span className="text-sm font-semibold" style={{color: bonus > 0 ? '#09E4A0' : bonus < 0 ? '#dc2626' : ''}} data-testid={`text-employee-bonus-${id}`}>
            {bonus > 0 ? '+' : ''}{bonus}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 pt-4">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onEdit?.(id)}
          data-testid={`button-edit-employee-${id}`}
        >
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete?.(id)}
          data-testid={`button-delete-employee-${id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
