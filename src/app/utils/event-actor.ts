/**
 * Nombre para mostrar del integrante que actuó sobre un evento.
 *
 * Los eventos del grupo traen hasta dos relaciones de este tipo —`takenChargeBy`
 * y `canceledBy`— y las muestran cuatro pantallas: las dos cards de listado y
 * los dos detalles. Cada una resolvía el nombre por su cuenta con la misma
 * línea repetida; vive acá para que no se desalineen.
 */
import { titleCase } from './title-case';

export function actorName(actor?: any): string {
  if (!actor) return '';
  return titleCase(`${actor.firstName ?? ''} ${actor.lastName ?? ''}`);
}
