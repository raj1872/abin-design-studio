import {
  Directive,
  ElementRef,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appFancybox]',
})
export class FancyboxDirective implements AfterViewInit {
  constructor(
    private el: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const { Fancybox } = await import('@fancyapps/ui');

      Fancybox.bind(this.el.nativeElement, '[data-fancybox]', {
        closeButton: 'auto',
        hideScrollbar: false,
        placeFocusBack: false,
        Carousel: {
          infinite: true,
          transition: 'slide',
        },
      } as any);
    }
  }
}
