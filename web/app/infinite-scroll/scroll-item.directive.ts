import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({selector: '[appScrollItem]'})
export class ScrollItemDirective {
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef) {
        this.viewContainer.createEmbeddedView(this.templateRef);
    }
}
