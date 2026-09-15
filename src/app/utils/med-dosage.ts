/**
 * Dosis y nombre de un medicamento, siempre con la unidad de medida.
 *
 * El catálogo guarda el número en `dosage` y la unidad aparte, en la relación
 * `measurementUnit`. Mostrar el número solo no dice nada: "500" puede ser mg,
 * ml o UI. Se arma acá porque la dosis aparece en cuatro lugares —la card del
 * listado, el detalle de la toma, el buscador del catálogo y el resumen del
 * alta— y cada uno la venía componiendo por su cuenta.
 *
 * Si la unidad no viene (una consulta que no trae la relación), devuelve el
 * número pelado en vez de romper: peor es no mostrar nada.
 */
function text(value: unknown): string {
  return value == null ? '' : String(value).trim();
}

/** "400 mg", o "400" si no vino la unidad. */
export function formatDosage(med?: any): string {
  const dosage = text(med?.dosage);
  if (!dosage) return '';
  const unit = text(med?.measurementUnit?.name);
  return unit ? `${dosage} ${unit}` : dosage;
}

/** "Ibuprofeno 400 mg". */
export function formatMedTitle(med?: any): string {
  return [text(med?.name), formatDosage(med)].filter(Boolean).join(' ');
}
