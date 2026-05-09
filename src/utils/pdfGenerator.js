import { jsPDF } from 'jspdf';

/**
 * Generates a branded Tesseract Invoice PDF.
 */
export const generateInvoicePDF = (invoice, freelancer) => {
  const doc = new jsPDF();
  
  // ── Branding & Header ───────────────────────────────────────────────────
  // Background rect for header
  doc.setFillColor(0, 0, 0); // Pitch Black
  doc.rect(0, 0, 210, 40, 'F');

  // Ether Violet Accent Line
  doc.setDrawColor(124, 58, 237); // #7C3AED
  doc.setLineWidth(1);
  doc.line(0, 40, 210, 40);

  // Tesseract Logo Text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text('TESSERACT', 20, 25);
  
  doc.setFontSize(10);
  doc.setTextColor(113, 113, 122); // Secondary text
  doc.text('EST. 2026 • THE FOCUS OPERATING SYSTEM', 20, 32);

  // Invoice Number (Top Right)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text(`INVOICE: ${invoice.id}`, 190, 25, { align: 'right' });

  // ── Freelancer & Client Info ────────────────────────────────────────────
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('FROM:', 20, 55);
  doc.setFont('helvetica', 'normal');
  doc.text([
    freelancer.name || 'Your Name',
    freelancer.email || 'yourname@email.com',
    freelancer.workspace || 'Your Studio'
  ], 20, 62);

  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO:', 120, 55);
  doc.setFont('helvetica', 'normal');
  doc.text([
    invoice.client || 'Client Name',
    invoice.project || 'Project Name',
    'Payment Terms: Net 15'
  ], 120, 62);

  // ── Date Info ────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'bold');
  doc.text('ISSUED:', 20, 95);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.issued, 40, 95);

  doc.setFont('helvetica', 'bold');
  doc.text('DUE DATE:', 120, 95);
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.due, 145, 95);

  // ── Table Header ────────────────────────────────────────────────────────
  doc.setFillColor(248, 249, 250); // bg-surface Equivalent
  doc.rect(20, 105, 170, 10, 'F');
  
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.1);
  doc.line(20, 105, 190, 105);
  doc.line(20, 115, 190, 115);

  doc.setFont('helvetica', 'bold');
  doc.text('DESCRIPTION', 25, 111.5);
  doc.text('AMOUNT', 185, 111.5, { align: 'right' });

  // ── Item Row ────────────────────────────────────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.text(`Professional Services: ${invoice.project}`, 25, 125);
  doc.text(`$${invoice.amount.toLocaleString()}`, 185, 125, { align: 'right' });

  // ── Total ───────────────────────────────────────────────────────────────
  doc.setDrawColor(124, 58, 237);
  doc.setLineWidth(0.5);
  doc.line(120, 135, 190, 135);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('TOTAL DUE:', 120, 145);
  doc.text(`$${invoice.amount.toLocaleString()}`, 185, 145, { align: 'right' });

  // ── Footer ──────────────────────────────────────────────────────────────
  doc.setFontSize(8);
  doc.setTextColor(113, 113, 122);
  doc.text('Generated via Tesseract — Privacy-First Freelance CRM.', 105, 285, { align: 'center' });

  // SAVE
  doc.save(`${invoice.id}_Tesseract_Invoice.pdf`);
};
