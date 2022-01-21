import { Component, OnInit, Input } from '@angular/core';
import { GlobalDataSumary } from 'src/app/models/global-data';
import { DataServiceService } from '../../services/data-service.service';
import { GoogleChartInterface, GoogleChartType } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  globalData: GlobalDataSumary[] = [];
  public pieChart: GoogleChartInterface = {
    chartType: 'PieChart',
  };
  public columChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
  };

  constructor(private dataService: DataServiceService) {}

  initChart(caseType: String) {
    let datatable: any = [];
    datatable.push(['Country', 'Cases']);

    this.globalData.forEach(cs => {
      let value: any;
      if (caseType == 'c')
        if (cs.confirmed > 2000000)
          value = cs.confirmed

      if (caseType == 'a')
        if (cs.active > 200)
          value = cs.active

      if (caseType == 'd')
        if (cs.deaths > 200)
          value = cs.deaths

      if (caseType == 'r')
        if (cs.recovered > 200)
          value = cs.recovered

      datatable.push([
        cs.country, value
      ])
    });

    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: { height: 500 },
    };

    this.columChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      //firstRowIsData: true,
      options: { height: 500 },
    };
  }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe((res) => {
      //console.log(res);
      this.globalData = res;

      res.forEach((cs) => {
        if (!Number.isNaN(cs.confirmed)) {
          this.totalActive += cs.active;
          this.totalConfirmed += cs.confirmed;
          this.totalDeaths += cs.deaths;
          this.totalRecovered += cs.recovered;
        }
      });
      this.initChart('c');
    });
  }

  updateChart(input: HTMLInputElement) {
    //console.log(input.value);
    this.initChart(input.value)
  }
}
