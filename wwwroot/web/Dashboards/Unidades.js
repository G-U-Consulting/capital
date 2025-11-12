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
            let csv = await httpFunc(`/util/reports/Dashboard:Get_InfUnidades/csv`, {});
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "DataUnidades.csv");
            link.style.display = "none";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    },
    computed: {

    }
}