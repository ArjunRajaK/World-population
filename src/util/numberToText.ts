export function convertPopulationToString (population: number | undefined): string {
    if (!population) return '';
    if (Math.abs(Number(population)) >= 1.0e+9) return (Math.abs(population) / 1.0e+9).toFixed(1) + "B";
    if (Math.abs(Number(population)) >= 1.0e+6) return (Math.abs(population) / 1.0e+6).toFixed(1) + "M";
    if (Math.abs(Number(population)) >= 1.0e+3) return (Math.abs(population) / 1.0e+3).toFixed(1) + "K";
    return Math.abs(Number(population)).toFixed(1);
}
