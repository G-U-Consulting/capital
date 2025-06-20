export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: []
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("MiCalendario", null);
        this.setMainMode('MiCalendario');

    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
    }
}