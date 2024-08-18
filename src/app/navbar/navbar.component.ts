import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  userName: string = 'ชลชาติ สุขสวัสดิ์';
  dropdownVisible: boolean = false;



  toggleDropdown(event: MouseEvent): void {
    this.dropdownVisible = !this.dropdownVisible;
    event.stopPropagation(); // Prevent click event from bubbling up
}

@HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent): void {
        // Check if the click is outside the user-menu
        const targetElement = event.target as HTMLElement;
        const userMenuElement = document.querySelector('.user-menu') as HTMLElement;
        if (userMenuElement && !userMenuElement.contains(targetElement)) {
            this.dropdownVisible = false;
        }
    }

}
