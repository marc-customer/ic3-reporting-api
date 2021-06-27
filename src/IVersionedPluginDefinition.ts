import {IPluginDefinition} from "./IPluginDefinition";
import {ApiVersion} from "./ApiVersion";

export interface IVersionedPluginDefinition extends IPluginDefinition {

    version: ApiVersion;

}