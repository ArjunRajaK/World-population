import { IChartActions } from 'src/models/chart';
import { IGroupedYear } from 'src/models/population';
import * as d3 from 'd3';
import { convertPopulationToString } from 'src/util/numberToText';

export interface IOverallChartParams {
  data: Map<number, IGroupedYear>;
  width: number;
  height: number;
  containerId: string;
}

export interface IAreaData {
  x: number;
  y: number;
}

export function createOverallChart(params: IOverallChartParams): IChartActions {
  let data = params.data;
  const transformedData: IAreaData[] = [];
  const margin = { top: 30, right: 30, bottom: 30, left: 50 };
  let width = params.width;
  let height = params.height - margin.bottom;
  const id: string = params.containerId;
  const years = Array.from(data.keys()).sort((a, b) => a - b);
  const totalPopulation: number[] = [];
  let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  const [firstYear, lastYear] = [years[0], years.slice(-1)[0]];
  let [firstData, lastData] = [0, 0];
  const textColor = '#A49393';

  const my: IChartActions = {
    draw() {
      for (const year of years) {
        const groupedData = data.get(year);
        totalPopulation.push(groupedData?.totalPopulation || 0);
        transformedData.push({ x: year, y: groupedData?.totalPopulation || 0 });
      }
      [firstData, lastData] = [
        totalPopulation[0],
        totalPopulation.slice(-1)[0],
      ];
      const area = d3
        .area<IAreaData>()
        .x((d) => xScale(d.x))
        .y0(() => ySCale(0))
        .y1((d) => ySCale(d.y));

      svg = d3
        .select(`#${id}`)
        .append('svg')
        .attr('class', 'chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom + 15);

      const areaGroup = svg
        .append('g')
        .attr('class', 'area-group')
        .attr('transform', 'translate(' + margin.top + ',' + (margin.bottom - 20) + ')');

      const xScale = d3
        .scaleLinear()
        .domain(<number[]>d3.extent(years))
        .range([0, width]);

      const ySCale = d3
        .scaleLinear()
        .domain(<number[]>d3.extent(totalPopulation))
        .range([height, 0]);

      areaGroup
        .append('path')
        .datum<IAreaData[]>(transformedData)
        .attr('fill', '#FADCD9')
        .attr('stroke', '#F79489')
        .attr('stroke-width', 1)
        .attr('d', (d) => area(d));

      areaGroup
        .append('text')
        .text(convertPopulationToString(firstData))
        .attr('x', xScale(firstYear))
        .attr('y', ySCale(firstData) - 10)
        .attr('font-weight', 'bold')
        .attr('fill', textColor);

      areaGroup
        .append('text')
        .text(convertPopulationToString(lastData))
        .attr('x', xScale(lastYear) - 30)
        .attr('y', ySCale(lastData))
        .attr('font-weight', 'bold')
        .attr('fill', textColor);

      areaGroup
        .append('text')
        .text(firstYear)
        .attr('x', xScale(firstYear))
        .attr('y', ySCale(0) + 15)
        .attr('font-weight', 'bold')
        .attr('fill', textColor);

      areaGroup
        .append('text')
        .text(lastYear)
        .attr('x', xScale(lastYear) - 30)
        .attr('y', ySCale(0) + 15)
        .attr('font-weight', 'bold')
        .attr('fill', textColor);

      return my;
    },
    setDimensions(width: number, height: number) {
      svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);
      return my;
    },
  };
  return my;
}
