import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('landingWrapper', { static: true }) landingWrapper!: ElementRef;
  private lenis!: Lenis;
  private animationFrame!: number;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return; // ⬅️ Prevent running in SSR

    this.lenis = new Lenis({
      wrapper: this.landingWrapper.nativeElement,
      content: this.landingWrapper.nativeElement,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 8,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      this.animationFrame = requestAnimationFrame(raf);
    };
    this.animationFrame = requestAnimationFrame(raf);
  }

  /**
   * Scroll to the second landing section using Lenis if available,
   * fallback to native smooth scroll otherwise.
   */
  onExploreClick(): void {
    if (!this.isBrowser) return;

    const target = this.document.getElementById('abin-design-studio-landing-2');
    if (target) {
      if (this.lenis) {
        this.lenis.scrollTo(target, { offset: 0 });
      } else {
        try {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch {
          target.scrollIntoView();
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    cancelAnimationFrame(this.animationFrame);
    if (this.lenis) {
      this.lenis.destroy();
    }
  }
}
