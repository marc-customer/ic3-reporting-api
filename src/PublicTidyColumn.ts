import {
    AxisCoordinate,
    EntityItem,
    IMdxAxisSeriesInfo,
    ITidyTableSelection,
    MdxInfo,
    SortingType,
    TidyCellError,
    TidyColumnCoordinateUniqueName,
    TidyColumnsType,
} from "./PublicTidyTableTypes";
import {TidyActionEvent} from "./IcEvent";
import {ITidyTable} from "./PublicTidyTable";
import {ReactElement} from "react";
import {ThemeTextFormatter} from "./PublicTheme";

/**
 * Properties with a special meaning
 */
export enum ITidyColumnNamedProperties {

    mdxCellFormattedValue = "formattedValue",
    mdxCellBackColor = "mdxCellBackColor",
    mdxCellForeColor = "mdxCellForeColor",
    mdxCellFormatString = "mdxCellFormatString",
    mdxCellColor = "color",

    /**
     * Column defined to fire events, the name of the event
     */
    eventName = "eventName",

    /**
     * Column defined to fire events, the value of the event (e.g. used in title)
     */
    eventValue = "eventValue",

    /**
     * Column defined to fire events, the mdx value of the event (e.g. used in queries)
     */
    eventMdxValue = "eventMdxValue",

    /**
     * Column defined as an MDX axis, the unique name of the column  (the name is the value of the column)
     */
    uniqueName = "uniqueName",

    /**
     * Column defined as an MDX axis, the caption of the column
     */
    caption = "caption",

    /**
     * Column defined as an MDX axis, the key of the column
     */
    key = "key",

    tooltip = "tooltip",
}

/**
 * A copy from XLSX CellObject (we don't want the link to the library !)
 */
export interface ITidyColumnXlsxCell {
    /** The raw value of the cell.  Can be omitted if a formula is specified */
    v?: string | number | boolean | Date;

    /** Formatted text (if applicable) */
    w?: string;

    /**
     * The Excel Data Type of the cell.
     * b Boolean, n Number, e Error, s String, d Date, z Empty
     */
    t: 'b' | 'n' | 'e' | 's' | 'd' | 'z';

    /** Cell formula (if applicable) */
    f?: string;

    /** Range of enclosing array if formula is array formula (if applicable) */
    F?: string;

    /** Rich text encoding (if applicable) */
    r?: any;

    /** HTML rendering of the rich text (if applicable) */
    h?: string;

    /** Number format string associated with the cell (if requested) */
    z?: string | number;

    /** Cell hyperlink object (.Target holds link, .tooltip is tooltip) */
    l?: {
        /** Target of the link (HREF) */
        Target: string;

        /** Plaintext tooltip to display when mouse is over cell */
        Tooltip?: string;
    };

    /** The style/theme of the cell (if applicable) */
    s?: any;
}

export type AllowedColumnType<T> = TidyColumnsType.UNKNOWN | (T extends string ?
    TidyColumnsType.COLOR | TidyColumnsType.CHARACTER :
    T extends number ? TidyColumnsType.NUMERIC | TidyColumnsType.LATITUDE | TidyColumnsType.LONGITUDE :
        T extends boolean ? TidyColumnsType.LOGICAL :
            T extends number[] ? TidyColumnsType.VECTOR :
                T extends Date ? TidyColumnsType.DATETIME :
                    T extends null ? TidyColumnsType.NULL : TidyColumnsType.MIXED);

/**
 * Base interface for nullable column.
 */
export interface ITidyBaseColumn<T> {

    /**
     * The name of the column.
     */
    name: string;

    /**
     * Create a column.
     * @param name name of the column.
     * @param values values in the column.
     * @param type optional type of the column.
     */

    // constructor(name: string, values: T[], type?: TidyColumnsType);

    /**
     * Returns the name of the column.
     */
    getName(): string;

    /**
     * Set the name of the column.
     * @param name set this as the caption of the column.
     */
    setName(name: string): void;

