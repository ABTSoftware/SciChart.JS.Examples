import {
    adornersSvgCustomization,
    annotationAdornersDefaultStyle,
    annotationAdornersDefaultStyleViaBuilderAPI,
    annotationAdornersStylingViaBuilderAPI,
    annotationAdornersStylingViaOptions,
    annotationAdornersStylingViaProperties,
    dragPointsCustomization,
    dragPointsCustomizationViaBuilderAPI,
    resizeDirectionCustomization,
    resizeDirectionCustomizationViaBuilderAPI,
} from './adornersCustomization';
import { customAxisMarkerAnnotationTs } from './customAxisMarkerAnnotationTs';

const divId1 = 'scichart-div-id-1';
const divId2 = 'scichart-div-id-2';
const divId3 = 'scichart-div-id-3';
const divId4 = 'scichart-div-id-4';
const divId5 = 'scichart-div-id-5';
const divId6 = 'scichart-div-id-6';
const divId7 = 'scichart-div-id-7';
const divId8 = 'scichart-div-id-8';
const divId9 = 'scichart-div-id-9';
const divId10 = 'scichart-div-id-10';
const divId11 = 'scichart-div-id-11';

customAxisMarkerAnnotationTs(divId1);
annotationAdornersDefaultStyle(divId2);
annotationAdornersDefaultStyleViaBuilderAPI(divId3);
annotationAdornersStylingViaOptions(divId4);
annotationAdornersStylingViaProperties(divId5);
annotationAdornersStylingViaBuilderAPI(divId6);cd
dragPointsCustomization(divId7);
dragPointsCustomizationViaBuilderAPI(divId8);
resizeDirectionCustomization(divId9);
resizeDirectionCustomizationViaBuilderAPI(divId10);
adornersSvgCustomization(divId11);
