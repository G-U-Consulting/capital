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
        this.ruta = [{ text: 'Atención', action: () => this.setMode(0) }];
        this.setRuta();
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