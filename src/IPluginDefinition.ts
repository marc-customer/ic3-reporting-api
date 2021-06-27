import {ILocalizationManager} from "./ILocalizationManager";
import {IThemeManager} from "./IThemeManager";
import {IWidgetManager} from "./IWidgetManager";
import {ITidyTableTransformationManager} from "./ITidyTableTransformationManager";
import {IWidgetDefaultsManager} from "./IWidgetDefaultsManager";
import {Theme} from "@material-ui/core/styles";

export interface IPluginDefinition {

    /**
     * Unique over all the registered plugins. Must not contain any dot.
     */
    id: string;

    registerAmCharts4?: (callback: (am4core: any) => void) => void;

    registerLocalization?: (manager: ILocalizationManager) => void;

    registerThemes?: (manager: IThemeManager) => void;

    registerWidgets?: (manager: IWidgetManager) => void;

    registerTidyTableTransformations?: (manager: ITidyTableTransformationManager) => void;

    registerWidgetDefaults?: (theme: Theme, manager: IWidgetDefaultsManager) => void;

}