export default {
    data() {
        return {
            mainmode: 0,
            mode: 0
       
        }
    }, 
    async mounted() {

    },
    methods: {
        async setMainMode(mode) {
            this.mainmode = mode;
            this.mode = 0;
        }
    }
}