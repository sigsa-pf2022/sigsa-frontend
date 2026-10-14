import { NgModule } from '@angular/core';
import { CapitalizeWordsPipe } from './capitalize-words.pipe';

@NgModule({
  declarations: [CapitalizeWordsPipe],
  exports: [CapitalizeWordsPipe],
})
export class PipesModule {}
