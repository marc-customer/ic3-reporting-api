import {FormFieldDef} from "./PublicTemplateForm";
import {ITidyTable} from "./PublicTidyTable";
import {IPublicContext} from "./PublicContext";

export interface ILocalizationContext {

    localizeDescription(...args: any[]): string;

    localize(name: string, ...args: any[]): string;

}

export interface ITidyTableTransformation<OPTIONS> {

    id: string;

    groupId: string;

    /**
     * Internal usage: pluginID.id
     */
    qualifiedId?: string;

    getDescription?(context: ILocalizationContext, options: OPTIONS): string;

    getFieldMeta(): FormFieldDef[];

    validateOptions(options: any): options is OPTIONS;

    apply(context: IPublicContext, table: ITidyTable, options: OPTIONS): void;

}
