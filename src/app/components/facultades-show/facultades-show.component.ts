import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Facultad } from '../../interfaces/facultad';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-facultades-show',
  imports: [FontAwesomeModule],
  template: `
    <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
      <div class="bg-white p-5 rounded-3xl w-full max-w-lg">
        <!-- Title -->
        <div class="flex gap-2 items-center">
          <div class="bg-contrast py-1 px-1.5 rounded-full">
            <fa-icon [icon]="Building"></fa-icon>
          </div>
          <div>
            <h3 class="text-xl font-semibold">{{ facultad.name }}</h3>
            <p class="text-sm text-neutral-600 -mt-1">{{ facultad.description }}</p>
          </div>
        </div>
        <!-- Content -->
        <div class="flex flex-col gap-2 max-h-96 overflow-y-auto my-4">
          @for (item of facultad.offices; track item) {
            <div class="bg-gray-100 p-2 rounded-lg">
              <p class="text-sm truncate">{{ item }}</p>
            </div>
          }
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" (click)="close.emit()" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cerrar</button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class FacultadesShowComponent {
  @Input() facultad!: Facultad;
  @Output() close = new EventEmitter<void>();

  Building = faBuilding;
}
