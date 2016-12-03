import { property } from "./index"
import EventSource from "./event_source"

class PropertySource extends EventSource {
	get(name, default_value = null) {
        let v = property(this, name);
        if(v !== null) {
            return v;
        } else {
            return default_value;
        }
	}

	set(name, value) {
		this.fire('change', {
			'target': this,
			'propertyName': name,
			'value': value,	
			'orig_value': this[name]
		});
		this[name] = value;
	}
}

export default PropertySource
