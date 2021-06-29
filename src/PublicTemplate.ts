import {ITidyTable} from "./PublicTidyTable";
import {ChartTemplateDataMapping, TidyColumnsType} from "./PublicTidyTableTypes";
import {ITidyTableInteraction} from "./PublicTidyTableInteractions";
import {IWidgetPublicContext} from "./PublicContext";
import {FormFieldDef, FormFieldObject, FormFields} from "./PublicTemplateForm";
import {IWidgetVariantManager} from "./IWidgetVariantManager";
import {ITidyColumn} from "./PublicTidyColumn";
import {ReactElement} from "react";

type ChartTemplateWidgetProps = any;

/**
 * Actual instance used by our React Widget component.
 */
export interface IPublicReactChartTemplate<T extends FormFieldObject> {

    /**
     * here goes the rendering, if it´s a react component return a ReactElement
     */
    reactElement: (data: IWidgetTemplateTidyData, widgetFormOptions: T, widgetHeader: string, props: ChartTemplateWidgetProps) => ReactElement;

}

export interface IPublicJsChartTemplate<T extends FormFieldObject> {

    /**
     * here goes the rendering, if it´s a react component return a ReactElement
     */
    render: (options: IChartVisualizationTypedInput<T>, widgetHeader: string, props: ChartTemplateWidgetProps) => void;

    dispose: () => void;

}

export type IPublicWidgetTemplateDefinition<T extends FormFieldObject> =
    IPublicWidgetReactTemplateDefinition<T>
    | IPublicWidgetJsTemplateDefinition<T>;

export interface IPublicWidgetReactTemplateDefinition<T extends FormFieldObject> extends IPublicCommonWidgetTemplateDefinition {

    jsCode: (context: IWidgetPublicContext) => IPublicReactChartTemplate<T>;

    reactComponent: true;

}

export interface IPublicWidgetJsTemplateDefinition<T extends FormFieldObject> extends IPublicCommonWidgetTemplateDefinition {

    jsCode: (context: IWidgetPublicContext, container: HTMLDivElement) => IPublicJsChartTemplate<T>;

    reactComponent?: false;
}

/**
 * Definition - static - of a widget template
 */
interface IPublicCommonWidgetTemplateDefinition {

    /**
     * Determine the widget icon in the widget infos.
     * Used for finding the right documentation.
     */
    type: WidgetTemplateDefinitionType;

    /**
     * Unique within the plugin. Must not contain any dot.
     */
    id: string;

    /**
     * Used for localization right now.
     */
    groupId: string;

    /**
     * Internal usage: pluginID.id
     */
    qualifiedId?: string;

    /**
     * A way to ensure we do not display in the widget chooser templates that cannot
     * be used because the rendering depends on a given theme.
     */
    dependsOnTheme?: string;

    /**
     * No widget box decoration.
     */
    noDecoration?: boolean;

    /**
     * No widget *** box *** header is rendered (the widget content is taking care of it).
     */
    withoutHeader?: boolean;

    /**
     * No title is being edited/rendered.
     */
    withoutTitle?: boolean;
    withoutQuery?: boolean;
    withoutDrilldown?: boolean;
    withoutUserMenu?: boolean;
    renderIfNotInViewport?: boolean;
    renderIfQueryNotExecuted?: boolean;

    withOptionAutoExpand?: boolean;
    withOptionAutoExpandKeepTableHeader?: boolean;

    /**
     * list of useMenuOptions managed by the widget
     */
    userMenuOptions?: string[];
    userMenuOptionsOnEditing?: string[];

    /**
     * TODO -> move this out....
     * Rationale: the pivot-table does not use the tidy table at all.
     */
    withoutTidyTable?: boolean;

    handlesWidgetStatus?: boolean;

    eventRoles?: ITemplateEventActionDef;

    dataMappingMeta?: IWidgetTemplateDataMappingDef[];

    chartOptionsMeta?: FormFieldDef[] | FormFields<FormFieldObject>;

    registerVariants?: (theme: any, manager: IWidgetVariantManager) => void;

    /**
     * A sort of "preview" of the widget in the widget chooser.
     */
    image: string;

    /**
     * lazyLibs (e.g., amCharts4)
     * */
    lazyLibs?: string;

    reactComponent?: boolean;

    /**
     * Allows for a fine grained control of
     */
    selection?: {

        allowedColumns: (column: ITidyColumn) => boolean;

    }
}

/**
 * *********************************************************************************************************************
 *                  DO NOT CHANGE THEIR VALUE : USED FOR FINDING THE DOCUMENTATION.
 * *********************************************************************************************************************
 */
export enum WidgetTemplateDefinitionType {
    Chart = "chart",
    Filter = "filter",
    Map = "map",
    Misc = "misc",
}


export interface IChartVisualizationInput {

    mapping: ChartTemplateDataMapping;
    table: ITidyTable;
    inter: ITidyTableInteraction;

    options: { [key: string]: any };
}

export interface IWidgetTemplateTidyData {

    table: ITidyTable;
    inter: ITidyTableInteraction;

    mapping: ChartTemplateDataMapping;
}


export interface IChartVisualizationTypedInput<T extends FormFieldObject> {

    table: ITidyTable;
    inter: ITidyTableInteraction;
    mapping: ChartTemplateDataMapping;

    options: T;
}

/**
 * The mapping meta describes the coordinate system of the chart (e.g. axis, groups, values).
 * An error occurs when the columns in the mapping do not uniquely identify each row in the table.
 */
export interface IWidgetTemplateDataMappingDef {

    /**
     * The alias for the column.
     */
    mappingName: string;

    /**
     * When defined, adds the mapping options to a group in the widget editor.
     */
    mappingGroup?: string;

    /**
     * When defined, the value is added as a prefix to the fieldPath to defined the localization tag.
     */
    mappingTag?: string;

    /**
     * Only columns of this/these type(s) are allowed.
     */
    allowedTypes: TidyColumnsType[] | ((column: ITidyColumn) => boolean);

    /**
     * If true, fallback to a column that is both an Mdx axis and has a type that is allowed.
     * Note, properties of columns are not considered.
     */
    fallback?: boolean;

    /**
     * A column must be mapped to this alias, either by fallback or by user input.
     * Throw an error of no column is mapped to this alias.
     */
    mandatory?: boolean;

    isForDrilldown?: boolean;
}

/**
 * Predefined roles
 */
export enum TemplateEventActionNames {
    SELECTION = 'Selection',

    // Notifications
    ADD_SELECTION = 'AddSelection',
    FILTER_TO_DEFAULT = 'FilterToDefault',
}

/**
 *
 * Definition of the actions supported by a template
 *
 *
 * ( e.g publish: 'onClick'  )
 */
export interface ITemplateEventActionDef {

    /**
     *  The actions publishing to a channel
     */
    publish?: string[];

    /**
     *  The actions subscribing to a channel  (only new events value are sent, state change)
     */
    subscribe?: string[];

    /**
     *  The actions being notified by a channel  (on each new event generated)
     */
    notify?: string[];

    /**
     * The actions publishing to the 'selection' channel (it's internally managed by TidyTableInteraction)
     */
    selectionPublish?: string;

    /**
     * The actions subscribing to the 'selection' channel
     */
    selectionSubscribe?: string;

}