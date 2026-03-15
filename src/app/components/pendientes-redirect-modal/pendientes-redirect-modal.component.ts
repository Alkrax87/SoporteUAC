import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Pendiente } from '../../interfaces/pendiente';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClipboardCheck, faHourglassHalf } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReportesService } from '../../services/reportes.service';
import { PendientesService } from '../../services/pendientes.service';

@Component({
  selector: 'app-pendientes-redirect-modal',
  imports: [FontAwesomeModule, ReactiveFormsModule],
  template: `
    <div class="bg-black bg-opacity-70 fixed inset-0 z-50 flex justify-center items-center select-none px-3 sm:px-5">
      <div class="bg-white p-5 rounded-3xl w-full max-w-md">
        <div class="flex gap-2 items-center">
          <div class="bg-contrast py-1 px-1.5 rounded-full">
            <fa-icon [icon]="SandClock"></fa-icon>
          </div>
          <h3 class="text-xl font-semibold">Cerrar Pendiente</h3>
        </div>
        <hr class="-mx-5 my-4">
        <form [formGroup]="form!" (submit)="save()">
          <div class="flex flex-col gap-4">
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
            <hr class="-mx-5 my-4">
            <div class="flex justify-end gap-2">
              <button type="button" (click)="close.emit()" class="hover:bg-neutral-100/80 text-neutral-600 border rounded-full px-6 py-2 text-sm duration-300">Cancelar</button>
              <button type="submit" [disabled]="form!.invalid" class="bg-green-600 hover:bg-green-600/90 text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-full px-6 py-2 text-sm duration-300">
                <fa-icon [icon]="ClipBoard"></fa-icon>&nbsp; Cerrar pendiente
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: ``,
})
export class PendientesRedirectModalComponent {
  @Input() pendiente!: Pendiente;
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private reportesService = inject(ReportesService);
  private pendientesService = inject(PendientesService);

  form = this.fb.group({
    time: ['', Validators.required],
    patrimonialCode: [''],
  });

  ClipBoard = faClipboardCheck;
  SandClock = faHourglassHalf;

  save() {
    if (this.form.invalid) {
      return;
    }

    const reporte = {
      _id: undefined,
      report: this.pendiente.report,
      description: this.pendiente.description,
      type: this.pendiente.type,
      school: this.pendiente.school,
      office: this.pendiente.office,
      time: this.form.value.time ?? '',
      patrimonialCode: this.form.value.patrimonialCode ?? '',
      date: new Date(),
    }

    this.reportesService.addReporte(reporte);
    this.pendientesService.deletePendiente(this.pendiente._id!);
    this.close.emit();
  }
}