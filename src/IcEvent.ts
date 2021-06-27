export const emptySet = "∅"

export enum IcEventType {
    TIDY_SELECTION,
    TIDY_FIRE,
    TIDY_ACTION,
    API,
}

/**
 * Event mandatory events as sent by the widgets -> @{eventName}
 */
export interface PublicIcEvent {

    /**
     * The value of the event
     */
    readonly value: string;

    /**
     * The MDX version of the events
     */
    readonly mdx: string;

    /**
     * These two strings together define an unique id for a widget in a report
     */
    sourceNid?: string;
    sourceWid?: string;

    /**
     * special 'tag' to
     */
    isEmpty?: boolean;

    /**
     * the type of event
     */
    readonly type?: IcEventType;
}

export interface TidyActionEvent extends PublicIcEvent {

    readonly type: IcEventType.TIDY_ACTION;

    readonly tidyIdxHint: number

}