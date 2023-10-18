import { Component, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IBubbleActions, createDetailChart } from 'src/closures/details-chart';
import { IGroupedYear } from 'src/models/population';

@Component({
  selector: 'app-population-vs-density',
  templateUrl: './population-vs-density.component.html',
  styleUrls: ['./population-vs-density.component.scss'],
})
export class PopulationVsDensityComponent implements OnChanges {
  @Input() currentYearInfo!: IGroupedYear | undefined;
  detailsChart!: ReturnType<typeof createDetailChart>;
  containerId = 'population-details';
  maxWidth = 1000;


  @HostListener('window:resize', ['$event.target'])
  public onResize(target: any) {
    const { innerWidth, innerHeight } = target;
    this.detailsChart.setDimensions(innerWidth, innerHeight);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    const isDataAvailable = changes['currentYearInfo']?.currentValue;
    if (isDataAvailable) this.renderChart();
  }
  
  private renderChart(): void {
    if (this.detailsChart) {
      this.detailsChart.updateData(
        this.currentYearInfo?.population || []
      );
      return;
    }
    this.detailsChart = <IBubbleActions>createDetailChart({
      containerId: this.containerId,
      data: this.currentYearInfo?.population || [],
      height: 400,
      width: window.innerWidth > this.maxWidth ? this.maxWidth : window.innerWidth,
      maxWidth: this.maxWidth
    }).draw();
  }
}
