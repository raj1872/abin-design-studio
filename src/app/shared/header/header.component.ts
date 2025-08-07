import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isMenuActive = false;
  isMenuLinksVisible = false;

  toggleMenu(): void {
    this.isMenuActive = !this.isMenuActive;
    document.body.style.overflow = this.isMenuActive ? 'hidden' : 'auto';

    if (this.isMenuActive) {
      setTimeout(() => {
        this.isMenuLinksVisible = true;
      }, 500);
    } else {
      this.isMenuLinksVisible = false;
    }
  }

  closeMenu(): void {
    this.isMenuActive = false;
    this.isMenuLinksVisible = false;
    document.body.style.overflow = 'auto';
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    this.closeMenu();
  }
}
