import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { createOverallChart } from 'src/closures/overall-chart';
import { IGroupedYear } from 'src/models/population';


@Component({
  selector: 'app-overall-chart',
  templateUrl: './overall-chart.component.html',
  styleUrls: ['./overall-chart.component.scss'],
})
export class OverallChartComponent implements OnChanges {

  @Input() data!: Map<number, IGroupedYear>;
  overallChart!: ReturnType<typeof createOverallChart>

  ngOnChanges(changes: SimpleChanges): void {
    const data = changes['data']?.currentValue as Map<number, IGroupedYear>;
    if (data && data.size !== 0) this.renderChart();
  }
  
  private renderChart(): void {
    this.overallChart = createOverallChart({
      containerId: 'over-all',
      data: this.data,
      height: 100,
      width: 320
    }).draw();
  }
}
