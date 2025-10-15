export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],

            asesores: [],
            sedes: [],
            zonas: [],
            ciudadelas: [],
            salas: [],
            trazabilidad: [],
            acciones: [],
            proyectos: [],

            filMode: 'week',
            filIdSala: '',
            filtros: {
                trazabilidad: {
                    created_on1: this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 7)),
                    created_on2: this.formatDatetime('', 'bdate', new Date())
                }
            },

            chart: null,
            selTodosAs: false,
            selTodosAcc: false,
            chartMode: 'acciones_asesor',
            groupMode: 'sede',
            verBarras: true,
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
            let asesores = [], salas = [];
            [this.trazabilidad, asesores, this.sedes, this.zonas, this.ciudadelas, salas, this.proyectos] =
                (await httpFunc("/generic/genericDS/Clientes:Get_Trazabilidad", {})).data;
            this.asesores = asesores.map(a => ({ ...a, ids_sala_venta: a.ids_sala_venta.split(',') }));
            this.salas = salas.map(s => ({ ...s, ids_proyectos: s.ids_proyectos.split(',') }));
            this.acciones = [
                { accion: "Visitas", obj: "Visita", selected: true },
                { accion: "Cotizaciones", obj: "Cotización", selected: true },
                { accion: "Opciones", obj: "Opción", selected: true },
                { accion: "Ventas", obj: "Venta", selected: true },
                { accion: "Desistimientos", obj: "Desistimiento", selected: true }
            ];
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
            this.selTodosAs = true;
            this.onSelTodosAs();
            this.selTodosAcc = true;
            this.onSelTodosAcc();
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
        onSelTodosAs() {
            this.asesores.forEach(a => a.selected = this.selTodosAs);
            this.initChart();
        },
        onSelTodosAcc() {
            this.acciones.forEach(a => a.selected = this.selTodosAcc);
            this.initChart();
        },
        toggleAsesor(a) {
            a.selected = !a.selected;
            if (this.asesores.every(a => a.selected)) this.selTodosAs = true;
            else this.selTodosAs = false;
            this.initChart();
        },
        toggleAccion(a) {
            a.selected = !a.selected;
            if (this.acciones.every(a => a.selected)) this.selTodosAcc = true;
            else this.selTodosAcc = false;
            this.initChart();
        },
        resetChart() {
            this.selTodosAs = true;
            this.onSelTodosAs();
            this.selTodosAcc = true;
            this.onSelTodosAcc();
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
            if (this.chartMode === 'temporal_asesor')
                this.dataTemporalAsesor(config);
            if (this.chartMode === 'temporal_unidad')
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
        setAccion() {
            this.acciones.forEach(a => a.selected = (!this.filtros.trazabilidad.obj || a.obj === this.filtros.trazabilidad.obj));
        },
        getColor(i, length) {
            const palette = [
                "#44ee85", "#4444ee", "#0094b9", "#173d5b", "#eed444", "#ee4444", "#b944ee", "#44eeb9", "#eea944"
            ];
            return i < palette.length ? palette[i] : `hsl(${(i * 360 / length)}, 70%, 60%)`;
        },

        dataAccionesAsesor(config) {
            let asesores = [], labels = [];
            if (!this.filtros.trazabilidad.asesor)
                asesores = this.filAsesorSala.filter(a => a.selected);
            else
                asesores = [this.filAsesorSala.find(a => a.usuario === this.filtros.trazabilidad.asesor)];
            labels = asesores.map(a => a.nombres);
            asesores.forEach(a =>
                this.acciones.filter(ac => ac.selected).forEach(ac =>
                    a[ac.obj] = this.getFilteredList('trazabilidad').filter(t => t.obj === ac.obj && a.usuario === t.asesor).length
                )
            );
            const data = {
                labels: labels,
                datasets: this.acciones.map((ac, i) => (
                    {
                        label: ac.accion,
                        data: asesores.map(a => a[ac.obj]),
                        backgroundColor: this.getColor(i, this.acciones.length)
                    }
                )),
            };
            config.data = data;
        },
        dataTemporalAsesor(config) {
            let asesores = [], acciones = this.acciones.filter(ac => ac.selected).map(ac => ac.obj);
            if (!this.filtros.trazabilidad.asesor)
                asesores = this.filAsesorSala.filter(a => a.selected);
            else
                asesores = [this.filAsesorSala.find(a => a.usuario === this.filtros.trazabilidad.asesor)];
            const fechas = Array.from(new Set(
                this.getFilteredList('trazabilidad').map(t => t.created_on)
            )).sort();
            const datasets = asesores.map((a, idx) => ({
                label: a.nombres,
                data: fechas.map(fecha =>
                    this.getFilteredList('trazabilidad').filter(
                        t => t.asesor === a.usuario && t.created_on === fecha && acciones.includes(t.obj)
                    ).length
                ),
                backgroundColor: this.getColor(idx, asesores.length),
                borderColor: this.getColor(idx, asesores.length),
                tension: 0
            }));
            config.type = this.verBarras ? 'bar' : 'line';
            config.data = {
                labels: fechas,
                datasets: datasets
            };
            config.options.scales = {
                x: {
                    stacked: this.verBarras,
                    title: { display: true, text: 'Fecha' }
                },
                y: {
                    stacked: this.verBarras,
                    title: { display: true, text: 'Acciones' }
                }
            };
        },
        dataTemporalUnidad(config) {
            let items = [], group = this.groupMode,
                acciones = this.acciones.filter(ac => ac.selected).map(ac => ac.obj);

            items = Array.from(new Set(
                group === 'sede' ? this.getFilteredList('trazabilidad').filter(t => t.id_sede).map(t => t.id_sede) :
                    group === 'zona' ? this.getFilteredList('trazabilidad').filter(t => t.id_zona_proyecto).map(t => t.id_zona_proyecto) :
                        group === 'ciudadela' ? this.getFilteredList('trazabilidad').filter(t => t.id_ciudadela).map(t => t.id_ciudadela) :
                            group === 'proyecto' ? this.getFilteredList('trazabilidad').filter(t => t.id_proyecto).map(t => t.id_proyecto) : []
            ));

            const fechas = Array.from(new Set(
                this.getFilteredList('trazabilidad').map(t => t.created_on)
            )).sort();
            const datasets = items.map((id, idx) => ({
                label: group === 'sede' ? this.sedes.find(s => s.id_sede === id)?.sede :
                    group === 'zona' ? this.zonas.find(z => z.id_zona_proyecto === id)?.zona_proyecto :
                        group === 'ciudadela' ? this.ciudadelas.find(c => c.id_ciudadela === id)?.ciudadela :
                            group === 'proyecto' ? this.proyectos.find(p => p.id_proyecto === id)?.proyecto : '',
                data: fechas.map(fecha =>
                    this.getFilteredList('trazabilidad').filter(
                        t => ((group === 'sede' && t.id_sede === id) || (group === 'zona' && t.id_zona_proyecto === id)
                            || (group === 'ciudadela' && t.id_ciudadela === id) || (group === 'proyecto' && t.id_proyecto === id)) 
                            && t.created_on === fecha && acciones.includes(t.obj)
                    ).length
                ),
                backgroundColor: this.getColor(idx, items.length),
            }));
            config.data = {
                labels: fechas,
                datasets: datasets
            };
            config.options.scales = {
                x: {
                    stacked: true,
                    title: { display: true, text: 'Fecha' }
                },
                y: {
                    stacked: true,
                    title: { display: true, text: 'Acciones' }
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
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
                        console.log(this.trazabilidad, this.filtros[tabla][key]);
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
        filAsesorSala: {
            get() { return this.asesores.filter(a => !this.filIdSala || a.ids_sala_venta.includes(this.filIdSala)) }
        },
    }
}