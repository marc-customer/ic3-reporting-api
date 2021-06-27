import {IThemeWidgetVariant} from "./IThemeManager";

export interface IWidgetVariantManager {

    registerVariants(variants: IThemeWidgetVariant[]): void;

}