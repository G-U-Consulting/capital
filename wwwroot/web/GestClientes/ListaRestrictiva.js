export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            listas: [],
            proyectos: [],

            filMode: 'week',
            filtros: {
                listas: { 
                    nombre_id: '',
                    fechaI: this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 7)),
                    fechaF: this.formatDatetime('', 'bdate', new Date())
                }
            },

            searchCli: null,
            cliente: {},
            lista: {},

            newMode: true,
            jsonList: [],
        };
    },
    async mounted() {
        this.ruta = [{ text: 'Listas Restrictivas', action: () => this.setMode(0) }];
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
            [this.proyectos, this.listas] = (await httpFunc("/generic/genericDS/Clientes:Get_ListaRestrictiva", {})).data;
            hideProgress();
        },
        onClear(table) {
            let item = this.filtros[table];
            item = Object.keys(item).forEach((key) => item[key] = '');
        },
        async onDelete() {
            showProgress();
            let res = null;
            try {
                res = await httpFunc('/generic/genericST/Clientes:Del_ListaRestrictiva', { id_lista: this.lista.id_lista });
                if (res.isError || res.data !== 'OK') throw res;
                this.loadData();
                this.closeModal();
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
        },
        closeModal(e) {
            if (e && e.target.matches('#modalOverlay')) {
                e.target.style.display = 'none';
                this.lista = {};
            }
            if (!e || e.target.matches('.modal-cerrar.events')) {
                let $modal = document.getElementById('modalOverlay');
                $modal && ($modal.style.display = 'none');
                this.lista = {};
            }
        },
        onSelect(lista) {
            this.openModal();
            this.lista = lista;
            this.jsonList = JSON.parse(lista.resultados);
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
                this.filtros.listas.fechaI = this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 7));
                this.filtros.listas.fechaF = this.formatDatetime('', 'bdate', new Date(new Date().getTime()));
            }
            if (mode === 'month') {
                this.filtros.listas.fechaI = this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 30));
                this.filtros.listas.fechaF = this.formatDatetime('', 'bdate', new Date(new Date().getTime()));
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
        getIniciales(nombre) {
            let n = nombre.split(" ");
            if (n.length > 2)
                return (n[0][0] || '') + (n[2][0] || '');
            else if (n.length > 1)
                return (n[0][0] || '') + (n[1][0] || '');
            else if (n.length == 1) return n[0][0] || '';
            else return "UU";
        }
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
                        if (tabla == 'listas' && key == 'fechaI')
                            return !this.filtros[tabla][key] ||
                                (new Date(this.filtros[tabla][key] + ' 00:00')).getTime() <= (new Date(item.created_on + ' 00:00').getTime());
                        if (tabla == 'listas' && key == 'fechaF')
                            return !this.filtros[tabla][key] ||
                                (new Date(this.filtros[tabla][key] + ' 00:00')).getTime() >= (new Date(item.created_on + ' 00:00').getTime());
                        if (key.startsWith('id_') || key === 'created_by')
                            return !this.filtros[tabla][key] || String(item[key]) === this.filtros[tabla][key];
                        if (tabla == 'listas' && key == 'nombre_id')
                            return this.filtros[tabla][key] === ''
                                || String(item['nombre']).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                                || String(item['numero_documento']).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
                        else return !this.filtros[tabla][key] || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
                    }) : []
                ) : [];
            };
        },
    }
}