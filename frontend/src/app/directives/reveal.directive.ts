import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

// Fait apparaître l'élément en l'agrandissant doucement quand il entre dans l'écran (au défilement)
@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  private el = inject<ElementRef<HTMLElement>>(ElementRef);
  private io?: IntersectionObserver;

  ngOnInit() {
    const node = this.el.nativeElement;
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (typeof IntersectionObserver === 'undefined' || reduce) {
      node.classList.add('in');
      return;
    }
    this.io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          node.classList.add('in');
          this.io?.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    this.io.observe(node);
  }

  ngOnDestroy() {
    this.io?.disconnect();
  }
}
