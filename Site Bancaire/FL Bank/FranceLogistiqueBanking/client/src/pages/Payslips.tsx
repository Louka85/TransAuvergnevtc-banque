import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, FileText } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

//todo: remove mock functionality
const mockPayslips = [
  {
    id: "1",
    employeeName: "Jean Dupont",
    month: "Octobre 2025",
    amount: "€0.00",
    status: "Disponible",
  },
  {
    id: "2",
    employeeName: "Marie Martin",
    month: "Octobre 2025",
    amount: "€0.00",
    status: "Disponible",
  },
  {
    id: "3",
    employeeName: "Pierre Dubois",
    month: "Octobre 2025",
    amount: "€0.00",
    status: "Disponible",
  },
];

export default function Payslips() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayslips = mockPayslips.filter((payslip) =>
    payslip.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownload = (employeeName: string, month: string) => {
    console.log(`Downloading payslip for ${employeeName} - ${month}`);
    const blob = new Blob(
      [
        `FICHE DE PAIE\n\n` +
        `France Logistique Banking\n` +
        `---------------------------\n\n` +
        `Employé: ${employeeName}\n` +
        `Période: ${month}\n` +
        `Montant: €0.00\n\n` +
        `Document généré le ${new Date().toLocaleDateString('fr-FR')}\n`
      ],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Fiche_Paie_${employeeName.replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display" data-testid="text-page-title">
            Fiches de Paie
          </h1>
          <p className="text-muted-foreground mt-1">
            Consultez et téléchargez les fiches de paie
          </p>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un employé..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-payslip"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fiches de Paie Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employé</TableHead>
                  <TableHead>Période</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayslips.map((payslip) => (
                  <TableRow key={payslip.id} data-testid={`row-payslip-${payslip.id}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {payslip.employeeName}
                      </div>
                    </TableCell>
                    <TableCell>{payslip.month}</TableCell>
                    <TableCell className="font-mono">{payslip.amount}</TableCell>
                    <TableCell>
                      <span className="text-sm" style={{color: '#09E4A0'}}>{payslip.status}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(payslip.employeeName, payslip.month)}
                        data-testid={`button-download-payslip-${payslip.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPayslips.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Aucune fiche de paie trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
