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
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// install modules
Swiper.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-our-studio',
  templateUrl: './our-studio.component.html',
  styleUrls: ['./our-studio.component.css'],
})
export class OurStudioComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer', { static: false }) swiperContainer!: ElementRef;
  @ViewChild('teamWrapper', { static: true }) teamWrapper!: ElementRef;
  hoverName: string = "People Name";

  images: string[] = [
    'https://dummyimage.com/1080x926/1A1A1A/1A1A1A',
    'https://dummyimage.com/1080x926/1C1C1C/1C1C1C',
    'https://dummyimage.com/1080x926/C1C1C1/C1C1C1',
    'https://dummyimage.com/1080x926/1A1A1A/1A1A1A',
  ];

  team_images: any = {
    1: [
      { src: "assets/images/studio/img-1.jpg", name: "Person Name1" },
      { src: "assets/images/studio/img-2.jpg", name: "Person Name2" },
      { src: "assets/images/studio/img-3.jpg", name: "Person Name3" },
      { src: "assets/images/studio/img-4.jpg", name: "Person Name4" },
      { src: "assets/images/studio/img-1.jpg", name: "Person Name5" },
      { src: "assets/images/studio/img-2.jpg", name: "Person Name6" },
    ],
    2: [
      { src: "assets/images/studio/img-2.jpg", name: "Person Name1" },
      { src: "assets/images/studio/img-3.jpg", name: "Person Name2" },
      { src: "assets/images/studio/img-2.jpg", name: "Person Name3" },
      { src: "assets/images/studio/img-4.jpg", name: "Person Name4" },
      { src: "assets/images/studio/img-1.jpg", name: "Person Name5" },
      { src: "assets/images/studio/img-1.jpg", name: "Person Name6" },
    ],
    3: [
      { src: "assets/images/studio/img-1.jpg", name: "Person Name1" },
      { src: "assets/images/studio/img-4.jpg", name: "Person Name2" },
      { src: "assets/images/studio/img-1.jpg", name: "Person Name3" },
      { src: "assets/images/studio/img-3.jpg", name: "Person Name4" },
      { src: "assets/images/studio/img-2.jpg", name: "Person Name5" },
      { src: "assets/images/studio/img-2.jpg", name: "Person Name6" },
    ]
  };

  loopCount = 5;
  loopCountGrid = 3;

  get loops() {
    return Array(this.loopCount).fill(0);
  }

  get loopsGrid() {
    return Array(this.loopCountGrid).fill(0);
  }


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
      let workInfoItems = document.querySelectorAll('.team-image-grid');
      workInfoItems.forEach(function (item: any, index) {
        item.style.zIndex = workInfoItems.length - index;
      });

      const container = document.getElementById("abin-design-studio-studio-page-wrapper");
      const sections = container?.querySelectorAll<HTMLElement>(".snap");
      // const sec1 = document.getElementById('abin-design-studio-studio-1')
      if (!container || !sections) return;

      let currentIndex = 0;
      container.addEventListener("wheel", (e) => {
        e.preventDefault();
        if (e.deltaY > 0 && currentIndex < sections.length - 1) {
          currentIndex++;
        } else if (e.deltaY < 0 && currentIndex > 0) {
          currentIndex--;
        }
        if ((e.deltaY > 0 && currentIndex == 1) || (e.deltaY < 0 && currentIndex == 0)) {
          sections[currentIndex].scrollIntoView({ behavior: "smooth" });
        } else {
          sections[currentIndex].scrollIntoView({ behavior: "instant" });
        }
      }, { passive: false });

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

  setName(name: any) {
    this.hoverName = name
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
}
