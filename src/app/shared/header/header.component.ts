import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isMenuActive = false;
  isMenuLinksVisible = false;
  isProjectsPage = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkIfProjectsPage(this.router.url);

    // Listen for route changes
    this.router.events.subscribe(() => {
      this.checkIfProjectsPage(this.router.url);
    });
  }

  private checkIfProjectsPage(url: string): void {
    // Match exact `/projects` or starts with `/projects/`
    this.isProjectsPage = /^\/projects(\/|$)/.test(url);
  }

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
