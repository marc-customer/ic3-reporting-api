import {MdxInfo, SelectionBehaviour} from "./PublicTidyTableTypes";
import {ITidyBaseColumn, ITidyColumn} from "./PublicTidyColumn";
import {ILazyTreeViewLoader} from "./LazyTreeView";
import {PublicIcEvent} from "./IcEvent";
import {ReactElement} from "react";
import {Theme} from "@material-ui/core/styles";

export enum SelectionMode {
    SINGLE = 'SINGLE',
    MULTIPLE = 'MULTIPLE',
    TREE = 'TREE',

    /**
     * Deprecated, use options for selection optimization instead
     */
    TREE_COLLAPSE = 'TREE_COLLAPSE'
}

export enum TreeFireEventMode {
    ALL_SELECTED = 'ALL_SELECTED',
    /**
     * if all children are selected,  fire only the parent
     */
    COMPACT_ON_PARENT = 'COMPACT_ON_PARENT'
}

export enum TidyPivotTableLikeNodeStatus {
    COLLAPSED,
    EXPANDED,
    NO_CHILDREN_OR_DRILLDOWN,
    WITH_DRILLDOWN,
    LOADING
}

export type TidyEvent = MouseEvent | TouchEvent;

export interface ITidyTableInteractionSelection {

    /**
     * Sets the selection at the creation of the widget
     */
    initializeSelection(): void;

    /**
     * Returns true if the selection if empty. Returns false otherwise.
     */
    isSelectionEmpty(): boolean;

    firstIdxSelected(): number | undefined;

    /**
     * A row is selected if all cells in the row are selected
     * @param rowIdx the index of the row
     */
    isSelected(rowIdx: number): boolean;

    /**
     *
     * @param rowIdx the index of the row
     */
    isColumnRowSelected(column: ITidyBaseColumn<any>, rowIdx: number): boolean | undefined;


    /**
     * map function on selected rows
     */
    mapSelectedRows<T>(callback: (rowIdx: number) => T | null | undefined): T[];

    /**
     * Creates a new Column of size Table row count with the following values
     *
     * @param selectedItemValue  if the row is selected
     * @param notSelectedItemValue  if the row is not selected
     * @param noSelectionValue   if defined an the selection is empty, all row values have this value
     */
    applySelectionToNewColumn<T>(selectedItemValue: T, notSelectedItemValue: T, noSelectionValue?: T): ITidyBaseColumn<T>;


    /**
     * Handles the click event for the selection on a given column.
     *
     * If the columns is not part of the selection columns of the widget nothing will happen
     *
     * @param rowIdx index of row clicked
     * @param event the mouse event of the click
     */
    handleColumnSelection(column: ITidyColumn, rowIdx: number, event?: TidyEvent): void;


    /***
     *
     */
    getColorOnSelection(theme: Theme, color: string | undefined, rowIdx: number): string | undefined;

    /**
     * Handles the click event for the selection
     * @param rowIdx index of row clicked
     * @param event the mouse event of the click
     */
    handleClickSelection(rowIdx: number, event?: TidyEvent): void;

    /**
     * Select multiple rows at once
     */
    handleMultipleRowSelection(rowIds: number[]): void;

    /**
     * Clear the selection and fire an empty event value. Note, this resets the
     * selection to the initial selection.
     */
    handleClearSelection(): void;

    /**
     * Get the selection mode (single or multiple) of the interaction object.
     */
    getSelectionMode(): SelectionMode | undefined;

    /**
     * Set the selection mode of the interaction.
     * @param mode
     */
    setSelectionMode(mode: SelectionMode): void;

    /**
     * Set the selection behaviour for when the selection is empty.
     * @param behaviour
     */
    setSelectionEmptyBehaviour(behaviour: SelectionBehaviour): void;

    setSelectionAllBehaviour(behaviour: SelectionBehaviour): void;

