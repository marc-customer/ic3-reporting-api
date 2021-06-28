import ReportingVersion from "./ReportingVersion";

export interface IReportDefinition {

    getName(): string;

    getPath(): string;

    getDefaultSchemaName(): string;

    setDefaultSchemaName(name: string): void;

    getDefaultCubeName(): string;

    setDefaultCubeName(name: string): void;
}

/**
 * Used to setup filter initial selection.
 */
export interface IReportParam {
    channelName: string;
    name: string | string[];
}

export interface IOpenReportOptions {

    embedded?: boolean;

    /**
     * Full path of the report (e.g., shared:/marc/my-report).
     */
    path: string;

    /**
     * Optional JSON object (i.e., constant / filter default value).
     */
    params?: IReportParam[];

    /**
     * Called before the report definition is actually applied. Give the opportunity
     * to change the definition (e.g., schema name).
     */
    onDefinition?: (report: IReportDefinition) => void;

    /**
     * If the method exist and return true then the default error dispatcher is not
     * being called. Give the caller the opportunity to render the error.
     */
    onError?: (error: any) => boolean;

}

export interface IOpenReportAppOptions {

    /**
     * Full path of the report app. (e.g., shared:/my-report).
     */
    path: string;

}

/**
 * An instance of icCube reporting application.
 */
export interface IReporting {

    getVersion(): ReportingVersion;

    openReport(options: IOpenReportOptions): void;

    fireEvent(eventName: string, caption: string, mdx: string): void;

}