import {
    AxisCoordinate,
    EntityItem,
    IAmCharts4Data,
    IAmCharts4DataTreeMap,
    ITidyRow,
    SortingType,
    TidyColumnsType,
    TidyTableMappingCoordinate
} from "./PublicTidyTableTypes";
import {
    AllowedColumnType,
    ITidyBaseColumn,
    ITidyCharacterColumn,
    ITidyColumn,
    ITidyDateColumn,
    ITidyNumericColumn,
    ITidyUnknownColumn
} from "./PublicTidyColumn";
import {TidyTree} from "./PublicTidyTree";

export type ITidyTableType = "data" | "properties";


/**
 * Result of a MDX, SQL, ... query with additional transformations (e.g., colors, sizes, changing MDX names,...).
 * A tidy table has axes and measures. The axes describe the coordinates for each measure.
 * The columns of a tidy table are thus structured as follows: columns = axes + measures.
 *
 * For example:
 * axes         | measures
 * Brand | Year | Size (m)
 * Volvo | 2018 | 234
 * MBW   | 2019 | 456
 *
 * In this chart the Brand and Year columns are axes and Size (m) is the measure.
 * The columns of this table are Brand, Year, Size (m).
 */
export interface ITidyTable {

    // constructor(columns?: ITidyColumn, rowCount?: number);

    getType(): ITidyTableType;

    getQueryUid(): number;

    asPivotTableForExcel(nullValue: any): ITidyTable;

    /**
     * Return all columns in the table
     */
    getColumns(): ITidyColumn[];

    /**
     * Get the number of rows.
     */
    getRowCount(): number;

    /**
     * Set the number of rows.
     * @deprecated
     */
    setRowCount(count: number): void;

    /**
     * Get the number of columns.
     */
    getColumnCount(): number;

    /**
     * Columns getters without mapping
     * @deprecated
     * @see {getOptionalColumnByType}
     *
     */
    getAxisN(axisPosition: number): ITidyCharacterColumn;

    /**
     * @deprecated
     * @see {getOptionalColumnByType}
     */
    getOptionalAxisN(axisPosition: number): ITidyCharacterColumn | undefined;

    /**
     * @deprecated
     * @see {getOptionalColumnByType}
     * @param axisPosition
     */
    getMeasureN(axisPosition: number): ITidyNumericColumn;

    /**
     * @deprecated
     * @see {getOptionalColumnByType}
     * @param axisPosition
     */
    getOptionalMeasureN(axisPosition: number): ITidyNumericColumn | undefined;

    /**
     * Returns the column at the index.
     * @param index index of column.
     */
    getColumnN(index: number): ITidyUnknownColumn;

    /**
     * @see {getColumnN}
     */
    getOptionalColumnN(index: number): ITidyUnknownColumn | undefined;

    /**
     * Returns the first column with name. If no column is found, it gives an error.
     * @param name name of the column.
     */
    getColumn(name: string): ITidyUnknownColumn;

    /**
     * @see {getColumn}
     */
    getOptionalColumn(name: string): ITidyUnknownColumn | undefined;

    /**
     * Column getters with mapping defined, throws an error if the column is not found.
     *
     * The idea is then to have a function: getColumnByAlias that requests mapping name.
     * The widget can check for if the mapping is undefined or not. If it is defined,
     * it will result in a column (which can be empty). If it is undefined it will try to
     * fallback to another column that has the mapping specification.
     *
     * @param alias mapping name
     */
    getColumnByAlias(alias: string): ITidyUnknownColumn;

    /**
     * @see {getColumnByAlias}
     */
    getOptionalColumnByAlias(alias: string): ITidyUnknownColumn | undefined;

    /**
     * Get a column using the coordinate from a 'columnCoordinate' option field.
     * @param coordinate coordinate to the column or property.
     */
    getColumnByCoordinate(coordinate: TidyTableMappingCoordinate | undefined): ITidyUnknownColumn | undefined;

    /**
     * Get a column using the coordinate of an axis.
     * @param coordinate
     * @see {AxisCoordinate}
     */
    getColumnByMdxAxis(coordinate: AxisCoordinate): ITidyUnknownColumn | undefined;

    /**
     * Get the number of MDX axis.
     */
    getMdxAxisCount(): number;

