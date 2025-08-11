import {
  Component,
  HostListener,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
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
  projectListingTrue = false;
  isLandingPage = false;
  isTeamPage = false;
  isContactNavActive = false;

  private prevScrollTop = 0;
  private scrollYBeforeLock = 0; // For iOS-safe scroll lock
  isHeaderHidden = false;
  isHeaderChanged = false;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.checkPageType(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkPageType(event.urlAfterRedirects);
      });
  }

  private checkPageType(url: string): void {
    this.isProjectsPage = /^\/projects(\/|$)/.test(url);
    this.isLandingPage = url === '/' || url.startsWith('/landing');
    this.isTeamPage = /^\/our-team(\/|$)/.test(url);
    this.projectListingTrue = /^\/projects-svg(\/|$)/.test(url);
  }

  private lockScroll(lock: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = document.body;
    const html = document.documentElement;

    if (lock) {
      // Store scroll position
      this.scrollYBeforeLock = window.scrollY;

      // Lock scroll
      body.style.position = 'fixed';
      body.style.top = `-${this.scrollYBeforeLock}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.overflow = 'hidden';
      body.style.height = '100%';

      html.style.overflow = 'hidden';
    } else {
      // Unlock scroll
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.overflow = '';
      body.style.height = '';

      html.style.overflow = '';

      // Restore scroll position
      window.scrollTo(0, this.scrollYBeforeLock);
    }
  }

  toggleMenu(): void {
    this.isMenuActive = !this.isMenuActive;
    this.lockScroll(this.isMenuActive);

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
    this.lockScroll(false);
  }

  openContactNav(): void {
    this.isContactNavActive = true;
  }

  closeContactNav(): void {
    this.isContactNavActive = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(): void {
    this.closeMenu();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrollTop = window.scrollY;

    this.isHeaderHidden = scrollTop > this.prevScrollTop && scrollTop > 0;
    this.prevScrollTop = scrollTop;

    this.isHeaderChanged = scrollTop > 100;
  }
}
