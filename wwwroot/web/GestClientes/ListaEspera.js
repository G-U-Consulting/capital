export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            items: [],
            proyectos: [],
            torres: [],
            aptos: [],
            pisos: [],
            localizaciones: [],
            clases: [],
            tipos: [],

            filtros: {
                items: { id_proyecto: '', is_waiting: '1', is_active: '1' }
            },
            item: {},

            currentProject: null
        };
    },
    async mounted() {
        this.setMode(0);
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
            if (mode === 0) {
                this.ruta = [{ text: 'Listas de espera', action: () => this.setMode(0) }];
                this.setRuta();
                this.item = {};
                this.currentProject = {};
                await this.loadData();
            }
            if (mode === 1) {
                this.ruta = [this.ruta[0], { text: `Edición - ${this.item.id_lista}`, action: () => this.setMode(1) }];
                this.setRuta();
            }
        },
        async loadLista() {
            showProgress();
            [this.torres, this.aptos, this.clases, this.tipos] = (await
				httpFunc('/generic/genericDS/Clientes:Get_ListaEspera', { id_proyecto: this.currentProject })).data;
            let pisos = [], localizaciones = [];
            this.aptos.forEach(a => {
                if(!pisos.includes(a.piso)) pisos.push(a.piso);
                if(!localizaciones.includes(a.localizacion) && a.localizacion) 
                    localizaciones.push(a.localizacion);
            });
            this.pisos = pisos.sort((a, b) => Number(a) - Number(b));
            this.torres = this.torres.sort((a, b) => Number(a.consecutivo) - Number(b.consecutivo));
            this.aptos = this.aptos.sort((a, b) => Number(a.numero_apartamento) - Number(b.numero_apartamento));
            this.tipos = this.tipos.sort((a, b) => a.tipo.localeCompare(b.tipo));
            this.localizaciones = localizaciones;
            hideProgress();
        },
        async loadData() {
			showProgress();
			[this.items, this.proyectos] = (await
				httpFunc('/generic/genericDS/Clientes:Get_ListasEspera', {})).data;
			hideProgress();
		},
        async onSelect(item) {
            this.item = {...item};
            this.currentProject = item.id_proyecto;
            await this.loadLista();
            this.setMode(1);
        },
        onClear(table) {
            let item = this.filtros[table];
            item = Object.keys(item).forEach((key) => item[key] = '');
        },
        async onSave() {
            showProgress();
			let res = null;
			try {
				res = await httpFunc('/generic/genericST/Clientes:Upd_ListaEspera', this.item);
				if (res.isError || res.data !== 'OK') throw res;
				await this.setMode(0);
			} catch (e) {
				console.error(e);
				showMessage('Error: ' + e.errorMessage || e.data);
			}
			hideProgress();
        },
        async onCloseList() {
            this.item.is_active = '0';
            await this.onSave();
        },
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