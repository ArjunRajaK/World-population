export interface IPopulation {
    country: string;
    year: number;
    population: number;
    populationDensity: number;
    populationGrowthRate: number;
}

export interface IGroupedYear {
  totalPopulation: number;
  population: IPopulation[];
}