export interface ErrorRendererClasses {

    /**
     * Style applied to
     */
    errorRendererRoot: string;
    /**
     * Style applied to
     */
    errorLogo: string;
    /**
     * Style applied to
     */
    errorLogoW: string;
    /**
     * Style applied to
     */
    errorInfo: string;
    /**
     * Style applied to
     */
    errorSchemaNotAuth: string;
    /**
     * Style applied to
     */
    errorMessage: string;
    /**
     * Style applied to
     */
    errorDetailToggle: string;
    /**
     * Style applied to
     */
    errorWidget: string;
    /**
     * Style applied to
     */
    errorCauseMessage: string;
    /**
     * Style applied to
     */
    errorCauseDetailedMessage: string;
    /**
     * Style applied to
     */
    errorCauseDetailedInfo: string;
    /**
     * Style applied to
     */
    errorCauseStacktrace: string;

}

export declare type ErrorRendererClassKey = keyof ErrorRendererClasses;
