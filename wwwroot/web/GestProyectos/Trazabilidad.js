export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            proyectos: [],
            unidades: [],
            unidad: {},
            selPro: {},
            selTorre: {},
            selUnd: {},

            optVisible: false,
            filtros: {
                unidades: {}
            },
        };
    },
    async mounted() {
        this.ruta = [{ text: 'Trazabilidad', action: () => this.setMode(0) }];
        this.setRuta();
        await this.loadProyectos();
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

        async loadProyectos() {
            showProgress();
            this.proyectos = (await httpFunc("/generic/genericDT/Gestion:Get_Proyectos", {})).data;
            hideProgress();
        },
        async loadTorres(pro) {
            if (pro) {
                showProgress();
                pro.torres = (await httpFunc("/generic/genericDT/Gestion:Get_Torres", { id_proyecto: pro.id_proyecto })).data;
                this.selTorre = {};
                this.unidades = [];
                hideProgress();
            }
        },
        async loadUnidades(torre) {
            if (torre) {
                showProgress();
                torre.unidades = (await httpFunc("/generic/genericDT/Gestion:Get_Unidades", { id_torre: torre.id_torre })).data;
                this.unidades = torre.unidades;
                hideProgress();
            }
        },
        async onSelect(und) {
            this.unidad = {};
            if (!und.logs)
                await this.loadLogs(und);
            if (!und.logs || !und.logs.length)
                showMessage(`No hay registros en la unidad ${und.unidad}.`);
            else {
                this.unidad = und;
                this.setMode(1);
            }
        },
        async loadLogs(und) {
            showProgress();
            und.logs = (await httpFunc("/generic/genericDT/Gestion:Get_Logs", { id_unidad: und.id_unidad })).data;
            hideProgress();
        },

    },
    computed: {
        completeProjects() {
            return () => {
                let filProject = this.filtros.unidades['proyecto'];
                return this.proyectos.filter(pro => !filProject || pro.nombre.toLowerCase().includes(filProject.toLowerCase()));
            }
        },
    }
}