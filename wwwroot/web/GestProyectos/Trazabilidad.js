export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            proyectos: [],
            unidad: {},

            filtros: {

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
            let pro = (await httpFunc("/generic/genericDT/Gestion:Get_Proyectos", {})).data;
            this.proyectos = pro.map(p => ({ ...p, showDetails: false }));
            hideProgress();
        },
        async loadTorres(pro) {
            showProgress();
            let torres = (await httpFunc("/generic/genericDT/Gestion:Get_Torres", { id_proyecto: pro.id_proyecto })).data;
            pro.torres = torres.map(t => ({ ...t, showDetails: false }));
            hideProgress();
        },
        async loadUnidades(torre) {
            showProgress();
            torre.unidades = (await httpFunc("/generic/genericDT/Gestion:Get_Unidades", { id_torre: torre.id_torre })).data;
            hideProgress();
        },
        async loadLogs(und) {
            showProgress();
            und.logs = (await httpFunc("/generic/genericDT/Gestion:Get_Logs", { id_unidad: und.id_unidad })).data;
            hideProgress();
        },

        async toggleProject(pro) {
            if (!pro.showDetails && !pro.torres)
                await this.loadTorres(pro);
            if (!pro.torres || !pro.torres.length)
                showMessage(`No hay torres cargadas en ${pro.nombre}.`);
            else
                pro.showDetails = !pro.showDetails;
        },
        async toggleTower(torre) {
            if (!torre.showDetails && !torre.unidades)
                await this.loadUnidades(torre);
            if (!torre.unidades || !torre.unidades.length)
                showMessage(`No hay unidades cargadas en la torre ${torre.consecutivo}.`);
            else
                torre.showDetails = !torre.showDetails;
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
                
        }
    },
    computed: {

    }
}