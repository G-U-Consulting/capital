export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            
            asesores: [],
            trazabilidad: [],

            filMode: 'week',
            filtros: {
                trazabilidad: { 
                    created_on1: this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 7)),
                    created_on2: this.formatDatetime('', 'bdate', new Date())
                }
            },

            chart: null,
            selTodos: false,
            updateTimeout: null,
            chartMode: 'acciones_asesor',
        };
    },
    async mounted() {
        this.ruta = [{ text: 'Trazabilidad Acciones', action: () => this.setMode(0) }];
        this.setRuta();
        await this.loadData();
    },
    async unmounted() {
        if (this.chart) this.chart.destroy();
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
            [this.trazabilidad, this.asesores] = 
                (await httpFunc("/generic/genericDS/Clientes:Get_Trazabilidad", {})).data;
            hideProgress();
        },

        updateFilMode(mode) {
            this.filMode = mode;
            if (mode === 'week') {
                this.filtros.trazabilidad.created_on1 = this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 7));
                this.filtros.trazabilidad.created_on2 = this.formatDatetime('', 'bdate', new Date(new Date().getTime()));
            }
            if (mode === 'month') {
                this.filtros.trazabilidad.created_on1 = this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 30));
                this.filtros.trazabilidad.created_on2 = this.formatDatetime('', 'bdate', new Date(new Date().getTime()));
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
            clearTimeout(this.updateTimeout);
            this.asesores.forEach(a => a.selected = this.selTodos);
            this.initChart();
        },
        toggleAsesor(a) {
            clearTimeout(this.updateTimeout);
            a.selected = !a.selected;
            if (this.asesores.every(a => a.selected)) this.selTodos = true;
            else this.selTodos = false;
            this.initChart();
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
            
            if (this.chartMode === 'acciones_asesor') 
                this.dataAccionesAsesor(config);
            else if (this.chartMode === 'temporal_asesor') 
                this.dataTemporalAsesor(config);
            else if (this.chartMode === 'temporal_unidad') 
                this.dataTemporalUnidad(config);
            if (ctx) this.chart = new Chart(ctx, config);
        },
        exportChart() {
            if (this.chart) {
                const link = document.createElement('a');
                link.href = this.chart.toBase64Image();
                link.download = `${this.chartMode}_${this.filtros.trazabilidad.created_on1}_${this.filtros.trazabilidad.created_on2}.png`;
                link.click();
            }
        },

        dataAccionesAsesor(config) {
            let asesores = [], labels = [];
            if (!this.filtros.trazabilidad.asesor) 
                asesores = this.asesores.filter(a => a.selected);
            else 
                asesores = [this.asesores.find(a => a.usuario === this.filtros.trazabilidad.asesor)];
            labels = asesores.map(a => a.nombres);
            asesores.forEach(a => {
                a.visitas = this.getFilteredList('trazabilidad').filter(t => t.obj === 'Visita' && a.usuario === t.asesor).length;
                a.cotizaciones = this.getFilteredList('trazabilidad').filter(t => t.obj === 'Cotización' && a.usuario === t.asesor).length;
                a.opciones = this.getFilteredList('trazabilidad').filter(t => t.obj === 'Opción' && a.usuario === t.asesor).length;
                a.ventas = this.getFilteredList('trazabilidad').filter(t => t.obj === 'Venta' && a.usuario === t.asesor).length;
                a.desistimientos = this.getFilteredList('trazabilidad').filter(t => t.obj === 'Desistimiento' && a.usuario === t.asesor).length;
            });
            const data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Visitas',
                        data: asesores.map(a => a.visitas),
                        backgroundColor: "#44ee85",
                    },
                    {
                        label: 'Cotizaciones',
                        data: asesores.map(a => a.cotizaciones),
                        backgroundColor: "#4444ee",
                    },
                    {
                        label: 'Opciones',
                        data: asesores.map(a => a.opciones),
                        backgroundColor: "#0094b9",
                    },
                    {
                        label: 'Ventas',
                        data: asesores.map(a => a.ventas),
                        backgroundColor: "#173d5b",
                    },
                    {
                        label: 'Desistimientos',
                        data: asesores.map(a => a.desistimientos),
                        backgroundColor: "#eed444",
                    },
                ]
            };
            config.data = data;
        },
        dataTemporalAsesor(config) {
            let asesores = [];
            if (!this.filtros.trazabilidad.asesor) 
                asesores = this.asesores.filter(a => a.selected);
            else 
                asesores = [this.asesores.find(a => a.usuario === this.filtros.trazabilidad.asesor)];
            const fechas = Array.from(new Set(
                this.getFilteredList('trazabilidad').map(t => t.created_on)
            )).sort();
            const palette = [
                "#44ee85", "#4444ee", "#0094b9", "#173d5b", "#eed444", "#ee4444", "#b944ee", "#44eeb9", "#eea944"
            ];
            const getColor = (i) => i < palette.length ? palette[i] : `hsl(${(i * 360 / asesores.length)}, 70%, 60%)`;
            const datasets = asesores.map((a, idx) => ({
                label: a.nombres,
                data: fechas.map(fecha =>
                    this.getFilteredList('trazabilidad').filter(
                        t => t.asesor === a.usuario && t.created_on === fecha
                    ).length
                ),
                backgroundColor: getColor(idx),
            }));

            config.data = {
                labels: fechas,
                datasets: datasets
            };
            config.options = {
                responsive: true,
                animation: false,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        title: { display: true, text: 'Fecha' }
                    },
                    y: {
                        stacked: true,
                        title: { display: true, text: 'Acciones' }
                    }
                }
            };
        },
        dataTemporalUnidad(config) {
            let unidades = [];
            if (!this.filtros.trazabilidad.unidad)
                unidades = Array.from(new Set(
                    this.getFilteredList('trazabilidad').map(t => t.unidad).filter(u => u)
                ));
            else
                unidades = [this.filtros.trazabilidad.unidad];
            const fechas = Array.from(new Set(
                this.getFilteredList('trazabilidad').map(t => t.created_on)
            )).sort();
            const palette = [
                "#44ee85", "#4444ee", "#0094b9", "#173d5b", "#eed444", "#ee4444", "#b944ee", "#44eeb9", "#eea944"
            ];
            const getColor = (i) => i < palette.length ? palette[i] : `hsl(${(i * 360 / unidades.length)}, 70%, 60%)`;
            const datasets = unidades.map((u, idx) => ({
                label: u,
                data: fechas.map(fecha =>
                    this.getFilteredList('trazabilidad').filter(
                        t => t.unidad === u && t.created_on === fecha
                    ).length
                ),
                backgroundColor: getColor(idx),
            }));
            config.data = {
                labels: fechas,
                datasets: datasets
            };
            config.options = {
                responsive: true,
                animation: false,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        title: { display: true, text: 'Fecha' }
                    },
                    y: {
                        stacked: true,
                        title: { display: true, text: 'Acciones' }
                    }
                }
            };
        }
    },
    computed: {
        getFilteredList() {
			return (tabla) => {
				return this[tabla] ? this[tabla].filter(item =>
					this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
						if (tabla == 'trazabilidad' && key == 'created_on1')
							return !this.filtros[tabla][key] || 
                                (new Date(this.filtros[tabla][key] + ' 00:00')).getTime() <= (new Date(item.created_on + ' 00:00').getTime());
						if (tabla == 'trazabilidad' && key == 'created_on2')
							return !this.filtros[tabla][key] || 
                                (new Date(this.filtros[tabla][key] + ' 00:00')).getTime() >= (new Date(item.created_on + ' 00:00').getTime());
						if (key.startsWith('id_') || key === 'created_by')
							return !this.filtros[tabla][key] || String(item[key]) === this.filtros[tabla][key];
						else return !this.filtros[tabla][key] || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
					}) : []
				) : [];
			};
		},
    }
}