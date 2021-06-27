import {IWidgetEditorPublicContext} from "./PublicContext";
import {ITidyColumn} from "./PublicTidyColumn";
import * as React from "react";
import {
    AutocompleteRenderInputParams,
    AutocompleteRenderOptionState
} from "@material-ui/core/Autocomplete/Autocomplete";


export function formFieldIsSelection(field: IFormFieldDef<any>) {
    return field.group === IFormFieldGroupTypes.Selection;
}

export enum IFormFieldGroupTypes {
    Selection = 'selection',
    FilterGeneralOption = 'filterGeneralOptionsGroup',
    FilterItem = 'filterItemGroup',
}

export type FormFieldType =
    |
    /**
     * @see IFormReportPathFieldDef
     */
    "appPath" |
    /**
     * @see IFormAutocompleteFieldDef
     */
    "autocomplete" |
    /**
     * @see IFormBooleanFieldDef
     */
    "boolean" |
    /**
     * @see IFormColorEditorFieldDef
     */
    "color" |
    /**
     * @see IFormColumnCoordinateFieldDef
     */
    "columnCoordinate" |
    /**
     * @see IFormColumnSelectionFieldDef
     */
    "columnSelection" |
    /**
     * @see IFormArrayStringRecordsFieldDef
     */
    "eventMappingArray" |
    /**
     * @see IFormEmbeddedFieldDef
     */
    "embedded" |
    /**
     * @see IFormFileUploaderFieldDef
     */
    "fileUploader" |
    /**
     * @see IFormBooleanFieldDef
     */
    "groupBoolean" |
    /**
     * @see IFormGroupsFieldDef
     */
    "groups" |
    /**
     * @see IFormJsFieldDef
     */
    "js" |
    /**
     * @see IFormMarkdownFieldDef
     */
    "markdown" |
    /**
     * @see IFormMdxFieldDef
     */
    "mdxExpression" |
    /**
     * @see IFormMuiVariantFieldDef
     */
    "muiVariant" |
    /**
     * @see IFormNumberFieldDef
     */
    "number" |
    /**
     * @see IFormOptionFieldDef
     */
    "option" |
    /**
     * @see IFormColorEditorFieldDef
     */
    "palette" |
    /**
     * @see IFormReportPathFieldDef
     */
    "reportFolder" |
    /**
     * @see IFormReportPathFieldDef
     */
    "reportPath" |
    /**
     * @see IFormReportPermaLinkFieldDef
     */
    "reportPermaLink" |
    /**
     * @see IFormStringFieldDef
     */
    "string" |
    /**
     * @see IFormTidyTableHtmlExprFieldDef
     */
    "tidyTableHtmlExpr" |
    /**
     * @see IFormTidyTableHtmlRowExprFieldDef
     */
    "tidyTableHtmlRowExpr" |
    /**
     * @see IFormTidyTableNumericExprFieldDef
     */
    "tidyTableNumericExpr" |
    /**
     * @see IFormTidyTableNumericRowExprFieldDef
     */
    "tidyTableNumericRowExpr" |
    /**
     * @see IFormTidyTableScaleRowExprFieldDef
     */
    "tidyTableScaleRowExpr" |
    /**
     * @see IFormTidyTableTextExprFieldDef
     */
    "tidyTableTextExpr" |
    /**
     * @see IFormTidyTableTextRowExprFieldDef
     */
    "tidyTableTextRowExpr" |
    /**
     * @see IFormWidgetVariantFieldDef
     */
    "widgetVariant"
    ;

export type FormFieldTidyTableExprType =
    "tidyTableHtmlExpr" |
    "tidyTableHtmlRowExpr" |
    "tidyTableNumericExpr" |
    "tidyTableNumericRowExpr" |
    "tidyTableScaleRowExpr" |
    "tidyTableTextExpr" |
    "tidyTableTextRowExpr"
    ;

export function isTidyTableExpr(type: FormFieldType): type is FormFieldTidyTableExprType {
    return type === "tidyTableHtmlExpr"
        || type === "tidyTableHtmlRowExpr"
        || type === "tidyTableTextExpr"
        || type === "tidyTableTextRowExpr"
        || type === "tidyTableNumericExpr"
        || type === "tidyTableNumericRowExpr"
        || type === "tidyTableScaleRowExpr"
        ;
}