    /**
     * Returns the caption of the column. The caption is used for displaying localised
     * or custom captions for the axis, header, etc.
     */
    getCaption(): string;

    /**
     * Set the caption of the column. The caption is used for displaying localised
     * or custom captions for the axis, header, etc.
     * @param caption set this as the caption of the column.
     */
    setCaption(caption: string): void;

    /**
     * Get the value of the column at position idx.
     * @param idx the position to return the value of.
     */
    getValue(idx: number): T;

    /**
     * Set the value of a column at a certain index.
     * @param idx row index.
     * @param newValue new value for the column.
     */
    setValue(idx: number, newValue: T): void;

    /**
     * Get cell as expected by xlsx library (do not include the interface as it's lazy loaded !)
     *
     * @param idx the position to return the value of.
     */
    getExcelCell(idx: number): ITidyColumnXlsxCell | undefined;

    /**
     * Get the formatted value of the column at position idx.
     *
     * undefined - if the formatted_value is not available
     * null - if it's empty
     *
     * @param idx the position to return the value of.
     */
    getFormattedValue(idx: number): string | undefined;

    getFormattedValueOrValue(idx: number): string | undefined;

    setNumberFormat(format: ThemeTextFormatter, fv: (value: T | undefined) => string): void;

    setFormattedValues(formatString: string, formattedValues: string[]): void;

    /**
     * Returns the formatter of the column.
     */
    getNumberFormat(): ThemeTextFormatter | undefined;

    getNumberFormatInfo(): string | undefined;

    /**
     * Returns the column values.
     */
    getValues(): Array<T>;

    /**
     * Set the values of this column. Ensure that the length remains the same, if not, an error is thrown.
     * @param values new values of the column.
     */
    setValues<P>(values: P[]): void;

    /**
     * Returns the column internal values object.
     * @deprecated Use {getValues} or {unique} instead.
     * @see {getValues} {unique}
     */
    getInternalValues(): Array<T>;

    /**
     * Return a new column with transformed values.
     * @param fun function with one parameter. Describes the transformation.
     * @param columnName the name of the new column.
     * @param newType new type for the column. Leave blank for auto inference of the type.
     */
    mapToColumn<P>(fun: (value: T, index: number) => P, columnName: string, newType?: AllowedColumnType<P>): ITidyBaseColumn<P>;

    /**
     * Apply a transformation to all values in the column. Note, this functions alters the values in the column.
     * @param fun function with one parameter. Describes the transformation. In the function, index represents the
     * index of the internal data structure.
     * @param newType new type for the column. Leave blank for auto inference of the type.
     */
    apply<P>(fun: (value: T, index: number) => P, newType?: AllowedColumnType<P>): void;

    /**
     * Fill the column with a single value.
     */
    fill<P>(value: P): void;

    /**
     * Get the unique values in this column.
     */
    unique(): T[];

    /**
     * Get the axis values in this column.
     *
     * If it's an MDX Axis, the potentially sorted MDX axis (e.g. pivot table sort)
     *
     * If it's not, return undefined
     */
    mdxAxis(): T[] | undefined;

    /**
     * Returns true if and only if the column has zero rows.
     */
    isEmpty(): boolean;

    /**
     * Returns the length of the value array.
     */
    length(): number;

    /**
     * Sort the values of the column. Edge cases such as NaN and null are sorted to the end of the column.
     * Sort ascending by default.
     */
    sort(order?: SortingType): void;

    /**
     * Get the ranking of the values. Smallest value gets rank 0,
     * second smallest rank 1, etc. until rank n-1. Sort ascending by default.
     * @param order sorting order. Default = ascending.
     */
    getRank(order?: SortingType): number[];

    /**
     * Export the column as a flat object.
     */
    toChartData(): { [key: string]: T }[];

    /**
     * Returns the mdx info at a row index.
     */
    getMdxInfo(idx: number): MdxInfo | undefined;

