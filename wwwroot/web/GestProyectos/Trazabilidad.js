export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            sedes: [],
            ciudadelas: [],
            proyectos: [],
            clases: [],
            unidades: [],
            tipos: [],
            estados: [],
            unidad: {},
            selSede: {},
            selCiu: {},
            selPro: {},
            selTorre: {},
            selUnd: {},

            editTipoEstado: true,

            optVisible: false,
            filtros: {
                unidades: {}
            },
        };
    },
    async mounted() {
        this.ruta = [{ text: 'Trazabilidad', action: () => this.setMode(0) }];
        this.setRuta();
        await this.loadData();
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

        async loadData() {
            showProgress();
            [this.sedes, this.ciudadelas, this.proyectos, this.clases, this.estados] = 
                (await httpFunc("/generic/genericDS/Gestion:Get_InitData", {})).data;
            hideProgress();
        },
        async loadTorres(pro) {
            if (pro && pro.id_proyecto) {
                showProgress();
                delete this.filtros.unidades.id_tipo;
                [pro.torres, this.tipos] = (await httpFunc("/generic/genericDS/Gestion:Get_Torres", { id_proyecto: pro.id_proyecto })).data;
                this.selTorre = {};
                this.unidades = [];
                hideProgress();
            }
        },
        async loadUnidades(torre) {
            if (torre && torre.id_torre) {
                if (torre.unidades && torre.unidades.length)
                    this.unidades = torre.unidades;
                else {
                    showProgress();
                    torre.unidades = (await httpFunc("/generic/genericDT/Gestion:Get_Unidades", { id_torre: torre.id_torre })).data;
                    this.unidades = torre.unidades;
                    hideProgress();
                }
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
        valClase() {
            if (this.filtros.unidades.id_clase && this.filtros.unidades.id_clase != '8') {
                delete this.filtros.unidades.id_tipo;
                delete this.filtros.unidades.id_estado_unidad;
                this.editTipoEstado = false;
            }
            else this.editTipoEstado = true;
        }

    },
    computed: {
        completeProjects() {
            return () => {
                let filProject = this.filtros.unidades['proyecto'];
                return this.proyectos.filter(pro => !filProject || pro.nombre.toLowerCase().includes(filProject.toLowerCase()));
            }
        },
        getFilteredList() {
			return (tabla) => {
				return this[tabla] ? this[tabla].filter(item =>
					this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
						if (tabla == 'unidades' && key == 'torres')
							return this.filtros[tabla][key].length === 0 || this.filtros[tabla][key].includes(item.idtorre);
						if (key.startsWith('id_') || key == 'localizacion' || key == 'piso')
							return !this.filtros[tabla][key] || String(item[key]) === this.filtros[tabla][key];
						else return !this.filtros[tabla][key] || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
					}) : []
				) : [];
			};
		},
    }
}