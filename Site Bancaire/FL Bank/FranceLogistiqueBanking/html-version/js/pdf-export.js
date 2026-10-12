// Système d'export PDF et Excel

const PDFExport = {
    // Générer une fiche de paie en PDF
    generatePayslipPDF(payslip, employee) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // En-tête
        doc.setFillColor(0, 90, 69);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text('FL Banking', 20, 20);
        doc.setFontSize(12);
        doc.text('France Logistique', 20, 30);

        // Informations de la fiche de paie
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text('FICHE DE PAIE', 20, 55);

        // Informations employé
        doc.setFontSize(10);
        let y = 65;
        doc.text(`Employé: ${payslip.employeeName}`, 20, y);
        y += 7;
        doc.text(`ID: ${employee.id}`, 20, y);
        y += 7;
        doc.text(`Période: ${payslip.period}`, 20, y);
        y += 7;
        doc.text(`Date d'émission: ${new Date().toLocaleDateString('fr-FR')}`, 20, y);

        // Détails
        y += 15;
        doc.setFontSize(12);
        doc.text('DÉTAILS', 20, y);
        y += 10;

        doc.setFontSize(10);
        doc.text(`Salaire brut: ${this.formatAmount(payslip.grossSalary)}`, 20, y);
        y += 7;
        if (payslip.bonuses > 0) {
            doc.text(`Primes: +${this.formatAmount(payslip.bonuses)}`, 20, y);
            y += 7;
        }
        if (payslip.deductions > 0) {
            doc.text(`Déductions: -${this.formatAmount(payslip.deductions)}`, 20, y);
            y += 7;
        }
        y += 3;
        doc.setDrawColor(0, 90, 69);
        doc.line(20, y, 190, y);
        y += 7;
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Salaire net: ${this.formatAmount(payslip.netSalary)}`, 20, y);

        // Pied de page
        doc.setFont(undefined, 'normal');
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Document généré par FL Banking - France Logistique', 20, 280);

        // Télécharger
        doc.save(`fiche-paie-${employee.id}-${payslip.period}.pdf`);
    },

    // Générer un rapport en PDF
    generateReportPDF(reportData) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // En-tête
        doc.setFillColor(0, 90, 69);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.text('FL Banking', 20, 20);
        doc.setFontSize(12);
        doc.text('Rapport Financier', 20, 30);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text('RAPPORT FINANCIER', 20, 55);
        doc.setFontSize(10);
        doc.text(`Période: ${reportData.period}`, 20, 65);
        doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 72);

        let y = 85;
        doc.setFontSize(12);
        doc.text('RÉSUMÉ', 20, y);
        y += 10;

        doc.setFontSize(10);
        doc.text(`Dépenses totales: ${this.formatAmount(reportData.totalExpenses)}`, 20, y);
        y += 7;
        doc.text(`Masse salariale: ${this.formatAmount(reportData.totalSalaries)}`, 20, y);
        y += 7;
        doc.text(`Effectif: ${reportData.totalEmployees} employés`, 20, y);

        y += 15;
        doc.setFontSize(12);
        doc.text('DÉTAILS PAR CATÉGORIE', 20, y);
        y += 10;

        reportData.categories.forEach(cat => {
            doc.setFontSize(10);
            doc.text(`${cat.name}: ${this.formatAmount(cat.amount)}`, 20, y);
            y += 7;
        });

        // Pied de page
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text('Document généré par FL Banking - France Logistique', 20, 280);

        doc.save(`rapport-${reportData.period}-${Date.now()}.pdf`);
    },

    // Générer un rapport en Excel
    generateReportExcel(reportData) {
        // Créer un CSV (format Excel simple)
        let csv = 'Rapport Financier - FL Banking\n';
        csv += `Période: ${reportData.period}\n`;
        csv += `Date: ${new Date().toLocaleDateString('fr-FR')}\n\n`;
        csv += 'Catégorie,Montant\n';
        
        reportData.categories.forEach(cat => {
            csv += `${cat.name},${cat.amount}\n`;
        });

        csv += `\nTotal,${reportData.totalExpenses}\n`;

        // Télécharger
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `rapport-${reportData.period}-${Date.now()}.csv`;
        link.click();
    },

    // Envoyer un rapport par email (simulation)
    sendReportByEmail(reportData, email) {
        // En production, utiliser un service d'email réel
        alert(`Le rapport a été envoyé à ${email}\n\nEn production, cette fonctionnalité enverrait réellement un email avec le rapport en pièce jointe.`);
        
        // Pour la démo, on génère le PDF et on simule l'envoi
        this.generateReportPDF(reportData);
    },

    formatAmount(amount) {
        return new Intl.NumberFormat('fr-FR', { 
            style: 'currency', 
            currency: 'EUR' 
        }).format(amount);
    }
};

