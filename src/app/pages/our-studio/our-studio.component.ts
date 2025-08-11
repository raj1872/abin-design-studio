import {
  Component,
  HostListener,
  OnInit,
  OnDestroy,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-our-studio',
  templateUrl: './our-studio.component.html',
  styleUrls: ['./our-studio.component.css'],
})
export class OurStudioComponent implements OnInit, OnDestroy {
  private parallaxElement: HTMLElement | null = null;
  private ticking = false;
  private speed = 0.4;
  private isBrowser = false;

  constructor(
    private el: ElementRef,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Set page title
    this.titleService.setTitle('Our Studio - Abin Design Studio');

    // Add meta description & keywords
    this.metaService.updateTag({
      name: 'description',
      content:
        'Discover the Abin Design Studio — a space of creativity and innovation, blending art, architecture, and functionality in perfect harmony.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'Abin Design Studio, architecture, interior design, creative space, studio, art, design, innovation',
    });

    if (this.isBrowser) {
      // Init parallax only in browser
      this.parallaxElement =
        this.el.nativeElement.querySelector('.parallax-studio');
      this.updateSpeed();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.isBrowser || !this.parallaxElement) return;

    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        this.parallaxElement!.style.transform = `translateY(${
          scrolled * this.speed
        }px)`;
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  @HostListener('window:resize', [])
  onResize(): void {
    if (this.isBrowser) {
      this.updateSpeed();
    }
  }

  private updateSpeed(): void {
    if (!this.isBrowser) return;

    if (window.innerWidth < 480) {
      this.speed = 0.4; // phone
    } else if (window.innerWidth < 1024) {
      this.speed = 0.25; // tablet
    } else {
      this.speed = 0.4; // desktop
    }
  }

  ngOnDestroy(): void {
    this.parallaxElement = null;
  }
}
