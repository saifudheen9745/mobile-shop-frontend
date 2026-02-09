// import PDFDocument from "pdfkit";
// import type { IPurchaseDocument } from "./purchase.types.js";
// import path from "path";

// export const generatePurchaseBillPDF = (
//   purchase: IPurchaseDocument
// ): PDFKit.PDFDocument => {
//   const doc = new PDFDocument({
//     size: "A4",
//     margin: 40,
//   });

//   /* ---------------- FONT SETUP (₹ FIX) ---------------- */
//   const regularFont = path.join(
//     process.cwd(),
//     "assets/fonts/NotoSans-Regular.ttf"
//   );
//   const boldFont = path.join(
//     process.cwd(),
//     "assets/fonts/NotoSans-Bold.ttf"
//   );

//   doc.registerFont("regular", regularFont);
//   doc.registerFont("bold", boldFont);

//   const leftX = doc.page.margins.left;
//   const rightX = doc.page.width - doc.page.margins.right;
//   const pageWidth = rightX - leftX;

//   /* ---------------- SHOP HEADER ---------------- */
//   doc.font("bold").fontSize(18).text("SMART MOBILES", leftX, 40);

//   doc.font("regular").fontSize(9).text(
//     "MG Road, Kochi, Kerala - 682016\nPhone: +91 98765 43210\nGSTIN: 32ABCDE1234F1Z9",
//     leftX,
//     65
//   );

//   doc.font("bold").fontSize(22).text("INVOICE", 0, 45, {
//     align: "right",
//   });

//   doc.moveDown(3);

//   /* ---------------- INVOICE META ---------------- */
//   const metaY = doc.y;

//   doc.font("regular").fontSize(10);
//   doc.text(`Invoice No: ${purchase.invoiceNumber}`, leftX, metaY);
//   doc.text(`Date: ${purchase.createdAt?.toDateString()}`, leftX, metaY + 15);
//   doc.text(`Customer: ${purchase.user}`, leftX, metaY + 30);
//   doc.text(`Phone: ${purchase.phone}`, leftX, metaY + 45);

//   /* ---- PAYMENT DETAILS (EXTREME RIGHT) ---- */
//   doc.font("bold").text("Payment Details", rightX - 180, metaY, {
//     width: 180,
//     align: "right",
//   });

//   doc.font("regular").text(
//     `Method: ${purchase.paymentMethod}`,
//     rightX - 180,
//     metaY + 15,
//     {
//       width: 180,
//       align: "right",
//     }
//   );

//   doc.moveDown(3);

//   /* ---------------- SEPARATOR ---------------- */
//   doc.moveTo(leftX, doc.y).lineTo(rightX, doc.y).stroke();
//   doc.moveDown(1);

//   /* ---------------- TABLE HEADER ---------------- */
//   const tableY = doc.y;

//   doc.font("bold").fontSize(10);
//   doc.text("Product", leftX, tableY);
//   doc.text("Qty", 300, tableY, { width: 40, align: "right" });
//   doc.text("Price", 360, tableY, { width: 80, align: "right" });
//   doc.text("Total", 460, tableY, { width: 80, align: "right" });

//   doc.moveDown(0.5);
//   doc.moveTo(leftX, doc.y).lineTo(rightX, doc.y).stroke();

//   /* ---------------- TABLE ROWS ---------------- */
//   doc.font("regular");
//   let y = doc.y + 6;

//   purchase.products.forEach((p) => {
//     doc.text(p.name, leftX, y, { width: 240 });
//     doc.text(String(p.quantity), 300, y, { width: 40, align: "right" });
//     doc.text(`₹ ${p.sellingPrice}`, 360, y, {
//       width: 80,
//       align: "right",
//     });
//     doc.text(`₹ ${p.total}`, 460, y, {
//       width: 80,
//       align: "right",
//     });
//     y += 22;
//   });

//   doc.y = y + 10;

//   /* ---------------- GRAND TOTAL (PERFECT ALIGN) ---------------- */
//   doc.moveTo(300, doc.y).lineTo(rightX, doc.y).stroke();
//   doc.moveDown(0.8);

//   const totalRowY = doc.y;

//   doc.font("bold").fontSize(12);
//   doc.text("Grand Total", 300, totalRowY, {
//     width: 140,
//     align: "right",
//   });

//   doc.text(`₹ ${purchase.grandTotal}`, 460, totalRowY, {
//     width: 80,
//     align: "right",
//   });

//   /* ---------------- FOOTER ---------------- */
//   doc.moveDown(4);
//   doc.font("regular").fontSize(10).text("Thank you for your purchase!", {
//     align: "center",
//   });

