export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: GlobalVariables.ruta,
        }
    }, 
    async mounted() {

    },
    methods: {
        async setMainMode(mode) {
            this.setRuta("Política de Contraseña");
            this.mainmode = mode;
            this.mode = 0;
        },
        setRuta(...segments) {
            this.ruta = [GlobalVariables.ruta, ...segments].join(" / ");
        },
    }
}