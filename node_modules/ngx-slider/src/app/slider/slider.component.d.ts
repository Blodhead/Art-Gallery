import { OnInit, ElementRef } from '@angular/core';
import { Slider } from './class/slider';
import { ISliderConfig } from './interface/slider-config';
import { ISlide } from './interface/slide';
export declare class SliderComponent implements OnInit {
    el: ElementRef;
    init: Slider;
    sliderItems: Array<ISlide>;
    config: ISliderConfig;
    componentWidth: number;
    currentItemIndex: number;
    activeTitle: string;
    sliderStyle: any;
    slideStyle: any;
    constructor(el: ElementRef);
    ngOnInit(): void;
    onResize(): void;
    private resize();
    private setSliderStyle();
    private setSlideStyle();
    private setTitle();
    private getNumberOfPreview();
    private getPreviewWidth();
    private getWrapperWidth();
    private getWrapperLeft();
    private goTo(action);
}
