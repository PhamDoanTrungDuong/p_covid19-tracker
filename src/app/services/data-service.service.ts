import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GlobalDataSumary } from '../models/global-data';
import { DateWiseData } from '../models/date-wise-data';
@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  private GLOBAL_DATA_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/01-19-2022.csv"

  private DATA_WISE_DATA_URL = "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv"

  constructor(private _http: HttpClient) { }

  getDateWiseData() {
    return this._http.get(this.DATA_WISE_DATA_URL, { responseType: 'text'}).pipe(map(result => {
      let rows = result.split('\n');
        // console.log(rows);
        let mainData: any = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/)
        dates.splice(0 , 4);
        rows.splice(0 , 1);
        rows.forEach(row=>{
          let cols = row.split(/,(?=\S)/)
          let con = cols[1];
          cols.splice(0 , 4);
          // console.log(con , cols);
          mainData[con] = [];
          cols.forEach((value , index)=>{
            let dw : DateWiseData = {
              cases : +value ,
              country : con ,
              date : new Date(Date.parse(dates[index]))
            }
            mainData[con].push(dw)
          })
        })
         console.log(mainData);
        return mainData;
    }))
  }

  getGlobalData() {
    return this._http.get(this.GLOBAL_DATA_URL, { responseType: 'text'}).pipe(
      map((res) => {
        let data: GlobalDataSumary[] = []
        let raw: any = {}
        let rows = res.split('\n');
        rows.splice(0, 1)
        //console.log(rows);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/)
         // console.log(cols);
          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10],
          }

          let temp: GlobalDataSumary = raw[cs.country];
          if(temp){
            temp.active = cs.active + temp.active
            temp.confirmed = cs.confirmed + temp.confirmed
            temp.deaths = cs.deaths + temp.deaths
            temp.recovered = cs.recovered + temp.recovered
            raw[cs.country] = temp
          }else{
            raw[cs.country] = cs;
          }
        })
        return <GlobalDataSumary[]>Object.values(raw)
      })
    )
  }


}
