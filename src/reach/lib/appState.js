class AppState {
    /** 
     * @description Current participant function's name 
     * @type {string | null} 
     */
    name = null;
    /**
     * @description Current participant function's resolve
     * @type {(value: any) => void | null}
     */
    resolve = null;
    /** 
     * @description Current participant function's reject
     * @type {(reason?: any) => void | null} 
     */
    reject = null;
    /** 
     * @description Arguments that contract sends to the app
     * @type {any[] | null} 
     */
    ctcArgs = null;
    /** 
     * @description Variables to use inside a participant function
     * @type {{ [key: string]: any } | null}
     */
    vars = null;

    /**
     * @param {{
     *  name: string,
     *  resolve: (value: any) => void,
     *  reject: (reason?: any) => void,
     *  ctcArgs: any[] | undefined,
     *  vars: { [key: string]: any }
     * }} 
     */
    constructor({ name, resolve, reject, ctcArgs, vars }) {
        this.name = name;
        this.resolve = resolve;
        this.reject = reject;
        this.ctcArgs = ctcArgs;
        this.vars = vars ?? {};
    }

    /**
     * Returns a new AppState after adding given variables to it
     * @param {AppState} prevState 
     * @param {{ [key: string]: any }} vars 
     * @returns {AppState}
     * @dev Used while setting the new state
     */
    static update(prevState, vars) {
        return new this({
            name: prevState.name,
            resolve: prevState.resolve,
            reject: prevState.reject,
            ctcArgs: prevState.ctcArgs,
            vars: Object.assign(prevState.vars, vars)
        })
    }
}

export default AppState;