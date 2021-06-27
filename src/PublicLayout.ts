//TODO: better way to do this: import {CSSProperties} from "react";
type CSSProperties = any;

/**
 * <pre>
 *     unlimited: in height (page width is always known).
 * </pre>
 */
export type PageSize = "known" | "manual" | "unlimited";
export type PageSizeUnit = "px" | "mm" | "cm" | "in";

export type PageOrientation = "portrait" | "landscape";

export interface IPageSize {
    type: PageSize;
}

/**
 * From icCube server print component configuration:
 *
 * <pre>
 *   <paperSize name="A5" unit="in" width="5.8" height="8.3"/>
 *   <paperSize name="A4" unit="in" width="8.3" height="11.7"/>
 *   <paperSize name="A3" unit="in" width="11.7" height="16.5"/>
 *   <paperSize name="B5" unit="in" width="6.9" height="9.8"/>
 *   <paperSize name="B4" unit="in" width="9.8" height="13.9"/>
 *
 *   <paperSize name="JIS-B5" unit="in" width="7.2" height="10.1"/>
 *   <paperSize name="JIS-B4" unit="in" width="10.1" height="14.3"/>
 *
 *   <paperSize name="Letter" unit="in" width="8.5" height="11"/>
 *   <paperSize name="Legal" unit="in" width="8.5" height="14"/>
 *   <paperSize name="Ledger" unit="in" width="11" height="17"/>
 * </pre>
 */
export interface IKnownPageSize extends IPageSize {
    name: string;
}

export interface IManualPageSize extends IPageSize {
    pageSizeUnits: PageSizeUnit;
    pageWidth: number;
    pageHeight: number;
}

/**
 * Unlimited in height.
 */
export interface IUnlimitedPageSize extends IPageSize {
    pageSizeUnits: PageSizeUnit;
    pageWidth: number;
}

export interface IPageMargin {
    sizeUnits: PageSizeUnit;

    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface IWidgetLayoutGridDefinition {

    snap: boolean;
    show: boolean;

    width: number;
    height: number;
}

export interface IPageHeaderFooterLogoDefinition {

    // CSS: applied to the img element.

    style?: CSSProperties;

    // src of the img element.

    src: string;

}

export interface IPageHeaderFooterContentDefinition {

    /**
     * Used for formatting @dateTime variable (https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/)
     */
    dateTimeFormat?: string;

    /**
     * Used for formatting @date variable (https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/)
     */
    dateFormat?: string;

    /**
     * Used for formatting @time variable (https://momentjscom.readthedocs.io/en/latest/moment/04-displaying/01-format/)
     */
    timeFormat?: string;

    text: string;

    // CSS: applied to the typography element.

    style?: CSSProperties;

    // configuring https://material-ui.com/api/typography/

    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
    color?: string;
    variant?: string;

}

export interface IPageHeaderFooterPartDefinition {

    // CSS: applied to the div wrapping the content or logo element.

    style?: CSSProperties;

    /**
     * Available variables:
     *
     * <pre>
     *      @pageNb
     *      @pageCount
     *      @reportName
     *
     *      @dateTime
     *      @date
     *      @time
     * </pre>
     */
    content?: IPageHeaderFooterContentDefinition;
    logo?: IPageHeaderFooterLogoDefinition;

}

export interface IPageHeaderFooterDefinition {

    sizeUnits: PageSizeUnit;
    height: number

    // CSS

    style?: CSSProperties;

    // using a flex display w/ center as flex=1

    left?: IPageHeaderFooterPartDefinition;
    center?: IPageHeaderFooterPartDefinition;
    right?: IPageHeaderFooterPartDefinition;

}

/**
 * E.g., size, orientation, ...
 */
export interface IWidgetLayoutDefinition {

    layoutConfigId: string;

    cssClass?: string;

    pageSize: IKnownPageSize | IManualPageSize | IUnlimitedPageSize;
    pageOrientation: PageOrientation;

    pageMargin: IPageMargin;
    pageBackgroundColor: string;

    /**
     * Widgets are zoomed so that their bounding box fits the horizontal page area.
     */
    expandH?: boolean;

    grid: IWidgetLayoutGridDefinition;

    header?: IPageHeaderFooterDefinition;
    footer?: IPageHeaderFooterDefinition;

}
