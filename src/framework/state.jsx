import {BaseClass} from "./core"
import {isObject, clone, extend} from "underscore"

//
// The state class base for all the application states, for
// the shortcuts for clone and property
//
class AppState extends BaseClass {
    constructor(app, obj) {
        super();
        this.meta = {
            hash: app.hash(), // setting the hash to the meta
            params: clone(app.param()), // setting the params to the meta
            config: clone(app.config()) // setting the configs to the meta
        }

        if(obj && isObject(obj)) {
            extend(this, obj);        
        }
    }
}

export default AppState
