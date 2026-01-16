import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-logout',
  imports: [FontAwesomeModule],
  template: `
    <div class="bg-light flex items-center justify-center rounded-xl h-full min-w-[92px] text-lg">
      <fa-icon [icon]="User"></fa-icon>
    </div>
  `,
  styles: ``,
})
export class UserLogoutComponent {
  User = faUser;
}