    isWithEntityItem(): boolean;

    getEntityItem(idx: number): EntityItem | undefined;

    getMdxCoordinates(rowIdx: number): [number, number, number] | [];

    /**
     * Returns true if the column is a hierarchical structure
     */
    isHierarchy(): boolean;

    /**
     * Get the index of the parent. Returns idx if there is no hierarchy.
     * @param idx the index to find the parent of.
     */
    getParentIdx(idx: number): number;

    /**
     * Returns true if the entry at position idx does not have children
     * @param idx the position to check
     */
    isLeaf(idx: number): boolean;

    /**
     * Get the indices of the level 0 children of this node. Returns [] if the
     * column is not a hierarchy.
     * @param idx
     */
    getLeaves(idx: number): number[];

    /**
     * Return the descendants of the node in the hierarchy at the index.
     * Returned set excludes the node itself.
     * @param index
     */
    getDescendants(index: number): number[];

    /**
     * Returns the children of the node in the hierarchy. Excludes the node itself.
     * @param index
     */
    getChildren(index: number): number[];

    /**
     * Return the siblings of the node in the hierarchy at the index.
     * Including the node itself.
     * @param index
     */
    getSiblings(index: number): number[];

    mapAllRows<P>(fun: (index: number) => P): P[];

    /**
     * Map the rows that are visible given a hierarchical axis and an array of boolean values
     * @param expanded an array indicating for each index if it is expanded or not. If it is collapsed, then all
     * children are not visible.
     * @param fun function to apply
     */
    mapVisibleRows<P>(expanded: (rowIdx: number) => boolean, fun: (index: number) => P): P[];

    mapTreeVisibleRows<P extends ReactElement>(expanded: (rowIdx: number) => boolean, fun: (index: number) => P, filter?: (info: MdxInfo) => boolean): P[];

    /**
     * For hierarchical structures de tree depth, starts at zero.
     */
    getLevelDepth(idx: number): number | undefined;

    hasMdxChildren(rowIdx: number): boolean;

    /**
     * Returns a string representation of the coordinate
     */
    getCoordinateUniqueName(rowIdx: number): TidyColumnCoordinateUniqueName;

    /**
     * Returns true if the column has a property of requested type.
     */
    hasProperty(type: TidyColumnsType): boolean;

    /**
     * Returns the property at the specified property coordinate.
     * @param name name of the property.
     */
    getProperty(name: ITidyColumnNamedProperties | string): ITidyUnknownColumn;

    /**
     * Returns the property at the specified property coordinate.
     * @param name name of the property.
     */
    getOptionalProperty(name: ITidyColumnNamedProperties | string): ITidyUnknownColumn | undefined;

    /**
     * Get the value of the property for the given property coordinate and the given row (undefined if the property does not exist)
     * @param name name of the property.
     * @param rowIdx row index for the value to return.
     */
    getPropertyAt(name: ITidyColumnNamedProperties | string, rowIdx: number): any;

    /**
     * Returns true if the column has color property  or is a color column
     *
     */
    hasColorProperty(): boolean;

    /**
     * Returns the color of a cell (if defined).
     *
     * If the column has type 'color', then it returns the cell value. Else it returns the
     * value at rowIdx of the first property with type 'color' (if it is defined).
     */
    getColor(rowIdx: number): string | undefined;

    /**
     * Return available properties for this column as a list of columns.
     */
    getProperties(): ITidyUnknownColumn[];

    /**
     * Return the properties for the column as a table.
     */
    getPropertyTable(): ITidyTable;

    /**
     * Set a table as the properties for this column. Ensure that the row count of the table is equal to the length
     * of the column.
     * @param tableWithProperties table with columns that will become properties of the column.
     */
    setPropertyTable(tableWithProperties: ITidyTable): void;

    /**
     * Return the properties of a column for a given cell index.
     * @param idx row index of cell.
     */
    getPropertiesAt(idx: number): Record<string, any>;

