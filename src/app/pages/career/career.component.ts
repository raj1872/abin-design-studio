import {
  Component,
  Inject,
  PLATFORM_ID,
  OnInit,
  AfterViewInit,
  HostListener,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../services/api.service';
import Lenis from '@studio-freight/lenis';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.css'],
})
export class CareerComponent implements OnInit, AfterViewInit {
  isMobile = false;
  openings: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    // ✅ Set Page Title & Meta Tags
    this.titleService.setTitle('Careers at Abin Design Studio');
    this.metaService.updateTag({
      name: 'description',
      content:
        'Explore exciting career opportunities at Abin Design Studio. Join our creative team and grow with us.',
    });
    this.metaService.updateTag({
      name: 'keywords',
      content:
        'careers, job openings, abin design studio, design jobs, creative careers',
    });

    // ✅ SSR + Browser safe API call
    this.apiService.getopenings().subscribe({
      next: (res) => {
        this.openings = res.list || res;
        console.log(this.openings);
      },
      error: (err) => console.error('Error fetching openings:', err),
    });

    if (isPlatformBrowser(this.platformId)) {
      this.checkIsMobile();
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkIsMobile();
    }
  }

  private checkIsMobile(): void {
    this.isMobile = window.innerWidth <= 991;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const lenis = new Lenis({
        orientation: 'vertical',   // ✅ vertical scroll (default)
        gestureOrientation: 'vertical',
        smoothWheel: true,
        lerp: 0.1,
        wheelMultiplier: 1,
      });

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }
}
