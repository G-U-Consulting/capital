export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            vetos: [],
            directores: [],

            filtros: {
                vetos: { nombre_id: '', vigente: '' }
            },

            searchCli: null,
            cliente: {},
            veto: {},

            showAprobar: false,
            searched: false,
        };
    },
    async mounted() {
        this.ruta = [{ text: 'Vetos', action: () => this.setMode(0) }];
        this.setRuta();
        await this.loadData();
        this.showAprobar = await this.hasPermission(14);
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
            [this.vetos, this.directores] = (await httpFunc("/generic/genericDS/Clientes:Get_Vetos", {})).data;
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
				res = await httpFunc('/generic/genericST/Clientes:Del_Veto', { id_veto: veto.id_veto });
				if (res.isError || res.data !== 'OK') throw res;
				this.loadData();
			} catch (e) {
				console.error(e);
				showMessage('Error: ' + e.errorMessage || e.data);
			}
			hideProgress();
        },
        async onApprove(veto) {
            showProgress();
			let res = null;
			try {
				res = await httpFunc('/generic/genericST/Clientes:Upd_Veto', 
                    { id_veto: veto.id_veto, vigente: '1', usuario: GlobalVariables.username });
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
        openModal() {
            let $modal = document.getElementById('modalOverlay');
            if ($modal) $modal.style.display = 'flex';
            this.searched = false;
        },
        closeModal(e) {
            if (e && e.target.matches('#modalOverlay')) {
                e.target.style.display = 'none';
                this.cliente = {};
                this.searchCli = null;
            }
            if (!e || e.target.matches('.modal-cerrar.events')) {
                let $modal = document.getElementById('modalOverlay');
                $modal && ($modal.style.display = 'none');
                this.cliente = {};
                this.searchCli = null;
            }
        },
        async getCliente() {
            if (this.searchCli) {
                showProgress();
                let res = (await httpFunc('/generic/genericDT/Clientes:Get_Cliente', { numero_documento: this.searchCli })).data;
                if (res && res.length) this.cliente = res[0];
                this.searched = true;
                if (this.cliente.vigente == '1' && this.cliente.vetado_por) {
                    showMessage(`El cliente '${this.cliente.nombres} ${this.cliente.apellido1}' ya se encuentra vetado por ${this.cliente.vetado_por}`);
                    this.cliente = {};
                    this.searchCli = null;
                    this.searched = false;
                }
                if (this.cliente.vigente == '0' && this.cliente.solicitado_por) {
                    showMessage(`El cliente '${this.cliente.nombres} ${this.cliente.apellido1}' tiene una solicitud de veto por ${this.cliente.solicitado_por}`);
                    this.cliente = {};
                    this.searchCli = null;
                    this.searched = null;
                }
                hideProgress();
            }
        },
        async onRequest() {
            showProgress();
            console.log(this.cliente);
            if (!this.searched)
                showMessage("Primero debe buscar el número de documento del cliente, en caso de no estar registrado se habilitará la edición de los datos.")
            if (this.searchCli && this.searched) {
                if (!this.cliente.nombres) {
                    showMessage("Debe ingresar un nombre");
                    return;
                }
                if (!this.cliente.id_cliente && (!this.isEmail(this.cliente.email1) || !this.isEmail(this.cliente.email2))) {
                    showMessage("Email con formato incorrecto");
                    return;
                }
                if (!this.cliente.numero_documento) this.cliente.numero_documento = this.searchCli;
                let res = null;
                try {
                    res = await httpFunc('/generic/genericST/Clientes:Ins_Veto', 
                        { ...this.cliente, usuario: GlobalVariables.username });
                    if (res.isError || res.data !== 'OK') throw res;
                    this.loadData();
                    this.closeModal();
                } catch (e) {
                    console.error(e);
                    showMessage('Error: ' + e.errorMessage || e.data);
                }
            }
            hideProgress();
        },
        async hasPermission(id) {
            await GlobalVariables.loadPermisos();
            return !!GlobalVariables.permisos.filter((p) => p.id_permiso == id).length;
        },
        validarNumero(obj, field) {
            if (obj && field) obj[field] = obj[field].replaceAll(/[^0-9]/g, '');
            else if(field) this[field] = this[field].replaceAll(/[^0-9]/g, '');
        },
        async validarTexto(obj, field) {
            if (obj && field) obj[field] = obj[field].replaceAll(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
            else if(field) this[field] = this[field].replaceAll(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        },
        isEmail(email) {
            let regex = /[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})/i;
            return !email || regex.test(email);
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