import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../interfaces/user';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-confirm-modal',
  imports: [FontAwesomeModule],
  template: `
    <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
      <div class="bg-white p-5 rounded-3xl w-full max-w-sm">
        <h3 class="text-xl font-semibold">Eliminar {{ message.section }}</h3>
        <p class="my-4">¿Estas seguro de eliminar <b>{{ message.element }}</b>?</p>
        <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cancelar</button>
            <button type="submit" (click)="confirm.emit()" class="bg-red-600 hover:bg-red-600/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
              <fa-icon [icon]="Delete"></fa-icon>&nbsp; Eliminar
            </button>
          </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ConfirmModalComponent {
  @Input() message!: { section: string; element: string };
  @Output() confirm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  Delete = faTrashCan;
}