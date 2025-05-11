export interface Route {
    icon?: string;
    path: string;
    title?: string;
    pathParams?: string[];
    aliases?: string[];
    template: Function;
    allowWithoutLogin?: boolean;
    showInNav?: boolean;
    handler?: Function;
}