export function isTidyTableExprTable(type: FormFieldType) {
    return type === "tidyTableHtmlExpr"
        || type === "tidyTableTextExpr"
        || type === "tidyTableNumericExpr"
        ;
}

export function isTidyTableExprRow(type: FormFieldType) {
    return type === "tidyTableHtmlRowExpr"
        || type === "tidyTableTextRowExpr"
        || type === "tidyTableNumericRowExpr"
        || type === "tidyTableScaleRowExpr"
        ;
}

export function isTidyTableExprText(type: FormFieldType) {
    return type === "tidyTableHtmlExpr"
        || type === "tidyTableHtmlRowExpr"
        || type === "tidyTableTextExpr"
        || type === "tidyTableTextRowExpr"
        ;
}

export function isTidyTableExprTextHtml(type: FormFieldType) {
    return type === "tidyTableHtmlExpr"
        || type === "tidyTableHtmlRowExpr"
        ;
}

export function isTidyTableExprNumeric(type: FormFieldType) {
    return type === "tidyTableNumericExpr"
        || type === "tidyTableNumericRowExpr"
        ;
}

export function isTidyTableExprScale(type: FormFieldType) {
    return type === "tidyTableScaleRowExpr"
        ;
}

export interface IFormFieldDef<VALUE_TYPE> {

    /**
     * The path of the field within the edited bean.
     */
    fieldPath: string;

    /**
     * The default value defined at field level (note: can be defined at Theme level as well).
     */
    defaultValue?: VALUE_TYPE;

    /**
     * Override fieldPath to search for a default value in the Theme.
     */
    defaultValuePath?: string;

    /**
     * The optional group a field belongs too
     */
    group?: string;

    /**
     * When defined, the value is added as a prefix to the fieldPath to defined the localization tag.
     */
    fieldPrefixTag?: IFormFieldGroupTypes | string;

    /**
     * When defined, this tag is used for localization
     */
    localizationTag?: string;

    /**
     * Default: "string".
     */
    fieldType: FormFieldType;

    /**
     * Override default localization.
     */
    fieldDescription?: string;

    /**
     * Default: false
     */
    mandatory?: boolean;

    /**
     * Default: false
     */
    readOnly?: boolean;

    /**
     * An optional field path value. The value of this field depends on the value of the dependsOn field.
     */
    dependsOn?: string;

    /**
     * When defined a function that returns the visibility of the field according to the dependsOn value.
     */
    dependsOnVisibility?: boolean | ((dependsOnValue?: any) => boolean);

    /**
     * When defined a function that returns the visibility of the field.
     */
    visibility?: boolean | ((context: IWidgetEditorPublicContext) => boolean);

    /**
     * When defined the content of the field is translated (using context.translateContent).
     */
    translated?: boolean;

}

/**
 * Error messages for field suggestions and value candidates.
 * Put translations in ReportLocalization.csv.
 */
export enum AutocompleteNoOptionsText {
    NO_OPTIONS = "NO_OPTIONS",
    NO_QUERY_RESULT = "NO_QUERY_RESULT",
}

export type CodeMirrorMode =
    "plain" |
    "mdx" |
    "sql" |
    "js" |
    "csv" |
    "md" |
    FormFieldTidyTableExprType
    ;

export function isCodeMirrorModeExpr(mode: CodeMirrorMode) {
    return mode === "tidyTableHtmlExpr"
        || mode === "tidyTableHtmlRowExpr"
        || mode === "tidyTableTextExpr"
        || mode === "tidyTableTextRowExpr"
        || mode === "tidyTableNumericExpr"
        || mode === "tidyTableNumericRowExpr"
        || mode === "tidyTableScaleRowExpr"
        ;
}

export type FormFieldDialogEditorModelType =
    "unknown" |
    "markdown" |
    FormFieldTidyTableExprType
    ;

export interface IColorDef {

    /**
     * aka. name
     */
    path: string;

}

export interface IPaletteDef {

    /**
     * aka. name
     */
    path: string;

    reversed: boolean;

}

export interface IOption {

    id: string;
    caption: string;

}