    /**
     * If the selection is on a tree, this determines how the fired event is optimized for the
     * tree structure. Collapsed means that if all children are selected, we only use the parent. Children means
     * that we use leaves only. All means that we fire both parent and child nodes.
     * @param mode
     */
    setTreeFireEventMode(mode: TreeFireEventMode): void;

    setTreeCascade(value: boolean): void;

    /**
     * Set to true to enable selection on the interaction object.
     * @param enabled if true, the selection is enabled. If false, the interaction object does not respond to
     * methods setting the selection (e.g. click).
     */
    setSelectionActive(enabled?: boolean): void;

    /**
     * Returns true if the selection is activated, e.g. the interaction object responds to click and onther selection
     * events.
     */
    isSelectionActive(): boolean;
}


export interface ITidyTableDrilldown {

    handleDrilldown(rowIdx: number, event: TidyEvent | undefined): void;

    /**
     * drilldown
     *
     * @see pivotTableLikeDrilldown
     */
    onDrilldown(column: ITidyColumn, rowIdx: number, event: TidyEvent | undefined): void;

    hasDrilldown(): boolean;

    hasNodeDrilldown(column: ITidyColumn, rowIdx: number, stopDrillDownDepth?: any): boolean;
}

export interface ITidyTableInteractionEvent {

    /**
     * actionName if the action is bound to a channel, sends the events ( e.g. 'onClick' to the channel 'year' )
     */
    fireEvent(actionName: string, column: ITidyColumn, rowIdx: number | number[]): void;

    /**
     * actionName if the action is bound to a channel, sends the emptySet event, ∅
     */
    fireEmptySetEvent(actionName: string): void;

    /**
     * actionName if the action is bound to a channel, send an Mdx Event (value,mdx)
     */
    fireMdxEvent(actionName: string, value: string, mdx: string): void;

    /**
     * returns the value of the event
     */
    getEventValue(actionName: string): PublicIcEvent | undefined;

    /**
     * returns true if the actionName in bound to a channel
     */
    firesEvent(actionName: string): boolean;

    /**
     * register a callback that will be called each time an event is send to the channel bound to the actionName
     */
    onNotification(actionName: string, callback: (event: any) => void): void;
}

export interface ITidyTableInteraction extends ITidyTableInteractionSelection, ITidyTableInteractionEvent, ITidyTableDrilldown {

    /**
     * Handles a row hit/click, doing a selection or a drilldown depending on the widget status
     *
     * The column(s) for the selection or the drilldown are based on the widget options/settings
     *
     * This does not fire any event...for now
     */
    handleRowHit(rowIdx: number, event: TidyEvent | undefined): void;


    /**
     * Collapsed / Expand
     */

    toggleSeriesPoint(column: ITidyColumn, rowIdx: number): void;

    /**
     * Map a function to the visible rows only. Used in tree structures with expanded or collapsed items.
     * @param column column to map the values of
     * @param mapper function
     * @param inverse per default, all items are expanded. If inverse is true, all items are collapsed per default.
     */
    mapVisibleRows<T>(column: ITidyColumn, mapper: (index: number) => T, inverse?: boolean): T[];

    mapTreeVisibleRows<T extends ReactElement>(column: ITidyColumn, mapper: (index: number) => T, filter?: (info: MdxInfo) => boolean): T[];

    isCollapsed(column: ITidyColumn, rowIdx: number): boolean;

    /**
     * Is the node loading
     */
    isLoading(column: ITidyColumn, rowIdx: number): boolean;


    /**
     * Pivot Type behavior ( nodes can collapse/expand + drilldown might return some values)
     *
     * pay attention that the query needs to set the flag, pivot table like (to insert data)
     */
    pivotTableLikeDrilldown(column: ITidyColumn, rowIdx: number, event: TidyEvent, stopDrillDownDepth?: number): void;

    pivotTableLikeNodeStatus(column: ITidyColumn, rowIdx: number, stopDrillDownDepth?: number): TidyPivotTableLikeNodeStatus;

    asLazyTreeViewLoader(column: ITidyColumn): ILazyTreeViewLoader;

}

