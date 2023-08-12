import { Injectable } from '@angular/core';
import { __core_private_testing_placeholder__ } from '@angular/core/testing';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { RefundRequest } from 'src/app/Model/RefundRequest';
import { Inventory } from 'src/app/Model/inventory';
import { DataServiceService } from 'src/app/customer/services/data-service.service';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  user: any;
  constructor(private userService: DataServiceService) { 
    var tokenUser = this.userService.getUserFromToken();
    this.userService.getUser(tokenUser!.email).subscribe((result: any) => {
      this.user = result.user;
    })
  }


  generatePdf(inventoryData: Inventory[], currentDate: string): void {
    if(inventoryData.length > 0){
    const documentDefinition = {
      content: [
        { text: 'Inventory Report', style: 'header' },
        { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' }, // Display the username
        { text: `Date: ${currentDate}`, style: 'subheader' }, // Display the current date
        '\n', // Add a line break
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
        },
        subheader: {
          fontSize: 12,
          italics: true,
          margin: [0, 5, 0, 5] as [number, number, number, number] // Adjust the margin values here
        }
      }
    };
  
    pdfMake.createPdf(documentDefinition).download('inventory_report.pdf');
  }else{
    const documentDefinition = {
      content: [
        { text: 'Inventory Report', style: 'header' },
        { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' }, // Display the username
        { text: `Date: ${currentDate}`, style: 'subheader' }, // Display the current date
        '\n', // Add a line break
        {
          table: {
            headerRows: 1,
            widths: ['auto'], // Adjust widths so that it doesn't exceed the page width
            body: [
              ["There is nothing stored in Inventory at the moment."]
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 10] as [number, number, number, number] // Adjust the margin values here
        },
        subheader: {
          fontSize: 12,
          italics: true,
          margin: [0, 5, 0, 5] as [number, number, number, number] // Adjust the margin values here
        }
      }
    };
  
    pdfMake.createPdf(documentDefinition).download('inventory_report.pdf');
  }
}

  

  generateRefundsPdf(refundData: RefundRequest[], beginDate: Date, endDate: Date): void {
    console.log(refundData);
    
    let beginDate2 = new Date(beginDate);
    let endDate2 = new Date(endDate);
    
    let formattedBeginDate = beginDate2.getDate() + "-" + (beginDate2.getMonth()+1) + "-" + beginDate2.getFullYear();
    let formattedEndDate = endDate2.getDate() + "-" + (endDate2.getMonth()+1) + "-" + endDate2.getFullYear();
    
    if(refundData.length > 0){

    const documentDefinition = {
      content: [
        { text: 'Refunds Report', style: 'header' },
        { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
        { text: `From: ${formattedBeginDate} To: ${formattedEndDate}`, style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto' , 'auto', 'auto', 'auto', 'auto'], // Adjust widths so that it doesn't exceed the page width
            body: [
              ['No.', 'WineId', 'OrderId', 'Reference Number', 'Requested On', 'Description', 'Email', 'Status'],
              ...refundData.map((item, index) => [index, item.wineId, item.orderId, item.orderRefNum, item.requestedOn, item.description, item.email, item.status])
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 10] as [number, number]
        },
        subheader: {
          fontSize: 12,
          margin: [0, 6] as [number, number] // Adjust the margin values here
        }
      },
      pageOrientation: 'landscape' as const // Set the page orientation to landscape
    };

    pdfMake.createPdf(documentDefinition).download(`refunds_report_${formattedBeginDate}_${formattedEndDate}.pdf`);
  
  }else{
    const documentDefinition = {
      content: [
        { text: 'Refunds Report', style: 'header' },
        { text: `Report generated by: ${this.user.first_Name} ${this.user.last_Name}`, style: 'subheader' },
        { text: `From: ${formattedBeginDate} To: ${formattedEndDate}`, style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['auto'], // Adjust widths so that it doesn't exceed the page width
            body: [
              ["There were no refunds between the selected dates."]
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 16,
          bold: true,
          margin: [0, 10] as [number, number]
        },
        subheader: {
          fontSize: 12,
          margin: [0, 6] as [number, number] // Adjust the margin values here
        }
      },
      pageOrientation: 'landscape' as const // Set the page orientation to landscape
    };

    pdfMake.createPdf(documentDefinition).download(`refunds_report_${formattedBeginDate}_${formattedEndDate}.pdf`);
  }
}
}
