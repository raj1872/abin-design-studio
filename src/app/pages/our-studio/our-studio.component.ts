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
  hoverName: string = "People Name";

  images: string[] = [
    'https://dummyimage.com/1080x926/1A1A1A/1A1A1A',
    'https://dummyimage.com/1080x926/1C1C1C/1C1C1C',
    'https://dummyimage.com/1080x926/C1C1C1/C1C1C1',
    'https://dummyimage.com/1080x926/1A1A1A/1A1A1A',
  ];

  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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
        speed: 500,
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
      });
    }
  }
}
