import {IPublicWidgetTemplateDefinition} from "./PublicTemplate";

export interface IWidgetManager {

    registerWidget(widget: IPublicWidgetTemplateDefinition<any>): void;

}
