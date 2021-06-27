import {FormFieldType} from "./PublicTemplateForm";

export interface I18nIFormFieldDef {
    fieldType?: FormFieldType;
    fieldPath: string;
    fieldPrefixTag?: string;
    fieldDescription?: string;
    localizationTag?: string;
}
