export default {
    data() {
        return {
            mainmode: ""            
        };
    },
    async mounted() {

    },
    methods: {
        async setMainMode(mode) {
            /*if (mode == 1) {
                var resp = await httpFunc("/generic/genericDS/Proyectos:Get_Vairables", {});
                resp = resp.data;
                resp[0].forEach(item => item.checked = false);
                this.estado_publicacion = resp[0];
                resp[1].forEach(item => item.checked = false);
                this.tiposVIS = resp[1];
                resp[2].forEach(item => item.checked = false);
                this.tiposFinanciacion = resp[2];
                resp[3].forEach(item => item.checked = false);
                this.opcionesVisuales = resp[3];
                this.sede = resp[4];
                this.zona_proyecto = resp[5];
                this.ciudadela = resp[7];
                this.tipo = resp[6];
                this.pie_legal = resp[8];
                this.fiduciaria = resp[9];
                this.bancos = resp[10];
            } else if(mode == 3){
                this.sincoCompanies();
            }
            if(mode == 4){
                var resp = await httpFunc("/generic/genericDS/General:Get_Informes", {});
                resp = resp.data;

                this.informes = resp[0];
                this.cargues = resp[1];

            }*/
            GlobalVariables.loadMiniModule(mode, null, "#projectsMainContent");
            this.mainmode = mode;
            //this.mode = 0;
        }
    }
};
