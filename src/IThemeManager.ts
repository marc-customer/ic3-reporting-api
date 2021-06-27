export enum EmbeddedThemeNames {

    Statos = "ic3-statos",

}

/**
 * Default values (e.g., box options, chart options, etc..).
 */
export interface IThemeWidgetDefaults {

    /**
     * Default values for widget boxes.
     *
     * <pre>
     *      IWidgetBoxDefinition
     * </pre>
     */
    box?: Record<string, any>;

    /**
     * Default values for widget chart options.
     *
     * <pre>
     *      IWidgetDefinition
     *          dataRenderOptions: IWidgetDataRenderDefinition
     *              chartOptions: IChartTemplateDataRenderDefinition
     * </pre>
     *
     * Lookup order:
     *
     * <pre>
     *      plugin-id.template-id.option
     *      plugin-id.option
     *      option
     * </pre>
     */
    options?: Record<string, any>;
}

/**
 * Sort of named set of predefined options.
 */
export interface IThemeWidgetVariant {

    id: string;

    /**
     * Default values.
     */
    widgetDefaults: {

        /**
         * Default values for widget chart options.
         *
         * <pre>
         *      IWidgetDefinition
         *          dataRenderOptions: IWidgetDataRenderDefinition
         *              chartOptions: IChartTemplateDataRenderDefinition
         * </pre>
         */
        options: Record<string, any>;
    }
}


export interface IThemeManager {

    /**
     * The theme decorator allows to setup the Theme.components and Theme.ic3 using the theme
     * created from its partial options (e.g., using palette, typography, spacing, etc...)
     */
    registerTheme(themeOptions: any, themeDecorator?: (theme: any) => void, baseTheme?: EmbeddedThemeNames): void;

}