import { defaultSelectors } from "@/utils";

class SOMAnnotator 
{
  /**
   * The list of interactive elements.
   */
  private interactiveElements: HTMLElement[] = [];

  /**
   * The list of overlays.
   */
  private overlays: HTMLElement[] = [];

  /**
   * The selectors to use to find interactive elements.
   */
  private selectors: string[] = defaultSelectors;

  /**
   * Constructor.
   * @param {string[]} selectors - The selectors to use to find interactive elements.
   */
  constructor(selectors: string[]) {
    this.selectors = selectors;
    this.interactiveElements = [];
    this.overlays = [];
  }

  /* 
    Search for interactive elements on the page.
    @returns {HTMLElement[]} The list of interactive elements.
  */
  private findInteractiveElements(): HTMLElement[] 
  {
    const selectors = [...defaultSelectors, ...this.selectors];
    this.interactiveElements = Array.from(document.querySelectorAll(selectors.join(',')));
    return this.interactiveElements;
  }

  /*
    Initialize the annotator.
  */
  public start() {
    this.removeOverlays();
    const interactiveElements = this.findInteractiveElements();

    interactiveElements.forEach((element, index) => {
      const overlayElement = this.createOverlayStyle(element);
      const labelElement = this.createLabelElement(index);
      
      overlayElement.appendChild(labelElement);
      document.body.appendChild(overlayElement);

      this.overlays.push(overlayElement);
    });
  }

  /*
    Create the overlay style.
    @param {HTMLElement} element - The element to create the overlay for.
    @returns {HTMLElement} The overlay element.
  */
  private createOverlayStyle(element: HTMLElement): HTMLElement {
    const rect = element.getBoundingClientRect(),
      overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.top = `${rect.top + window.scrollY}px`;
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.border = '2px solid red';
    overlay.style.boxSizing = 'border-box';
    overlay.style.pointerEvents = 'none';
    overlay.style.zIndex = '9999';
    return overlay;
  }

  /*
    Create the label element.
    @param {number} index - The index of the element.
    @returns {HTMLElement} The label element.
  */
  private createLabelElement(index: number): HTMLElement {
    const label = document.createElement('div');
    label.innerText = index.toString();
    label.style.position = 'absolute';
    label.style.top = '0';
    label.style.left = '0';
    label.style.backgroundColor = 'red';
    label.style.color = 'white';
    label.style.fontSize = '12px';
    label.style.padding = '2px';
    return label;
  }

  /*
    Remove the overlays.
  */
  private removeOverlays(): void {
    this.overlays.forEach(overlay => {
      if (!overlay.parentElement) return;
      overlay.parentElement.removeChild(overlay);
    });
    this.overlays = [];
  }

  /*
    Get the annotations.
    @returns {Object[]} The list of annotations.
  */
  public getAnnotations() {
    return this.interactiveElements.map((element, index) => {
      const rect = element.getBoundingClientRect();
      return {
        index,
        tag: element.tagName,
        id: element.id,
        classes: element.className,
        position: {
          left: rect.left + window.scrollX,
          top: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        },
        text: element.textContent ? element.textContent.trim() : null,
      };
    });
  }
}

export { SOMAnnotator }