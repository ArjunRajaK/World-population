import { IChartActions } from 'src/models/chart';
import { IPopulation } from 'src/models/population';
import * as d3 from 'd3';
import { convertPopulationToString } from 'src/util/numberToText';

export interface IDetailChartParams {
  data: IPopulation[];
  width: number;
  height: number;
  containerId: string;
  maxWidth: number;
}

export interface IBubbleActions extends IChartActions {
  updateData: (data: IPopulation[]) => IBubbleActions;
}

export function createDetailChart(params: IDetailChartParams): IBubbleActions {
  let data = params.data;
  const maxWidth = params.maxWidth;
  const margin = { top: 70, right: 40, bottom: 30, left: 50 };
  let width = params.width - margin.left - margin.right;
  let height = params.height - margin.top - margin.bottom;
  let svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  let xSCale: d3.ScaleLinear<number, number, never>;
  let ySCale: d3.ScaleLinear<number, number, never>;
  let bubbleScale: d3.ScaleLinear<number, number, never>;
  let xAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  let yAxis: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  const id = params.containerId;
  const population = data.map((d) => d.population);
  const minPopulation = d3.min(population) || 0;
  const maxPopulation = d3.max(population) || 0;
  let circlesContainer: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  let areaGroup: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  const textColor = '#2E765E';
  const bubbleColor = '#EF7C8E';
  let toolTip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  let rect: d3.Selection<SVGRectElement, unknown, HTMLElement, any>;
  let zoom: d3.ZoomBehavior<Element, unknown>;
  let xAxisText: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;

  const updateXAxis = () => {
    xSCale = d3
      .scaleLinear()
      .domain(<number[]>d3.extent(data, (d) => d.populationDensity))
      .range([0, width]);

    xAxis.call(d3.axisBottom(xSCale));
  };

  const updateYAxis = () => {
    ySCale = d3
      .scaleLinear()
      .domain(<number[]>d3.extent(data, (d) => d.populationGrowthRate))
      .range([height, 0]);

    yAxis.call(d3.axisLeft(ySCale));
  };

  const addBubbles = () => {
    zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('zoom', (event: d3.D3ZoomEvent<any, any>) => {
        const newX = event.transform.rescaleX(xSCale);
        const newY = event.transform.rescaleY(ySCale);
        circlesContainer
          .selectAll('circle')
          .attr('cx', (d: any) => newX(d.populationDensity))
          .attr('cy', (d: any) => newY(d.populationGrowthRate));
        xAxis.call(d3.axisBottom(newX));
        yAxis.call(d3.axisLeft(newY));
      });

    if (!toolTip) {
      toolTip = d3
        .select('.population-details')
        .append('div')
        .style('opacity', 0)
        .style('background-color', 'black')
        .style('color', 'white')
        .style('display', 'flex')
        .style('flex-flow', 'column')
        .style('border', '1px solid white')
        .style('border-radius', '5px')
        .style('padding', '3px')
        .style('user-select', 'none')
        .style('pointer-events', 'none')
        .style('position', 'absolute');
    }

    const showToolTip = (event: MouseEvent, d: IPopulation) => {
      toolTip
        .style('opacity', 1)
        .style('left', `${event.x + 10}px`)
        .style('top', `${event.y + 10}px`).html(`
         <span>Population density: ${d3.format(',.2r')(
           d.populationDensity
         )}</span>
         <span>population growth rate: ${d.populationGrowthRate}%</span>
         <span>Country: ${d.country}</span>
         <span>Population: ${convertPopulationToString(d.population)}</span>
        `);
    };

    const moveTooltip = () => toolTip.style('opacity', 1);
    const hideTooltip = () => toolTip.transition().style('opacity', 0);

    circlesContainer
      .selectAll<any, IPopulation>('.dots')
      .data<IPopulation>(data, (d: IPopulation) => d.country)
      .join(
        (enter) =>
          enter
            .append('circle')
            .attr('cx', (d) => xSCale(d.populationDensity))
            .attr('cy', (d) => ySCale(d.populationGrowthRate))
            .attr('r', (d) => bubbleScale(d.population))
            .attr('clip-path', 'url(#clip)')
            .style('fill', bubbleColor)
            .style('opacity', 1)
            .style('stroke', 'white')
            .style('stroke-width', '2px')
            .on('mouseover', showToolTip)
            .on('mousemove', moveTooltip)
            .on('mouseleave', hideTooltip),

        (update) =>
          update
            .attr('cx', (d) => xSCale(d.populationDensity))
            .attr('cy', (d) => ySCale(d.populationGrowthRate))
            .attr('r', (d) => bubbleScale(d.population)),
        (exit) => exit.remove()
      );

    if (!rect) {
      const clip = circlesContainer.append('clipPath').attr('id', 'clip');
      rect = clip.append('rect').attr('width', width).attr('height', height);
    }
    svg.call(<any>zoom);
  };

  const my: IBubbleActions = {
    draw() {
      svg = d3
        .select(`#${id}`)
        .append('svg')
        .attr('class', 'chart-svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      areaGroup = svg
        .append('g')
        .attr('class', 'area-group')
        .attr(
          'transform',
          'translate(' + margin.top + ',' + margin.bottom + ')'
        );

      xSCale = d3
        .scaleLinear()
        .domain(<number[]>d3.extent(data, (d) => d.populationDensity))
        .range([0, width]);

      xAxis = areaGroup
        .append('g')
        .attr('transform', `translate(0, ${height})`)
        .attr('class', 'x-axis')
        .call(d3.axisBottom(xSCale))
        .call(g => g.select(".domain").attr('stroke', '#2E765E').attr('stroke-width', '2px'))


      ySCale = d3
        .scaleLinear()
        .domain(<number[]>d3.extent(data, (d) => d.populationGrowthRate))
        .range([height, 0]);

      yAxis = areaGroup
        .append('g')
        .attr('class', 'y-axis')
        .call(d3.axisLeft(ySCale))
        .call(g => g.select(".domain").attr('stroke', '#2E765E').attr('stroke-width', '2px'))

      const [_, maxX] = xSCale.domain();
      xAxisText = svg
        .append('text')
        .attr('text-anchor', 'start')
        .attr('x', xSCale(maxX / 2))
        .attr('y', height + margin.top)
        .style('fill', textColor)
        .style('font-weight', 'bold')
        .text('Population density');

      svg
        .append('text')
        .attr('text-anchor', 'start')
        .attr('transform', 'rotate(-90)')
        .attr('y', margin.bottom)
        .attr(
          'x',
          -(margin.top + margin.bottom + margin.left + margin.right + 40)
        )
        .style('fill', textColor)
        .style('font-weight', 'bold')
        .text('Population growth(%)');

      bubbleScale = d3
        .scaleLinear()
        .domain([minPopulation, maxPopulation])
        .range([5, 25]);

      circlesContainer = areaGroup
        .append('g')
        .attr('class', 'circle-container');
      addBubbles();
      return my;
    },
    setDimensions(updatedWidth: number, __: number) {
      width = updatedWidth - 200;
      if (width > maxWidth) width = maxWidth;

      svg
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

      updateXAxis();

      circlesContainer
        .selectAll('circle')
        .attr('cx', (d: any) => xSCale(d.populationDensity))
        .attr('cy', (d: any) => ySCale(d.populationGrowthRate));

      const [_, maxX] = xSCale.domain();
      xAxisText.attr('x', xSCale(maxX / 2)).attr('y', height + margin.top);
      rect.attr('height', height).attr('width', width);
      return my;
    },
    updateData(updatedData: IPopulation[]) {
      data = updatedData;
      updateXAxis();
      updateYAxis();

      circlesContainer.selectAll('circle')?.remove();
      svg.call(<any>zoom.transform, d3.zoomIdentity);
      addBubbles();
      return my;
    },
  };
  return my;
}