    /**
     * Get a numeric column from the alias.
     * @param alias name in the mapping meta.
     * @see {getColumnByAlias}
     * @deprecated Use getColumnByAlias and test if the result is a numeric. The error from this function is not localized.
     */
    getNumericColumnByAlias(alias: string): ITidyNumericColumn;

    /**
     * @see {getNumericColumnByAlias}
     * @see {getColumnByAlias}
     * @deprecated Use getOptionalColumnByAlias and test if the result is a numeric. The error from this function is not localized.
     */
    getOptionalNumericColumnByAlias(alias: string): ITidyNumericColumn | undefined;

    getColumnForTextFormatter(nameOrAlias: string): ITidyUnknownColumn | undefined;

    /**
     * Get the first n rows of the table. Returns a new table.
     * @param n number of rows to return, default = 10;
     */
    head(n?: number): ITidyTable;

    /**
     * Convert the tidy table to an array of arrays.
     * @param major the major-ordering of the arrays. If 'column', the result is an array of columns. If 'row', the
     * result is an array of rows. The default is 'row'.
     */
    toArray(major?: 'row' | 'column'): any[][];

    /**
     * Get the alias names of the tidy table.
     */
    getAliasNames(): string[];

    /**
     * Get the column names of the tidy table.
     */
    getColumnNames(): string[];

    /**
     * Get the column which is of type classId and at position. Examples,
     * getColumnByClassAndIdx("COLOR", 0) would give the first column of class COLOR
     * getColumnByClassAndIdx("COLOR", 1) would give the second column of class COLOR
     * getColumnByClassAndIdx("Axis", 1) would give the first column of class Axis
     * @param type the column class to look for
     * @param position get the nth column of type. Default = 0.
     */
    getColumnByType(type: TidyColumnsType, position?: number): ITidyUnknownColumn;

    /**
     * @see {getColumnByType}
     */
    getOptionalColumnByType(type: TidyColumnsType, position?: number): ITidyUnknownColumn | undefined;

    getColumnTypes(): TidyColumnsType[];

    lookupColumnIdx(axis?: ITidyColumn): number;

    /**
     * Return a single row from the table.
     * @param rowIdx the row number to query.
     */
    getRow(rowIdx: number): ITidyRow;

    /**
     * Returns the value of the cell. Does not search properties.
     * @param columnName name of the column in the table
     * @param row row of the table
     */
    getValue(columnName: string, row: number): any;

    /**
     * Apply a mapper function to each row. Returns a list with length equal to the number of rows in the table.
     * @param mapper the function to use.
     */
    mapRows<T>(mapper: (rowIdx: number, rowData: (colIdx: number) => any, colCount: number) => T): T[];

    /**
     * Map the columns of the table, resulting in a list with length equal to the number of columns.
     * @param mapper
     */
    mapColumns<T>(mapper: (colIdx: ITidyColumn, colData: (rowIdx: number) => any, rowCount: number) => T): T[];

    getEntityItem(colIdx: number, rowIdx: number): EntityItem | undefined;

    getMdxCoordinates(colIdx: number, rowIdx: number): [number, number, number] | [];

    /**
     * Take the sum of the column, but if it is a hierarchical column only the sum at the root level will be
     * calculated
     * @param axisColIdx the (hierarchical) axis
     * @param measureColIdx measures to take the sum of
     */
    sumRoot(axisColIdx: number, measureColIdx: number): number;

    /**
     * Check if there is a one to many relation from name1 to name2.
     * @param column1 name of first column.
     * @param column2 name of second column.
     */
    oneToManyRelation(column1: string, column2: string): boolean;

    /**
     * build a tidy tree where the levels are defined by the treeLevels parameter, using
     * the column values for creating unique tree nodes.
     *
     *  ColA   |  ColB  | Value
     *  Europe   Bike     1
     *  Europe   Car      2
     *  America  Foot     4
     *
     * is transformed into :
     *
     * root
     *  |
     *  --- Europe
     *  |     |
     *  |     --- Bike  1
     *  |     |
     *  |     --- Car   2
     *  |
     *  --- America
     *       |
     *       --- Foot   4
     *
     * The values of the measures are added to the leafs unless expandHierarchicalColumn is true.
     *
     *
     * @param treeColumns  columns to build the levels
     * @param measures     measures to be attached to nodes (leafs)
     * @param rootLabel    the label of the root
     * @param expandHierarchicalColumn  if true, hierarchical columns will be expanded as a tree (all nodes except the root one will have measures values)
     */
    buildTidyTree(treeColumns: ITidyColumn[], measures: ITidyColumn[], rootLabel?: string, expandHierarchicalColumn?: boolean): TidyTree;

