import { NgModule } from '@angular/core';
import { MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';

const MaterialComponents = [
  MatDatepickerModule,
  MatInputModule,
  MatFormFieldModule,
  MatNativeDateModule
]

@NgModule({
  declarations: [],
  imports: [
    MaterialComponents
  ],
  exports: [
    MaterialComponents
  ]
})
export class MaterialModule { }
