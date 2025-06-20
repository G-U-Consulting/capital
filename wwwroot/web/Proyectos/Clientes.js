export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: []
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("Clientes", null);
        this.setMainMode('Clientes');

    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
    }
}