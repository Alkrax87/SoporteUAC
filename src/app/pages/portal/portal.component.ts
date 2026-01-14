import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-portal',
  imports: [RouterOutlet],
  template: `
    <div>Portal component</div>
    <router-outlet></router-outlet>
  `,
  styles: ``,
})
export class PortalComponent {}
