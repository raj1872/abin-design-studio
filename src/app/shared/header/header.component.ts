import { Component, HostListener, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isMenuActive = false;
  isMenuLinksVisible = false;
  isProjectsPage = false;
  isLandingPage = false; // ✅ flag to hide header

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkPageType(this.router.url);

    // Listen for route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkPageType(event.urlAfterRedirects);
      });
  }

  private checkPageType(url: string): void {
    this.isProjectsPage = /^\/projects(\/|$)/.test(url);

    // ✅ detect landing page route
    this.isLandingPage = url === '/' || url.startsWith('/landing');
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
