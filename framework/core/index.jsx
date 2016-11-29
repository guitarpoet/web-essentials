/**
 * The core helper functions
 *
 * @author Jack
 * @version 1.0
 * @date Wed Jun 29 17:51:35 2016 
 *
 */

import { extend, isArray, isUndefined, clone, isObject, keys } from "underscore";
import md5 from "md5";
import handlebars from "handlebars"
import df from "date-format"
import pako from "pako"

//
// Get the class of the object, if this is an object
//
export const getClass = (obj) => {
	if(obj && isObject(obj)) {
		return obj.constructor.name;
	}
	return null;
}

export const strftime = (format, date) => {
	if(!date) {
		date = new Date();
	}
	if(!format) {
		format = "yy-MM-dd hh:mm:ss";
	}
	return df.asString(format, date)
}

//
// This methods function will query parent's functions as well.
//
export const methods = (obj, carry) => {
	if(!carry) 
		carry = {};

	if(obj && isObject(obj) && obj.__proto__) {
		// For function, we treat it like class
		// Getting the methods in class to the carry
		for(let p of Object.getOwnPropertyNames(obj.__proto__)) {
			carry[p] = 1;
		}
		// Getting parent's function
		if(obj.__proto__.__proto__)
			methods(obj.__proto__.__proto__, carry);
	}
	return keys(carry);
}


//
// The global cache to store the data
//
export const cache = (key, value) => {
    if(typeof GLOBAL !== "undefined") {
        GLOBAL.window = GLOBAL;
    }

	window._cache = window._cache || {};
	if(!key) {
		return window._cache;	
	}

	if(value) {
		window._cache[key] = value;
	}
	return window._cache[key];
}

//
// Get the sequence number for the name
//
// Note: This is not thread safe yet!
//
export const seq = (name) => {
    let seqData = cache("sequence")
    if(!seqData) {
        seqData = cache("sequence", {});
    }

    let s = seqData[name];
    if(isUndefined(s)) {
        s = 0;
    }
    seqData[name] = s + 1;
    cache("sequence", seqData);
    return s;
}

//
// Get the property of the object using the  style of property string
// like this a.b.c, and if the property is array, can use this way
// a.1.b.c
//
export const property = (obj, path) => {
	if(obj && path) {
		var paths = path.split(".");
		var current = obj;
		while(paths.length) {
			if(!current)
				return null;
			let cp = paths.shift();	
			if(cp) {
				current = current[cp];
			}
			else {
				return null;
			}
		}
		if(current)
			return current;
	}
	return null;
}

// 
// The result must be positive, or will treat it as null
//
export const pos_prop = (obj, path, def = "-?-") => {
    let p = property(obj, path);
    if(p > 0) {
        return p;
    }
    return def;
}

export const prop = (obj, path, def = "-?-") => {
    return property(obj, path) || def;
}

export const leftpad = (data, count = 2) => {
    var str = "" + data
    var pad = "";
    for(let i = 0; i < count; i++) {
        pad = pad + "0";
    }
    return pad.substring(0, pad.length - str.length) + str
}

export const template = (tpl, context) => {
	var name = md5(tpl);
	var t = cache(name);
	if(!t) {
		t = handlebars.compile(tpl);
		cache(name, t);

	}
	return t(context);
}

//
// Inflate the package that packaged using zlib
//
export const inflate = (pack) => {
    if(pack) {
        return pako.inflate(pack);
    }
}

//
// The text i18n function
//
export const _ = (text, context = null) => {
    if(context) {
        // OK, let's treat it as the template
        return template(text, context);
    }
    return text;
}

export const join = (arr, sep = ',') => {
    if(isArray(arr)) {
        return arr.join(sep);
    }
    return arr + "";
}

export class BaseClass {
	methods() {
		return methods(this);
	}

	property(path) {
		return property(this, path);
	}

	clone() {
		return clone(this);
	}

	getClass() {
		return getClass(this);
	}
    
    copy(obj) {
        if(isObject(obj)) {
            extend(this, obj);
        }
    }
}
