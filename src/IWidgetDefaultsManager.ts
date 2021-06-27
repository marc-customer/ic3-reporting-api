import {IThemeWidgetDefaults} from "./IThemeManager";

export interface IWidgetDefaultsManager {

    registerWidgetDefaults(defaults: IThemeWidgetDefaults): void;

}