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
      { src: "assets/images/studio/img-1.jpg", name: "People Name1" },
      { src: "assets/images/studio/img-2.jpg", name: "People Name2" },
      { src: "assets/images/studio/img-3.jpg", name: "People Name3" },
      { src: "assets/images/studio/img-4.jpg", name: "People Name4" },
      { src: "assets/images/studio/img-1.jpg", name: "People Name5" },
      { src: "assets/images/studio/img-2.jpg", name: "People Name6" },
    ],
    2: [
      { src: "assets/images/studio/img-2.jpg", name: "People Name1" },
      { src: "assets/images/studio/img-3.jpg", name: "People Name2" },
      { src: "assets/images/studio/img-2.jpg", name: "People Name3" },
      { src: "assets/images/studio/img-4.jpg", name: "People Name4" },
      { src: "assets/images/studio/img-1.jpg", name: "People Name5" },
      { src: "assets/images/studio/img-1.jpg", name: "People Name6" },
    ],
    3: [
      { src: "assets/images/studio/img-1.jpg", name: "People Name1" },
      { src: "assets/images/studio/img-4.jpg", name: "People Name2" },
      { src: "assets/images/studio/img-1.jpg", name: "People Name3" },
      { src: "assets/images/studio/img-3.jpg", name: "People Name4" },
      { src: "assets/images/studio/img-2.jpg", name: "People Name5" },
      { src: "assets/images/studio/img-2.jpg", name: "People Name6" },
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

      gsap.from('.team-image-grid', {
        opacity: 0,
        scale: 0.5,
        scrollTrigger: {
          trigger: '#page-3',
          scroller: 'main',
          // markers:true,
          start: 'top 50%',
          end: 'top 49%',
          scrub: 1,
          // pin:true
        }
      });

      gsap.set('.team-image-grid', {
        clipPath: function () {
          return "inset(0px 0px 0px 0px)"
        },
      });

      gsap.to('.team-image-grid:not(:last-child)', {
        clipPath: function () {
          return "inset(0px 0px 100% 0px)"
        },
        scrollTrigger: {
          trigger: '#page-3',
          scroller: 'main',
          // markers:true,
          start: 'top -2%',
          end: 'top -400%',
          scrub: 1,
          // pin:true
        },
        stagger: .5,
        ease: 'none'
      });

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

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
}
