import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Inventory } from 'src/app/Model/inventory';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() { }

  generatePdf(inventoryData: Inventory[]): void {
    const documentDefinition = {
      content: [
        { text: 'Inventory Report', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto' , 'auto', 'auto', 'auto'],
            body: [
              ['No.', 'Name', 'Varietal', 'Type', 'Price', 'Stock Limit', 'Quantity on Hand'],
              ...inventoryData.map((item, index) => [index + 1, item.wineName, item.wineVarietal, item.wineType, item.winePrice, item.stockLimit, item.quantityOnHand ])
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 10] as [number, number, number, number] // Adjust the margin values here
        }
      }
    };

    pdfMake.createPdf(documentDefinition).download('inventory_report.pdf');
  }
}
