import {ITidyTableTransformation} from "./ITidyTableTransformation";

export interface ITidyTableTransformationManager {

    registerTransformation(transformation: ITidyTableTransformation<any>): void;

}
