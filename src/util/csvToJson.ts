import { IGroupedYear, IPopulation } from 'src/models/population';

enum KeyValue {
 country = 0,
 year = 1,
 population = 2,
 populationDensity = 3,
 populationGrowthRate = 4
}

export function convertCsvDataToJson(data: any): Map<number, IGroupedYear> {
  const getNumberFromString = (str: string): number =>
  str.includes('(') ? -(+str.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')) : +str.replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '');
  const groupedYear = new Map<number, IGroupedYear>();
  const splicedData: Array<string[]> = data.splice(1);
  splicedData.forEach((s) => {
    const res: IPopulation = {
      country: s[KeyValue.country],
      population: getNumberFromString(s[KeyValue.population]) * 1000,
      populationDensity: getNumberFromString(s[KeyValue.populationDensity]),
      populationGrowthRate: getNumberFromString(s[KeyValue.populationGrowthRate]),
      year: getNumberFromString(s[KeyValue.year]),
    };
    const yearData = groupedYear.get(res.year);
    if (yearData) {
      yearData.totalPopulation = yearData.totalPopulation + res.population;
      yearData.population.push(res);
      return;
    }
    groupedYear.set(res.year, {
      totalPopulation: res.population,
      population: [res],
    });
  });
  return groupedYear;
}