/**
 * A generic object.
 *
 * Use the editorConf to provide the list of options to choose from and the function that is displaying
 * the label/caption of the options. Check the editorConf for more configuration.
 *
 * This is quite a generic editor that should not be used directly.
 *
 * @see FormFieldDef
 */
export interface IFormAutocompleteFieldDef<OPTION> extends IFormFieldDef<OPTION> {

    fieldType: "autocomplete",

    editorConf: {

        multiple?: boolean;
        groupBy?: (option: OPTION | undefined) => string;
        getOptionLabel?: (option: OPTION | undefined | null) => string;
        isOptionEqualToValue?: (option: OPTION | undefined | null, value: OPTION | undefined | null) => boolean;

        freeSolo?: boolean;

        optionValues?: OPTION[] | ((callback: ((suggestions: OPTION[]) => void), dependsOnValue?: any) => void);
        optionValuesObsolete?: boolean;
        optionValuesObsoleteMessage?: string;

        noOptionsText?: AutocompleteNoOptionsText;

        renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode;

        renderOption?: (
            props: React.HTMLAttributes<HTMLLIElement>,
            option: OPTION,
            state: AutocompleteRenderOptionState,
            onClose: () => void
        ) => React.ReactNode;

    }
}

/**
 * @see FormFieldDef
 */
export interface IFormBooleanFieldDef extends IFormFieldDef<boolean> {

    fieldType: "boolean" | "groupBoolean",

}

/**
 * @see FormFieldDef
 */
export interface IFormColorEditorFieldDef extends IFormFieldDef<IColorDef> {

    fieldType: "color",

}

/**
 * @see FormFieldDef
 */
export interface IFormColumnCoordinateFieldDef extends IFormFieldDef<any> {

    fieldType: "columnCoordinate",

    editorConf?: {

        multiple?: boolean;
        allowDuplicate?: boolean;
        allowedTypes?: (column: ITidyColumn) => boolean;
        includeProperties?: boolean;

    }

}

/**
 * @see FormFieldDef
 */
export interface IFormColumnSelectionFieldDef extends IFormFieldDef<any> {

    fieldType: "columnSelection",

    editorConf: {

        columnAlias: string;
        multiple?: boolean;

    }

}

/**
 * @see FormFieldDef
 */
export interface IFormEventMappingArrayFieldDef extends IFormFieldDef<any> {

    fieldType: "eventMappingArray",

}

/**
 * Contains the ordering of the groups.
 *
 * @see FormFieldDef
 */
export interface IFormGroupsFieldDef extends IFormFieldDef<string[]> {

    fieldType: "groups",
    groups: string[];

}

/**
 * @see FormFieldDef
 */
export interface IFormJsFieldDef extends IFormFieldDef<string> {

    fieldType: "js",

}

/**
 * @see FormFieldDef
 */
export interface IFormFileUploaderFieldDef extends IFormFieldDef<any> {

    fieldType: "fileUploader",

    editorConf: {

        acceptedFileExt?: string;
        dropMessage: string;

    }

}

/**
 * @see FormFieldDef
 */
export interface IFormMarkdownFieldDef extends IFormFieldDef<string> {

    fieldType: "markdown",

}

/**
 * @see FormFieldDef
 */
export interface IFormMdxFieldDef extends IFormFieldDef<string> {

    fieldType: "mdxExpression",

}

/**
 * Material-UI variants (defined in the theme's components).
 *
 * @see FormFieldDef
 */
export interface IFormMuiVariantFieldDef extends IFormFieldDef<string> {

    fieldType: "muiVariant",

    editorConf: {

        componentName: string;

    }

}

/**
 * @see FormFieldDef
 */
export interface IFormNumberFieldDef extends IFormFieldDef<number> {

    fieldType: "number",

}

/**
 * A string that is chosen from the list of available values (aka. options).
 *
 * Typically used to edit an "enum" where the user can select the value from a list of "localized" options.
 * The editorConf is setup as following:
 * <pre>
 *      editorConf: {
 *          optionValues: Object.values(SortingType),
 *          optionName: "SortingType"                    -- localization purpose
 *      }
 * </pre>
 *
 * This editor is not limited to enum as the editorConf.optionValues is accepting a function resolving the
 * actual list of options as an array of {id,caption} objects. E.g., editing a locale, theme, etc...
 *
 * Editing a list of strings is supported using the editorConf.multiple flag.
 *
 * @see FormFieldDef
 */
