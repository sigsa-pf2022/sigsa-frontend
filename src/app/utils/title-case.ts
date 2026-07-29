/**
 * Capitaliza nombres para mostrar. Los nombres se guardan como los tipeó el
 * usuario al registrarse, así que en la base conviven "Pedro Martinez" y
 * "pedra martinez"; normalizamos al momento de mostrar.
 *
 * Es el equivalente en TypeScript del pipe `titlecase`, para los textos que se
 * arman en código y no en la plantilla.
 */
export function titleCase(value?: string | null): string {
  if (!value) return '';
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
