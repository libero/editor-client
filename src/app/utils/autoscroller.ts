const WINDOW_SCROLL_ZONE = 300;

interface Coords {
  x: number;
  y: number;
}

interface ScrollUpdateInterface {
  translate: Coords;
  maxTranslate: Coords;
  minTranslate: Coords;
  minScroll: Coords;
  width: number;
  height: number;
}

export class AutoScroller {
  private static instance: AutoScroller;

  public static getInstance(): AutoScroller {
    if (!AutoScroller.instance) {
      AutoScroller.instance = new AutoScroller();
    }
    return AutoScroller.instance;
  }

  private interval: number | null;
  private container: Element;
  private isAutoScrolling: boolean;

  constructor() {
    this.container = window.document.scrollingElement || window.document.documentElement;
  }

  public clear(): void {
    if (this.interval == null) {
      return;
    }

    clearInterval(this.interval);
    this.interval = null;
  }

  public updateScroll(event: DragEvent, dropContainer: Element): void {
    const containerRect = this.container.getBoundingClientRect();
    const dropRect = dropContainer.getBoundingClientRect();

    const minTranslate: Coords = { x: 0, y: 0 };
    const maxTranslate: Coords = {
      x: containerRect.width,
      y: containerRect.height
    };

    const minScroll = {
      x: dropRect.left + this.container.scrollLeft,
      y: dropRect.top + this.container.scrollTop
    };

    this.doAutoscroll({
      translate: { x: event.clientX, y: event.clientY },
      minTranslate,
      maxTranslate,
      minScroll,
      width: WINDOW_SCROLL_ZONE * 2,
      height: WINDOW_SCROLL_ZONE * 2
    });
  }

  private doAutoscroll({ translate, minTranslate, maxTranslate, width, height }: ScrollUpdateInterface): void {
    const direction = {
      x: 0,
      y: 0
    };

    const speed = {
      x: 1,
      y: 1
    };

    const acceleration = {
      x: 10,
      y: 10
    };

    const { scrollTop, scrollLeft, scrollHeight, scrollWidth, clientHeight, clientWidth } = this.container;

    const isTop = scrollTop === 0;
    const isBottom = scrollHeight - scrollTop - clientHeight === 0;
    const isLeft = scrollLeft === 0;
    const isRight = scrollWidth - scrollLeft - clientWidth === 0;

    if (translate.y >= maxTranslate.y - height / 2 && !isBottom) {
      // Scroll Down
      direction.y = 1;
      speed.y = acceleration.y * Math.abs((maxTranslate.y - height / 2 - translate.y) / height);
    } else if (translate.x >= maxTranslate.x - width / 2 && !isRight) {
      // Scroll Right
      direction.x = 1;
      speed.x = acceleration.x * Math.abs((maxTranslate.x - width / 2 - translate.x) / width);
    } else if (translate.y <= minTranslate.y + height / 2 && !isTop) {
      // Scroll Up
      direction.y = -1;
      speed.y = acceleration.y * Math.abs((translate.y - height / 2 - minTranslate.y) / height);
    } else if (translate.x <= minTranslate.x + width / 2 && !isLeft) {
      // Scroll Left
      direction.x = -1;
      speed.x = acceleration.x * Math.abs((translate.x - width / 2 - minTranslate.x) / width);
    }

    if (this.interval) {
      this.clear();
      this.isAutoScrolling = false;
    }

    if (direction.x !== 0 || direction.y !== 0) {
      this.interval = window.setInterval(() => {
        this.isAutoScrolling = true;
        const offset = {
          left: speed.x * direction.x,
          top: speed.y * direction.y
        };
        this.container.scrollTop += offset.top;
        this.container.scrollLeft += offset.left;
      }, 5);
    }
  }
}
