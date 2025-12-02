/**
 * Utility functions for date and time handling
 */

export function formatarDiasSemana(diasSemana: string): string {
  const diasArray = diasSemana.split(",");

  if (diasArray.length === 1) {
    return diasArray[0];
  }
  if (diasArray.length === 2) {
    return diasArray.map((dia) => dia.replace("-feira", "")).join(" e ");
  }
  const ultimoDia = diasArray.pop();
  const diasFormatados = diasArray
    .map((dia) => dia.replace("-feira", ""))
    .join(", ");
  return `${diasFormatados} e ${ultimoDia?.replace("-feira", "")}`;
}
