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
            tmpListas: [],
            unidad: {},
            selSede: {},
            selCiu: {},
            selZona: {},
            selSala: {},
            selPro: {},
            selTorre: {},
            selUnd: {},
            proDiff: {},
            selLista: {},
            currentList: {},

            editTipoEstado: true,
            textLog: '',

            optVisible: false,
            filMode: 'week',
            filtros: {
                unidades: { gestionado_por: '' }
            },
            filFecha1: this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 7)),
            filFecha2: this.formatDatetime('', 'bdate', new Date()),

            groupMode: 'sedes',
            chartMode: 'estados_unidad',

            selTodos: true,
        };
    },
    async mounted() {
        this.ruta = [{ text: 'Trazabilidad Estados', action: () => this.setMode(0) }];
        this.setRuta();
        await this.loadData();
        await this.loadDiffEstado();
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
                [pro.torres, this.tipos] = (await httpFunc("/generic/genericDS/Gestion:Get_Torres", { id_proyecto: pro.id_proyecto })).data;
                this.selTorre = {};
                this.unidades = [];
                hideProgress();
            }
        },
        async loadUnidades(torre) {
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
        },
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
        async loadDiffEstado() {
            showProgress();
            let diff = (await httpFunc("/generic/genericDT/Gestion:Get_DiffEstados", {})).data;
            this.proyectos.forEach(p => p.diff = diff.filter(d => d.id_proyecto === p.id_proyecto)
                .map(d => ({...d, fecha: new Date(d.fecha + ' 00:00')})));
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
                this.filFecha1 = this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 7));
                this.filFecha2 = this.formatDatetime('', 'bdate', new Date(new Date().getTime()));
            }
            if (mode === 'month') {
                this.filFecha1 = this.formatDatetime('', 'bdate', new Date(new Date().getTime() - 1000 * 3600 * 24 * 30));
                this.filFecha2 = this.formatDatetime('', 'bdate', new Date(new Date().getTime()));
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
            if (this.chartMode === 'cambio_estado')
                this.dataCambioEstado2(config);
            if (ctx) this.chart = new Chart(ctx, config);
        },
        exportChart() {
            if (this.chart && this.chart.ctx) {
                const link = document.createElement('a');
                link.href = this.chart.toBase64Image();
                link.download = this.chartMode == 'estados_unidad'
                    ? `${this.chartMode}_${this.groupMode}_${this.formatDatetime('', 'bdatetimes')}.png`
                    : `${this.chartMode}_${this.proDiff.nombre || 'proyectos'}_${this.filFecha1}_${this.filFecha2}.png`
                link.click();
            }
            else {
                const svgElement = document.querySelector("#d3-js>svg");
                if (svgElement) {
                    const svgData = new XMLSerializer().serializeToString(svgElement);
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
                    const img = new Image();
                    const self = this;
                    img.onload = () => {
                        canvas.width = svgElement.clientWidth;
                        canvas.height = svgElement.clientHeight;
                        ctx.drawImage(img, 0, 0);
                        const pngFile = canvas.toDataURL("image/png");
                        
                        const link = document.createElement("a");
                        link.download = `${self.chartMode}_${this.proDiff.nombre || 'proyectos'}_${self.filFecha1}_${self.filFecha2}.png`;
                        link.href = pngFile;
                        link.click();
                    };

                    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
                }
            }
        },
        getColor(i, length) {
            const palette = [
                "#44ee85", "#4444ee", "#0094b9", "#173d5b", "#eed444", "#ee4444", "#b944ee", "#44eeb9", "#eea944"
            ];
            return i < palette.length ? palette[i] : `hsl(${(i * 360 / length)}, 70%, 60%)`;
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
        async dataCambioEstado1() {
            let $cont = document.getElementById('d3-js');
            if ($cont) {
                let [data, numUnd] = this.getDiffStates();

                let sizes = $cont.getBoundingClientRect();
                const width = sizes.width;
                const height = sizes.height - 10;
                const marginTop = 20;
                const marginRight = 20;
                const marginBottom = 20;
                const marginLeft = 40;

                // Determine the series that need to be stacked.
                const series = d3.stack()
                    .offset(d3.stackOffsetExpand)
                    .keys(d3.union(data.map(d => d.state)))
                    .value(([, D], key) => D.get(key).total)
                    (d3.index(data, d => d.date, d => d.state));

                // Prepare the scales for positional and color encodings.
                const x = d3.scaleUtc()
                    .domain(d3.extent(data, d => d.date))
                    .range([marginLeft, width - marginRight]);

                const y = d3.scaleLinear()
                    .rangeRound([height - marginBottom, marginTop]);

                const color = d3.scaleOrdinal()
                    .domain(series.map(d => d.key))
                    .range(this.estados.map(e => e.color_fondo).reverse());

                // Construct an area shape.
                const line = d3.line()
                    .x((d, i) => x(d.data[0])) // ← d.data es [date, Map(state → value)]
                    .y(d => y(d[1])); // ← borde superior

                // Create the SVG container.
                const svg = d3.create("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", [0, 0, width, height])
                    .attr("style", "max-width: 100%; height: auto;");

                // Append a path for each series.
                svg.selectAll(".line-shadow")
                    .data(series)
                    .enter().append("path")
                    .attr("class", "line-shadow")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("stroke", "#585858ff")
                    .style("stroke-width", 5);
                svg.selectAll(".line")
                    .data(series)
                    .enter().append("path")
                    .attr("class", "line")
                    .attr("d", line)
                    .style("fill", "none")
                    .style("stroke", d => color(d.key)) // usa tu escala de color
                    .style("stroke-width", 3);

                // Append the x axis, and remove the domain line.
                svg.append("g")
                    .attr("transform", `translate(0,${height - marginBottom})`)
                    .call(d3.axisBottom(x).tickSizeOuter(0))
                    .call(g => g.select(".domain").remove());

                // Add the y axis, remove the domain line, add grid lines and a label.
                svg.append("g")
                    .attr("transform", `translate(${marginLeft},0)`)
                    .call(d3.axisLeft(y).ticks(height / 80, "%")
                        .tickFormat(d => Math.round(d * numUnd)))
                    .call(g => g.selectAll(".tick line")
                        .filter(d => d === 0)
                        .clone()
                        .attr("x2", width - marginLeft - marginRight))
                    .call(g => g.append("text")
                        .attr("x", -marginLeft)
                        .attr("y", 10)
                        .attr("fill", "currentColor")
                        .attr("text-anchor", "start")
                        .text("↑ Total Unidades"));

                // Return the chart with the color scale as a property (for the legend).
                let chart = Object.assign(svg.node(), { scales: { color } });
                $cont.innerHTML = chart.outerHTML;
                //$cont.insertAdjacentElement('afterbegin', chart);
            }
        },
        async dataCambioEstado2(config) {
            let estados = this.estados;
            let datos = this.getDiffStates()[0].sort((a, b) => a.date.getTime() - b.date.getTime());
            const fechas = Array.from(new Set(
                datos.map(t => t.date)
            ));
            const datasets = estados.map((e, idx) => ({
                label: e.estado_unidad,
                data: fechas.map(fecha =>
                    datos.find(
                        t => t.state.toLowerCase() === e.estado_unidad.toLowerCase() && t.date.getTime() === fecha.getTime()
                    )?.total || 0
                ),
                backgroundColor: e.color_fondo.toLowerCase() == '#ffffff' ? '#bbb' : e.color_fondo,
                borderColor: e.color_fondo.toLowerCase() == '#ffffff' ? '#bbb' : e.color_fondo,
            }));
            config.type = 'line';
            config.data = {
                labels: fechas.map(f => this.formatDatetime('', 'bdate', f)),
                datasets: datasets
            };
            config.options.scales = {
                x: {
                    stacked: false,
                    title: { display: true, text: 'Fecha' }
                },
                y: {
                    stacked: false,
                    title: { display: true, text: 'Total Unidades' }
                }
            };
        },
        getDiffStates() {
            let selChanges = [], data = [], proCount = {}, numUnd = 0,
                estados = this.estados.map(e => ({ estado: e.estado_unidad.toLowerCase(), id: e.id_estado_unidad })),
                start = new Date(this.filFecha1 + ' 00:00'),
                end = new Date(this.filFecha2 + ' 00:00');
            if (this.proDiff && this.proDiff.diff) {
                selChanges = this.proDiff.diff.filter(d => d.fecha >= start && d.fecha <= end);
                estados.forEach(e => proCount[e.estado] = Number(this.proDiff[e.estado]));
            }
            else {
                this.proyectos.forEach(p => 
                    selChanges.push(...p.diff.filter(d => d.fecha >= start && d.fecha <= end)));
                estados.forEach(e => proCount[e.estado] = this.proyectos.reduce((a, b) => a + Number(b[e.estado] || 0), 0));
            }
            Object.keys(proCount).forEach(k => numUnd += proCount[k]);
            const changesByDate = new Map();
            selChanges.forEach(c => {
                const time = c.fecha.getTime();
                if (!changesByDate.has(time)) changesByDate.set(time, []);
                changesByDate.get(time).push(c);
            });
            while (end >= start) {
                let tomorrow = new Date(end + 1000 * 3600 * 24), 
                    changes = changesByDate.get(tomorrow.getTime()) || [];
                    estados.forEach(e => {
                        data.unshift({
                            date: end,
                            state: e.estado,
                            total: proCount[e.estado]
                        });
                        proCount[e.estado] = proCount[e.estado] 
                            + changes.filter(c => c.id_estado_unidad1 == e.id).length
                            - changes.filter(c => c.id_estado_unidad2 == e.id).length;
                    });
                
                end = new Date(end.getTime() - 1000 * 3600 * 24);
            }
            return [data, numUnd];
        },
        reqOperation(msg, okCallback, cancelCallback, item, textOk, textCancel) {
			showConfirm(msg, okCallback, cancelCallback, item, textOk, textCancel);
		},
        async openUnlockModal(unidad) {
            showProgress();
            let tmpListas = (await httpFunc("/generic/genericDT/Gestion:Get_Listas", 
                { id_unidad: unidad.id_unidad })).data;
			this.tmpListas = tmpListas.map(l => ({ ...l, precio: l.precio.replace(',', '.') }));
			let $modal = document.getElementById('modalOverlayUnlock');
			$modal && ($modal.style.display = 'flex');
			this.tmpUnidad = unidad;
            this.selLista = this.tmpListas.find(l => l.id_lista === unidad.id_lista) || {};
            this.currentList = { ...this.selLista };
            hideProgress();
		},
		closeUnlockModal(e) {
			if (e && e.target.matches('#modalOverlayUnlock')) {
				e.target.style.display = 'none';
				this.textLog = '';
                this.selLista = {};
                this.currentList = {};
                this.tmpListas = [];
			}
			if (!e || e.target.matches('.closeListModal')) {
				document.getElementById('modalOverlayUnlock').style.display = 'none';
				this.textLog = '';
                this.selLista = {};
                this.currentList = {};
                this.tmpListas = [];
			}
		},
        reqUnlockApto(apto) {
			if (!this.textLog)
				showMessage("Debe ingresar el motivo");
			else if (apto.id_estado_unidad != '1')
				this.reqOperation(`El estado de la unidad <b>${apto.unidad}</b> cambiará de <b>${apto.estado_unidad}</b> a <b>Libre</b>`,
					this.unlockApto, null, apto);
		},
        async unlockApto(apto) {
            showProgress();
			apto.estatus = 'Libre';
			apto.id_estado_unidad = '1';
            try {
				let res = await (httpFunc('/generic/genericST/Gestion:Upd_EstadoLog', {
					id_unidad: apto.id_unidad,
                    id_estado_unidad: apto.id_estado_unidad,
                    texto: this.textLog,
                    id_lista: this.selLista.id_lista,
					Usuario: GlobalVariables.username
				}));
				if (res.isError || res.data !== 'OK') throw res;
                this.closeUnlockModal();
			} catch (e) {
				console.error(e);
				showMessage('Error: ' + e.errorMessage || e.data);
			}
            hideProgress();
		},
        formatNumber(value, dec = true, ndec) {
			if (!value) return "";
			let [parteEntera, parteDecimal] = value.split(".");
			parteEntera = parteEntera.replace(/\D/g, "");
			parteDecimal = parteDecimal && dec ? parteDecimal.replace(/\D/g, "") : "";
			if (ndec >= 0)
				parteDecimal = dec && ndec > 0 ? parteDecimal.padEnd(ndec, '0') : "";

			let groups = [];
			let len = parteEntera.length;
			for (let i = len; i > 0; i -= 3)
				groups.unshift(parteEntera.substring(Math.max(0, i - 3), i));

			let formattedEntera = groups[0] || "";
			for (let i = 1; i < groups.length; i++)
				formattedEntera += '.' + groups[i];

			let result = formattedEntera;
			if (parteDecimal) {
				if (ndec > 0 && parteDecimal.length > ndec)
					parteDecimal = Math.round(parseInt(parteDecimal) / Math.pow(10, parteDecimal.length - ndec)).toString();
				result += "," + parteDecimal;
			}

			return result;
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