export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],

            filtros: {

            },
        };
    },
    async mounted() {
        await this.loadData();
    },
    async unmounted() {

    },
    methods: {
        setRuta() {
            GlobalVariables.miniModuleCallback('SetRuta', this.ruta);
        },
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async setMode(mode) {
            this.mode = mode;
        },
        async loadData() {

        },
    },
    computed: {

    }
}