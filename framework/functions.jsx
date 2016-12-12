import Application from "./app"
// For Ajax requests
import axios from "axios"
import { property, template } from "./core"
import React from "react"
import ReactDOM from "react-dom"
import $ from "webpack-zepto"
import { isString } from "underscore"
import Cookie from "oatmeal-cookie"

export const isTop = () => {
    return window.parent == window;
}

export const inBrowser = () => {
    if(typeof window !== "undefined") {
        return true;
    }
    return false;
}

export const set_title = (title) => {
    $("title").text(_(title));
}

export const startup = (configUrl, initHandlers = []) => {
    return new Application(configUrl, initHandlers).init();
}

export const service = (name, service = null) => {
    return application.service(name, service);
}

export const config = (name, defaultValue) => {
    return application.config(name);
}

export const trigger = (e, tag = {}) => {
	return application.trigger(e, tag);
}

export const debug = (tpl, context = {}) => {
    return application.debug(tpl, context);
}

export const info = (tpl, context = {}) => {
    return application.info(tpl, context);
}

export const error = (tpl, context = {}) => {
    return application.error(tpl, context);
}

export const route = (router, path) => {
    return application.route(router, path);
}

export const findNode = (component) => {
    return $(ReactDOM.findDOMNode(component)); 
}

export const selectNodes = (selector, component) => {
    return $(selector, findNode(component));
}

//
// Get the value of state using the property way
//
export const state = (path) => {
    return application.getState(path);
}

export const tick = (cause, handler, count = 1, sync = false, index = -1) => {
    return application.tick(cause, handler, count, sync, index);
}

export const timeout = (handler, count = 1, sync = false, index = -1) => {
    return application.timeout(handler, count, sync, index);
}

export const untick = (handler) => {
    return application.untick(handler);
}

export const showError = (error, router) => {
    trigger("UPDATE_CURRENT_ERROR", {error});
    route(router, "/error");
}

export const time_diff = (from, to) => {
    if(!from) {
        return -1;
    }

    if(!to) {
        to = now();
    }

    return from - to;
}

export const now = () => {
    if(Date.now) {
        return Date.now();
    }
    return new Date().now();
}

export const translate = (text) => {
    if(typeof application !== "undefined") {
        let lang = config("lang");
        if(lang) {
            let t = lang[text];
            if(t) {
                return t;
            }
        }
    }
    return text;
}

//
// The text i18n function
//
export const _ = (text, context = null) => {
    text = translate(text);
    if(context) {
        // OK, let's treat it as the template
        return template(text, context);
    }
    return text;
}

export const split = (str, sep = ",") => {
    if(isString(str) && str.split) {
        return str.split(sep);
    }
    return [];
}

export const bridge = (fn, args = []) => {
    return application.exec(fn, args);
}

export const bridge_callback = (fn, args = []) => {
    return application.callback(fn, cb, args);
}

export const ajax = axios

export const cookie = (name, value = null, config = {}) => {
    if(value) {
        Cookie.set(name, value, config);
    } else {
        return Cookie.get(name);
    }
}

