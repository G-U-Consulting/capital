export default {
    data() {
        return {
           
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
                resultadoEjecucion: null
            }
        };
    },
    async mounted() {
        showProgress();
        var resp = await httpFunc("/generic/genericDS/General:Get_Informes", {});
        resp = resp.data;
        this.informes = resp[0];
        this.cargues = resp[1];
        hideProgress();
    },
    methods: {
    }
};
