import { AutoScroller } from '../autoscroller';

class DragEvent extends window.Event {
  constructor(public clientX: number, public clientY: number) {
    super('drag');
  }
}

describe('autoscroller', () => {
  beforeEach(() => {
    jest.spyOn(window, 'setInterval');
    Object.defineProperty(window, 'DragEvent', {
      value: DragEvent
    });
  });

  it('should scroll up', () => {
    const dropContainer = givenElement(500, 100);
    mockContainer(400, 0, 0, 0, 1500, 7000);
    const event = givenEvent(550, 150);
    const scroller = AutoScroller.getInstance();
    scroller.updateScroll(event, dropContainer as Element);
    window.setInterval['mock'].calls[0][0].call(null);
    expect(window.document.documentElement.scrollTop).toBe(397.5);
  });

  it('should scroll right', () => {
    const dropContainer = givenElement(500, 100);
    mockContainer(0, 400, 0, 0, 7000, 1500);
    const event = givenEvent(6820, 550);
    const scroller = AutoScroller.getInstance();
    scroller.updateScroll(event, dropContainer as Element);
    window.setInterval['mock'].calls[0][0].call(null);
    expect(window.document.documentElement.scrollLeft).toBe(402);
  });

  it('should scroll down', () => {
    const dropContainer = givenElement(500, 100);
    mockContainer(400, 0, 0, 0, 1500, 7000);
    const event = givenEvent(550, 6820);
    const scroller = AutoScroller.getInstance();
    scroller.updateScroll(event, dropContainer as Element);
    window.setInterval['mock'].calls[0][0].call(null);
    expect(window.document.documentElement.scrollTop).toBe(402);
  });

  it('should scroll left', () => {
    const dropContainer = givenElement(500, 100);
    mockContainer(0, 400, 0, 0, 7000, 1500);
    const event = givenEvent(150, 550);
    const scroller = AutoScroller.getInstance();
    scroller.updateScroll(event, dropContainer as Element);
    window.setInterval['mock'].calls[0][0].call(null);
    expect(window.document.documentElement.scrollLeft).toBe(397.5);
  });
});

function givenElement(top: number, left: number): { getBoundingClientRect: Function } {
  return {
    getBoundingClientRect: () => ({ top, left })
  };
}

function mockContainer(
  scrollTop: number,
  scrollLeft: number,
  left: number,
  top: number,
  width: number,
  height: number
): void {
  const rect = {
    ...window.document.body.getBoundingClientRect(),
    top,
    left,
    width,
    height
  };
  jest.spyOn(window.document.documentElement, 'getBoundingClientRect').mockReturnValue(rect);
  window.document.documentElement.scrollTop = scrollTop;
  window.document.documentElement.scrollLeft = scrollLeft;
}

function givenEvent(x: number, y: number): DragEvent {
  return new DragEvent(x, y);
}
