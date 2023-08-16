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


////////////////////////////////Pie Chart/////////////////////////////////////////////////
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
  this.chartsService.getGenderDistribution().subscribe((data: any[]) => { 
    const labels = data.map(d => d.gender);
    const counts = data.map(d => d.count);

    setTimeout(() => {
      this.createGenderPieChart(labels, counts);
    }, 0);
  });
}

//////////////////////////////////////////Age distrubution Chart/////////////////////////////////////////////////
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
          label: 'Customers By Age', 
          data: counts,
          backgroundColor: 'blue' 
        }]
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Customer Age Distribution', 
            font: {
              size: 18,
            }
          },
          legend: {
            display: true, 
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
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
  const datasets = [];

  // Add the wine data only if there is data
  if (wineTotals.length > 0) {
    datasets.push({
      data: wineTotals,
      borderColor: 'blue', // Wine sales
      pointBackgroundColor: 'blue', // Same as borderColor for Wine Sales
      label: 'Wine Sales'
    });
  }

  // Add the ticket data only if there is data
  if (ticketTotals.length > 0) {
    datasets.push({
      data: ticketTotals,
      borderColor: 'red', // Ticket sales
      pointBackgroundColor: 'red', // Same as borderColor for Event Sales
      label: 'Event Sales'
    });
  }

  this.salesReportLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: datasets
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

mergeLabels(wineLabels: string[], ticketDates: string[], startDate: string, endDate: string): string[] {
  const combinedLabels: Set<string> = new Set();

  for (let date = moment(startDate); date.isSameOrBefore(endDate); date.add(1, 'days')) {
    combinedLabels.add(date.format('YYYY-MM-DD'));
  }
  wineLabels.forEach(label => combinedLabels.add(label));
  ticketDates.forEach(label => combinedLabels.add(label));

  // Convert to an array and sort
  const sortedLabels = Array.from(combinedLabels);
  sortedLabels.sort();
  return sortedLabels;
}



loadSalesReport() {
  const startDate = this.startDate;
  const endDate = this.endDate;

  if (startDate && endDate) {
    this.chartsService.getSalesReport(startDate, endDate).subscribe(data => {
      const wineLabels = data.length ? data.map((order: any) => moment(order.orderDate).format('YYYY-MM-DD')) : [];
      const wineTotals = data.length ? data.map((order: any) => order.totalAmount) : [0];

      this.totalWineSales = wineTotals.reduce((a: number, b: number) => a + b, 0);

      this.chartsService.getTicketSalesReport(startDate, endDate).subscribe(ticketData => {
        const ticketDates = ticketData.length ? ticketData.map((purchase: any) => moment(purchase.purchaseDate).format('YYYY-MM-DD')) : [];
        const ticketTotals = ticketData.length ? ticketData.map((purchase: any) => purchase.totalAmount) : [0];
        this.totalEventSales = ticketTotals.reduce((a: number, b: number) => a + b, 0);

        this.totalSales = this.totalWineSales + this.totalEventSales;

        // Combine wine and ticket labels, and make sure that the total counts align
        const labels = this.mergeLabels(wineLabels, ticketDates, startDate, endDate);
        console.log("Labels:", labels);

        const wineTotalsFilled = labels.map(label => {
          const index = wineLabels.indexOf(label);
          return index !== -1 ? wineTotals[index] : 0;
        });

          const ticketTotalsFilled = labels.map(label => {
          const index = ticketDates.indexOf(label);
          return index !== -1 ? ticketTotals[index] : 0;
        });

        console.log("Wine Totals Filled:", wineTotalsFilled);
        console.log("Ticket Totals Filled:", ticketTotalsFilled);

        
        setTimeout(() => {
          this.createSalesReportChart(labels, wineTotalsFilled, ticketTotalsFilled);
        }, 0);
      });
      console.log(data);

    });
  } else {
    this.toastr.error('Please select valid dates');
    console.error('Start date and end date must be defined.');
  }
}

}