//   doc.moveDown(0.5);
//   doc
//     .fontSize(8)
//     .fillColor("gray")
//     .text("This is a system-generated invoice.", {
//       align: "center",
//     })
//     .fillColor("black");

//   return doc;
// };



import PDFDocument from "pdfkit";
import type { IPurchaseDocument } from "./purchase.types.js";
import path from "path";

export const generatePurchaseBillPDF = (
  purchase: IPurchaseDocument
): PDFKit.PDFDocument => {
  const doc = new PDFDocument({
    size: "A5",
    margin: 30,
  });

  /* ---------------- FONT SETUP ---------------- */
  const regularFont = path.join(
    process.cwd(),
    "assets/fonts/NotoSans-Regular.ttf"
  );
  const boldFont = path.join(
    process.cwd(),
    "assets/fonts/NotoSans-Bold.ttf"
  );

  doc.registerFont("regular", regularFont);
  doc.registerFont("bold", boldFont);

  const leftX = doc.page.margins.left;
  const rightX = doc.page.width - doc.page.margins.right;

  /* ---------------- HEADER ---------------- */
  doc.font("bold").fontSize(16).text("SMART MOBILES", leftX, 30);

  doc.font("regular").fontSize(8).text(
    "MG Road, Kochi, Kerala - 682016\nPhone: +91 98765 43210\nGSTIN: 32ABCDE1234F1Z9",
    leftX,
    52
  );

  doc.font("bold").fontSize(18).text("INVOICE", 0, 32, { align: "right" });

  doc.moveDown(2.2);

  /* ---------------- META ---------------- */
  const metaY = doc.y;

  doc.font("regular").fontSize(9);
  doc.text(`Invoice No: ${purchase.invoiceNumber}`, leftX, metaY);
  doc.text(`Date: ${purchase.createdAt?.toDateString()}`, leftX, metaY + 12);
  doc.text(`Customer: ${purchase.user}`, leftX, metaY + 24);
  doc.text(`Phone: ${purchase.phone}`, leftX, metaY + 36);

  doc.font("bold").text("Payment Details", rightX - 150, metaY, {
    width: 150,
    align: "right",
  });

  doc.font("regular").text(
    `Method: ${purchase.paymentMethod}`,
    rightX - 150,
    metaY + 12,
    {
      width: 150,
      align: "right",
    }
  );

  doc.moveDown(2);

  /* ---------------- LINE ---------------- */
  doc.moveTo(leftX, doc.y).lineTo(rightX, doc.y).stroke();

  /* ---------------- TABLE HEADER ---------------- */
  doc.moveDown(0.7);
  const tableY = doc.y;

  doc.font("bold").fontSize(9);
  doc.text("Product", leftX, tableY);
  doc.text("Qty", 220, tableY, { width: 30, align: "right" });
  doc.text("Price", 260, tableY, { width: 60, align: "right" });
  doc.text("Total", 330, tableY, { width: 60, align: "right" });

  doc.moveDown(0.4);
  doc.moveTo(leftX, doc.y).lineTo(rightX, doc.y).stroke();

  /* ---------------- ROWS ---------------- */
  doc.font("regular").fontSize(9);
  let y = doc.y + 5;

  purchase.products.forEach((p) => {
    doc.text(p.name, leftX, y, { width: 170 });
    doc.text(String(p.quantity), 220, y, { width: 30, align: "right" });
    doc.text(`₹ ${p.sellingPrice}`, 260, y, { width: 60, align: "right" });
    doc.text(`₹ ${p.total}`, 330, y, { width: 60, align: "right" });
    y += 18;
  });

  doc.y = y + 6;

  /* ---------------- GRAND TOTAL ---------------- */
  doc.moveTo(220, doc.y).lineTo(rightX, doc.y).stroke();
  doc.moveDown(0.5);

  const totalY = doc.y;

  doc.font("bold").fontSize(10);
  doc.text("Grand Total", 220, totalY, { width: 90, align: "right" });
  doc.text(`₹ ${purchase.grandTotal}`, 330, totalY, {
    width: 60,
    align: "right",
  });

  /* ---------------- FOOTER ---------------- */
  doc.moveDown(3);
  doc.font("regular").fontSize(9).text("Thank you for your purchase!", {
    align: "center",
  });

  doc.moveDown(0.3);
  doc.fontSize(7).fillColor("gray").text(
    "This is a system-generated invoice.",
    { align: "center" }
  );

  return doc;
};
