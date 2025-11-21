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
        async getReport() {
            let res = await httpFunc(`/util/inte/fact_visitas/integraciones:Get_VisitaSF`, { id_visita: 306 });
            console.log(res);
        }
    },
    computed: {

    }
}