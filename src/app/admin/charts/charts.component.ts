import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, PieController, ArcElement  } from 'chart.js';
import { ChartsService } from '../services/charts.service';
import { BarController, BarElement  } from 'chart.js';


interface GenderDistribution {
  gender: string; // Change to 'gender'
  count: number;  // Change to 'count'
}

Chart.register(BarController, BarElement , LineController, LineElement, PointElement, LinearScale, CategoryScale, PieController, ArcElement);


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})


export class ChartsComponent implements AfterViewInit {
//The types of charts
@ViewChild('genderPieChartCanvas') genderPieChartCanvas!: ElementRef;
genderPieChart: any;

@ViewChild('ageDistributionCanvas') ageDistributionCanvas!: ElementRef;
ageDistributionBarChart: any;

@ViewChild('salesReportCanvas') salesReportCanvas!: ElementRef;
salesReportLineChart: any;

constructor(private chartsService: ChartsService) { }

startDate: string | undefined;
endDate: string | undefined;

ngAfterViewInit(): void {
    this.loadGenderDistributionChart();
    this.loadAgeDistributionChart();
  }


///////////////////////////////////////////////////////////////////Pie Chart
createGenderPieChart(labels: string[], counts: number[]): void {
  if (this.genderPieChart) {
    this.genderPieChart.destroy();
  }

  const ctx = this.genderPieChartCanvas.nativeElement.getContext('2d');

  this.genderPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: counts,
        backgroundColor: ['blue', 'red', 'green'],
      }]
    },
    options: {
      plugins: {
        legend: {
          display: true,
          labels: {
            usePointStyle: true,
          }
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
          data: counts,
          backgroundColor: 'blue' // You can customize this
        }]
      },
      options: {
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

createSalesReportChart(labels: string[], totals: number[]): void {
  if (this.salesReportLineChart) {
    this.salesReportLineChart.destroy();
  }

  const ctx = this.salesReportCanvas.nativeElement.getContext('2d');

  this.salesReportLineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: totals,
        borderColor: 'blue' // You can customize this
      }]
    }
  });
}


loadSalesReport() {
  this.chartsService.getSalesReport(this.startDate, this.endDate).subscribe(data => {
    const labels = data.map((order: any) => order.orderDate);
    const totals = data.map((order: any) => order.orderTotal);

    setTimeout(() => {
      this.createSalesReportChart(labels, totals);
    }, 0);
  });
}



}

