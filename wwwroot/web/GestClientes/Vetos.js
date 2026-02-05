export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            vetos: [],
            directores: [],

            filMode: 'week',
            filtros: {
                vetos: { 
                    nombre_id: '', vigente: '',
                    fechaI: this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 7)),
                    fechaF: this.formatDatetime('', 'bdate', new Date())
                }
            },

            searchCli: null,
            cliente: {},
            veto: {},

            showAprobar: false,
            searched: false,
            newMode: true,
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
            if (this.searchCli && this.newMode) {
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
            else if (field) this[field] = this[field].replaceAll(/[^0-9]/g, '');
        },
        async validarTexto(obj, field) {
            if (obj && field) obj[field] = obj[field].replaceAll(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
            else if (field) this[field] = this[field].replaceAll(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        },
        isEmail(email) {
            let regex = /[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})/i;
            return !!email && regex.test(email);
        },
        onSelect(veto) {
            this.openModal();
            this.newMode = false;
            this.cliente = { ...veto };
            this.searchCli = veto.numero_documento;
        },
        async exportExcel(tabla) {
            try {
                showProgress();
                let datos = this.getFilteredList(tabla);
                if (!datos.length) {
                    hideProgress();
                    showMessage('No hay datos para exportar');
                    return;
                }
                var archivo = (await httpFunc("/util/Json2File/excel", datos)).data;
                var formato = (await httpFunc("/util/ExcelFormater", { "file": archivo, "format": "FormatoMaestros" })).data;
                window.open("./docs/" + archivo, "_blank");
            }
            catch (e) {
                console.error(e);
            }
            hideProgress();
        },
        updateFilMode(mode) {
            this.filMode = mode;
            if (mode === 'week') {
                this.filtros.vetos.fechaI = this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 7));
                this.filtros.vetos.fechaF = this.formatDatetime('', 'bdate', new Date(new Date().getTime()));
            }
            if (mode === 'month') {
                this.filtros.vetos.fechaI = this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 30));
                this.filtros.vetos.fechaF = this.formatDatetime('', 'bdate', new Date(new Date().getTime()));
            }
        },
        formatDatetime(text, type = 'datetime', _date) {
            const date = _date || (text ? new Date(text) : new Date());
            let day = date.getDate().toString().padStart(2, '0'),
                month = (date.getMonth() + 1).toString().padStart(2, '0'),
                year = date.getFullYear(),
                hour = (date.getHours() % 12 || 12).toString().padStart(2, '0'),
                minutes = date.getMinutes().toString().padStart(2, '0'),
                seconds = date.getSeconds().toString().padStart(2, '0'),
                meridian = date.getHours() >= 12 ? 'p. m.' : 'a. m.';
            if (type === 'date')
                return `${day}/${month}/${year}`;
            if (type === 'textdate')
                return `${day} de ${this.nameMonths[date.getMonth()]} de ${year}`;
            if (type === 'bdate')
                return `${year}-${month}-${day}`;
            if (type === 'bdatetime')
                return `${year}-${month}-${day} ${date.getHours().toString().padStart(2, '0')}:${minutes}`;
            if (type === 'bdatetimes')
                return `${year}-${month}-${day} ${date.getHours().toString().padStart(2, '0')}:${minutes}:${seconds}`;
            if (type === 'time')
                return `${hour}:${minutes} ${meridian}`;
            if (type === 'vtime')
                return `${date.getHours().toString().padStart(2, '0')}:${minutes}`
            return `${day}/${month}/${year} ${hour}:${minutes} ${meridian}`;
        },
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
                        if (tabla == 'vetos' && key == 'fechaI')
                            return !this.filtros[tabla][key] ||
                                (new Date(this.filtros[tabla][key] + ' 00:00')).getTime() <= (new Date(item.fecha.split(' ')[0] + ' 00:00').getTime());
                        if (tabla == 'vetos' && key == 'fechaF')
                            return !this.filtros[tabla][key] ||
                                (new Date(this.filtros[tabla][key] + ' 00:00')).getTime() >= (new Date(item.fecha.split(' ')[0] + ' 00:00').getTime());
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