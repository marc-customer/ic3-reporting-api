export interface AppClasses {

    /**
     * Style applied to
     */
    appRoot: string;
    /**
     * Style applied to
     */
    topMenu: string;
    /**
     * Style applied to
     */
    toolbar: string;
    /**
     * Style applied to
     */
    appPayload: string;
    /**
     * Style applied to
     */
    appError: string;
    /**
     * Style applied to
     */
    appBar: string;
    /**
     * Style applied to
     */
    appPayloadRoot: string;
    /**
     * Style applied to the root div containing the edited dashboard pages.
     */
    dashboardRoot: string;
    /**
     * Style applied to
     */
    zoomWidgetRoot: string;
}

export declare type AppClassKey = keyof AppClasses;
