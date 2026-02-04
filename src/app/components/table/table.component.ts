import { DatePipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronLeft, faChevronRight, faChevronUp, faClock, faComputer, faDesktop, faEdit, faNetworkWired, faPhone, faPrint, faSearch, faToolbox, faTrash, faWrench } from '@fortawesome/free-solid-svg-icons';
import { Facultad } from '../../interfaces/facultad';

@Component({
  selector: 'app-table',
  imports: [FontAwesomeModule, NgClass, DatePipe],
  template: `
    <!-- Seach and Selector -->
    <div class="flex justify-between">
      <!-- Search -->
      <div class="relative w-full md:w-1/2 lg:w-1/3">
        <fa-icon [icon]="Search" class="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"></fa-icon>
        <input
          type="text"
          placeholder="Buscar..."
          [value]="searchTerm"
          (input)="onSearch($event)"
          class="w-full rounded-full shadow-md pl-10 pr-4 py-2 outline-none ring-[3px] ring-transparent focus:ring-main/50 focus:text-main"
        >
      </div>
      <!-- Items -->
      <div class="flex items-center gap-2">
        <p class="text-neutral-400 text-sm">Elementos por página:</p>
        <select
          [value]="pageSize"
          (change)="onPageSizeChange($event)"
          class="bg-white ring-transparent ring-[3px] hover:ring-main/50 text-main text-end text-sm px-3 py-1 rounded-full outline-none cursor-pointer shadow-md"
        >
          <option class="text-start" value="20">20</option>
          <option class="text-start" value="30">30</option>
          <option class="text-start" value="50">50</option>
          <option class="text-start" value="100">100</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="my-6 overflow-x-auto shadow-md rounded-3xl border b">
      <table class="w-full">
        <thead class="bg-main text-white">
          <tr class="h-12">
            @for (header of tableConstructor; track $index) {
              @switch ($index) {
                @case (0) {
                  <th (click)="sortData(header.key)" class="cursor-pointer text-start px-3 min-w-48">
                    {{ header.label }}
                    @if (sortColumn === header.key) {
                      @if (sortDirection === 'asc') {
                        <fa-icon class="text-sm m-0.5" [icon]="Ascendent"></fa-icon>
                      } @else {
                        <fa-icon class="text-sm m-0.5" [icon]="Descendent"></fa-icon>
                      }
                    }
                  </th>
                }
                @case (1) {
                  <th (click)="sortData(header.key)" class="cursor-pointer text-start px-3 min-w-48">
                    {{ header.label }}
                    @if (sortColumn === header.key) {
                      @if (sortDirection === 'asc') {
                        <fa-icon class="text-sm m-0.5" [icon]="Ascendent"></fa-icon>
                      } @else {
                        <fa-icon class="text-sm m-0.5" [icon]="Descendent"></fa-icon>
                      }
                    }
                  </th>
                }
                @default {
                  <th (click)="sortData(header.key)" class="cursor-pointer text-center truncate px-3">
                    {{ header.label }}
                    @if (sortColumn === header.key) {
                      @if (sortDirection === 'asc') {
                        <fa-icon class="text-sm m-0.5" [icon]="Ascendent"></fa-icon>
                      } @else {
                        <fa-icon class="text-sm m-0.5" [icon]="Descendent"></fa-icon>
                      }
                    }
                  </th>
                }
              }
            }
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          @for (row of paginatedData; track $index) {
            <tr class="h-10 hover:bg-neutral-100">
              @for (header of tableConstructor; track $index) {
                @switch ($index) {
                  @case (0) {
                    <td class="px-3  text-sm">{{ row[header.key] }}</td>
                  }
                  @case (1) {
                    <td class="px-3 text-sm">{{ row[header.key] }}</td>
                  }
                  @default {
                    @if (header.search) {
                      <td class="text-center text-sm px-3">{{ getFacultadName(row[header.key]) }}</td>
                    } @else if (header.isDate) {
                      <td class="px-3 truncate text-sm">
                        <div class="font-semibold text-sm">{{ row[header.key] | date: 'dd MMMM, y' }}</div>
                        <div class="text-xs text-neutral-500">{{ row[header.key] | date: 'HH:mm' }}</div>
                      </td>
                    } @else if (header.isTime) {
                      <td class="px-3 text-center text-sm">
                        <div class="bg-[#343434] text-white rounded-full flex justify-center truncate px-4 gap-1">
                          <fa-icon [icon]="Clock"></fa-icon> {{ row[header.key] }}
                        </div>
                      </td>
                    } @else if (header.isType) {
                      @switch (row[header.key]) {
                        @case ('Hardware') {
                          <td class="px-3 text-center text-sm">
                            <div class="bg-[#2696AA] text-white rounded-full flex justify-center px-4 gap-1">
                              <fa-icon [icon]="Hardware"></fa-icon> {{ row[header.key] }}
                            </div>
                          </td>
                        }
                        @case ('Software') {
                          <td class="px-3 text-center text-sm">
                            <div class="bg-[#03CCA0] text-white rounded-full flex justify-center px-4 gap-1">
                              <fa-icon [icon]="Software"></fa-icon> {{ row[header.key] }}
                            </div>
                          </td>
                        }
                        @case ('Impresora') {
                          <td class="px-3 text-center text-sm">
                            <div class="bg-[#16476A] text-white rounded-full flex justify-center px-4 gap-1">
                              <fa-icon [icon]="Printer"></fa-icon> {{ row[header.key] }}
                            </div>
                          </td>
                        }
                        @case ('Red') {
                          <td class="px-3 text-center text-sm">
                            <div class="bg-[#FF0F40] text-white rounded-full flex justify-center px-4 gap-1">
                              <fa-icon [icon]="Network"></fa-icon> {{ row[header.key] }}
                            </div>
                          </td>
                        }
                        @case ('Anexo') {
                          <td class="px-3 text-center text-sm">
                            <div class="bg-[#FF6400] text-white rounded-full flex justify-center px-4 gap-1">
                              <fa-icon [icon]="Phone"></fa-icon> {{ row[header.key] }}
                            </div>
                          </td>
                        }
                        @case ('Accesorios') {
                          <td class="px-3 text-center text-sm">
                            <div class="bg-[#FFB51E] text-white rounded-full flex justify-center px-4 gap-1">
                              <fa-icon [icon]="Accesories"></fa-icon> {{ row[header.key] }}
                            </div>
                          </td>
                        }
                        @default {
                          <td class="px-3 text-center text-sm">
                            <div class="bg-[#777C6D] text-white rounded-full flex justify-center px-4 gap-1">
                              <fa-icon [icon]="Other"></fa-icon> {{ row[header.key] }}
                            </div>
                          </td>
                        }
                      }
                    } @else {
                      <td class="px-3 text-center text-sm">{{ row[header.key] }}</td>
                    }
                  }
                }
              }
              <td class="px-5">
                <div class="flex items-center justify-center gap-4">
                  <button (click)="onEdit.emit(row)" class="text-amber-500" title="Editar">
                    <fa-icon [icon]="Edit"></fa-icon>
                  </button>
                  <button (click)="onDelete.emit(row)"  class="text-red-600"title="Eliminar">
                    <fa-icon [icon]="Delete"></fa-icon>
                  </button>
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Paginate -->
    <div class="flex justify-between gap-2">
      <!-- Paginate -->
      <div class="text-neutral-400 text-sm">
        Mostrando {{ startRecord + 1 }} a {{ endRecord }} de {{ filteredData.length }} registros
      </div>
      <!-- Paginate -->
      <div class="flex gap-2">
        <!-- Previous -->
         <button (click)="prevPage()" [disabled]="currentPage === 1" [ngClass]="{'bg-neutral-200 hover:bg-neutral-200': currentPage === 1}" class="bg-main hover:bg-main-hover w-8 h-8 text-white rounded-full font-semibold text-sm">
          <fa-icon class="text-sm" [icon]="Previous"></fa-icon>
        </button>
        <!-- Pages -->
        <div class="flex gap-0.5">
          @for (page of [].constructor(totalPages); track $index) {
            <button (click)="goToPage($index + 1)" [ngClass]="{'bg-main text-white': currentPage === ($index + 1)}" class="border w-8 h-8 rounded-full outline-none hover:bg-main hover:text-white duration-300">
              {{ $index + 1 }}
            </button>
          }
        </div>
        <!-- Next -->
        <button (click)="nextPage()" [disabled]="currentPage === totalPages" [ngClass]="{'bg-neutral-200 hover:bg-neutral-200': currentPage === totalPages}" class="bg-main hover:bg-main-hover w-8 h-8 text-white rounded-full font-semibold text-sm">
          <fa-icon class="text-sm" [icon]="Next"></fa-icon>
        </button>
      </div>
    </div>
  `,
  styles: ``,
})
export class TableComponent {
  @Input() tableConstructor: { key: string, label: string, search?: boolean, isDate?: boolean, isType?: boolean, isTime?: boolean }[] = [];
  @Input() data: any[] = [];
  @Input() facultades: Facultad[] = [];
  @Output() onShow = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();

