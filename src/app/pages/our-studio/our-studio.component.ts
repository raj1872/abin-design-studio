import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import Swiper, { Navigation, Pagination, Autoplay } from 'swiper';

// install modules
Swiper.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-our-studio',
  templateUrl: './our-studio.component.html',
  styleUrls: ['./our-studio.component.css'],
})
export class OurStudioComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;

  images: string[] = [
    'https://dummyimage.com/600x600/FAFAFA/FAFAFA',
    'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    'https://dummyimage.com/600x600/FEFEFE/FEFEFE',
    'https://dummyimage.com/600x600/1A1A1A/1A1A1A',
  ];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Our Studio - Abin Design Studio');
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
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      new Swiper(this.swiperContainer.nativeElement, {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        navigation: true,
        pagination: { clickable: true },
        autoplay: { delay: 3000, disableOnInteraction: false },
      });
    }
  }
}
