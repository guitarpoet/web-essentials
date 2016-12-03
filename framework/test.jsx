import PropertySource from "./core/property_source"
import $ from "webpack-zepto"

class SampleObject extends PropertySource {
}

let obj = new SampleObject();
$(obj).on("change", function(event) {
    console.info(event);
});
obj.set("name", "Jack");
console.info(obj.get("name"));