export interface IFormOptionFieldDef extends IFormFieldDef<any> {

    fieldType: "option",

    editorConf: {

        freeSolo?: boolean;

        multiple?: boolean;
        allowDuplicate?: boolean;

        optionValues?: string[] | IOption[] | ((callback: ((suggestions: string[] | IOption[]) => void), dependsOnValue?: any) => void);
        optionName?: string;

        getCaption?: (id: string) => string;
    }

}

export interface IFormEmbeddedFieldDef<T extends FormFieldObject> extends IFormFieldDef<T> {

    fieldType: "embedded",

    editorConf: {

        meta: FormFields<T>[];

    }

}

/**
 * @see FormFieldDef
 */
export interface IFormPaletteEditorFieldDef extends IFormFieldDef<IPaletteDef> {

    fieldType: "palette",

}

/**
 * @see FormFieldDef
 */
export interface IFormReportPathFieldDef extends IFormFieldDef<string> {

    fieldType: "appPath" | "reportFolder" | "reportPath",

}

/**
 * @see FormFieldDef
 */
export interface IFormReportPermaLinkFieldDef extends IFormFieldDef<string> {

    fieldType: "reportPermaLink",

}

/**
 * Use editorConf.suggestions to provide a list of possible values. Then the editor is an autocomplete
 * displaying the suggestions using the freeSolo mode to enter any kind of value.
 *
 * @see FormFieldDef
 */
export interface IFormStringFieldDef extends IFormFieldDef<string> {

    fieldType: "string",

    editorConf?: {

        /**
         * A list of possible strings...
         */
        suggestions?: string[] | ((callback: ((candidates: string[]) => void), dependsOnValue?: any) => void);

    }

}

/**
 * An HTML (markdown) text expression containing tidy table value accessor (e.g., Donut's center text).
 * The evaluation context is the table.
 *
 * @see FormFieldDef
 */
export interface IFormTidyTableHtmlExprFieldDef extends IFormFieldDef<string> {

    fieldType: "tidyTableHtmlExpr",

    editorConf?: {
        defaultColumn?: boolean,
    },

}

/**
 * An HTML (markdown) text expression containing tidy table value accessor (e.g., chart's tooltip).
 * The evaluation context is a row.
 *
 * @see FormFieldDef
 */
export interface IFormTidyTableHtmlRowExprFieldDef extends IFormFieldDef<string> {

    fieldType: "tidyTableHtmlRowExpr",

    editorConf?: {
        defaultColumn?: boolean,
    },

}

/**
 * A numeric expression containing tidy table value accessor (e.g., chart's value axis minimum).
 * The evaluation context is the table.
 *
 * @see FormFieldDef
 */
export interface IFormTidyTableNumericExprFieldDef extends IFormFieldDef<string> {

    fieldType: "tidyTableNumericExpr",

    editorConf?: {
        defaultColumn?: boolean,
    },

}

/**
 * A numeric expression containing tidy table value accessor (e.g., chart's value axis minimum).
 * The evaluation context is a row.
 *
 * @see FormFieldDef
 */
export interface IFormTidyTableNumericRowExprFieldDef extends IFormFieldDef<string> {

    fieldType: "tidyTableNumericRowExpr",

    editorConf?: {
        defaultColumn?: boolean,
    },

}

/**
 * A numeric expression containing tidy table value accessor (e.g., chart's value axis minimum).
 * The evaluation context is a row.
 *
 * @see FormFieldDef
 */
export interface IFormTidyTableScaleRowExprFieldDef extends IFormFieldDef<string> {

    fieldType: "tidyTableScaleRowExpr",

    editorConf?: {
        defaultColumn?: boolean,
    },

}

/**
 * A text expression containing tidy table value accessor (e.g., Donut's center text).
 * The evaluation context is the table.
 *
 * @see FormFieldDef
 */
export interface IFormTidyTableTextExprFieldDef extends IFormFieldDef<string> {

    fieldType: "tidyTableTextExpr",

    editorConf?: {
        defaultColumn?: boolean,
    },

}

