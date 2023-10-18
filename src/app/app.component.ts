import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Papa } from 'ngx-papaparse';
import {Subscription, fromEvent } from 'rxjs';
import { IGroupedYear, IPopulation } from 'src/models/population';
import { convertCsvDataToJson } from 'src/util/csvToJson';
import { convertPopulationToString } from 'src/util/numberToText';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'world-population';
  groupedPopulation = new Map<number, IGroupedYear>();
  years: number[] = [];
  selectedYear!: number;
  currentPopulationInWords!: string;
  currentYearInfo!: IGroupedYear | undefined;
  areaChartWidthLimit = 700;

  constructor(private http: HttpClient, private papa: Papa) {}

  ngOnInit(): void {
    this.setGroupedPopulationFromCsv();
  }

  private setGroupedPopulationFromCsv(): void {
    this.http
    .get(`assets/population.csv`, { responseType: 'text' })
    .subscribe((csvText) => {
      this.papa.parse(csvText, {
        complete: (res) => {
          const splicedData: IPopulation[] = res.data.splice(1);
          this.groupedPopulation = convertCsvDataToJson(splicedData);
          this.years = [...this.groupedPopulation.keys()].sort((a, b) => a - b);
          [this.selectedYear] = this.years.slice(-1);
          this.currentYearInfo = this.groupedPopulation.get(this.selectedYear);
          this.currentPopulationInWords = convertPopulationToString(this.currentYearInfo?.totalPopulation);
        },
      });
    });
  }

  handleChange(event: MatSelectChange): void {
    const groupedYear = this.groupedPopulation.get(event.value);
    this.currentPopulationInWords = convertPopulationToString(groupedYear?.totalPopulation);
    this.selectedYear = event.value;
    this.currentYearInfo = groupedYear;
  }

}
