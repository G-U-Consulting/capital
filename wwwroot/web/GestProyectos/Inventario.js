export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            sedes: [],
            zonas: [],
            ciudadelas: [],
            salas: [],
            proyectos: [],
            clases: [],
            unidades: [],
            tipos: [],
            estados: [],
            asesores: [],
            statsPro: [],
            unidad: {},
            selSede: {},
            selCiu: {},
            selZona: {},
            selSala: {},
            selPro: {},
            selTorre: {},
            selUnd: {},

            editTipoEstado: true,

            optVisible: false,
            filMode: 'week',
            filtros: {
                unidades: { gestionado_por: '', id_torre: '' }
            },

            groupMode: 'sedes',
            chartMode: 'estados_unidad',
            idProChart: null,

            selTodos: true,
        };
    },
    async mounted() {
        this.ruta = [{ text: 'Inventario', action: () => this.setMode(0) }];
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
            let sedes = [], zonas = [], ciudadelas = [], salas = [];
            [sedes, zonas, ciudadelas, salas, this.proyectos, this.clases, this.estados, this.asesores] =
                (await httpFunc("/generic/genericDS/Gestion:Get_InitData", {})).data;
            this.salas = salas.map(s => ({ ...s, ids_proyectos: s.ids_proyectos.split(',') }));
            this.sedes = sedes.map(t => ({ ...t, selected: true }));
            this.zonas = zonas.map(t => ({ ...t, selected: true }));
            this.ciudadelas = ciudadelas.map(t => ({ ...t, selected: true }));
            hideProgress();
        },
        async loadTorres(pro) {
            if (pro && pro.id_proyecto) {
                showProgress();
                delete this.filtros.unidades.id_tipo;
                [pro.torres, this.tipos, this.unidades] = (await httpFunc("/generic/genericDS/Gestion:Get_Torres", { id_proyecto: pro.id_proyecto })).data;
                this.selTorre = {};
                this.filtros.unidades.id_torre = '';
                pro.torres.forEach(t => t.unidades = this.unidades.filter(u => u.id_torre === t.id_torre));
                hideProgress();
            }
        },
        /* async loadUnidades(torre) {
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
        }, */
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
        },

        updateFilMode(mode) {
            this.filMode = mode;
            if (mode === 'week') {
                this.filtros.unidades.created_on1 = this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 7));
                this.filtros.unidades.created_on2 = this.formatDatetime('', 'bdate', new Date(new Date().getTime()));
            }
            if (mode === 'month') {
                this.filtros.unidades.created_on1 = this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 30));
                this.filtros.unidades.created_on2 = this.formatDatetime('', 'bdate', new Date(new Date().getTime()));
            }
        },
        openModal() {
            let $modal = document.getElementById('modalOverlay');
            $modal && ($modal.style.display = 'flex');
            $modal && (this.modal = $modal);
            this.selTodos = true;
            this.onSelTodos();
        },
        closeModal(e, forzar) {
            if (this.modal && (e.target === this.modal || forzar)) {
                this.modal.style.display = 'none';
                if (this.chart) this.chart.destroy();
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
        onSelTodos() {
            this[this.groupMode].forEach(t => t.selected = this.selTodos);
            this.initChart();
        },
        toggleItem(t) {
            t.selected = !t.selected;
            if (this[this.groupMode].every(e => e.selected)) this.selTodos = true;
            else this.selTodos = false;
            this.initChart();
        },
        resetChart() {
            this.selTodos = true;
            this.onSelTodos();
        },
        async initChart() {
            if (this.chart) this.chart.destroy();
            const ctx = document.getElementById('chart-js');
            const config = {
                type: 'bar',
                options: {
                    responsive: true,
                    animation: false,
                    maintainAspectRatio: false,
                }
            };

            if (this.chartMode === 'estados_unidad')
                this.dataEstadosUnidad(config);
            if (this.chartMode === 'estados_torre')
                this.dataEstadosTorre(config);
            if (ctx) this.chart = new Chart(ctx, config);
        },
        exportChart() {
            if (this.chart) {
                console.log(this.chart);
                const link = document.createElement('a');
                link.href = this.chart.toBase64Image();
                link.download = `${this.chartMode}_${this.chartMode == 'estados_unidad' 
                    ? this.groupMode : this.chartMode == 'estados_torre' 
                    ? this.proyectos.find(p => p.id_proyecto === this.idProChart)?.nombre : ''}_${this.formatDatetime('', 'bdatetimes')}.png`;
                link.click();
            }
        },
        getColor(i, length) {
            const palette = [
                "#44ee85", "#4444ee", "#0094b9", "#173d5b", "#eed444", "#ee4444", "#b944ee", "#44eeb9", "#eea944"
            ];
            return i < palette.length ? palette[i] : `hsl(${(i * 360 / length)}, 70%, 60%)`;
        },
        async getStatsPro() {
            showProgress();
            if (this.idProChart)
                this.statsPro = (await httpFunc("/generic/genericDT/Gestion:Get_StatsProyecto", { id_proyecto: this.idProChart })).data;
            else this.statsPro = [];
            console.log(this.statsPro);
            hideProgress();
            this.resetChart();
        },

        dataEstadosUnidad(config) {
            let items = this[this.groupMode].filter(t => t.selected),
                labels = items.map(i => i.nombre.substr(0, 20));

            const data = {
                labels: labels,
                datasets: this.estados.map(e => (
                    {
                        label: e.estado_unidad,
                        data: items.map(t => t[e.estado_unidad.toLowerCase()]),
                        backgroundColor: e.color_fondo,
                        borderColor: '#666',
                        borderWidth: 1
                    }
                )),
            };
            config.data = data;
            config.options.scales = {
                x: {
                    stacked: false,
                    title: { display: true, text: this.groupMode }
                },
                y: {
                    stacked: false,
                    title: { display: true, text: 'Unidades' }
                }
            };
        },
        dataEstadosTorre(config) {
            let labels = this.statsPro.map(t => 'Torre ' + t.consecutivo);

            const data = {
                labels: labels,
                datasets: this.estados.map(e => (
                    {
                        label: e.estado_unidad,
                        data: this.statsPro.map(t => t[e.estado_unidad.toLowerCase()]),
                        backgroundColor: e.color_fondo,
                        borderColor: '#666',
                        borderWidth: 1
                    }
                )),
            };
            config.data = data;
            config.options.scales = {
                x: {
                    stacked: false,
                    title: { display: true, text: 'Torres' }
                },
                y: {
                    stacked: false,
                    title: { display: true, text: 'Unidades' }
                }
            };
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
        getItems() {
            return () => this[this.groupMode];
        },
    }
}