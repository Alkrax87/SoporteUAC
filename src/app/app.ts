import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <h1 class="text-green-600 font-semibold text-center text-4xl">{{ title() }}</h1>
    <router-outlet></router-outlet>
  `,
  styles: ``,
})
export class App {
  protected readonly title = signal('SoporteUAC');
}