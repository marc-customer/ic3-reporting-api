import {IPluginDefinition} from "./IPluginDefinition";
import ReportingVersion from "./ReportingVersion";

export interface IVersionedPluginDefinition extends IPluginDefinition {

    /**
     * The version of the API used while building the customer's plugin module.
     */
    apiVersion: ReportingVersion;

}