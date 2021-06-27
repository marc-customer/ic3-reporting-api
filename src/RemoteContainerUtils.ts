/* eslint @typescript-eslint/ban-ts-comment: 0 */  // --> OFF

export interface IScriptCallback {

    onSuccess: () => void;
    onError: (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => void;

}

export class RemoteContainerUtils {

    public static loadScript(url: string, callback: IScriptCallback): void {

        const element = document.createElement("script");

        element.src = url;
        element.type = "text/javascript";
        element.async = true;

        element.onload = () => {
            callback.onSuccess();
        };

        element.onerror = (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
            callback.onError(event, source, lineno, colno, error);
        };

        document.head.appendChild(element);
    }

    public static loadModule(scope: string, module: string): () => Promise<any> {

        // An async function is a function that knows how to expect the possibility
        // of the await keyword being used to invoke asynchronous code.

        // So the async keyword is added to functions to tell them to return a promise
        // rather than directly returning the value.

        return async (): Promise<any> => {

            // Initializes the share scope. This fills it with known provided modules
            // from this build and all remotes.

            // @ts-ignore
            await __webpack_init_sharing__("default");

            // or get the container somewhere else
            const container = (window as any)[scope];

            // Initialize the container, it may provide shared modules

            // @ts-ignore
            await container.init(__webpack_share_scopes__.default);
            const factory = await (window as any)[scope].get(module);

            const Module = factory();
            return Module;
        };
    }


}