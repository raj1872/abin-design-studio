import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  HostListener,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('parallaxBg', { static: true }) parallaxBg!: ElementRef;
  @ViewChildren('scalableImage', { read: ElementRef })
  scalableImages!: QueryList<ElementRef>;

  isBrowser = false;

  // ===== Popup state flags =====
  isCreditOpen = false;
  isInnerPopupActive = false;
  isPublicationOpen = false;
  isOverlayActive = false;

  // top offset used for fixed-position popup (value in px relative to viewport)
  sectionTop = 0;

  private wordSpans: NodeListOf<HTMLSpanElement> = [] as any;
  private totalSpans = 0;
  private container: HTMLElement | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      // initial compute (use rect.top — viewport-relative)
      this.updateSectionTop();
    }
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.onScroll(); // Initial position
      this.setupWordRevealEffect(); // Word-by-word scroll reveal

      // ✅ Initialize AOS for animation
      import('aos').then((AOS: any) => {
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
        });
      });
    }
  }

  // Recompute sectionTop (important: use rect.top for fixed positioning)
  private updateSectionTop(): void {
    if (!this.isBrowser) return;

    const section = document.getElementById(
      'abin-design-studio-project-detail-2'
    );
    if (!section) return;

    const rect = section.getBoundingClientRect();

    // rect.top is the distance from the top of the viewport.
    // clamp to >= 0 so popup doesn't go above viewport (optional).
    const top = Math.max(0, Math.round(rect.top));
    this.sectionTop = top;
  }

  // Keep alignment while the popup is open if the page scrolls or resizes
  @HostListener('window:resize', [])
  onResize(): void {
    if (!this.isBrowser) return;
    // recompute so fixed popup stays aligned on viewport resize
    this.updateSectionTop();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!this.isBrowser) return;

    // If credits popup is open, keep recalculating sectionTop so the fixed popup
    // visually remains on top of the section start as the page moves.
    // (If you DON'T want it to follow while user scrolls, remove this call.)
    if (this.isCreditOpen) {
      this.updateSectionTop();
    }

    const scrollTop = window.scrollY;
    const isMobile = window.innerWidth <= 768;
    const parallaxSpeed = isMobile ? 0.4 : 0.4; // Less parallax on mobile
    const offset = scrollTop * parallaxSpeed;

    if (this.parallaxBg?.nativeElement) {
      this.parallaxBg.nativeElement.style.transform = `translate3d(0, ${offset}px, 0)`; // GPU acceleration
    }

    this.updateWordRevealEffect();

    this.scalableImages?.forEach((imgRef: ElementRef) => {
      const imgEl = imgRef.nativeElement as HTMLElement;
      const rect = imgEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        const progress =
          1 -
          Math.abs(
            (rect.top + rect.height / 2 - window.innerHeight / 2) /
              (window.innerHeight / 2)
          );
        const scale = 1 + Math.max(0, Math.min(0.05, progress * 0.05)); // scale from 1 to 1.05
        imgEl.style.transform = `scale(${scale})`;
      } else {
        imgEl.style.transform = 'scale(1)';
      }
    });
  }

  // ===== Popup Methods =====
  openCredits() {
    if (this.isCreditOpen) return;
    this.closeAll();

    // compute fresh position at the moment of opening (viewport-relative)
    if (this.isBrowser) {
      this.updateSectionTop();
    }

    this.isCreditOpen = true;
    this.isOverlayActive = true;

    setTimeout(() => {
      this.isInnerPopupActive = true;
    }, 1000);
  }

  openPublication() {
    if (this.isPublicationOpen) return;
    this.closeAll();
    this.isPublicationOpen = true;
    this.isOverlayActive = true;
  }

  closeAll() {
    this.isCreditOpen = false;
    this.isInnerPopupActive = false;
    this.isPublicationOpen = false;
    this.isOverlayActive = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey() {
    this.closeAll();
  }

  // ===== Word reveal & other logic (unchanged) =====
  setupWordRevealEffect(): void {
    this.container = document.getElementById('scroll-reveal-text');
    if (!this.container || this.container.classList.contains('words-enhanced'))
      return;

    const words = this.container.textContent?.trim().split(' ') || [];
    this.container.innerHTML = '';

    words.forEach((word) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.opacity = '0.05';
      span.style.transition = 'opacity 0.3s ease';
      span.style.display = 'inline-block';
      span.style.wordBreak = 'break-word';
      this.container!.appendChild(span);
    });

    this.container.classList.add('words-enhanced');
    this.wordSpans = this.container.querySelectorAll('span');
    this.totalSpans = this.wordSpans.length;

    this.updateWordRevealEffect();
  }

  updateWordRevealEffect(): void {
    if (!this.container || this.wordSpans.length === 0) return;

    const rect = this.container.getBoundingClientRect();

    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      const scrollTop = window.scrollY;
      const elementStart = scrollTop + rect.top;
      const scrollDistance = scrollTop - (elementStart - window.innerHeight);

      const vhMultiplier = window.innerWidth < 768 ? 1.15 : 0.75;
      const revealRange = window.innerHeight * vhMultiplier;
      const revealStep = revealRange / this.totalSpans;

      this.wordSpans.forEach((span, index) => {
        const revealPoint = index * revealStep;
        span.style.opacity = scrollDistance >= revealPoint ? '1' : '0.05';
      });
    } else {
      this.wordSpans.forEach((span) => (span.style.opacity = '0.05'));
    }
  }
}
