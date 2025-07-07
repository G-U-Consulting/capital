export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: []
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("ProgMensual", null);
        this.setMainMode('ProgMensual');

    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
    }
}