    /**
     * Construct list of tidy tables
     * @param columns groupIdx and groupRows for each unique value in this(ese) column(s)
     * @returns an map with indexes for each group.
     */
    groupBy(columns: ITidyColumn[]): Map<string, number[]>;

    /**
     * For each row matching values the lookup value call func()
     *
     * @param columns
     * @param values
     * @param func  if false, stop the foreach
     */
    forEachMatching(columns: ITidyColumn[], values: any[], func: (rowIdx: number) => void | boolean): void;

    /**
     * Pivot a tidy table from wide to long format. See https://pandas.pydata.org/docs/reference/api/pandas.melt.html.
     * @param columns columns to melt.
     * @param namesCaption name of the column to which the variable name are melted.
     * @param valuesCaption name of the column to which the values are melted.
     */
    melt(columns: ITidyColumn[], namesCaption?: string, valuesCaption?: string): void;

    /**
     * Sort the table based on the certain columns. Default sorting is descending.
     * @param columns column(s) used for sorting. Columns earlier in the list take priority over columns with
     * higher indexes in determining the order.
     * @param order sorting order. Default = descending.
     */
    sort(columns: ITidyColumn[], order?: SortingType[]): void;

    /**
     * Get the ranking of one or more columns. Smallest value gets rank 0,
     * second smallest rank 1, etc. until rank n-1. Sort ascending by default.
     * @param columns columns used for finding the order. Columns earlier in the list take priority over columns with
     * higher indexes in determining the order.
     * @param order sorting order. Default = ascending.
     */
    getRank(columns: ITidyColumn[], order?: SortingType[]): number[];

    /**
     * Add a new column to the table. If the column name already exits, a new name is generated.
     * If the column is already in the table, nothing is done.
     * @param column
     */
    addColumn(column: ITidyColumn): void;

    /**
     * Convert the tidy table to a data object that can be used by amCharts.
     * Note, duplicated rows in 'group' are skipped.
     *
     * See the tests for examples.
     *
     * @param category the column with labels for the category axis.
     * @param value this is an object with columns. Each column is converted to <group>.<key> = <column-value>.
     * @param group column indicating the groups. Each unique value in this column forms a new group. Groups in
     * the resulting data object are given by '<group_id>.' preceding the values.
     * @param level this column expands the axis so that widgets can plot level-like charts using guides. This expansion
     * follows the patters axis-label[level-label].
     */
    toAmcharts4Data<F extends string>(category: ITidyColumn, value: Record<F, ITidyColumn | undefined>, group?: ITidyColumn, level?: ITidyColumn): IAmCharts4Data[];

    /**
     * Creates a data object for the Amcharts treemap.
     * @param value values to use in the node data.
     * @param level0 names for the parent nodes.
     * @param level1 names for the child nodes.
     */
    toAmcharts4DataTreeMap(value: Record<string, ITidyColumn | undefined>, level0: ITidyColumn, level1: ITidyColumn): IAmCharts4DataTreeMap[];

    /**
     * Convert the tidy table to json.
     *
     * For example, let table =
     * col1 | col2 | value1 | value2
     * a      b      1        2
     * a      bar    5        3
     *
     * then, table.toJson('r', {c1: col1, c2: col2, v2: value2}) results in
     * [
     *    {row: 0, c1: a, c2: b, v2: 2},
     *    {row: 1, c1: a, c2: bar, v2: 3}
     * ]
     *
     * Note that 'row' represents the index of the row in the tidy table.
     *
     * Another example, now without arguments:
     * table.toJson() results in
     * [
     *  {
     *      row: 0,
     *      col1: a,
     *      col2: b,
     *      value1: 1,
     *      value2: 2
     *  },
     *  {
     *      row: 1,
     *      col1: a,
     *      col2: bar,
     *      value1: 5,
     *      value2: 3
     *  }
     * ]
     *
     * @param rowIdxTag if defined, include the row number of the tidy table in the result. Use rowIdxTag as the key in the object.
     * @param colTags if defined, this is how the columns in the tidy table are mapped. If not defined, the captions of the
     * tidy table are used as keys in the row objects.
     */
    toJson(rowIdxTag?: string, colTags?: Record<string, ITidyColumn | undefined>): Record<string, any>[];

