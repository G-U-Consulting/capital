export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            submode: 0,
            //ejemplo informe cargue
            selectCarg: "",
            fileSelected: null,
            selectInfo: "",
            parsInforme: {
                pars: [
                  { parametro: 'Fecha Desde', tipo: 'date', valor: '', visible: true },
                  { parametro: 'Fecha Hasta', tipo: 'date', valor: '', visible: true },
                  { parametro: 'Sala de Negocios:', tipo: 'select', valor: '', opciones: [
                    'Alameda de Zipaquirá',
                    'Mystique 106',
                    'Porto Hayuelos',
                    'Urbania',
                    'Serralta'
                  ], visible: true },
                  { parametro: 'Asesor:', tipo: 'select', valor: '', opciones: ['Asesor1', 'Aesor2'], visible: true },
                  
                ],
                parsLen: 2,
                resultadoEjecucion: null,
               
            },
            ruta: [],
        };
    },
    computed: {
        
    },
    async mounted() {

    },
    methods: {
        setMode(mode) {
            this.mode = mode;
            this.setRuta();
        },
        setRuta() {
            console.log(this.mainmode, this.mode)
            if (this.mainmode !== 0) {
                let subpath = [this.getMainPath()];
                let nuevo = { text: 'Nuevo', action: () => this.setMode(1) },
                    editar = { text: 'Edición', action: () => this.setMode(2) };
                if (this.mode == 1) subpath.push(nuevo);
                if (this.mode == 2) subpath.push(editar);
                this.ruta = [{
                    text: 'ZA', action: () => 
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
                }, {text: 'Proyectos', action: () => { this.mainmode = 0; this.setMode(0) }}];
                this.ruta = [...this.ruta, ...subpath];
            }
            else this.ruta = [{
                    text: 'ZA', action: () => 
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
                }];
        },

    }
};