    /**
     * For each row matching the lookup value call func()
     *
     * @param lookupValue
     * @param func  if false, stop the foreach
     */
    forEachMatching(lookupValue: any, func: (rowIdx: number) => void | boolean): void;


    /**
     * Set a property on the column. If the property already exists, it is overwritten.
     * @param property the column to set as a property. Ensure that the lengths are the same.
     */
    setProperty(property: ITidyColumn): void;

    /**
     * Returns first value where callback does not return undefined.
     * @param callback given the row index, outputs a value or undefined.
     */
    findFirst<P>(callback: (idx: number) => P | undefined): P | undefined;

    /**
     * @param column the initial selection as a column
     * @param items the initial selection (name, ...)
     */
    getInitialSelectionRowIndices(column: ITidyColumn | undefined, items: any[]): number[];

    /**
     * The ITidyTableSelection row identifier for the row (uniqueName if it's an MDX like column)
     */
    getSelectionRowIdentifier(idx: number): string;

    /**
     * @param sel  the selection columns
     * @param colIdx  if multiple columns, the colIdx in the selectionColumn for the lookup
     * @param startIdx  if defined, start lookup at this position
     */
    findRowIdxForSelection(sel: ITidyTableSelection, colIdx?: number, startIdx?: number): number | undefined;

    /**
     * If an error occurred in the calculation of cells for a column, then the error can be
     * retrieved using this function.
     * @param idx the row index of the cell to retrieve the error of.
     */
    getError(idx: number): TidyCellError | undefined;

    setErrors(errors: (TidyCellError | undefined)[]): void;

    /**
     * Returns the row index of the first occurrence where the values of this column equals value. Returns undefined
     * if it did not find the value.
     * @param value value to search for.
     */
    getRowIndexOf(value: T): number | undefined;


    /**
     * Apply a function to the groups of unique values in this column
     */
    groupBy(): Map<T, number[]>;

    /**
     * Get the default member of the dimension that the column represents. Returns undefined
     * if the column is not a MDX dimension.
     */
    getHierarchyDefaultMember(): string | undefined;

    /**
     * Get extra information of the MDX axis used for this column, if available.
     */
    getAxisInfo(): IMdxAxisSeriesInfo | undefined;

    /**
     * Get the MDX axis coordinate, if available.
     * @see {AxisCoordinate}
     */
    getAxisCoordinate(): AxisCoordinate | undefined;

    /**
     * For a hierarchical columns returns a a list of transformed colummns  columns as needed by a pivot
     * table like structure
     *
     * (e.g.  a columns with Year, Quarter and Month will be converteded into 3 columns [Year,Quarter,Month])
     *
     * .. still experimental
     *
     * If not, hierarchical, return this
     */
    toFlatColumns(nullValue: any): ITidyUnknownColumn[];

    /**
     * Returns the tree-path for the node, including the node itself.
     * @param rowIdx column index of the node.
     */
    getNodePath(rowIdx: number): number[];

    /**
     * Returns if present an action as defined by the properties of the columns
     */
    getEventAction(rowIdx: number): [string, TidyActionEvent] | undefined;

    /**
     * Insert a column into this column.
     * @param column column to add.
     * @param index insert the column at this index. If undefined, insert at the start of the
     * this column.
     */
    insertColumn(column: ITidyColumn, index?: number): void;

    mapUniqueNames<T>(uniqueNames: string[], mapper: (idx: number) => T | null | undefined): T[];

    /**
     * Apply a new index to the column and its properties.
     *
     * Examples:
     * column.getValues() --> ['a','b','c']
     * column.reIndex([2,1,0]) --> ['c','b','a']
     * column.reIndex([2,2,1]) --> ['c','c','b']
     * column.reIndex([0]) --> ['a']
     * column.reIndex([0,5]) --> ['a',undefined]
     *
     * @param index list of integers.
     */
    reIndex(index: number[], keepingAxisOrder?: boolean): void;

