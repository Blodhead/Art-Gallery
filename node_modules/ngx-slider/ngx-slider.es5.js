import { Component, ElementRef, HostListener, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
var SliderComponent = (function () {
    /**
     * @param {?} el
     */
    function SliderComponent(el) {
        this.el = el;
        this.currentItemIndex = 0;
        this.activeTitle = '';
    }
    /**
     * @return {?}
     */
    SliderComponent.prototype.ngOnInit = function () {
        this.sliderItems = this.init.items;
        this.config = this.init.config;
        this.setTitle();
        this.resize();
        this.setSliderStyle();
    };
    /**
     * @return {?}
     */
    SliderComponent.prototype.onResize = function () {
        this.resize();
    };
    /**
     * @return {?}
     */
    SliderComponent.prototype.resize = function () {
        this.componentWidth = this.el.nativeElement.parentElement.clientWidth - (this.getPreviewWidth() * this.getNumberOfPreview());
        this.setSlideStyle();
    };
    /**
     * @return {?}
     */
    SliderComponent.prototype.setSliderStyle = function () {
        var /** @type {?} */ width = this.getWrapperWidth() + "px";
        var /** @type {?} */ left = this.getWrapperLeft() ? "-" + (this.getWrapperLeft() - this.getPreviewWidth()) + "px" : 0;
        this.sliderStyle = {
            width: width,
            left: left,
            transition: "left " + this.config.transitionDuration + "s"
        };
    };
    /**
     * @return {?}
     */
    SliderComponent.prototype.setSlideStyle = function () {
        this.slideStyle = {
            width: this.componentWidth + "px"
        };
    };
    /**
     * @return {?}
     */
    SliderComponent.prototype.setTitle = function () {
        this.activeTitle =
            this.sliderItems.length ? this.sliderItems[this.currentItemIndex].title : '';
    };
    /**
     * @return {?}
     */
    SliderComponent.prototype.getNumberOfPreview = function () {
        return this.config.showPreview ? this.config.numberOfPreview : 0;
    };
    /**
     * @return {?}
     */
    SliderComponent.prototype.getPreviewWidth = function () {
        return this.config.showPreview ? this.config.previewWidth : 0;
    };
    /**
     * @return {?}
     */
    SliderComponent.prototype.getWrapperWidth = function () {
        return this.sliderItems.length ? this.sliderItems.length * this.componentWidth : this.componentWidth;
    };
    /**
     * @return {?}
     */
    SliderComponent.prototype.getWrapperLeft = function () {
        return this.currentItemIndex * this.componentWidth;
    };
    /**
     * @param {?} action
     * @return {?}
     */
    SliderComponent.prototype.goTo = function (action) {
        if (action === 'next') {
            if (this.sliderItems.length - 1 > this.currentItemIndex) {
                this.currentItemIndex++;
            }
            else {
                this.currentItemIndex = this.config.loop ? 0 : this.currentItemIndex;
            }
        }
        else if (action === 'previous') {
            if (this.currentItemIndex > 0) {
                this.currentItemIndex--;
            }
            else {
                this.currentItemIndex = this.config.loop ? this.sliderItems.length - 1 : this.currentItemIndex;
            }
        }
        else {
            this.currentItemIndex = action;
        }
        this.setSliderStyle();
        this.setTitle();
    };
    return SliderComponent;
}());
SliderComponent.decorators = [
    { type: Component, args: [{
                // tslint:disable-next-line:component-selector
                selector: 'ngx-slider',
                template: "\n    <h4 *ngIf=\"config.showTitle\" class=\"slide-title\" [innerHTML]=\"activeTitle\"></h4>\n    <div class=\"slider-container\">\n      <div class=\"slider-row\">\n        <div [ngStyle]=\"sliderStyle\" class=\"slide-wrapper\">\n          <div *ngFor=\"let slide of sliderItems; let i=index;\" \n               [class.active]=\"i === currentItemIndex\"\n               [ngStyle]=\"slideStyle\" \n               class=\"slide-item\">\n               <div [ngStyle]=\"{'background-image': 'url(' + slide.src + ')'}\" class=\"slide\"></div>\n          </div>\n        </div>\n      </div>\n      <ng-container *ngIf=\"sliderItems.length > 1 && config.showNavigator\">\n          <button (click)=\"goTo('next')\" class=\"slider-nav next\">\n              <i class=\"fa fa-chevron-right\" aria-hidden=\"true\"></i>\n            </button>\n            <button (click)=\"goTo('previous')\" class=\"slider-nav previous\">\n              <i class=\"fa fa-chevron-left\" aria-hidden=\"true\"></i>\n            </button>\n      </ng-container>\n      <div *ngIf=\"sliderItems.length > 1 && config.showDots\" class=\"slider-dots\">\n        <ul>\n          <li *ngFor=\"let slide of sliderItems; let i=index;\" [class.active]=\"i === currentItemIndex\">\n            <button (click)=\"goTo(i)\" class=\"dots\">\n              <i class=\"fa fa-circle\" aria-hidden=\"true\"></i>\n            </button>\n          </li>\n        </ul>\n      </div>\n    </div>\n  ",
                styles: ["\n    .slider-container {\n        width: 100%;\n        height: 100%;\n        position: relative;\n        overflow: hidden;\n    }\n    .slider-row {\n        width: 100%;\n        height: 100%;\n    }\n    .slide-wrapper {\n        position: absolute;\n        height: 100%;\n    }\n    .slide-wrapper .active {\n        opacity: 1;\n        -webkit-transition: opacity 1s, -webkit-transform 1s;\n        transition: opacity 1s, -webkit-transform 1s;\n        transition: opacity 1s, transform 1s;\n        transition: opacity 1s, transform 1s, -webkit-transform 1s;\n    }\n    .slide-item {\n        display: inline-block;\n        height: 100%;\n        opacity: 0.5;\n        -webkit-transition: opacity 1s, -webkit-transform 1s;\n        transition: opacity 1s, -webkit-transform 1s;\n        transition: opacity 1s, transform 1s;\n        transition: opacity 1s, transform 1s, -webkit-transform 1s;\n    }\n    .slide {\n        height: 100%;\n        background-repeat: no-repeat;\n        background-size: auto;\n        background-position: center;\n        margin: 0 5px;\n    }\n    .slide-title {\n        font-size: 1.5rem;\n        padding: 10px;\n    }\n    .slider-nav {\n        background-color: rgba(0,0,0,0.2);\n        position: absolute;\n        top: 35%;\n        border: none;\n        -webkit-box-shadow: none;\n                box-shadow: none;\n        color: white;\n        font-size: 2rem;\n        padding: 1.5rem;\n    }\n\n    .next {\n        right: 0;\n    }\n\n    .previous {\n        left: 0;\n    }\n\n    .slider-dots {\n        position: absolute;\n        bottom: 3%;\n        width: 100%;\n        text-align: center;\n    }\n\n    .slider-dots ul {\n        margin: 0;\n        padding: 0;\n    }\n\n    .slider-dots ul li {\n        display: inline-block;\n        list-style: none;\n        margin: 0 3px;\n    } \n\n    .slider-dots ul li.active i {\n        color: #00C24F;\n    }\n\n    .dots {\n        padding: 0;\n        border: 0;\n        -webkit-box-shadow: none;\n                box-shadow: none;\n        background: none;\n    }\n  "]
            },] },
];
/**
 * @nocollapse
 */
SliderComponent.ctorParameters = function () { return [
    { type: ElementRef, },
]; };
SliderComponent.propDecorators = {
    'init': [{ type: Input },],
    'onResize': [{ type: HostListener, args: ['window:resize', ['$event.target'],] },],
};
var SliderModule = (function () {
    function SliderModule() {
    }
    return SliderModule;
}());
SliderModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    SliderComponent
                ],
                exports: [
                    SliderComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
SliderModule.ctorParameters = function () { return []; };
var SliderConfig = (function () {
    function SliderConfig() {
        this.showDots = true;
        this.showNavigator = true;
        this.showTitle = true;
        this.loop = true;
        this.showPreview = true;
        this.numberOfPreview = 2;
        this.previewWidth = 50;
        this.transitionDuration = 1;
    }
    return SliderConfig;
}());
var Slider = (function () {
    function Slider() {
        this.items = [];
        this.config = new SliderConfig();
    }
    return Slider;
}());
/**
 * Generated bundle index. Do not edit.
 */
export { Slider, SliderModule, SliderComponent as ɵa };
//# sourceMappingURL=ngx-slider.es5.js.map