    /**
     * Get a row as an object.
     * @param rowIdx index of the row to query.
     */
    getRowJson(rowIdx: number): Record<string, any>;

    /**
     * Convert the table to html table string
     */
    toHtml(): string;

    /**
     * throws an exception if the column does not belong to the table
     */
    checkColumnExists(column: ITidyColumn): void;

    hasEmptyDrilldown(column: ITidyColumn, rowIdx: number): boolean;

    /**
     * Insert the rows of another table into this table at a given index. Ensure that both tables
     * have the same number of columns.
     * @param sliceTable
     * @param rowIdx
     */
    insertTable(sliceTable: ITidyTable, rowIdx: number): void;

    /**
     * Append the rows of another tidy table to the rows of this table. Columns with the same name are merged.
     * @param table other tidy table.
     * @param rowIdx start adding rows from this index. Appends at the end of the table if undefined.
     */
    rBind(table: ITidyTable, rowIdx?: number): void;

    /**
     * Apply a function mutating each column of the tidy table.
     * The function should result in columns of same length.
     * @param lambda function to apply on the columns.
     */
    applyColumns(lambda: (col: ITidyColumn) => void): void;

    /**
     * Apply a new index to the table. Used for sorting, filtering and duplication of rows.
     *
     * Examples:
     *
     * table.toString() -->
     *     Country   |Amount    |Count     |
     * ----------------------------------------
     * 0   France    |10        |5         |
     * 1   Holland   |20        |4         |
     * 2   China     |25        |3         |
     * 3   Germany   |20        |2         |
     * 4   Belgium   |25        |1         |
     *
     * column.reIndex([0,0,2,4,1,-1,-1,999]) -->
     *     Country   |Amount    |Count     |
     * ----------------------------------------
     * 0   France    |10        |5         |
     * 1   France    |10        |5         |
     * 2   China     |25        |3         |
     * 3   Belgium   |25        |1         |
     * 4   Holland   |20        |4         |
     * 5   undefined |undefined |undefined |
     * 6   undefined |undefined |undefined |
     * 7   undefined |undefined |undefined |
     *
     * @param index list of integers.
     */
    reIndex(index: number[], keepingAxisOrder?: boolean): void;

    /**
     * Create and return a new table by applying an index to this table, see {@link reIndex} for how the indexing works.
     * @param index list of integers.
     */
    sliceRows(index: number[]): ITidyTable;

    /**
     * Repeat the rows of the table.
     * @param newLength new length of the table.
     * @param repetition how many times to repeat each row.
     */
    repeat(newLength: number, repetition?: number): void;

    /**
     * Get the column associated with the first item in the mapping meta.
     */
    getFirstMappedColumn(): ITidyColumn | undefined;

    /**
     * Returns the list of columns that are mapped in the mapping.
     */
    getMappedColumns(): ITidyColumn[];

    /**
     * Returns true if and only if each row of the columns is unique.
     * @param columns columns from the table.
     */
    isUnique(columns: ITidyColumn[]): boolean;

    /**
     * Returns a datetime column by alias.
     * @param alias name as defined in the mapping meta.
     *
     * @deprecated Use getColumnByAlias and test if the result is a numeric. The error from this function is not localized.
     */
    getDateColumnByAlias(alias: string): ITidyDateColumn;

    /**
     * Delete a column from the table (if it exists).
     * @param column
     */
    deleteColumn(column: ITidyColumn | string): boolean;

    /**
     * Keep a subset of columns from the table.
     * @param columns list of columns that are in the table.
     */
    subsetColumns(columns: ITidyColumn[]): void;

    /**
     * Create a new column. The column is not added to the table. Ensure that the length of the values
     * equals the number of rows in the table.
     * @param name name of the column.
     * @param values cell values for the column.
     * @param type if undefined, the type is inferred. Note that the provided type is not checked against the values
     * for speed. Be sure that the type you set is correct to prevent unexpected behaviour.
     */
    createColumn<T>(name: string, values: T[], type?: AllowedColumnType<T>): ITidyBaseColumn<T>;

    toMarkdown(): string;

    /**
     * True if and only if the table is an MDX pivot table.
     */
    isPivotTable(): boolean;

}


