export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            proyecto: null,
            filtros: {
                
            }
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("SalaPersonal", null);
        this.setMainMode('SalaPersonal');
        await this.loadData();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async loadData() {
            /*[this.bancos, this.factores, this.tipos_factor, this.bancos_factores] =
                (await httpFunc("/generic/genericDS/Proyectos:Get_Bancos", { id_proyecto: this.proyecto.id_proyecto })).data;
            */
        },
        
        req(method) {
            showConfirm("Se sincronizarán los valores con los establecidos en el maestro.", method, null, null);
        }
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                    ) : []
                ) : [];
            };
        },
    }
}