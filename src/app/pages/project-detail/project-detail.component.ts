import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  HostListener,
  OnInit,
  ViewChildren, // ✅ ADD THIS
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

  private wordSpans: NodeListOf<HTMLSpanElement> = [] as any;
  private totalSpans = 0;
  private container: HTMLElement | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);
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

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!this.isBrowser) return;

    const scrollTop = window.scrollY;
    const isMobile = window.innerWidth <= 768;
    const parallaxSpeed = isMobile ? 0.1 : 0.4; // Less parallax on mobile
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
