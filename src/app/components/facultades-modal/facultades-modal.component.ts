import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Facultad } from '../../interfaces/facultad';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBuilding, faFloppyDisk, faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FacultadesService } from '../../services/facultades.service';

@Component({
  selector: 'app-facultades-modal',
  imports: [ReactiveFormsModule, FormsModule, FontAwesomeModule],
  template: `
    <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
      <div class="bg-white p-5 rounded-3xl w-full max-w-md">
        @if (facultad) {
          <div class="flex gap-2 items-center">
            <div class="bg-contrast py-1 px-1.5 rounded-full">
              <fa-icon [icon]="Building"></fa-icon>
            </div>
            <h3 class="text-xl font-semibold">Editar Facultad</h3>
          </div>
        } @else {
          <div class="flex gap-2 items-center">
            <div class="bg-contrast py-1 px-1.5 rounded-full">
              <fa-icon [icon]="Building"></fa-icon>
            </div>
            <h3 class="text-xl font-semibold">Agregar Facultad</h3>
          </div>
        }
        <hr class="-mx-5 my-4">
        <form [formGroup]="form!" (submit)="save()">
          <div class="flex flex-col gap-4">
            <!-- Name -->
            <div>
              <label for="name" class="relative">
                <input id="name" type="text" formControlName="name" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Nombres</span>
              </label>
            </div>
            <!-- Description -->
            <div>
              <label for="description" class="relative">
                <input id="description" type="text" formControlName="description" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Descripción</span>
              </label>
            </div>
            <!-- Offices -->
            <div formArrayName="offices">
              <label class="font-semibold">
                Oficinas
                <button (click)="addOffice()" type="button" class="bg-green-700 hover:bg-green-700/90 text-white rounded-full px-2 py-1 text-sm duration-300">
                  <fa-icon [icon]="Add"></fa-icon>
                </button>
              </label>
              @if (offices.controls.length > 0) {
                <div class="overflow-y-auto max-h-96 space-y-2 mt-2">
                  @for (office of offices.controls; track $index) {
                    <div class="flex gap-2">
                      <div class="w-full">
                        <label [for]="'office' + $index" class="relative">
                          <input [id]="'office' + $index" type="text" [formControlName]="$index" placeholder="Nombre oficina" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-10 text-sm cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                        </label>
                      </div>
                      <button (click)="removeOffice($index)" type="button" class="bg-red-600 hover:bg-red-600/90 text-white rounded-full px-3 text-sm duration-300">
                        <fa-icon [icon]="Delete"></fa-icon>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
          <hr class="-mx-5 my-4">
          <div class="flex justify-end gap-2">
            <button type="button" (click)="close.emit()" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cancelar</button>
            @if (facultad) {
              <button type="submit" [disabled]="form!.invalid" class="bg-amber-500 hover:bg-amber-500/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
                <fa-icon [icon]="Save"></fa-icon>&nbsp; Editar
              </button>
            } @else {
              <button type="submit" [disabled]="form!.invalid" class="bg-green-700 hover:bg-green-700/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
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
export class FacultadesModalComponent {
  @Input() facultad: Facultad | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private facultadesService = inject(FacultadesService);

  form: FormGroup | null = null;

  Building = faBuilding;
  Add = faPlus;
  Delete = faTrashCan;
  Save = faFloppyDisk;

  ngOnInit() {
    this.form = this.fb.group({
      _id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      offices: this.fb.array([]),
    });

    if (this.facultad) {
      this.loadFacultad(this.facultad);
    }
  }

  // Getter
  get offices(): FormArray {
    return this.form?.get('offices') as FormArray;
  }

  // DOM Actions
  addOffice(value: string = ''): void {
    this.offices.push(
      this.fb.control(value, Validators.required)
    );
  }
  removeOffice(index: number): void {
    this.offices.removeAt(index);
  }

  loadFacultad(facultad: Facultad): void {
    this.form!.patchValue({
      _id: facultad._id,
      name: facultad.name,
      description: facultad.description
    });

    this.offices.clear();

    facultad.offices.forEach(office => this.addOffice(office));
  }

  save() {
    if (this.form!.invalid) {
      return;
    }

    const facultad = this.form!.value as Facultad;

    if (facultad._id) {
      this.facultadesService.editFacultad(facultad);
      this.close.emit();
    } else {
      delete facultad._id;
      this.facultadesService.addFacultad(facultad);
      this.close.emit();
    }
  }
}