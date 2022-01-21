import { GlobalDataSumary } from 'src/app/models/global-data';
import { Component, OnInit } from '@angular/core';
import { DataServiceService } from '../../services/data-service.service';
import { DateWiseData } from 'src/app/models/date-wise-data';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  data: GlobalDataSumary[] = [];
  countries: string[] = [];
  dateWiseData: any
  selectedCountryData : DateWiseData[] = [];
  constructor(private dataService: DataServiceService) {}

  ngOnInit(): void {
    this.dataService.getDateWiseData().subscribe(res => {
      console.log(res);
    });

    this.dataService.getGlobalData().subscribe((res) => {
      this.data = res;
      this.data.forEach((cs) => {
        this.countries.push(cs.country);
      });
     // console.log('data: ', this.data);
    });
  }

  updatevalues(country: string) {
    console.log(country);
    this.data.forEach((cs) => {
      if (cs.country == country.trim()) {
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    });

    console.log(
      'active: ' +
        this.totalActive +
        ', confirm: ' +
        this.totalConfirmed +
        ', deaths: ' +
        this.totalDeaths +
        ', recovered: ' +
        this.totalRecovered
    );
  }
}
