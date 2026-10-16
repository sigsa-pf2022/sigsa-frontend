import { Pipe, PipeTransform } from '@angular/core';
import { capitalizeWords } from '../utils/title-case';

/** `capitalizeWords` en la plantilla: respeta siglas como "QA" en los nombres de grupo. */
@Pipe({ name: 'capitalizeWords' })
export class CapitalizeWordsPipe implements PipeTransform {
  transform(value?: string | null): string {
    return capitalizeWords(value);
  }
}