  searchTerm: string = '';
  sortColumn: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

  Ascendent = faChevronUp;
  Descendent = faChevronDown;
  Previous = faChevronLeft;
  Next = faChevronRight;
  Search = faSearch;
  Hardware = faComputer;
  Software = faDesktop;
  Printer = faPrint;
  Network = faNetworkWired;
  Phone = faPhone;
  Accesories = faToolbox;
  Other = faWrench;
  Clock = faClock;
  Edit = faEdit;
  Delete = faTrash;

  currentPage = 1;
  pageSize = 20;
  totalPages = 1;
  startRecord = 0;
  endRecord = 0;

  filteredData: any[] = [];
  paginatedData: any[] = [];

  ngOnInit() {
    this.applyFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['tableConstructor']) {
      this.applyFilters();
    }
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.applyFilters();
  }

  onPageSizeChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.pageSize = +target.value;
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    // Filtrado por búsqueda
    this.filteredData = this.data.filter(row =>
      this.tableConstructor.some(col =>
        row[col.key]?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );

    // Total de páginas
    this.totalPages = Math.ceil(this.filteredData.length / this.pageSize) || 1;

    // Reset de página si se pasa
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    this.updatePagination();
  }

  sortData(header: string) {
    if (this.sortColumn === header) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = header;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const valA = a[header]?.toString().toLowerCase() ?? '';
      const valB = b[header]?.toString().toLowerCase() ?? '';

      if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedData = this.filteredData.slice(start, end);
    this.startRecord = start;
    this.endRecord = Math.min(end, this.filteredData.length);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  getFacultadName(facultadId: string) {
    const facultad = this.facultades.find(f => f._id === facultadId);
    return facultad ? facultad.name : '';
  }
}