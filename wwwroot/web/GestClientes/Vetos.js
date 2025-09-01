export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            vetos: [],

            filtros: {
                vetos: { nombre_id: '' }
            },
        };
    },
    async mounted() {
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
            this.vetos = (await httpFunc("/generic/genericDT/Clientes:Get_Vetos", {})).data;
            hideProgress();
        },
        onClear(table) {
            let item = this.filtros[table];
            item = Object.keys(item).forEach((key) => item[key] = '');
        },
        async onDelete(veto) {
            showProgress();
			let res = null;
			try {
				res = await (httpFunc('/generic/genericST/Clientes:Del_Veto', { id_veto: veto.id_veto }));
				if (res.isError || res.data !== 'OK') throw res;
				this.loadData();
			} catch (e) {
				console.error(e);
				showMessage('Error: ' + e.errorMessage || e.data);
			}
			hideProgress();
        },
        reqOperation(msg, okCallback, cancelCallback, item, textOk, textCancel) {
			showConfirm(msg, okCallback, cancelCallback, item, textOk, textCancel);
		},
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
                        if (tabla == 'vetos' && key == 'nombre_id')
                            return this.filtros[tabla][key] === ''
                                || String(item['nombre']).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                                || String(item['numero_documento']).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
                        else return this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
                    }) : []
                ) : [];
            };
        },
    }
}