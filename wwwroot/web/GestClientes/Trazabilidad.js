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
        };
    },
    async mounted() {
        this.ruta = [{ text: 'Trazabilidad Estados', action: () => this.setMode(0) }];
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
        async openModal() {
            let $modal = document.getElementById('modalOverlay');
            $modal && ($modal.style.display = 'flex');
            $modal && (this.modal = $modal);
            await this.$nextTick();
            this.initChart();
        },
        closeModal(e, forzar) {
            console.log(e, forzar);
            if (this.modal && (e.target === this.modal || forzar))
                this.modal.style.display = 'none';
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
        initChart() {
            const ctx = document.getElementById('chart-js');

            let asesores = [], labels = [];
            if (!this.filtros.trazabilidad.asesor) 
                asesores = this.asesores.sort((a, b) => a.nombres.localeCompare(b.nombres));
            else 
                asesores = [this.asesores.find(a => a.usuario === this.filtros.trazabilidad.asesor)];
            labels = asesores.map(a => a.nombres);
            
            asesores.forEach(a => {
                a.visitas = this.getFilteredList('trazabilidad').filter(t => t.obj === 'Visita' && a.usuario === t.asesor).length;
                a.cotizaciones = this.getFilteredList('trazabilidad').filter(t => t.obj === 'Cotización' && a.usuario === t.asesor).length;
                a.opciones = this.getFilteredList('trazabilidad').filter(t => t.obj === 'Opción' && a.usuario === t.asesor).length;
                a.ventas = this.getFilteredList('trazabilidad').filter(t => t.obj === 'Venta' && a.usuario === t.asesor).length;
                a.liberaciones = this.getFilteredList('trazabilidad').filter(t => t.obj === 'Desistimiento' && a.usuario === t.asesor).length;
            });
            
            const data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Visitas',
                        data: asesores.map(a => a.visitas),
                        backgroundColor: "#ee4444",
                    },
                    {
                        label: 'Cotizaciones',
                        data: asesores.map(a => a.cotizaciones),
                        backgroundColor: "#4444ee",
                    },
                    {
                        label: 'Opciones',
                        data: asesores.map(a => a.opciones),
                        backgroundColor: "#44ee44",
                    },
                    {
                        label: 'Ventas',
                        data: asesores.map(a => a.ventas),
                        backgroundColor: "#9c44eeff",
                    },
                    {
                        label: 'Liberaciones',
                        data: asesores.map(a => a.liberaciones),
                        backgroundColor: "#eed444ff",
                    },
                ]
            };
            const config = {
                type: 'bar',
                data: data,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Procesos por asesor'
                        },
                    },
                    responsive: true,
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true
                        }
                    }
                }
            };
            console.log(ctx, data, this.chart);
            if (ctx) this.chart = new Chart(ctx, config);
        },
    },
    computed: {
        getFilteredList() {
			return (tabla) => {
				return this[tabla] ? this[tabla].filter(item =>
					this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
						if (tabla == 'trazabilidad' && key == 'created_on1')
							return !this.filtros[tabla][key] || 
                                (new Date(this.filtros[tabla][key])).getTime() <= (new Date(item.created_on + ' 00:00').getTime());
						if (tabla == 'trazabilidad' && key == 'created_on2')
							return !this.filtros[tabla][key] || 
                                (new Date(this.filtros[tabla][key])).getTime() >= (new Date(item.created_on + ' 00:00').getTime());
						if (key.startsWith('id_') || key === 'created_by')
							return !this.filtros[tabla][key] || String(item[key]) === this.filtros[tabla][key];
						else return !this.filtros[tabla][key] || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
					}) : []
				) : [];
			};
		},
    }
}