/**
 * A text expression containing tidy table value accessor (e.g., cell renderer link).
 * The evaluation context is a row.
 *
 * @see FormFieldDef
 */
export interface IFormTidyTableTextRowExprFieldDef extends IFormFieldDef<string> {

    fieldType: "tidyTableTextRowExpr",

    editorConf?: {
        defaultColumn?: boolean,
    },

}

/**
 * icCube variants (defined in the theme's ic3.widgetVariants).
 *
 * @see FormFieldDef
 */
export interface IFormWidgetVariantFieldDef extends IFormFieldDef<string> {

    fieldType: "widgetVariant",

}

export function formFieldsFilter(formFields: FormFieldDef[] | FormFields<FormFieldObject> | undefined, filter: (field: FormFieldDef) => boolean): FormFieldDef[] {
    if (formFields == null)
        return [];
    if (Array.isArray(formFields)) {
        return formFields.filter(filter)
    }

    // TODO .. garbage
    const fields: FormFieldDef[] = [];
    for (const key in formFields as FormFields<FormFieldObject>) {
        fields.push({...{fieldPath: key}, ...formFields[key]})
    }

    return fields.filter(filter);
}

export function formFieldsForEach(formFields: FormFieldDef[] | FormFields<FormFieldObject> | undefined, callback: (field: FormFieldDef) => void): void {
    if (formFields == null)
        return;
    if (Array.isArray(formFields)) {
        return formFields.forEach(callback)
    }

    // TODO .. garbage
    for (const key in formFields as FormFields<FormFieldObject>) {
        callback({...{fieldPath: key}, ...formFields[key]})
    }
}

export interface FormFieldObject {

}


export type FormFields<T extends FormFieldObject> = {
    [key in keyof T]-?:   // make the key mandatory even though the field is optional
    (
        // defaultValue mandatory if the field is non nullable in T
        undefined extends NonNullable<T>[key] ? { defaultValue?: any } : { defaultValue: unknown }
        )
    &
    (
        // matching T type with FormField type
        Required<T>[key] extends boolean ? Omit<IFormBooleanFieldDef, 'fieldPath'> :
            Required<T>[key] extends number ? Omit<IFormNumberFieldDef, 'fieldPath'> :
                Required<T>[key] extends string ? Omit<IFormStringFieldDef, 'fieldPath'> :
                    Required<T>[key] extends string[] ? Omit<IFormOptionFieldDef, 'fieldPath'> | Omit<IFormPaletteEditorFieldDef, 'fieldPath'> :
                        Required<T>[key] extends FormFieldObject ? Omit<IFormEmbeddedFieldDef<Required<T>[key]>, 'fieldPath'> :
                            never /* type not supported */
        )
};


// ---------------------------------------------------------------------------------------------------------------------
//      Allows for typing the field meta definitions.
// ---------------------------------------------------------------------------------------------------------------------

export type FormFieldDef =
    IFormAutocompleteFieldDef<any> |
    IFormBooleanFieldDef |
    IFormColorEditorFieldDef |
    IFormColumnCoordinateFieldDef |
    IFormColumnSelectionFieldDef |
    IFormEventMappingArrayFieldDef |
    IFormFileUploaderFieldDef |
    IFormGroupsFieldDef |
    IFormJsFieldDef |
    IFormMarkdownFieldDef |
    IFormMdxFieldDef |
    IFormMuiVariantFieldDef |
    IFormNumberFieldDef |
    IFormOptionFieldDef |
    IFormPaletteEditorFieldDef |
    IFormReportPathFieldDef |
    IFormReportPermaLinkFieldDef |
    IFormStringFieldDef |
    IFormTidyTableHtmlExprFieldDef |
    IFormTidyTableHtmlRowExprFieldDef |
    IFormTidyTableNumericExprFieldDef |
    IFormTidyTableNumericRowExprFieldDef |
    IFormTidyTableScaleRowExprFieldDef |
    IFormTidyTableTextExprFieldDef |
    IFormTidyTableTextRowExprFieldDef |
    IFormWidgetVariantFieldDef
    ;


export function createGroupsMeta(groups: string[]): IFormGroupsFieldDef {
    return {
        fieldType: "groups",
        groups: groups,
        fieldPath: ""
    };
}