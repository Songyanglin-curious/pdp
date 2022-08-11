Vue.component('onoff', {
    props: {
        "value": {
            type: Boolean,
            "default": false
        },
        "text": {
            type: String,
            "default":""
        }
    },
    computed: {
        img: function() { return this.value ? "../i/sgc/on.png" : "../i/sgc/off.png"; }
    },
    methods: {
        click: function() {
            this.$emit("input", !this.value);
            this.$emit("click");
        }
    },
    template: '<div style="display:inline-flex;align-items: center;"><img alt="" :src="img" @click="click">{{text}}</div>'
});