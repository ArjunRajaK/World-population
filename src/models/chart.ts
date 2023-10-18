export interface IChartActions {
    draw:() => IChartActions;
    setDimensions: (width: number, height: number) =>  IChartActions;
}