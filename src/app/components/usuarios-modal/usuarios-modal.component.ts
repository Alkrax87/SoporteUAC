import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { User } from '../../interfaces/user';
import { faFloppyDisk, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-usuarios-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
      <div class="bg-white p-5 rounded-3xl w-full max-w-sm">
        @if (user) {
          <h3 class="text-xl font-semibold">Editar Usuario</h3>
        } @else {
          <div class="flex gap-2 items-center">
            <div class="bg-contrast py-1 px-1.5 rounded-full">
              <fa-icon [icon]="User"></fa-icon>
            </div>
            <h3 class="text-xl font-semibold">Agregar Usuario</h3>
          </div>
        }
        <hr class="-mx-5 my-4">
        <form [formGroup]="form" (submit)="save()">
          <div class="flex flex-col gap-4">
            <!-- Name -->
            <div>
              <label for="name" class="relative">
                <input id="name" type="text" formControlName="name" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Nombres</span>
              </label>
            </div>
            <!-- Lastname -->
            <div>
              <label for="lastname" class="relative">
                <input id="lastname" type="text" formControlName="lastname" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Apellidos</span>
              </label>
            </div>
            <!-- Username -->
            <div>
              <label for="username" class="relative">
                <input id="username" type="text" formControlName="username" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Usuario</span>
              </label>
            </div>
            <!-- Password -->
            @if (!user) {
              <div>
                <label for="password" class="relative">
                  <input id="password" type="password" formControlName="password" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Contraseña</span>
                </label>
              </div>
            }
          </div>
          <hr class="-mx-5 my-4">
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cancelar</button>
            @if (user) {
              <button type="submit" [disabled]="form.invalid" class="bg-amber-500 hover:bg-amber-500/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
                <fa-icon [icon]="Save"></fa-icon>&nbsp; Editar
              </button>
            } @else {
              <button type="submit" [disabled]="form.invalid" class="bg-green-700 hover:bg-green-700/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
                <fa-icon [icon]="Add"></fa-icon>&nbsp; Agregar
              </button>
            }
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class UsuariosModalComponent {
  @Input() user: User | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);

  form = this.fb.group({
    _id: [''],
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  User = faUser;
  Add = faPlus;
  Save = faFloppyDisk;

  ngOnInit() {
    if (this.user) {
      this.form.patchValue(this.user);
    }
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    const user = this.form.value as User;

    if (user._id) {
      this.usersService.editUser(user);
      this.close.emit();
    } else {
      delete user._id;
      this.usersService.addUser(user);
      this.close.emit();
    }
  }
}