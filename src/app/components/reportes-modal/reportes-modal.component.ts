import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Reporte } from '../../interfaces/reporte';
import { ReportesService } from '../../services/reportes.service';
import { faClipboardList, faFloppyDisk, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FacultadesService } from '../../services/facultades.service';
import { Facultad } from '../../interfaces/facultad';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-reportes-modal',
  imports: [ReactiveFormsModule, FontAwesomeModule],
  template: `
    <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
      <div class="bg-white p-5 rounded-3xl w-full max-w-md">
        @if (reporte) {
          <div class="flex gap-2 items-center">
            <div class="bg-contrast py-1 px-1.5 rounded-full">
              <fa-icon [icon]="Board"></fa-icon>
            </div>
            <h3 class="text-xl font-semibold">Editar Facultad</h3>
          </div>
        } @else {
          <div class="flex gap-2 items-center">
            <div class="bg-contrast py-1 px-1.5 rounded-full">
              <fa-icon [icon]="Board"></fa-icon>
            </div>
            <h3 class="text-xl font-semibold">Agregar Facultad</h3>
          </div>
        }
        <hr class="-mx-5 my-4">
        <form [formGroup]="form!" (submit)="save()">
          <div class="flex flex-col gap-4">
            <!-- Report -->
            <div>
              <label for="report" class="relative">
                <input id="report" type="text" formControlName="report" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Reporte</span>
              </label>
            </div>
            <!-- Description -->
            <div>
              <label for="description" class="relative">
                <input id="description" type="text" formControlName="description" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Descripción</span>
              </label>
            </div>
            <!-- Type -->
            <div>
              <label for="type" class="relative">
                <select id="type" formControlName="type" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <option value="''" disabled>Selecciona Tipo</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Software">Software</option>
                  <option value="Impresora">Impresora</option>
                  <option value="Red">Red</option>
                  <option value="Anexo">Anexo</option>
                  <option value="Accesorios">Accesorios</option>
                  <option value="Otros">Otros</option>
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Tipo</span>
              </label>
            </div>
            <!-- School -->
            <div>
              <label for="school" class="relative">
                <select id="school" formControlName="school" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <option value="''" disabled>Selecciona Facultad</option>
                  @for (facultad of facultades(); track facultad) {
                    <option [value]="facultad._id">{{ facultad.name }}</option>
                  }
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Facultad</span>
              </label>
            </div>
            <!-- Office -->
            <div>
              <label for="office" class="relative">
                <select id="office" formControlName="office" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <option value="''" disabled>Selecciona Oficina</option>
                  @for (office of offices(); track office) {
                    <option [value]="office">{{ office }}</option>
                  }
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Oficina</span>
              </label>
            </div>
            <!-- Time -->
            <div>
              <label for="time" class="relative">
                <select id="time" formControlName="time" placeholder="" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-pointer px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                  <option value="''" disabled>Selecciona Tiempo</option>
                  <option value="10 min">10 min</option>
                  <option value="15 min">15 min</option>
                  <option value="20 min">20 min</option>
                  <option value="30 min">30 min</option>
                  <option value="45 min">45 min</option>
                  <option value="1 hora">1 hora</option>
                  <option value="2 horas">2 horas</option>
                  <option value="3 horas">3 horas</option>
                </select>
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Tiempo</span>
              </label>
            </div>
            <!-- Patrimonial Code -->
            <div>
              <label for="patrimonialCode" class="relative">
                <input id="patrimonialCode" type="text" formControlName="patrimonialCode" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-main focus:text-main h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-main cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Código Patrimonial</span>
              </label>
            </div>
            <!-- Date -->
            <div>
              <label for="date" class="relative">
                <input id="date" formControlName="date" type="datetime-local" placeholder="" autocomplete="false" class="bg-white text-neutral-700 border focus:border-crimson focus:text-crimson h-12 cursor-text px-5 py-2 peer w-full rounded-full shadow-sm duration-100 outline-none">
                <span class="bg-white text-neutral-400 peer-focus:text-crimson cursor-text flex items-center -translate-y-6 absolute inset-y-0 start-3 px-2 text-xs font-semibold transition-transform peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-6">Fecha</span>
              </label>
            </div>
            <hr class="-mx-5 my-4">
            <div class="flex justify-end gap-2">
              <button type="button" (click)="close.emit()" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cancelar</button>
              @if (reporte) {
                <button type="submit" [disabled]="form!.invalid" class="bg-amber-500 hover:bg-amber-500/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
                  <fa-icon [icon]="Save"></fa-icon>&nbsp; Editar
                </button>
              } @else {
                <button type="submit" [disabled]="form!.invalid" class="bg-green-700 hover:bg-green-700/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
                  <fa-icon [icon]="Add"></fa-icon>&nbsp; Agregar
                </button>
              }
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class ReportesModalComponent {
  @Input() reporte: Reporte | null = null;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private reportesService = inject(ReportesService);
  private facultadesService = inject(FacultadesService);

  constructor() {
    this.facultadesService.facultades$.pipe(takeUntilDestroyed()).subscribe({
      next: (data) => this.facultades.set(data),
    });
  }

  facultades = signal<Facultad[]>([]);
  offices = signal<string[]>([]);
  form = this.fb.group({
    _id: [''],
    report: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required],
    school: ['', Validators.required],
    office: ['', Validators.required],
    time: ['', Validators.required],
    patrimonialCode: [''],
    date: ['', Validators.required],
  });

  ngOnInit() {
    if (this.reporte) {
      const facultad = this.facultades().find(f => f._id === this.reporte!.school);
      this.offices.set(facultad?.offices ?? []);

      const date = this.reporte.date ? this.formatDatetimeLocal(this.reporte.date) : '';

      this.form.patchValue({ ...this.reporte, date });
    } else {
      this.form.get('date')?.setValue(this.formatDatetimeLocal(new Date()));
    }

    this.form.get('school')!.valueChanges.subscribe((facultadId) => {
      const facultad = this.facultades().find(f => f._id === facultadId);
      this.offices.set(facultad?.offices ?? []);
      this.form.get('office')?.reset('');
      this.form.get('office')?.enable();
    });
  }

  Board = faClipboardList;
  Add = faPlus;
  Save = faFloppyDisk;

  private formatDatetimeLocal(dateInput: Date | string): string {
    const d = new Date(dateInput);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }

  save() {
    if (this.form.invalid) {
      return;
    }

    let reporte = this.form.value as Reporte;
    reporte.date = new Date(reporte.date!);

    if (reporte._id) {
      this.reportesService.editReporte(reporte);
      this.close.emit();
    } else {
      delete reporte._id;
      this.reportesService.addReporte(reporte);
      this.close.emit();
    }
  }
}
