import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderItem {
    id: number;
    quantity: number;
    price: number;
    product: {
        id: number;
        name: string;
        images: string[];
        price: number;
    };
}

interface Order {
    id: number;
    orderNumber: string;
    subtotal: number;
    shippingFee: number;
    tax: number;
    total: number;
    status: string;
    createdAt: string;
    items: OrderItem[];
    paymentMethod?: string;
    shippingAddress?: string;
}

export const generateInvoice = (order: Order) => {
    const doc = new jsPDF();
    const date = new Date(order.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // -- Global Styles & Setup --
    const accentColor: [number, number, number] = [16, 185, 129]; // Emerald Green
    const darkColor: [number, number, number] = [31, 41, 55]; // Gray-800
    const lightGray: [number, number, number] = [107, 114, 128]; // Gray-500
    const pageMargin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();

    // -- Header Section --
    // Top Accent Bar
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, 0, pageWidth, 15, 'F');

    // Brand Name
    doc.setFontSize(28);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('E-STORE', pageMargin, 35);

    doc.setFontSize(10);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('PREMIUM MULTI-VENDOR MARKETPLACE', pageMargin, 42);

    // Invoice Label & Details
    doc.setFontSize(24);
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('INVOICE', pageWidth - pageMargin, 35, { align: 'right' });

    doc.setFontSize(10);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text(`#${order.orderNumber || order.id}`, pageWidth - pageMargin, 42, { align: 'right' });

    // -- Information Grid --
    const gridY = 60;

    // Left: Customer / Shipping info
    doc.setFontSize(11);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('SHIPPING DETAILS', pageMargin, gridY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    const splitAddress = doc.splitTextToSize(order.shippingAddress || 'No address provided', 60);
    doc.text(splitAddress, pageMargin, gridY + 8);

    // Middle: Payment Info
    doc.setFontSize(11);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('PAYMENT METHOD', 100, gridY);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text(order.paymentMethod?.toUpperCase() || 'CREDIT CARD', 100, gridY + 8);

    // Right: Transaction Summary
    doc.setFontSize(11);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('TRANSACTION INFO', pageWidth - pageMargin, gridY, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text(`Date: ${date}`, pageWidth - pageMargin, gridY + 8, { align: 'right' });

    // -- Cancelled Alert (If applicable) --
    if (order.status.toLowerCase() === 'cancelled') {
        doc.setFontSize(40);
        doc.setTextColor(220, 38, 38); // Red-600
        doc.setFont('helvetica', 'bold');
        doc.text('ORDER CANCELLED', pageWidth / 2, gridY + 22, { align: 'center' });
    }

    // -- Line Item Table --
    const tableData = order.items.map(item => [
        item.product?.name || 'Unknown Product',
        item.quantity.toString(),
        `$${Number(item.price).toFixed(2)}`,
        `$${(item.quantity * item.price).toFixed(2)}`
    ]);

    autoTable(doc, {
        startY: gridY + 30,
        margin: { left: pageMargin, right: pageMargin },
        head: [['DESCRIPTION', 'QTY', 'UNIT PRICE', 'SUBTOTAL']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: darkColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
            cellPadding: 6,
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 9,
            cellPadding: 5,
            textColor: [55, 65, 81]
        },
        columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'center', cellWidth: 20 },
            2: { halign: 'right', cellWidth: 35 },
            3: { halign: 'right', cellWidth: 35 },
        },
        alternateRowStyles: {
            fillColor: [249, 250, 251]
        }
    });

    // -- Summary Section --
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    const summaryWidth = 65;
    const summaryX = pageWidth - pageMargin - summaryWidth;

    doc.setFontSize(10);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont('helvetica', 'normal');

    // Subtotal Row
    doc.text('SUBTOTAL', summaryX, finalY);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(`$${Number(order.subtotal || order.total).toFixed(2)}`, pageWidth - pageMargin, finalY, { align: 'right' });

    // Tax Row
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text(`Estimated Tax (${order.tax > 0 ? 'Inc.' : '0%'})`, summaryX, finalY + 8);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.text(`$${Number(order.tax || 0).toFixed(2)}`, pageWidth - pageMargin, finalY + 8, { align: 'right' });

    // Shipping Row
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('Shipping & Handling', summaryX, finalY + 16);
    doc.setTextColor(16, 185, 129); // Green for Free if 0
    doc.text(order.shippingFee > 0 ? `$${Number(order.shippingFee).toFixed(2)}` : 'FREE', pageWidth - pageMargin, finalY + 16, { align: 'right' });

    // Divider Line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(summaryX, finalY + 20, pageWidth - pageMargin, finalY + 20);

    // Total Row
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.text('TOTAL', summaryX, finalY + 30);
    doc.text(`$${Number(order.total).toFixed(2)}`, pageWidth - pageMargin, finalY + 30, { align: 'right' });

    // -- Notes & Terms Section --
    const leftColY = finalY + 45; // Adjusted to be below the total
    doc.setFontSize(9);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('NOTES & TERMS', pageMargin, leftColY);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    const terms = [
        "1. Please pay within 15 days from the date of invoice.",
        "2. Make all checks payable to E-Store Marketplace.",
        "3. Thank you for your business!"
    ];
    doc.text(terms, pageMargin, leftColY + 6);

    // -- Signature Section --
    const signatureY = 245;
    doc.setDrawColor(229, 231, 235);
    doc.line(pageMargin, signatureY, 80, signatureY);
    doc.line(pageWidth - 80, signatureY, pageWidth - pageMargin, signatureY);

    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.text('CUSTOMER SIGNATURE', 50, signatureY + 5, { align: 'center' });
    doc.text('AUTHORIZED AGENT', pageWidth - 50, signatureY + 5, { align: 'center' });

    // -- Footer --
    const footerY = 270;

    // Bottom Border
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.rect(0, 290, pageWidth, 7, 'F');

    doc.setFontSize(12);
    doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for choosing E-Store!', pageWidth / 2, footerY, { align: 'center' });

    doc.setFontSize(8);
    doc.setTextColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFont('helvetica', 'normal');
    doc.text('This is a computer generated invoice. For any inquiries, contact support@e-store.com', pageWidth / 2, footerY + 6, { align: 'center' });
    doc.text('123 Luxury Avenue, Suite 400 | www.e-store.com', pageWidth / 2, footerY + 11, { align: 'center' });

    // Download PDF
    doc.save(`E_Store_Invoice_${order.orderNumber || order.id}.pdf`);
};
