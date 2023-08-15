import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, PieController, ArcElement, Legend, Title, Tooltip } from 'chart.js';
import { ChartsService } from '../services/charts.service';
import { BarController, BarElement  } from 'chart.js';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';


interface GenderDistribution {
  gender: string;
  count: number;
}

Chart.register(BarController, BarElement , LineController, LineElement, PointElement, LinearScale, CategoryScale, PieController, ArcElement, Legend, Title, Tooltip);


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})


export class ChartsComponent implements AfterViewInit {
  totalWineSales: number = 0;
  totalEventSales: number = 0;
  totalSales: number = 0;
//The types of charts
@ViewChild('genderPieChartCanvas') genderPieChartCanvas!: ElementRef;
genderPieChart: any;

@ViewChild('ageDistributionCanvas') ageDistributionCanvas!: ElementRef;
ageDistributionBarChart: any;

@ViewChild('salesReportCanvas') salesReportCanvas!: ElementRef;
salesReportLineChart: any;

constructor(private chartsService: ChartsService, private toastr: ToastrService) { }

startDate: string | undefined;
endDate: string | undefined;

ngAfterViewInit(): void {
    this.loadGenderDistributionChart();
    this.loadAgeDistributionChart();
  }


///////////////////////////////////////////////////////////////////Pie Chart
createGenderPieChart(labels: string[], counts: number[]): void {

    // Determine colors based on the labels
    const backgroundColors = labels.map(label => {
      switch (label) {
        case "Female": return 'blue';
        case "Male": return 'red';
        case "Other": return 'green';
        default: return 'grey'; // Fallback color
      }
    });

  if (this.genderPieChart) {
    this.genderPieChart.destroy();
  }

  const ctx = this.genderPieChartCanvas.nativeElement.getContext('2d');

  this.genderPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels, // Use the passed-in labels
      datasets: [{
        data: counts,
        backgroundColor: backgroundColors, // Use the dynamically generated colors
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: 'black',
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: 'Gender',
          font: {
            size: 18,
          }
        }
      },
    },
  });

  console.log(labels);
}






loadGenderDistributionChart(): void {
  this.chartsService.getGenderDistribution().subscribe((data: any[]) => { // Change type to any or align with actual structure
    const labels = data.map(d => d.gender); // Change to 'gender'
    const counts = data.map(d => d.count); // Change to 'count'

    setTimeout(() => {
      this.createGenderPieChart(labels, counts);
    }, 0);
  });
}

//////////////////////////////////////////////////////////////////////Age distrubution Chart
loadAgeDistributionChart(): void {
  this.chartsService.getAgeDistribution().subscribe((data: { [key: string]: number }) => {
    const labels = Object.keys(data);
    const counts = Object.values(data);

    const ctx = this.ageDistributionCanvas.nativeElement.getContext('2d');
    this.ageDistributionBarChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Customers By Age', // Legend for the dataset
          data: counts,
          backgroundColor: 'blue' // You can customize this
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Customer Age Distribution', // Header for the chart
            font: {
              size: 18,
            }
          },
          legend: {
            display: true, // This ensures the legend is displayed
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1 // This ensures only whole numbers are used on the y-axis
            }
          }
        }
      }
    });
  });
}

////////////////////////////////Sales Chart///////////////////////////////////////////
formatDates(dates: string[], format: string = 'YYYY-MM-DD'): string[] {
  return dates.map(date => moment(date).format(format));
}

createSalesReportChart(labels: string[], wineTotals: number[], ticketTotals: number[]): void {
  // Destroy the previous chart
  if (this.salesReportLineChart) {
    this.salesReportLineChart.destroy();
  }

  const ctx = this.salesReportCanvas.nativeElement.getContext('2d');

  this.salesReportLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          data: wineTotals,
          borderColor: 'blue', // Wine sales
          pointBackgroundColor: 'blue', // Same as borderColor for Wine Sales
          label: 'Wine Sales'
        },
        {
          data: ticketTotals,
          borderColor: 'red', // Ticket sales
          pointBackgroundColor: 'red', // Same as borderColor for Event Sales
          label: 'Event Sales'
        }
      ]
    },
    options: {
      plugins: {
        title: {
          display: true,
          font: {
            size: 18,
          }
        },
        legend: {
          display: true,
          labels: {
            usePointStyle: true,
          }
        }
      }
    }
  });
}



loadSalesReport() {
  // Assigning the start and end dates to local variables so TypeScript knows they won't change
  const startDate = this.startDate;
  const endDate = this.endDate;

  // Check if both startDate and endDate are defined
  if (startDate && endDate) {
    console.log("startDate:", this.startDate);
    console.log("endDate:", this.endDate);

    // Call the getSalesReport method from the service, passing in the start and end dates
    this.chartsService.getSalesReport(startDate, endDate).subscribe(data => {
      const wineLabels = data.map((order: any) => order.orderDate);
      const wineTotals = data.map((order: any) => order.orderTotal);
      this.totalWineSales = wineTotals.reduce((a: number, b: number) => a + b, 0); // Sum of wine sales

      // Format the wine labels
      const wineLabelsFormatted = this.formatDates(wineLabels, 'MM-DD');

      this.chartsService.getTicketSalesReport(startDate, endDate).subscribe(ticketData => {
        // Extract the purchase dates and total amounts for ticket sales
        const ticketDates = ticketData.map((purchase: any) => purchase.purchaseDate);
        const ticketTotals = ticketData.map((purchase: any) => purchase.totalAmount);
        this.totalEventSales = ticketTotals.reduce((a: number, b: number) => a + b, 0); // Sum of ticket sales

        // Calculate the total sales
        this.totalSales = this.totalWineSales + this.totalEventSales;

        // Combine wine and ticket labels if needed
        // const labels = mergeLabels(wineLabels, ticketDates); // You may need to implement this

        // Create the sales report chart with the extracted data
        setTimeout(() => {
          // Use the formatted labels here
          this.createSalesReportChart(wineLabelsFormatted, wineTotals, ticketTotals);
        }, 0);
      });
    });
  } else {
    // Show toastr notification if the dates are not defined
    this.toastr.error('Please select valid dates');
    console.error('Start date and end date must be defined.'); // Log an error message if the dates are not defined
    // Handle error, perhaps showing a message to the user.
  }
}

}

