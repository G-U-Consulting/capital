export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: []
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("MisCompromisos", null);
        this.setMainMode('MisCompromisos');

    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
    }
}