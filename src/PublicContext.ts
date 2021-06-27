import {LazyTreeViewProps} from "./LazyTreeView";
import {ITidyTable} from "./PublicTidyTable";
import {ITidyTableTransformation} from "./ITidyTableTransformation";
import {Theme} from "@material-ui/core/styles";
import {ThemeTextFormatter} from "./PublicTheme";
import {ITidyColumn} from "./PublicTidyColumn";

export enum WidgetRenderLayoutStatus {
    RENDERING = "RENDERING",
    RENDERED = "RENDERED",
}

export enum IContentMessageType { info, error}

export interface IPublicContext {

    /**
     * React
     */
    useGoogleMapHook(): boolean | Error;

    getTheme(): Theme;

    getUserName(): string;

    getReportLocale(): string;

    getNumberFormatter(format: ThemeTextFormatter): (value: any | undefined) => string;

    localizeTransformationCaption(template: ITidyTableTransformation<any>): { info: string, description?: string };

    localizeError(name: string, ...args: any[]): string;

    localize(name: string, ...args: any[]): string;

    translateContent(content: string): string;

    /**
     * Not in widget public context because of transformation not applied from a widget context always.
     *
     * @param expression typically coming from a widget field so it cannot be null if there is a default value.
     * To prevent usage of the default, pass an "empty" string that makes this method returns
     * undefined.
     */
    createTableRowTextExprFormatter(field: string, table: ITidyTable, defaultColumn: ITidyColumn | undefined, expression: string | undefined): ((rowIdx: number) => string) | undefined;

    /**
     * Not in widget public context because of transformation not applied from a widget context always.
     *
     * @param expression typically coming from a widget field so it cannot be null if there is a default value.
     * To prevent usage of the default, pass an "empty" string that makes this method returns
     * undefined.
     */
    createTableTextExprFormatter(field: string, table: ITidyTable, defaultColumn: ITidyColumn | undefined, expression: string | undefined): (() => string) | undefined;

    /**
     * Not in widget public context because of transformation not applied from a widget context always.
     *
     * @param expression typically coming from a widget field so it cannot be null if there is a default value.
     * To prevent usage of the default, pass an "empty" string that makes this method returns
     * undefined.
     */
    createTableRowHtmlExprFormatter(field: string, table: ITidyTable, defaultColumn: ITidyColumn | undefined, expression: string | undefined): ((rowIdx: number) => string) | undefined;

    /**
     * Not in widget public context because of transformation not applied from a widget context always.
     *
     * @param expression typically coming from a widget field so it cannot be null if there is a default value.
     * To prevent usage of the default, pass an "empty" string that makes this method returns
     * undefined.
     */
    createTableHtmlExprFormatter(field: string, table: ITidyTable, defaultColumn: ITidyColumn | undefined, expression: string | undefined): (() => string) | undefined;

    /**
     * Not in widget public context because of transformation not applied from a widget context always.
     *
     * @param expression typically coming from a widget field so it cannot be null if there is a default value.
     * To prevent usage of the default, pass an "empty" string that makes this method returns
     * undefined.
     */
    createTableRowNumericExpr(field: string, table: ITidyTable, defaultColumn: ITidyColumn | undefined, expression: string | undefined): ((rowIdx: number) => number | undefined) | undefined;

    /**
     * Not in widget public context because of transformation not applied from a widget context always.
     *
     * @param expression typically coming from a widget field so it cannot be null if there is a default value.
     * To prevent usage of the default, pass an "empty" string that makes this method returns
     * undefined.
     */
    createTableNumericExpr(field: string, table: ITidyTable, defaultColumn: ITidyColumn | undefined, expression: string | undefined): (() => number | undefined) | undefined;


}

export interface IWidgetPublicContext extends IPublicContext {

    onWidgetRenderStatusChange(status: WidgetRenderLayoutStatus): void;

    getNsId(): string;

    getWidgetId(): string;

    getTemplateId(): string;

    getWidgetPageId(): string;

    renderWidgetContentMessage(type: IContentMessageType, message: string): any;

    renderLazyTreeView<T>(props: LazyTreeViewProps): T;

    formatDate(value: Date | string | undefined | null, format: ThemeTextFormatter | null | undefined, locale?: string): string;

    formatNumber(value: number | string | undefined | null, format: ThemeTextFormatter | null | undefined, locale?: string): string;

    /**
     * A shortcut for formatNumber( theme.formatter.defaultNumber )
     */
    formatAmount(value: number | string | undefined | null, locale?: string): string;

    /**
     * A shortcut for formatNumber( theme.formatter.defaultPercent )
     */
    formatPercent(value: number | string | undefined | null, locale?: string): string;


    wrapWithTooltip(tooltip: string | undefined, wrappedElement: React.ReactElement): React.ReactElement;

    /**
     * Allows to setup a template specific callback on userMenuAction (e.g. setZoom in GoogleMaps action)
     *
     * if the callback returns an object, the object should contains a record with new values for the
     * template form fields, FormFieldDef (i.e.  {zoom:14} to set the zoom to 14). If in editing mode,
     * the edited options in the widget editor panel will be updated.
     */
    onUserMenuAction(userMenuAction: string, callback: (event: any) => Record<string, any> | undefined): void;
}

export interface IWidgetEditorPublicContext {

    /**
     * The variants available in the theme for the edited widget.
     */
    getWidgetVariantIds(): string[];

}