    slice(index: number[]): ITidyBaseColumn<T>;

    /**
     * Repeat the values in the column.
     *
     * Examples:
     * column.getValues() --> ['a','b','c']
     * column.repeat(6,1) --> ['a','b','c','a','b','c']
     * column.repeat(6,2) --> ['a','a','b','b','c','c']
     * column.repeat(12,2) --> ['a','a','b','b','c','c','a','a','b','b','c','c']
     *
     * @param newLength new length of the array.
     * @param repetition how many times to repeat each value.
     */
    repeat(newLength: number, repetition?: number): void;

    /**
     * Function used for value comparison in sorting and ranking. Return a positive number if a > b, a negative
     * number if a < b and 0 otherwise. Add the sorting type if nulls and NaNs should be pushed to the back of the
     * column.
     * @param a value 1
     * @param b value 2
     */
    compare(a: T, b: T): number;

    isNumeric(): this is ITidyNumericColumn;

    isVector(): this is ITidyVectorColumn;

    isDatetime(): this is ITidyDateColumn;

    isCharacter(): this is ITidyCharacterColumn;

    isLogical(): this is ITidyLogicalColumn;

    isColor(): this is ITidyColorColumn;

    /**
     * Convert the column to another type. This modifies the values to be of that type.
     */
    convertToType(type: TidyColumnsType): void;

    /**
     * Change the type of the column. Note, only types that model the values in the column are allowed. For conversion,
     * use {@link convertToType}
     * @param type
     */
    setType(type: AllowedColumnType<T>): void;

    getType(): AllowedColumnType<T>;

    /**
     * Cell decoration
     */
    setCellDecoration(decoration: Partial<PublicTidyColumnCellDecoration>): void;

    getCellDecoration(): Partial<PublicTidyColumnCellDecoration>;

    /**
     * Set a value in the cache of the column.
     */
    setCachedValue(key: string, value: any): void;

    /**
     * Get a value from the columns cache.
     */
    getCachedValue(key: string): any;

    /**
     * Clear the columns cache.
     */
    clearCache(): void;
}

export interface PublicTidyColumnCellDecoration {

    rendered: (rowIdx: number) => React.ReactElement;

    cssStyles: (rowIdx: number) => Record<string, any> | undefined;
}

export type ITidyColumn = ITidyBaseColumn<any>;
export type ITidyUnknownColumn = ITidyBaseColumn<unknown>;
export type ITidyNumericColumn = ITidyBaseColumn<number | null>;
export type ITidyCharacterColumn = ITidyBaseColumn<string | null>;
export type ITidyColorColumn = ITidyBaseColumn<string | null>;
export type ITidyDateColumn = ITidyBaseColumn<Date | null>;
export type ITidyLogicalColumn = ITidyBaseColumn<boolean | null>;
export type ITidyVectorColumn = ITidyBaseColumn<any[] | null>;

/**
 * Introduced for tidy table HTML expression (e.g., tooltip) completion.
 *
 * Quite simple for now: caption (as shown in the completion) to the actual Javascript method.
 */
export interface TidyTableExprColumnMeta {

    caption: string;

    method: string;
    argRow?: boolean;

}

export const TidyTableTextExprColumnMetas: TidyTableExprColumnMeta[] = [

    {caption: "total", method: "sum"},
    {caption: "average", method: "mean"},
    {caption: "median", method: "median"},
    {caption: "min", method: "min"},
    {caption: "max", method: "max"},

    {caption: "percent", method: "percent", argRow: true},

    {caption: "caption", method: "getCaption"},

];

export const TidyTableNumberExprColumnMetas: TidyTableExprColumnMeta[] = [

    {caption: "total", method: "sum"},
    {caption: "average", method: "mean"},
    {caption: "median", method: "median"},
    {caption: "min", method: "min"},
    {caption: "max", method: "max"},

    {caption: "percent", method: "percent", argRow: true},

    // {caption: "caption", method: "getCaption"},

];