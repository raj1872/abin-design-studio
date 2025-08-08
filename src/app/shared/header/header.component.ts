import { Component, HostListener, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isMenuActive = false;
  isMenuLinksVisible = false;
  isProjectsPage = false;
  isLandingPage = false;

  // Scroll state variables
  private prevScrollTop = 0;
  isHeaderHidden = false;
  isHeaderChanged = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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
  onEscape(): void {
    this.closeMenu();
  }

  // ✅ Scroll listener (SSR-safe)
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrollTop = window.scrollY;

    // Hide/show header like old script
    this.isHeaderHidden = scrollTop > this.prevScrollTop && scrollTop > 0;
    this.prevScrollTop = scrollTop;

    // Add/remove "header_change"
    this.isHeaderChanged = scrollTop > 100;
  }
}
