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
            usuarios: [],

            filtros: {
                items: { id_proyecto: '', is_waiting: '', is_active: '1', id_usuario: '' }
            },
            item: {},
            usuario: {},

            modal: null,
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
                this.modal = document.getElementById('modalOverlay');
            }
            if (mode === 1) {
                this.ruta = [this.ruta[0], { text: `Edición - ${this.item.id_lista}`, action: () => this.setMode(1) }];
                this.setRuta();
            }
        },
        async loadLista() {
            showProgress();
            [this.torres, this.aptos, this.clases, this.tipos] = (await
                httpFunc('/generic/genericDS/Clientes:Get_ListaEspera',
                    { id_proyecto: this.currentProject, id_usuario: this.item.id_usuario })).data;
            this.usuario = this.usuarios.find(u => u.id_usuario === this.item.id_usuario) || {};
            console.log(this.usuarios, this.item.id_usuario, this.usuario);
            let pisos = [], localizaciones = [];
            this.aptos.forEach(a => {
                if (!pisos.includes(a.piso)) pisos.push(a.piso);
                if (!localizaciones.includes(a.localizacion) && a.localizacion)
                    localizaciones.push(a.localizacion);
            });
            this.pisos = pisos.sort((a, b) => Number(a) - Number(b));
            this.torres = this.torres.sort((a, b) => Number(a.consecutivo) - Number(b.consecutivo));
            this.aptos = this.aptos.sort((a, b) => {
                const numA = parseInt(a.numero_apartamento, 10);
                const numB = parseInt(b.numero_apartamento, 10);
                if (numA !== numB)
                    return numA - numB;
                return a.numero_apartamento.localeCompare(b.numero_apartamento);
            });
            this.tipos = this.tipos.sort((a, b) => a.tipo.localeCompare(b.tipo));
            this.localizaciones = localizaciones;
            hideProgress();
        },
        async loadData() {
            showProgress();
            let items = [];
            [items, this.proyectos, this.usuarios] = (await
                httpFunc('/generic/genericDS/Clientes:Get_ListasEspera', {})).data;
            this.items = items.map(i => i.is_waiting == '0' && i.is_active == '1' ? { ...i, notify: true } : { ...i });
            hideProgress();
        },
        async onSelect(item) {
            this.item = { ...item };
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
        openModal() {
            let $modal = document.getElementById('modalOverlay');
            $modal && ($modal.style.display = 'flex');
        },
        closeModal(e, forzar) {
            if (this.modal && (e.target === this.modal || forzar))
                this.modal.style.display = 'none';
        },
        async onNotify() {
            let emails = this.items.filter(it => it.is_waiting == '0' && it.is_active == '1' && it.notify);
            console.log(emails);
            showProgress();
            let res = null;
            try {
                res = await httpFunc('/util/SendMail/ListaEspera', { subject: "Confirmación de Lista de Espera", emails });
                /* res = await httpFunc('/generic/genericST/Clientes:Upd_ListasAlerta', { data: JSON.stringify(lists) });
                if (res.isError || res.data !== 'OK') throw res; 
                await this.setMode(0); */
                this.closeModal({}, true);
            } catch (e) {
                console.error(e);
                showMessage('Error: ' + e.errorMessage || e.data);
            }
            hideProgress();
        },
        reqOperation(msg, okCallback, cancelCallback, item, textOk, textCancel) {
			showConfirm(msg, okCallback, cancelCallback, item, textOk, textCancel);
		},
        async exportExcel(tabla) {
            try {
                showProgress();
                let datos = this.getFilteredList(tabla);
                var archivo = (await httpFunc("/util/Json2File/excel", datos)).data;
                var formato = (await httpFunc("/util/ExcelFormater", { "file": archivo, "format": "FormatoMaestros" })).data;
                window.open("./docs/" + archivo, "_blank");
            }
            catch (e) {
                console.error(e);
            }
            hideProgress();
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
        currentUser: {
            get() {
                return GlobalVariables.username == this.usuario.usuario;
            }
        },
    }
}