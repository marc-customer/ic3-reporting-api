import {IPluginDefinition} from "./IPluginDefinition";
import {IVersionedPluginDefinition} from "./IVersionedPluginDefinition";
import {ApiVersion} from "./ApiVersion";

export class ApiUtils {

    /**
     * Define the form field as being localized.
     */
    public static readonly TAG_I18N_FIELD = "ic3t_";

    // TODO (mpo) ongoing: reporting: **********************************************************************************
    //      wait for tidy table setup and see how to setup that version information...
    private static readonly v: ApiVersion = new ApiVersion("8.0.0");

    static version(): ApiVersion {
        return ApiUtils.v;
    }

    static makePlugin(definition: IPluginDefinition): () => IVersionedPluginDefinition {

        return (): IVersionedPluginDefinition => {

            return {

                version: ApiUtils.version(),

                ...definition,

            }

        }
    }

}