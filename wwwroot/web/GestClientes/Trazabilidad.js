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
            aptos: [],
            tablaPeriodos: [],
            selectedApto: {},
            infoCotizacion: {},
            infoOpcion: {},

            filMode: 'week',
            filIdSala: '',
            filIdProyecto: '',
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
            modalMode: 'grafica',
            selIdObj: null,
            activeTab: null,
			showModal: false,
            modalImage: null,
            plantProyecto: '',
            tipoProyecto: '',
            recorrido: '',
            tablaAmortizacion: false,

            tooltipVisible: false,
            tooltipX: 0,
            tooltipY: 0,
            expandedVisible: false,
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
        async openModal(mode, id_obj) {
            this.modalMode = mode;
            if (id_obj) this.selIdObj = id_obj;
            if (mode == 'Cotización')
                await this.loadCotizacion();
            if (mode == 'Opción')
                await this.loadOpcion();
            let $modal = document.getElementById('modalOverlay');
            $modal && ($modal.style.display = 'flex');
            $modal && (this.modal = $modal);
            this.resetChart();
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
        setGroupMode() {
            this.groupMode = this.chartMode == 'total_acciones' ? 'total' : 'sede';
        },
        resetChart() {
            if (this.chartMode == 'acciones_asesor') {
                this.selTodosAs = true;
                this.onSelTodosAs();
            }
            else if (this.chartMode == 'temporal_asesor' || this.chartMode == 'temporal_unidad') {
                this.selTodosAcc = true;
                this.onSelTodosAcc();
            }
            else this.initChart();
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
                    plugins: {
                        title: {
                            display: true,
                            text: `Periodo ${this.filtros.trazabilidad.created_on1} - ${this.filtros.trazabilidad.created_on2}`
                        }
                    }
                }
            };

            if (this.chartMode === 'acciones_asesor')
                this.dataAccionesAsesor(config);
            if (this.chartMode === 'temporal_asesor')
                this.dataTemporalAsesor(config);
            if (this.chartMode === 'temporal_unidad')
                this.dataTemporalUnidad(config);
            if (this.chartMode === 'total_acciones')
                this.dataTotalAcciones(config);
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
                this.getFilteredList('trazabilidad').map(t => t.created_on.split(" ")[0])
            )).sort();
            const datasets = asesores.map((a, idx) => ({
                label: a.nombres,
                data: fechas.map(fecha =>
                    this.getFilteredList('trazabilidad').filter(
                        t => t.asesor === a.usuario && t.created_on.split(" ")[0] === fecha && acciones.includes(t.obj)
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
                this.getFilteredList('trazabilidad').map(t => t.created_on.split(" ")[0])
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
                            && t.created_on.split(" ")[0] === fecha && acciones.includes(t.obj)
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
        dataTotalAcciones(config) {
            let labels = [`${this.filtros.trazabilidad.created_on1} - ${this.filtros.trazabilidad.created_on2}`],
                todos = this.groupMode === 'total',
                trazabilidad = this.getFilteredList('trazabilidad').filter(t => !this.filIdProyecto || this.filIdProyecto === t.id_proyecto),
                num_visitas = !todos ? trazabilidad.filter(t => t.obj === 'Visita').length : 0;
            const data = {
                labels: labels,
                datasets: this.acciones.filter(a => a.obj !== 'Desistimiento' && (todos || a.obj !== 'Visita'))
                    .map((a, i) => ({
                        label: a.obj,
                        data: todos
                            ? [trazabilidad.filter(t => t.obj === a.obj).length]
                            : [trazabilidad.filter(t => t.obj === a.obj).length / num_visitas * 100],
                        backgroundColor: this.getColor(i, this.acciones.length)
                    }))
            };
            config.options.scales = {
                y: {
                    min: !todos ? 0 : undefined,
                    max: !todos ? 100 : undefined,
                    ticks: {
                        callback: function (value) {
                            return !todos ? value + '%' : value;
                        }
                    }
                }
            }
            config.options.plugins = {
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.parsed.y;
                            return !todos ? value.toFixed(2) + '%' : value;
                        }
                    }
                }
            }
            config.data = data;
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
        updateCursor(event) {
            this.tooltipX = event.clientX + 10;
            this.tooltipY = event.clientY + 10;
        },
        
		openImgModal(img) {
			this.modalImage = img
			this.showModal = true
		},
		closeImgModal() {
			this.showModal = false
			this.modalImage = null
		},
        async loadCotizacion() {
            showProgress();
            if (this.modalMode == 'Cotización') {
                let cotizacion = [];
                [cotizacion, this.aptos] =
                    (await httpFunc("/generic/genericDS/Clientes:Get_Cotizacion", {id_cotizacion: this.selIdObj})).data;
                this.infoCotizacion = cotizacion[0] || {};
                if (this.aptos[0]) await this.selectApto(this.aptos[0]);
                this.activeTab = 'detalle';
            }
            hideProgress();
        },
        async loadOpcion() {
            showProgress();
            this.tablaPeriodos = [];
            if (this.modalMode == 'Opción') {
                let opcion = (await httpFunc("/generic/genericDT/Clientes:Get_Opcion", {id_opcion: this.selIdObj})).data;
                this.infoOpcion = opcion[0] || {};
            }
            this.cargarTablaDesdeDB(this.selIdObj);
            hideProgress();
        },
		formatoMoneda(valor) {
			if (valor == null || valor === '') return '';
			let limpio = String(valor)
				.replace(/[^\d,.-]/g, '')
				.replace(',', '.');
			const numero = parseFloat(limpio);
			if (isNaN(numero)) return '';
			return new Intl.NumberFormat('es-CO', {
				style: 'currency',
				currency: 'COP',
				minimumFractionDigits: 0
			}).format(numero);
		},
        cleanNumber(value) {
            if (value === null || value === undefined || value === '') return 0;
            if (typeof value === 'number') return value;

            let str = String(value).replace(/\$/g, '').replace(/\s/g, '').trim();
            if (str === '') return 0;

            const puntos = (str.match(/\./g) || []).length;
            const comas = (str.match(/,/g) || []).length;

            if (puntos > 1) {
                str = str.replace(/\./g, '').replace(',', '.');
            }
            else if (comas > 1) {
                str = str.replace(/,/g, '');
            }
            else if (puntos === 1 && comas === 1) {
                const posPunto = str.indexOf('.');
                const posComa = str.indexOf(',');
                if (posPunto < posComa) {
                    str = str.replace(/\./g, '').replace(',', '.');
                }
                else {
                    str = str.replace(/,/g, '');
                }
            }
            else if (comas === 1 && puntos === 0) {
                const partes = str.split(',');
                if (partes[1] && partes[1].length <= 2) {
                    str = str.replace(',', '.');
                }
                else {
                    str = str.replace(',', '');
                }
            }

            else if (puntos === 1 && comas === 0) {
                const partes = str.split('.');
                if (partes[1] && (partes[1].length > 2 || partes[1].length === 3)) {
                    str = str.replace(/\./g, '');
                }
            }

            return parseFloat(str) || 0;
        },
        calcularValorFinal(apto) {
			if (!apto) return '';

			let base = 0;
			if (apto.agrupacion_total && apto.agrupacion_total.trim() !== '') {
				base = Number(apto.agrupacion_total.replace(',', '.')) || 0;
			} else {
				base = Number(apto.valor_unidad.replace(',', '.')) || 0;
			}
			const descuento = Number((apto.valor_descuento || '0').replace(',', '.'));
			const total = base - descuento;

			if (isNaN(total)) return '';
			return total.toLocaleString('es-CO', {
				style: 'currency',
				currency: 'COP',
				minimumFractionDigits: 0
			});
		},
        async selectApto(apto) {
			try {
				this.selectedApto = apto;
                let id_proyecto = apto.id_proyecto, id_unidad = apto.id_unidad;
				const consultas = [
					{
						prop: "tipoProyecto",
						url: "/generic/genericDT/ProcesoNegocio:Get_Tipos",
						params: { tipo: "imagenes", id_proyecto, id_unidad },
						formatter: (data) => `/file/S3get/${data[0].llave}`
					},
					{
						prop: "plantProyecto",
						url: "/generic/genericDT/Maestros:Get_Archivos",
						params: { tipo: "planta", id_proyecto },
						formatter: (data) => `/file/S3get/${data[0].llave}`
					},
					{
						prop: "recorrido",
						url: "/generic/genericDT/ProcesoNegocio:Get_Tipos",
						params: { tipo: "recorridos virt", id_proyecto, id_unidad },
						formatter: (data) => data[0].link
					}
				];

				const results = await Promise.all(
					consultas.map((q) => httpFunc(q.url, q.params))
				);

				results.forEach((res, i) => {
					if (res.data?.length) {
						this[consultas[i].prop] = consultas[i].formatter(res.data);
					}
                    else this[consultas[i].prop] = null;
				});

				this.id_cliente = GlobalVariables.id_cliente;
			} catch (error) {
				showMessage("No se pudieron cargar los datos del apartamento.");
			}
		},
        generarTabla() {
            this.tablaPeriodos = [];

            const limpiarNumero = this.cleanNumber.bind(this);
            const redondear0 = (num) => Math.round(num);

            const [anioBase, mesBase, diaBase] = this.infoOpcion.display_fecha_primera_cuota.split('-').map(Number);
            const partesPE = this.infoOpcion.fechaPE.split('-');
            const anioPE = parseInt(partesPE[0]);
            const mesPE = parseInt(partesPE[1]) - 1;
            const diaPE = parseInt(partesPE[2]);
            const fechaPE = new Date(anioPE, mesPE, diaPE);

            const capital = limpiarNumero(this.infoOpcion.cuota_inicial);
            const tnaAntes = limpiarNumero(this.infoOpcion.tna_antes);
            const tnaDespues = limpiarNumero(this.infoOpcion.tna_despues);
            const n = limpiarNumero(this.infoOpcion.d_meses);
            
            let saldo = capital;

            let tnaActual = tnaAntes;
            const iBase = tnaAntes / 100 / 12;

            let cuotaActual;
            if (iBase === 0) {
                cuotaActual = redondear0(capital / n);
            } else {
                cuotaActual = redondear0(
                    capital * (iBase * Math.pow(1 + iBase, n)) / (Math.pow(1 + iBase, n) - 1)
                );
            }

            let fechaPeriodo = new Date(anioBase, mesBase - 1, diaBase);

            for (let j = 0; j < n; j++) {
                if (j > 0) {
                    fechaPeriodo.setMonth(fechaPeriodo.getMonth() + 1);
                }

                const fechaFormateada = `${fechaPeriodo.getDate().toString().padStart(2, '0')}/${(fechaPeriodo.getMonth() + 1).toString().padStart(2, '0')}/${fechaPeriodo.getFullYear()}`;

                const tnaPeriodo = fechaPeriodo > fechaPE ? tnaDespues : tnaAntes;

                if (tnaPeriodo !== tnaActual) {
                    tnaActual = tnaPeriodo;
                    const iNueva = tnaActual / 100 / 12;
                    const periodosRestantes = n - j;

                    if (periodosRestantes > 0) {
                        if (iNueva === 0) {
                            cuotaActual = redondear0(saldo / periodosRestantes);
                        } else {
                            cuotaActual = redondear0(
                                saldo * (iNueva * Math.pow(1 + iNueva, periodosRestantes)) / (Math.pow(1 + iNueva, periodosRestantes) - 1)
                            );
                        }
                    }
                }

                const iPeriodo = tnaActual / 100 / 12;
                const saldoInicial = saldo;

                let interesPeriodoExacto = saldoInicial * iPeriodo;
                let principalPeriodoExacto = cuotaActual - interesPeriodoExacto;
                let saldoFinalExacto = saldoInicial - principalPeriodoExacto;

                let interesPeriodo = redondear0(interesPeriodoExacto);
                let principalPeriodo = redondear0(principalPeriodoExacto);
                let saldoFinal = redondear0(saldoFinalExacto);

                if (j === n - 1) {
                    saldoFinal = 0;
                    principalPeriodo = redondear0(saldoInicial - interesPeriodo);
                    cuotaActual = redondear0(interesPeriodo + principalPeriodo);
                } else {
                    principalPeriodo = redondear0(saldoInicial - saldoFinal);
                    interesPeriodo = redondear0(cuotaActual - principalPeriodo);
                }

                this.tablaPeriodos.push({
                    periodo: j + 1,
                    fecha: fechaFormateada,
                    saldo_inicial: redondear0(saldoInicial),
                    tna: tnaActual,
                    cuota_deseada: '',
                    cuota_calculada: cuotaActual,
                    intereses: interesPeriodo,
                    principal: principalPeriodo,
                    saldo_final: saldoFinal
                });

                saldo = saldoFinal;
            }
        },
        validar(index) {
            const fila = this.tablaPeriodos[index];
            const originalValue = fila.cuota_deseada;

            this.$nextTick(() => {
                if (!originalValue || originalValue.trim() === '') {
                    fila.cuota_deseada = '';
                    return;
                }
                const numeroParaFormato = this.cleanNumber(originalValue);
                fila.cuota_deseada = this.formatoMoneda(numeroParaFormato);
            });
        },
        recalcularFila(index) {
            const limpiarNumero = this.cleanNumber.bind(this);

            const redondear0 = (num) => Math.round(num);

            const calcularPMT = (i, n, p) => {
                if (i === 0) return p / n;
                const factor = Math.pow(1 + i, n);
                return (i * p * factor) / (factor - 1);
            };

            const fila = this.tablaPeriodos[index];
            const totalPeriodos = this.tablaPeriodos.length;

            const iPeriodo = fila.tna / 100 / 12;

            let cuotaEfectiva;

            const valorActual = String(fila.cuota_deseada || '').trim();

            if (valorActual === '') {
                
                fila.cuota_deseada = '';

                const periodosRestantes = totalPeriodos - fila.periodo + 1;

                if (fila.periodo <= totalPeriodos && fila.saldo_inicial > 0) {
                    cuotaEfectiva = redondear0(
                        calcularPMT(iPeriodo, periodosRestantes, Math.abs(fila.saldo_inicial))
                    );
                } else {
                    cuotaEfectiva = 0;
                }

            } else {
               
                const cuotaDeseadaInput = limpiarNumero(fila.cuota_deseada);
                cuotaEfectiva = cuotaDeseadaInput;
            }

            if (fila.saldo_inicial <= 0) {
                fila.cuota_calculada = 0;
                fila.intereses = 0;
                fila.principal = 0;
                fila.saldo_final = 0;
            } else {
                const cuotaParaCalculo = Number(cuotaEfectiva) || 0;

                const interesPeriodo = redondear0(fila.saldo_inicial * iPeriodo);
                const principalPeriodo = redondear0(cuotaParaCalculo - interesPeriodo);
                const saldoFinal = redondear0(fila.saldo_inicial - principalPeriodo);

                fila.cuota_calculada = cuotaParaCalculo;
                fila.intereses = interesPeriodo;
                fila.principal = principalPeriodo;
                fila.saldo_final = saldoFinal;
            }

            let saldoTemp = fila.saldo_final;
            for (let i = index + 1; i < this.tablaPeriodos.length; i++) {
                const f = this.tablaPeriodos[i];
                f.saldo_inicial = saldoTemp;

                if (saldoTemp <= 0) {
                    for (let j = i; j < this.tablaPeriodos.length; j++) {
                        const fRest = this.tablaPeriodos[j];
                        fRest.saldo_inicial = 0;
                        fRest.intereses = 0;
                        fRest.principal = 0;
                        fRest.cuota_calculada = 0;
                        fRest.saldo_final = 0;
                    }
                    break;
                }

                const iPeriodoSig = f.tna / 100 / 12;
                const interesSig = redondear0(saldoTemp * iPeriodoSig);
                let cuotaSig;

             
                const valorSig = String(f.cuota_deseada || '').trim();
                if (valorSig !== '') {
               
                    cuotaSig = limpiarNumero(f.cuota_deseada);
                } else {
                
                    const periodosRestantesSig = totalPeriodos - f.periodo + 1;
                    cuotaSig = redondear0(
                        calcularPMT(iPeriodoSig, periodosRestantesSig, Math.abs(saldoTemp))
                    );
                }
                const principalSig = redondear0(cuotaSig - interesSig);
                const saldoFinalSig = redondear0(saldoTemp - principalSig);
                f.intereses = interesSig;
                f.principal = principalSig;
                f.cuota_calculada = cuotaSig;
                f.saldo_final = saldoFinalSig;

                saldoTemp = saldoFinalSig;
            }

            let totalSaldosNegativos = 0;
            for (let i = 0; i < this.tablaPeriodos.length; i++) {
                const fila = this.tablaPeriodos[i];
                if (fila.saldo_final < 0) {
                    totalSaldosNegativos += fila.saldo_final;
                    break;
                }
            }

            if (this.infoOpcion.pago_financiado == '1') {
                const ultima = this.tablaPeriodos[this.tablaPeriodos.length - 1];

                if (ultima) {
                    const cuotaDeseada = limpiarNumero(ultima.cuota_deseada);
                    const cuotaCalculada = limpiarNumero(ultima.cuota_calculada);
                    //this.ultimaCuotaDigitada = cuotaDeseada;

                    if (cuotaDeseada > cuotaCalculada) {
                        const diferencia = cuotaDeseada - cuotaCalculada;

                        ultima.cuota_calculada = -diferencia;
                        ultima.principal = -diferencia;
                        ultima.saldo_final = -diferencia;
                    }
                }
            }

            const ultima = this.tablaPeriodos[this.tablaPeriodos.length - 1];

            if (ultima) {
                
                const haySaldoNegativoAnterior = this.tablaPeriodos.some((f, idx) =>
                    idx < this.tablaPeriodos.length - 1 && f.saldo_final < 0
                );

                if (!haySaldoNegativoAnterior) {
                    if (ultima.saldo_final < 0 && this.infoOpcion.pago_financiado == '1')
                        return;
                    if (ultima.saldo_final < 1 && ultima.saldo_final > -1)
                        ultima.saldo_final = 0;
                    else if (ultima.saldo_final !== 0 && ultima.saldo_inicial > 0) {
                        const saldoAnterior = ultima.saldo_inicial;
                        const interesUltimo = ultima.intereses;
                        ultima.principal = redondear0(saldoAnterior);
                        ultima.cuota_calculada = redondear0(saldoAnterior + interesUltimo);
                        ultima.saldo_final = 0;
                    }
                }
            }
        },
        async cargarTablaDesdeDB(id_opcion) {
            try {
                const resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Amortizacion', {
                    id_opcion
                });

                if (resp.data && resp.data[0] && resp.data[0].length > 0) {
                    this.cargarTablaAmortizacion(resp.data[0]);
                } else {
                    await this.generarTabla();
                }
            } catch (error) {
                console.error('Error al cargar tabla desde BD:', error);
                await this.generarTabla();
            }
        },
        cargarTablaAmortizacion(datosTabla) {
            try {
                this.tablaPeriodos = datosTabla.map(fila => {
                    let fechaFormateada = fila.fecha;
                    if (fila.fecha && fila.fecha.includes('-')) {
                        const partes = fila.fecha.split('-');
                        if (partes.length === 3) {
                            fechaFormateada = `${partes[2].padStart(2, '0')}/${partes[1].padStart(2, '0')}/${partes[0]}`;
                        }
                    }

                    const saldoInicialLimpio = this.cleanNumber(fila.saldo_inicial);
                    const tnaLimpia = this.cleanNumber(fila.tna);
                    const cuotaCalculadaLimpia = this.cleanNumber(fila.cuota_calculada);
                    const interesesLimpios = this.cleanNumber(fila.intereses);
                    const principalLimpio = this.cleanNumber(fila.principal);
                    const saldoFinalLimpio = this.cleanNumber(fila.saldo_final);
      
                    let cuotaDeseadaFormateada = '';
                    if (fila.cuota_deseada) {
                        const cuotaDeseadaLimpia = this.cleanNumber(fila.cuota_deseada);
                        if (cuotaDeseadaLimpia > 0) {
                            cuotaDeseadaFormateada = this.formatoMoneda(cuotaDeseadaLimpia);
                        }
                    }

                    return {
                        periodo: parseInt(fila.periodo),
                        fecha: fechaFormateada,
                        saldo_inicial: saldoInicialLimpio,
                        tna: tnaLimpia,
                        cuota_deseada: cuotaDeseadaFormateada,
                        cuota_calculada: cuotaCalculadaLimpia,
                        intereses: interesesLimpios,
                        principal: principalLimpio,
                        saldo_final: saldoFinalLimpio
                    };
                });

                /* if (this.tablaPeriodos.length > 0) {
                    this.tablaAmortizacion = true;
                } */
            } catch (error) {
                console.error('❌ [cargarTablaAmortizacion] Error al cargar tabla de amortización:', error);
            }
        },
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
                        if (tabla == 'trazabilidad' && key == 'created_on1')
                            return !this.filtros[tabla][key] ||
                                (new Date(this.filtros[tabla][key] + ' 23:59:59')).getTime() <= (new Date(item.created_on).getTime());
                        if (tabla == 'trazabilidad' && key == 'created_on2')
                            return !this.filtros[tabla][key] ||
                                (new Date(this.filtros[tabla][key] + ' 23:59:59')).getTime() >= (new Date(item.created_on).getTime());
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
        f_total: {
            get() {
                let total = 0;
                this.aptos.forEach(a => {
                    if (a.id_agrupacion == '') total += Number(a.valor_unidad.replace(',', '.'));
                    else total += Number(a.agrupacion_total.replace(',', '.'));
                });
                return total;
            },
        },
        excedentePagoCuotaInicial() {
            if (!this.tablaPeriodos || this.tablaPeriodos.length === 0) return 0;
            for (let i = 0; i < this.tablaPeriodos.length; i++) {
                const fila = this.tablaPeriodos[i];
                if (fila.saldo_final < 0) {
                    return Math.abs(fila.saldo_final);
                }
            }
            return 0;
        },
        importeFinanciacionAjustado() {
            return (this.infoOpcion.valor_credito_base - this.excedentePagoCuotaInicial) || 0;
        },
    }

}