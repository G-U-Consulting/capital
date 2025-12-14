const PORCENTAJE_CUOTA_MAXIMA = 0.40;
const MESES_POR_ANO = 12;
const PORCENTAJE_A_DECIMAL = 100;
const MILLONES = 1000000;

export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            submode: 1,
            tabsIncomplete: [],
            tabs: [
                "Bienvenida",
                "Registro",
                "Cotización",
                "Opción",
            ],
            showPolicyModal: false,
            policyAccepted: false,
            ObjCliente: {
                id_cliente: '',
                nombres: '',
                apellido1: '',
                apellido2: '',
                direccion: '',
                ciudad: '',
                barrio: '',
                departamento: '',
                pais: '',
                email1: '',
                email2: '',
                telefono1: '',
                telefono2: '',
                tipoDocumento: '',
                numeroDocumento: '',
                paisExpedicion: '',
                departamentoExpedicion: '',
                ciudadExpedicion: '',
                fechaExpedicion: '',
                isPoliticaAceptada: 0,
                ventanaUnidades: null,
                currentSubmode: null,
                is_atencion_rapida: 0,
                is_titular: 0,
                nombreEmpresa: '',
                nit: '',
                fechaNacimiento: '',
                porcentaje_copropiedad: '',
                pais_tel1: 'co',
                pais_tel2: 'co',
                codigo_tel1: '+57',
                codigo_tel2: '+57'
            },
            ObjClienteOpcional: {
                id_cliente: '',
                nombres: '',
                apellido1: '',
                apellido2: '',
                direccion: '',
                ciudad: '',
                barrio: '',
                departamento: '',
                pais: '',
                email1: '',
                email2: '',
                telefono1: '',
                telefono2: '',
                tipoDocumento: '',
                numeroDocumento: '',
                paisExpedicion: '',
                departamentoExpedicion: '',
                ciudadExpedicion: '',
                fechaExpedicion: '',
                isPoliticaAceptada: 0,
                ventanaUnidades: null,
                currentSubmode: null,
                is_atencion_rapida: 0,
                is_titular: 0,
                nombreEmpresa: '',
                nit: '',
                fechaNacimiento: '',
                porcentaje_copropiedad: '',
                pais_tel1: 'co',
                pais_tel2: 'co',
                codigo_tel1: '+57',
                codigo_tel2: '+57'
            },
            ObjVisita: {
                id_proyecto: '',
                tipo_registro: '',
                modo_atencion: '',
                id_categoria: '',
                id_medio: '',
                id_motivo_compra: '',
                id_referencia: '',
                id_presupuesto_vivienda: '',
                otro_texto: '',
                descripcion: '',
                id_cliente: '',
                id_tipo_tramite: '',
                usuario: '',
            },
            modo_atencion: [],
            tipo_registro: [],
            tipo_tramite: [],
            planes_pago: [],
            banco_financiador: [],
            planSeleccionado: '',
            iscliente: false,
            israpida: false,
            cliente: '',
            clienteOpcional: '',
            isboton: true,
            tablaAmortizacion: false,
            cargandoTablaDesdeDB: false,
            tab: ['Registros de visita', 'Registros de compras'],
            activeTab: 0,
            visitas: [],
            id_cliente: 0,
            filtroProyecto: '',
            contadorProyectos: {},
            unidades: [],
            tipoProyecto: null,
            logoProyecto: null,
            tipo_factor: [],
            pagoSeleccionado: '',
            registroCompras: [
                {
                    fecha: '2025-06-01',
                    proyecto: 'Proyecto A',
                    tipo: 'Compra',
                    modo: 'Contado',
                    descripcion: 'Compra de materiales A',
                    id_cliente: 111111
                },
                {
                    fecha: '2025-06-15',
                    proyecto: 'Proyecto B',
                    tipo: 'Compra',
                    modo: 'Crédito',
                    descripcion: 'Compra de herramientas B',
                    id_cliente: 111111
                }
            ],
            cotizacionActiva: null,
            mostrarModal: false,
            asuntoSeleccionado: '',
            cotizacion: [
                "Seguimiento a la cotización",
            ],
            opcion: [
                "Seguimiento a la opción",
            ],
            cotizacionSeleccionada: null,
            cotizaciones: [],
            ishistory: false,
            isTitular: false,
            showModal: false,
            vetoData: '',
            camposBloqueados: false,
            registro: false,
            id_opcion: null,
            tieneCambiosPendientes: false,
            ventanaUnidadesCheckInterval: null,

            bancoSeleccionado: 0,
            unidadSeleccionada: 0,
            anioSeleccionado: "",
            unidadesDisponibles: [],
            listaAnios: [],
            isClienteVetado: null,
            subsidioActivo: false,
            cajas_compensacion: [],
            caja_compensacion: "",
            listaAniosEntrega: [],
            seleccionAnioEntrega: "",
            valor_subsidio: 0,
            subsidio_vivienda: [],
            asesor: {},
            ingresos_mensuales: 0,

            cuota_inicial: 0,
            valor_credito: 0,
            cesantias: 0,
            ahorros: 0,
            seleccionPlan: 0,
            valor_descuento_adicional: 0,
            valor_escrituras: 0,
            valor_separacion: 0,
            fin_max_permisible: 0,
            cuota_max_financiable: 0,
            ingr_regs_max: 0,
            cuota_permisible: 0,

            tipoFinanciacionSeleccionada: '',

            valor_reformas: 0,
            valor_reformas_texto: '',
            valor_descuento: 0,
            valor_acabados: 0,

            principalStr: '',
            tnaAntes: 12,
            tnaDespues: 12,
            fechaEntrega: '',
            fechaPE: '',
            fechaPrimeraCuota: '',
            meses: 12,
            decimales: 2,
            payment: 0,
            schedule: [],

            d_tna_antes: 0,
            d_tna_despues: 0,
            d_fecha_escrituracion: '',
            d_fecha_entrega: '',
            d_fecha_ulti_cuota: '',
            d_fecha_pe: '',
            d_fecha_cuota: null,
            d_meses: 0,
            meses_max: 0,
            fechaAnterior: null,
            tablaPeriodos: [],
            f_cotizacion: '',
            unidadOpcion: '',


            opcion_fecha_entrega: null,
            opcion_fecha_escrituracion: null,
            opcion_fecha_primera_cuota: null,
            opcion_fecha_ultima_cuota: null,
            opcion_valor_reformas: null,
            opcion_valor_acabados: null,
            opcion_valor_separacion: null,
            opcion_fin_max_permisible: null,
            opcion_cuota_max_financiable: null,
            opcion_ingr_regs_max: null,

            clientes: [],
            ObjClienteOriginal: null,
            mostrarCliente: true,
            editandoIngresos: false,
            valor_credito_max: 0,
            valor_credito_final: 0,
            cuota_inicial_final: 0,

            mostrarModalCliente: false,
            mostrarTooltipOpcion: false,

            valor_notariales: 0,
            valor_beneficiencia: 0,
            valor_registro: 0,

            valor_credito_base: 0,

            detalle: false,

            ultimaCuotaResultado: 0,
            ultimaCuotaDigitada: 0,

            tel1: null,
            tel2: null,
            iti1: null,
            iti2: null,

            reformaActivo: false,
            importeBase: 0,
            cuota_inicial_base: 0,

            categoria: [],
            medio: [],
            motivo_compra: [],
            referencia: [],
            presupuesto_vivienda: [],
            tipo_financiacion: [],
            ids_unidades: [],
            tipoPlanta: null,
            selectedApto: null,
            cuota_escritura_final: 0,
            importeOriginal: 0,
            _ultimoTipoFinanciacion: null,
            noregistro: false,
            id_visita: null,
            nombre: '',
            nombre_asesor: '',
            proyecto: '',
            añoentrega: '',
            consecutivo: '',
            f_creacion: '',
            idcotizacion: null,
            cotizacionId: null,
            factoresBanco: [],
            factorSeleccionado: null,
            camposObligatorios: [],
            nombreCampos: {},
            factorBanco: 0,
            idFactorBanco: null,
            valor_credito_final_base: 0,
            cuota_inicial_final_anterior: null,
            davivienda: {},

            showBorradorModal: false,
            borradorData: null,
            guardandoBorrador: false,
            modoSoloLectura: false,
            unidadesYaOpcionadas: false,
            showDaviviendaModal: false,
            davForm: true,
            davUrl: null,
        };
    },
    async mounted() {
        this.tabsIncomplete = this.tabs.map((_, index) => index);
        GlobalVariables.miniModuleCallback("ProcesoNegocio", null);
        let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Variables', {usuario: GlobalVariables.username});
        let respa = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidades', {id_proyecto: this.id_proyecto});
        this.categoria = resp.data[0];
        this.medio = resp.data[1];
        this.motivo_compra = resp.data[2];
        this.referencia = resp.data[3];
        this.tipo_registro = resp.data[4];
        this.modo_atencion = resp.data[5];
        this.presupuesto_vivienda = resp.data[6];
        this.tipo_tramite = resp.data[7];
        this.planes_pago = resp.data[8];
        this.tipo_financiacion = respa.data[6];
        this.meses = respa.data[7][0].meses_ci;
        this.banco_financiador = resp.data[10];
        this.tipo_factor = resp.data[11];
        this.cajas_compensacion = resp.data[12];
        this.subsidio_vivienda = resp.data[13];
        let usuario = resp.data[14];
        if (usuario && usuario.length) this.asesor = usuario[0];
        this.campoObligatorio();
        window.addEventListener('keydown', this.eliminarCotizacionActivaSiVacia);
        window.addEventListener('message', this.handleMessages);
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        this.isSubsidio();

        window.activeMiniModule = this;
        window.activeMiniModule.name = "ProcesoNegocio";

    },
    methods: {
        formatNumber(value, dec = true, ndec = 2) {
            if (value == null || value === "") return "";

            value = value.toString();
            value = value.replace(/\./g, "");
            value = value.replace(",", ".");

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
            if (parteDecimal && dec && ndec > 0) {
                if (parteDecimal.length > ndec)
                    parteDecimal = Math.round(
                        parseInt(parteDecimal) / Math.pow(10, parteDecimal.length - ndec)
                    ).toString();
                result += "," + parteDecimal;
            }

            return result;
        },
        cleanNumber(value) {
            if (value === null || value === undefined || value === '') return 0;
            if (typeof value === 'number') return value;

            const cleaned = String(value)
                .replace(/\$/g, '')
                .replace(/\s/g, '')
                .replace(/\./g, '')
                .replace(',', '.')
                .trim();

            if (cleaned === '') return 0;
            return parseFloat(cleaned) || 0;
        },
        validarFormato(e) {
            e.target.value = e.target.value.replaceAll(/[^0-9\.,]/g, '');
            if (e.target.value == '') e.target.value = '0';
            e.target.value = e.target.value.replace(/^0+(\d)/, '$1');
        },
        inRange(e, min, max) {
            const value = this.cleanNumber(e.target.value);
            e.target.value = Math.min(Math.max(value, min), max);
        },
        toggleApto(apto) {
            let i = this.ids_unidades.indexOf(apto.id_unidad);
            i === -1 ? this.ids_unidades.push(apto.id_unidad) : this.ids_unidades.splice(i, 1);
        },
        calcularSubsidio() {
            if (this.esOpcionGuardada || this.cargandoBorrador) {
                return;
            }

            if (!this.seleccionAnioEntrega) {
                this.valor_subsidio = 0;
                return;
            }

            const registro = this.subsidio_vivienda.find(s => s.periodo == this.seleccionAnioEntrega);

            if (!registro) {
                this.valor_subsidio = 0;
                return;
            }

            const parseNumber = (valor) => {
                if (!valor) return 0;
                return parseFloat(String(valor).replace(/\$/g, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.'));
            };

            const ingresosLimpios = parseNumber(this.ingresos_mensuales);
            const smmlv = parseNumber(registro.smmlv);
            const smmlv_0_2 = parseNumber(registro.smmlv_0_2);
            const smmlv_2_4 = parseNumber(registro.smmlv_2_4);


            if (!ingresosLimpios || ingresosLimpios === 0) {
                this.valor_subsidio = 0;
                return;
            }

            if (ingresosLimpios <= smmlv * 2) {
                this.valor_subsidio = smmlv_0_2;
            } else if (ingresosLimpios <= smmlv * 4) {
                this.valor_subsidio = smmlv_2_4;
            } else {
                this.valor_subsidio = 0;
                this.seleccionAnioEntrega = '';
            }

        },
        async calcularFinanciacion() {
            if (this.esOpcionGuardada) {
                return;
            }

            if (this.tipoFinanciacionSeleccionada) {
                this.modalidadSeleccionada = this.tipoFinanciacionSeleccionada;
            }

            if (!this.tipoFinanciacionSeleccionada || !this.importeOriginal) {
                this.ingresos_mensuales = 0;
                this.valor_credito_final = 0;
                this.cuota_inicial_final = 0;
                return;
            }

            if (this.pagoSeleccionado === 'contado') {
                this.ingresos_mensuales = '$ 0';
                this.seleccionAnioEntrega = '';
                this.caja_compensacion = '';
                this.valor_subsidio = '0';
                this.onBlurIngresos();
            }

            const plan = this.tipo_financiacion.find(
                (p) => p.tipo_financiacion === this.tipoFinanciacionSeleccionada
            );

            if (!plan || !plan.tipo_financiacion) {
                this.cuota_inicial = 0;
                this.valor_credito = 0;
                return;
            }

            const match = plan.tipo_financiacion.match(/(\d+)[^\d]+(\d+)/);
            if (!match) {
                this.cuota_inicial = 0;
                this.valor_credito = 0;
                return;
            }

            const pctInicial = Number(match[1]);
            const pctCredito = Number(match[2]);

            const importeOriginalNumber = this.cleanNumber(this.importeOriginal);
            const descuentoAdicionalNumber = this.cleanNumber(this.valor_descuento_adicional);

            const baseCredito = (importeOriginalNumber - descuentoAdicionalNumber) * (pctCredito / 100);
            const baseInicial = importeOriginalNumber * (pctInicial / 100);
            const cuotaInicialTotal = this.cleanNumber(this.importeActiva) - baseCredito;

            let totalAportes = this.cleanNumber(this.cesantias) + this.cleanNumber(this.ahorros);

            if (this.pagoSeleccionado?.toLowerCase() === "financiado") {
                totalAportes += this.cleanNumber(this.valor_subsidio);
            }

            if (totalAportes >= cuotaInicialTotal) {
                this.cuota_inicial = 0;
                this.valor_credito = Math.max(Math.round(baseCredito), 0);
            } else {
                this.cuota_inicial = Math.round(cuotaInicialTotal);
                this.valor_credito = Math.round(baseCredito);
            }

            this.cuota_inicial_base = this.cuota_inicial;
            this.valor_credito_base = this.valor_credito;

            if (this.ingresos_mensuales) {
                this.onBlurIngresos();
            }
        },
        calcularPlanPago() {
            if (this.esOpcionGuardada) {
                return;
            }

            if (!this.planSeleccionado || !this.importeOriginal) {
                this.cuota_inicial = 0;
                this.valor_credito = 0;
                return;
            }

            let fechaHoy = new Date();
            let fechaPrimeraCuota = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth() + 1, 1);

            let diaSemana = fechaPrimeraCuota.getDay();
            if (diaSemana === 0) fechaPrimeraCuota.setDate(2);
            if (diaSemana === 6) fechaPrimeraCuota.setDate(3);

            const yyyyC = fechaPrimeraCuota.getFullYear();
            const mmC = String(fechaPrimeraCuota.getMonth() + 1).padStart(2, '0');
            const ddC = String(fechaPrimeraCuota.getDate()).padStart(2, '0');
            this.d_fecha_cuota = `${yyyyC}-${mmC}-${ddC}`;

            this.cuota_inicial = this.importeOriginal;
            this.valor_credito = 0;

        },
        async handleMessages(event) {
            if (event.data?.type === 'REFRESH_COTIZACION') {
                await this.seleccionarCotizacion(event.data.cotizacionId);
            }
        },

        handleBeforeUnload(event) {
            if (this.mode === 3 && this.tieneCambiosPendientes && !this.esOpcionGuardada) {
                event.preventDefault();
                event.returnValue = '';
                return '';
            }
        },

        validateModeCliente() {
            const camposObligatorios = [
                { campo: "nombres", label: "Nombres" },
                { campo: "apellido1", label: "Primer Apellido" },
                { campo: "apellido2", label: "Segundo Apellido" },
                { campo: "fechaNacimiento", label: "Fecha de Nacimiento" },
                { campo: "direccion", label: "Dirección" },
                { campo: "ciudad", label: "Ciudad" },
                { campo: "barrio", label: "Barrio" },
                { campo: "departamento", label: "Departamento" },
                { campo: "tipoDocumento", label: "Tipo de Documento" },
                { campo: "numeroDocumento", label: "Número de Documento" },
            ];

            const faltante = camposObligatorios.find(c => !this.ObjCliente[c.campo] || this.ObjCliente[c.campo].trim() === "");

            if (faltante) {
                showMessage(`Debe diligenciar el campo obligatorio: ${faltante.label}`);
                return false;
            }

            if (!this.policyAccepted) {
                showMessage("Debe aceptar la política para continuar.");
                return false;
            }

            return true;
        },

        async validateModeOpcion() {
   
            if (!this.cotizacionSeleccionada) {
                showMessage("No hay cotización seleccionada.");
                return false;
            }

            const cotizacion = this.cotizaciones.find(c => c.cotizacion === this.cotizacionSeleccionada);
            if (!cotizacion) {
                showMessage("No hay cotización seleccionada.");
                return false;
            }

            const hoyStr = new Date().toISOString().slice(0, 10);
            const fechaStr = (cotizacion.fecha instanceof Date)
                ? cotizacion.fecha.toISOString().slice(0, 10)
                : this.normalizarFecha(cotizacion.fecha);

            if (fechaStr !== hoyStr) {
                showMessage("Solo puede opcionar cotizaciones del día de hoy.");
                return false;
            }

            if (cotizacion.importe <= 0) {
                showMessage("La cotización seleccionada no tiene Item.");
                return false;
            }

            return true;
        },

        async prepararDatosOpcion() {
            this.limpiarDatosOpcion();

            this.importeBase = this.totalFinal;

            const id_unidad = this.unidades[0]?.id_unidad;
            if (!id_unidad) return;

            const resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidad', { id_unidad });
            this.unidadOpcion = resp.data[0][0];
            this.reformaActivo = this.unidadOpcion?.inv_terminado == 1;

            if (GlobalVariables.id_proyecto) {
                try {
                    const id_proyecto = GlobalVariables.id_proyecto;

                    const consultas = [
                        {
                            prop: "tipoProyecto",
                            url: "/generic/genericDT/ProcesoNegocio:Get_Tipos",
                            params: { tipo: "imagenes", id_proyecto, id_unidad },
                            formatter: (data) => data?.[0] ? `/file/S3get/${data[0].llave}` : null
                        },
                        {
                            prop: "tipoPlanta",
                            url: "/generic/genericDT/Maestros:Get_Archivos",
                            params: { tipo: "planta", id_proyecto },
                            formatter: (data) => data?.[0] ? `/file/S3get/${data[0].llave}` : null
                        },
                        {
                            prop: "logoProyecto",
                            url: "/generic/genericDT/Maestros:Get_Archivos",
                            params: { tipo: "logo", id_proyecto },
                            formatter: (data) => data?.[0] ? `/file/S3get/${data[0].llave}` : null
                        }
                    ];

                    const [resProyecto, resPlanta, resLogo] = await Promise.all(
                        consultas.map((q) => httpFunc(q.url, q.params))
                    );

                    this.tipoProyecto = resProyecto.data?.length
                        ? consultas[0].formatter(resProyecto.data)
                        : null;

                    this.tipoPlanta = resPlanta.data?.length
                        ? consultas[1].formatter(resPlanta.data)
                        : null;

                    this.logoProyecto = resLogo.data?.length
                        ? consultas[2].formatter(resLogo.data)
                        : null;

                } catch (error) {
                    console.error("Error al cargar las imágenes del apartamento:", error);
                }
            }

            try {
                let img = await fetch('../../img/ico/svg/logo-capital.svg');
                img = await img.text();
                await this.$nextTick();
                const container = document.getElementById('logo-capital');
                if (container) container.innerHTML = img;
            } catch (error) {
                console.error("Error al cargar el logo:", error);
            }

            await this.cargarOpcionExistente();
        },

        limpiarDatosOpcion() {
            this.id_opcion = null;

            this.valor_descuento_adicional = 0;
            this.valor_escrituras = 0;
            this.valor_notariales = 0;
            this.valor_beneficiencia = 0;
            this.valor_registro = 0;

            this.pagoSeleccionado = '';

            this.bancoSeleccionado = 0;
            this.tipoSeleccionado = null;
            this.anioSeleccionado = '';
            this.modalidadSeleccionada = null;

            this.ingresos_mensuales = 0;
            this.cesantias = 0;
            this.ahorros = 0;
            this.valor_subsidio = 0;
            this.seleccionAnioEntrega = '';
            this.caja_compensacion = '';

            this.fin_max_permisible = 0;
            this.cuota_permisible = 0;
            this.cuota_max_financiable = 0;
            this.ingr_regs_max = 0;
            this.d_meses = 0;

            this.valor_credito_final = 0;
            this.cuota_inicial_final = 0;

            this.opcion_fecha_entrega = null;
            this.opcion_fecha_escrituracion = null;
            this.opcion_fecha_primera_cuota = null;
            this.opcion_fecha_ultima_cuota = null;
            this.opcion_valor_reformas = null;
            this.opcion_valor_acabados = null;
            this.opcion_valor_separacion = null;
            this.opcion_fin_max_permisible = null;
            this.opcion_cuota_max_financiable = null;
            this.opcion_ingr_regs_max = null;

            this.unidadOpcion = null;
            this.importeBase = 0;
            this.reformaActivo = false;
        },

        async cargarOpcionExistente() {
            if (!this.idcotizacion) return;

            try {
                const respOpcion = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Opcion', {
                    id_cotizacion: this.idcotizacion,
                    id_proyecto: GlobalVariables.id_proyecto,
                    id_cliente: this.id_cliente
                });

                const opcion = respOpcion.data[0]?.[0];

                if (opcion) {
                   
                    this.id_opcion = opcion.id_opcion;

                    this.opcion_fecha_entrega = opcion.fecha_entrega ?? null;
                    this.opcion_fecha_escrituracion = opcion.fecha_escrituracion ?? null;
                    this.opcion_fecha_primera_cuota = opcion.fecha_primera_cuota ?? null;
                    this.opcion_fecha_ultima_cuota = opcion.fecha_ultima_cuota ?? null;
                    this.opcion_valor_reformas = opcion.valor_reformas ?? 0;
                    this.opcion_valor_acabados = opcion.valor_acabados ?? 0;
                    this.opcion_valor_separacion = opcion.valor_separacion ?? 0;
                    this.opcion_fin_max_permisible = this.cleanNumber(opcion.fin_max_permisible);
                    this.opcion_cuota_max_financiable = this.cleanNumber(opcion.cuota_max_financiable);
                    this.opcion_ingr_regs_max = this.cleanNumber(opcion.ingr_regs_max);
                
               
                    this.valor_descuento_adicional = opcion.valor_descuento_adicional || 0;
                    this.valor_separacion = opcion.valor_separacion || 0;
                    this.valor_notariales = opcion.notariales || 0;
                    this.valor_beneficiencia = opcion.beneficiencia || 0;
                    this.valor_registro = opcion.registro || 0;
                    this.calcularEscrituras();

                    if (opcion.pago_financiado) {
                        this.pagoSeleccionado = 'Financiado';
                    } else if (opcion.pago_contado) {
                        this.pagoSeleccionado = 'Contado';
                    }

                    this.bancoSeleccionado = opcion.id_entidad || null;

                    if (this.bancoSeleccionado) {
                        await this.cargarFactor();
                    }

                    this.tipoSeleccionado = opcion.id_tipo || null;
                    if (opcion.id_tipo) {
                        const factor = this.factoresBanco.find(f => f.id_factor == opcion.id_tipo);
                        this.unidadSeleccionada = factor ? factor.unidad : 0;
                    } else {
                        this.unidadSeleccionada = 0;
                    }
               
                    this.anioSeleccionado = opcion.id_anios ? parseInt(opcion.id_anios) : null;
                    if (this.unidadSeleccionada && this.unidadSeleccionada !== 0) {
                        this.cargarAnios();
                    }

                    this.modalidadSeleccionada = opcion.id_modalidad || null;
                    if (opcion.id_modalidad) {
                        const tipoFin = this.tipo_financiacion.find(t => t.id_tipo_financiacion == opcion.id_modalidad);
                        this.tipoFinanciacionSeleccionada = tipoFin ? tipoFin.tipo_financiacion : '';
                    } else {
                        this.tipoFinanciacionSeleccionada = '';
                    }

                    this.ingresos_mensuales = opcion.ingresos_familiares || 0;
                    this.cesantias = opcion.cesantias || 0;
                    this.ahorros = opcion.ahorros || 0;
                    this.valor_subsidio = opcion.valor_subsidio || 0;
                    this.seleccionAnioEntrega = opcion.anio_entrega || '';
                    this.caja_compensacion = opcion.id_caja_compensacion || null;

                    this.fin_max_permisible = this.cleanNumber(opcion.fin_max_permisible);
                    this.cuota_permisible = this.cleanNumber(opcion.cuota_permisible);
                    this.cuota_max_financiable = this.cleanNumber(opcion.cuota_max_financiable);
                    this.ingr_regs_max = this.cleanNumber(opcion.ingr_regs_max);
                    this.d_meses = opcion.meses || 0;

                    this.valor_credito_final = opcion.importe_financiacion || 0;
                    this.cuota_inicial_final = opcion.cuota_inicial || 0;

                    // const tablaAmortizacion = respOpcion.data[1];
                    // if (tablaAmortizacion && tablaAmortizacion.length > 0) {
                    //     this.cargarTablaAmortizacion(tablaAmortizacion);
                    // }

                    this.$nextTick(() => {
                        this.$forceUpdate();
                    });
                }
            } catch (error) {
                console.error('Error al cargar opción existente:', error);
            }
        },

        cargarTablaAmortizacion(datosTabla) {
            try {
                this.cargandoTablaDesdeDB = true;

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
                            cuotaDeseadaFormateada = this.formatearMoneda(cuotaDeseadaLimpia);
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

                if (this.tablaPeriodos.length > 0) {
                    this.tablaAmortizacion = true;
                }

                this.$nextTick(() => {
                    this.cargandoTablaDesdeDB = false;
                });
            } catch (error) {
                console.error('❌ [cargarTablaAmortizacion] Error al cargar tabla de amortización:', error);
                this.cargandoTablaDesdeDB = false;
            }
        },

        async handleSave() {
            const validaciones = {
                0: () => this.validateModeCliente(),
                1: () => this.validateModeVisita(),
                2: () => true
            };

            const validar = validaciones[this.mode];
            if (validar && !validar()) {
                return;
            }

            const saveActions = {
                0: () => this.nuevoCliente(0),
                1: () => this.nuevaVisita(),
                2: () => this.guardarCotizacion()
            };

            const action = saveActions[this.mode];
            if (action) {
                await action();
            }
        },

        async handleNext(nextIndex) {
            if (this.mode === 3 && nextIndex !== 3 && this.tieneCambiosPendientes && !this.esOpcionGuardada) {
                return new Promise((resolve) => {
                    showConfirm(
                        'Tienes cambios sin guardar en la opción. ¿Deseas guardar antes de salir?',
                        async () => {
                            await this.enviarYOpcionar();
                            this.tieneCambiosPendientes = false;
                            await this.continuarNavegacion(nextIndex);
                            resolve();
                        },
                        async () => {
                            this.tieneCambiosPendientes = false;
                            await this.continuarNavegacion(nextIndex);
                            resolve();
                        },
                        null,
                        'Guardar Borrador',
                        'Salir sin guardar'
                    );
                });
            }

            await this.continuarNavegacion(nextIndex);
        },

        async continuarNavegacion(nextIndex) {
            if (this.mode === 0 && nextIndex === 1) {
                if (!this.validateModeCliente()) return;
                await this.nuevoCliente(0);
            }

            if (this.mode === 1 && nextIndex === 2) {
                if (this.registro === false && this.noregistro !== true) {
                    const resp = await this.nuevaVisita();
                    if (resp?.includes("Error")) return;
                }
            }

            if (this.mode === 2 && nextIndex === 3) {
                if (!await this.validateModeOpcion()) return;
            }

            if (this.mode === 3 && nextIndex === 2) {
                this.limpiarDatosOpcion();
            }

            if (this.policyAccepted || nextIndex === 0) {
                if (this.mode === 0 && nextIndex === 2) return;
                if (this.mode === 0 && nextIndex === 3) return;
                if (this.mode === 1 && nextIndex === 3) return;

                this.mode = nextIndex;

                if (nextIndex === 1) {
                    let resp2 = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Registro', { cliente: this.cliente });
                    this.visitas = resp2.data[0];

                    const hoy = new Date().toISOString().split("T")[0];

                    const ultimoActivo = [...this.visitas].find(r =>
                        r.is_active == 1 &&
                        r.fecha?.split(" ")[0] === hoy
                    );

                    if (ultimoActivo) {
                        this.id_visita = ultimoActivo.id_visita;
                        await this.editarVisita(ultimoActivo.id_visita);
                        this.noregistro = true;
                    } else {
                        this.noregistro = false;
                    }
                }

                if (nextIndex === 2) {
                    await this.seleccionarCotizacion(null);
                    await this.getCotizaciones();
                    this.cotizacionSeleccionada = null;
                }

                if (nextIndex === 3) {
                    await this.prepararDatosOpcion();
                    this.tieneCambiosPendientes = false;
                    const borrador = await this.verificarBorradorExistente();
                    if (borrador) {
                        await this.mostrarModalBorrador(borrador);
                    }
                }
            }
        },
        async acceptPolicy(isChecked) {
            if (isChecked) {
                this.policyAccepted = true;
                this.showPolicyModal = false;
            }
        },
        async declinePolicy() {
            this.showPolicyModal = false;
            this.mode = 0;
        },
        async handleAction() {
            if (this.mode === 5) {
                this.save();
            } else {
                this.handleNext(this.mode + 1);
            }
        },
        async nuevoCliente(israpida) {
            if (!this.policyAccepted) {
                showMessage("Debe aceptar la política para continuar.");
                return;
            }

            this.ObjCliente.is_atencion_rapida = israpida;

            if (!this.validarCampos(this.ObjCliente, this.camposObligatorios)) return;

            const { is_atencion_rapida, ...edit } = this.ObjCliente || {};
            const { is_atencion_rapida: _, ...orig } = this.ObjClienteOriginal || {};

            const huboCambio = JSON.stringify(edit) !== JSON.stringify(orig);

            let obj = {};
            Object.keys(this.ObjCliente).forEach(k => (this.ObjCliente[k] || this.ObjCliente[k] === 0) && (obj[k] = this.ObjCliente[k]))
            let resp = await httpFunc('/generic/genericDT/ProcesoNegocio:Ins_Cliente', obj);
            let cliente = resp.data;

            if (resp?.errorMessage?.includes("Duplicate")) {
                showMessage("Cliente ya existe.");
                return;
            }

            if (cliente[0].result.includes("OK")) {
                if (cliente[0].result.includes('Insert')) {
                    showMessage("Cliente creado correctamente.");
                } else if (huboCambio) {
                    showMessage("Cliente actualizado correctamente.");
                    this.ObjClienteOriginal = JSON.parse(JSON.stringify(this.ObjCliente));
                }
            } else {
                this.limpiarObj();
                showMessage("Error al crear el cliente.");
                return;
            }
            
            this.id_cliente = Number(cliente[0].result.match(/\d+/)?.[0] || 0);
            this.isboton = true;
            this.mode = 1;
            this.israpida = false;
            this.policyAccepted = false;
            this.iscliente = !israpida;
            this.acceptPolicy(true);
        },
        async seleccionarCliente(c) {

            const resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Cliente', { cliente: c.numeroDocumento });
      
            Object.assign(this.ObjClienteOpcional, resp.data[0][0]);
             
            this.isTitular = !!c.is_titular;
            this.iscliente = true;
            this.initIntlTel(this.ObjClienteOpcional);
        },
        async agregarCliente() {
            if (!this.validarCampos(this.ObjClienteOpcional, this.camposObligatorios)) return;

            await this.addCliente();

            const existe = this.clientes.some(
                c => c.numeroDocumento === this.ObjClienteOpcional.numeroDocumento
            );
            if (existe) {
                showMessage("Ya agregaste un cliente con este número de documento.");
                return;
            }

            const nuevo = JSON.parse(JSON.stringify(this.ObjClienteOpcional));
            this.clientes.push(nuevo);

            showMessage("Cliente agregado a la lista.");

        },
        eliminarCliente(index) {
            this.clientes.splice(index, 1);
        },
        async limpiarObjClient() {
            this.limpiarObj();
        },
        async limpiarObj() {
            if (this.mode == 0 || this.mode == 3) {
                this.ObjCliente = {
                    id_cliente: '',
                    nombres: '',
                    apellido1: '',
                    apellido2: '',
                    direccion: '',
                    ciudad: '',
                    barrio: '',
                    departamento: '',
                    pais: '',
                    email1: '',
                    email2: '',
                    telefono1: '',
                    telefono2: '',
                    tipoDocumento: '',
                    numeroDocumento: '',
                    paisExpedicion: '',
                    departamentoExpedicion: '',
                    ciudadExpedicion: '',
                    fechaExpedicion: '',
                    idPresupuestoVivienda: '',
                    isPoliticaAceptada: 0,
                    is_atencion_rapida: 0,
                    is_titular: 0,
                    nombreEmpresa: '',
                    nit: '',
                    fechaNacimiento: '',
                    pais_tel1: 'co',
                    pais_tel2: 'co',
                    codigo_tel1: '+57',
                    codigo_tel2: '+57'
                }
            }
            if (this.mode == 1) {
                this.camposBloqueados = false;
                this.ObjVisita = {
                    tipo_registro: '',
                    modo_atencion: '',
                    id_categoria: '',
                    id_medio: '',
                    id_motivo_compra: '',
                    id_referencia: '',
                    otro_texto: '',
                    descripcion: '',
                    id_presupuesto_vivienda: '',
                    id_tipo_tramite: '',
                    usuario: '',
                    id_tipo_registro: '',
                    id_modo_atencion: ''
                }
                if (Array.isArray(this.tipo_registro)) {
                    this.tipo_registro.forEach(item => item.checked = false);
                }
                if (Array.isArray(this.modo_atencion)) {
                    this.modo_atencion.forEach(item => item.checked = false);
                }
            }
            this.iscliente = true;
            this.israpida = false;
        },

        async verificarBorradorExistente() {
            try {
                if (!this.idcotizacion || !this.id_cliente || !this.id_proyecto) {
                    return null;
                }

                const resp = await httpFunc('/generic/genericDT/ProcesoNegocio:Get_Borrador_Opcion', {
                    id_opcion: this.id_opcion || null,
                    id_cotizacion: this.idcotizacion,
                    id_cliente: this.id_cliente,
                    id_proyecto: this.id_proyecto
                });

                if (resp.data && resp.data.length > 0) {
                    return resp.data[0];
                }
                return null;
            } catch (error) {
                console.error('Error al verificar borrador existente:', error);
                return null;
            }
        },
       
        async guardarBorrador() {
            try {
                if (!this.idcotizacion || !this.id_cliente || !this.id_proyecto) {
                    showMessage('No se puede guardar el borrador sin cotización, cliente o proyecto');
                    return;
                }

                this.guardandoBorrador = true;

                const datosOpcion = {
                    fecha_entrega: this.esOpcionGuardada ? this.opcion_fecha_entrega : this.d_fecha_entrega,
                    valor_reformas: this.cleanNumber(this.esOpcionGuardada ? this.opcion_valor_reformas : this.valor_reformas) || 0,
                    valor_acabados: this.cleanNumber(this.esOpcionGuardada ? this.opcion_valor_acabados : this.valor_acabados) || 0,
                    valor_descuento_adicional: this.cleanNumber(this.valor_descuento_adicional) || 0,
                    valor_separacion: this.cleanNumber(this.esOpcionGuardada ? this.opcion_valor_separacion : this.valor_separacion) || 0,
                    valor_escrituras: this.cleanNumber(this.valor_escrituras) || 0,
                    notariales: this.cleanNumber(this.valor_notariales) || 0,
                    beneficiencia: this.cleanNumber(this.valor_beneficiencia) || 0,
                    registro: this.cleanNumber(this.valor_registro) || 0,
                    pago_contado: this.pagoSeleccionado?.toLowerCase() === 'contado' ? 1 : 0,
                    pago_financiado: this.pagoSeleccionado?.toLowerCase() === 'financiado' ? 1 : 0,
                    id_entidad: this.bancoSeleccionado || null,
                    id_tipo: this.tipoSeleccionado || null,
                    id_anios: this.anioSeleccionado || null,
                    id_modalidad: this.modalidadSeleccionada || null,
                    unidadSeleccionada: this.unidadSeleccionada || null,
                    tipoFinanciacionSeleccionada: this.tipoFinanciacionSeleccionada || '',
                    pagoSeleccionado: this.pagoSeleccionado || '',
                    planSeleccionado: this.planSeleccionado || null,
                    reformaActivo: this.reformaActivo || false,
                    subsidioActivo: this.subsidioActivo || false,
                    factorBanco: this.factorBanco || 0,
                    ingresos_familiares: this.cleanNumber(this.ingresos_mensuales) || 0,
                    cesantias: this.cleanNumber(this.cesantias) || 0,
                    ahorros: this.cleanNumber(this.ahorros) || 0,
                    fin_max_permisible: this.cleanNumber(this.fin_max_permisible) || 0,
                    cuota_permisible: this.cleanNumber(this.cuota_permisible) || 0,
                    cuota_max_financiable: this.cleanNumber(this.cuota_max_financiable) || 0,
                    ingr_regs_max: this.cleanNumber(this.ingr_regs_max) || 0,
                    valor_credito: this.cleanNumber(this.valor_credito) || 0,
                    valor_credito_max: this.cleanNumber(this.valor_credito_max) || 0,
                    anio_entrega: this.seleccionAnioEntrega || null,
                    valor_subsidio: this.cleanNumber(this.valor_subsidio) || 0,
                    id_caja_compensacion: this.caja_compensacion || null,
                    meses: this.d_meses || 0,
                    importe_financiacion: this.cleanNumber(this.valor_credito_final) || 0,
                    cuota_inicial: this.cleanNumber(this.cuota_inicial_final) || 0,
                    fecha_primera_cuota: this.esOpcionGuardada ? this.opcion_fecha_primera_cuota : this.d_fecha_cuota,
                    fecha_ultima_cuota: this.esOpcionGuardada ? this.opcion_fecha_ultima_cuota : this.d_fecha_ulti_cuota,
                    fecha_escrituracion: this.esOpcionGuardada ? this.opcion_fecha_escrituracion : this.d_fecha_escrituracion,
                    tablaPeriodos: this.tablaPeriodos || []
                };

                const resp = await httpFunc('/generic/genericST/ProcesoNegocio:Ins_Borrador_Opcion', {
                    id_opcion: this.id_opcion || null,
                    id_cotizacion: this.idcotizacion,
                    id_cliente: this.id_cliente,
                    id_proyecto: this.id_proyecto,
                    datos_json: JSON.stringify(datosOpcion),
                    usuario_creacion: GlobalVariables.username
                });

                if (!resp.isError) {
                    showMessage('Borrador guardado correctamente');
                    this.tieneCambiosPendientes = false;
                } else {
                    showMessage('Error al guardar el borrador');
                }
            } catch (error) {
                console.error('Error al guardar borrador:', error);
                showMessage('Error al guardar el borrador');
            } finally {
                this.guardandoBorrador = false;
            }
        },

        async cargarBorrador(borrador) {
            try {
                const opcion = JSON.parse(borrador.datos_json);
                this.valor_descuento_adicional = opcion.valor_descuento_adicional || 0;
                this.valor_separacion = opcion.valor_separacion || 0;
                this.valor_notariales = opcion.notariales || 0;
                this.valor_beneficiencia = opcion.beneficiencia || 0;
                this.valor_registro = opcion.registro || 0;
                this.calcularEscrituras();

                if (opcion.pago_financiado) {
                    this.pagoSeleccionado = 'Financiado';
                } else if (opcion.pago_contado) {
                    this.pagoSeleccionado = 'Contado';
                }

                this.bancoSeleccionado = opcion.id_entidad || null;
                if (this.bancoSeleccionado) {
                    await this.cargarFactor();
                }

                this.tipoSeleccionado = opcion.id_tipo || null;

                if (opcion.unidadSeleccionada !== undefined && opcion.unidadSeleccionada !== null) {
                    this.unidadSeleccionada = opcion.unidadSeleccionada;
                } else if (opcion.id_tipo) {
                    const factor = this.factoresBanco.find(f => f.id_factor == opcion.id_tipo);
                    this.unidadSeleccionada = factor ? factor.unidad : 0;
                } else {
                    this.unidadSeleccionada = 0;
                }

                this.anioSeleccionado = opcion.id_anios ? parseInt(opcion.id_anios) : null;
                if (this.unidadSeleccionada && this.unidadSeleccionada !== 0) {
                    this.cargarAnios();
                }

                this.modalidadSeleccionada = opcion.id_modalidad || null;

                if (opcion.tipoFinanciacionSeleccionada) {
                    this.tipoFinanciacionSeleccionada = opcion.tipoFinanciacionSeleccionada;
                } else if (opcion.id_modalidad) {
                    const tipoFin = this.tipo_financiacion.find(t => t.id_tipo_financiacion == opcion.id_modalidad);
                    this.tipoFinanciacionSeleccionada = tipoFin ? tipoFin.tipo_financiacion : '';
                } else {
                    this.tipoFinanciacionSeleccionada = '';
                }

                this.ingresos_mensuales = opcion.ingresos_familiares || 0;
                this.cesantias = opcion.cesantias || 0;
                this.ahorros = opcion.ahorros || 0;
                this.valor_subsidio = opcion.valor_subsidio || 0;
                this.seleccionAnioEntrega = opcion.anio_entrega || '';
                this.caja_compensacion = opcion.id_caja_compensacion || null;

                this.fin_max_permisible = this.cleanNumber(opcion.fin_max_permisible);
                this.cuota_permisible = this.cleanNumber(opcion.cuota_permisible);
                this.cuota_max_financiable = this.cleanNumber(opcion.cuota_max_financiable);
                this.ingr_regs_max = this.cleanNumber(opcion.ingr_regs_max);
                this.d_meses = opcion.meses || 0;

                this.pagoSeleccionado = opcion.pagoSeleccionado || '';
                this.planSeleccionado = opcion.planSeleccionado || null;
                this.reformaActivo = opcion.reformaActivo || false;
                this.subsidioActivo = opcion.subsidioActivo || false;
                this.factorBanco = opcion.factorBanco || 0;
                this.valor_credito = opcion.valor_credito || 0;
                this.valor_credito_max = opcion.valor_credito_max || 0;

                this.valor_credito_final = opcion.importe_financiacion || 0;
                this.cuota_inicial_final = opcion.cuota_inicial || 0;

                this.d_fecha_entrega = opcion.fecha_entrega || null;
                this.d_fecha_cuota = opcion.fecha_primera_cuota || null;
                this.d_fecha_ulti_cuota = opcion.fecha_ultima_cuota || null;
                this.d_fecha_escrituracion = opcion.fecha_escrituracion || null;

                // if (opcion.tablaPeriodos && opcion.tablaPeriodos.length > 0) {
                //     this.cargarTablaAmortizacion(opcion.tablaPeriodos);
                // }

                this.$nextTick(() => {
                    this.calcularMesesMaximos();
                    this.calcularEscrituras();
                    if (this.ingresos_mensuales) {
                        this.onInputIngresos();
                    }
                    if (this.tipoFinanciacionSeleccionada) {
                        this.calcularFinanciacion();
                    }
                    if (this.seleccionAnioEntrega) {
                        this.calcularSubsidio();
                    }
                    this.$forceUpdate();
                });

                this.tieneCambiosPendientes = false;

                showMessage('Borrador cargado correctamente');
            } catch (error) {
                console.error('Error al cargar borrador:', error);
                showMessage('Error al cargar el borrador');
            }
        },

        async eliminarBorrador() {
            try {
                if (!this.idcotizacion || !this.id_cliente || !this.id_proyecto) {
                    return;
                }

                await httpFunc('/generic/genericST/ProcesoNegocio:Del_Borrador_Opcion', {
                    id_opcion: this.id_opcion || null,
                    id_cotizacion: this.idcotizacion,
                    id_cliente: this.id_cliente,
                    id_proyecto: this.id_proyecto
                });
            } catch (error) {
                console.error('Error al eliminar borrador:', error);
            }
        },
    
        async mostrarModalBorrador(borrador) {
            this.borradorData = borrador;
            this.unidadesYaOpcionadas = borrador.unidades_opcionadas > 0;

            if (this.unidadesYaOpcionadas) {
                showConfirm(
                    'Esta unidad ya fue opcionada. ¿Desea ver la cotización solo con fines informativos?',
                    async () => {
                        this.modoSoloLectura = true;
                        await this.cargarBorrador(this.borradorData);
                        this.borradorData = null;
                    },
                    () => {
                        this.mode = 2;
                        this.borradorData = null;
                    }
                );
            } else {
                this.showBorradorModal = true;
            }
        },
     
        async aceptarBorrador() {
            if (this.borradorData) {
                await this.cargarBorrador(this.borradorData);
            }
            this.showBorradorModal = false;
            this.borradorData = null;
        },

        async rechazarBorrador() {
            this.showBorradorModal = false;
            this.borradorData = null;
            this.mode = 2;
        },

        async guardarBorradorYCerrar() {
            if (this.mode === 3 && this.tieneCambiosPendientes && !this.esOpcionGuardada) {
                await this.guardarBorrador();
            }
            this.mode = 0;
            await this.limpiarObj();
        },

        async busquedaCliente(ids) {

            var clienteOpcional = "";
            if (ids) {
                clienteOpcional = this.cliente;
            } else {
                clienteOpcional = this.clienteOpcional;
            }

            const resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Cliente', { cliente: clienteOpcional });
            const data = resp?.data?.[0]?.[0] || null;

            await httpFunc('/generic/genericDT/ProcesoNegocio:Ins_SaveCliente', {
                username: GlobalVariables.username,
                cliente: this.cliente
            });

            if (!data) {
                this.iscliente = false;
                this.ObjCliente.nombres = '';
                showMessage("No se encontró el cliente.");
                this.limpiarObj();
                return;
            }

            const map = {
                tipo_documento: "tipoDocumento",
                numero_documento: "numeroDocumento",
                pais_expedicion: "paisExpedicion",
                departamento_expedicion: "departamentoExpedicion",
                ciudad_expedicion: "ciudadExpedicion",
                fecha_expedicion: "fechaExpedicion",
                is_politica_aceptada: "isPoliticaAceptada",
                is_titular: "isTitular",
                fecha_nacimiento: "fechaNacimiento",
                nombre_empresa: "nombreEmpresa",
                porcentaje_copropiedad: "porcentaje_copropiedad",
                id_cliente: "id_cliente",
                pais_tel1: "pais_tel1",
                pais_tel2: "pais_tel2",
                codigo_tel1: "codigo_tel1",
                codigo_tel2: "codigo_tel2"
            };

            if (ids) {
                for (const key in data) {
                    const target = map[key] || key;
                    if (target in this.ObjCliente) {
                        this.ObjCliente[target] = data[key];
                    }
                }
            } else {
                for (const key in data) {
                    const target = map[key] || key;
                    if (target in this.ObjClienteOpcional) {
                        this.ObjClienteOpcional[target] = data[key];
                    }
                }
            }

            this.id_cliente = data.id_cliente;
            this.policyAccepted = this.ObjCliente.isPoliticaAceptada == 1;
            this.isClienteVetado = data.is_vetado == "1";

            this.ObjClienteOriginal = { ...this.ObjCliente };

            this.registroCompras = [
                { fecha: '2025-06-01', proyecto: 'Proyecto A', tipo: 'Compra', modo: 'Contado', descripcion: 'Compra A', id_cliente: '111111' },
                { fecha: '2025-06-15', proyecto: 'Proyecto B', tipo: 'Compra', modo: 'Crédito', descripcion: 'Compra B', id_cliente: '111111' }
            ];

            this.activeTabs(this.cliente);
            this.initIntlTel(ids ? this.ObjCliente : this.ObjClienteOpcional);
            this.iscliente = true;
            this.isboton = false;
            this.israpida = false;
        },
        async initIntlTel(cliente) {
            await Promise.resolve();
            let tmptel1 = document.getElementById('telefono1'), tmptel2 = document.getElementById('telefono2');

            if (tmptel1 && (!this.iti1 || (![...tmptel1.parentElement?.classList || []].includes('iti')))) {
                this.tel1 = tmptel1;
                if (this.tel1) {
                    this.iti1 = intlTelInput(this.tel1, {
                        initialCountry: cliente.pais_tel1 || "co",
                        separateDialCode: true,
                    });
                    this.tel1.addEventListener("countrychange", () => {
                        const countryData = this.iti1.getSelectedCountryData();
                        cliente.pais_tel1 = countryData.iso2;
                        cliente.codigo_tel1 = '+' + countryData.dialCode;
                    });
                }
            }
            else if (this.iti1) this.iti1.setCountry(cliente.pais_tel1 || "co");

            if (tmptel2 && (!this.iti2 || (![...tmptel2.parentElement?.classList || []].includes('iti')))) {
                this.tel2 = tmptel2;
                if (this.tel2) {
                    this.iti2 = intlTelInput(this.tel2, {
                        initialCountry: cliente.pais_tel2 || "co",
                        separateDialCode: true,
                    });
                    this.tel2.addEventListener("countrychange", () => {
                        const countryData = this.iti2.getSelectedCountryData();
                        cliente.pais_tel2 = countryData.iso2;
                        cliente.codigo_tel2 = '+' + countryData.dialCode;
                    });
                }
            }
            else if (this.iti2) this.iti2.setCountry(cliente.pais_tel2 || "co");
        },
        async setSubmode(index) {
            if (this.mode === 3 && this.tieneCambiosPendientes) {
                this.tieneCambiosPendientes = false;
                return new Promise((resolve) => {
                    showConfirm(
                        'Tienes cambios sin guardar en la opción. ¿Deseas guardar antes de continuar?',
                        async () => {
                            await this.guardarBorrador();
                            await this.continuarSetSubmode(index);
                            resolve();
                        },
                        async () => {
                            await this.continuarSetSubmode(index);
                            resolve();
                        },
                        null,
                        'Guardar Borrador',
                        'Continuar sin guardar'
                    );
                });
            }

            await this.continuarSetSubmode(index);
        },

        async continuarSetSubmode(index) {
            this.campoObligatorio();

            if (GlobalVariables.ventanaUnidades && !GlobalVariables.ventanaUnidades.closed) {
                await this.cerrarVentanaUnidadesConValidacion();
            }

            if (index == 1) {
                let resp2 = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Registro', { cliente: this.cliente });
                this.visitas = resp2.data[0];

                const hoy = new Date().toISOString().split("T")[0];

                const ultimoActivo = [...this.visitas].find(r =>
                    r.is_active == 1 &&
                    r.fecha?.split(" ")[0] === hoy
                );

                if (ultimoActivo) {
                    this.id_visita = ultimoActivo.id_visita;
                    await this.editarVisita(ultimoActivo.id_visita);
                    this.noregistro = true;
                } else {
                    this.noregistro = false;
                    // this.limpiarObj();
                }
            }

            if (index == 2) {
                await this.seleccionarCotizacion(null);
                await this.getCotizaciones();
                this.cotizacionSeleccionada = null;
            }

            if (index == 3) {
                this.nombre_asesor = this.asesor.nombres;
                const id_unidad = this.unidades[0]?.id_unidad;

                if (id_unidad && GlobalVariables.id_proyecto) {
                    try {
                        var id_proyecto = GlobalVariables.id_proyecto;

                        const consultas = [
                            {
                                prop: "tipoProyecto",
                                url: "/generic/genericDT/ProcesoNegocio:Get_Tipos",
                                params: { tipo: "imagenes", id_proyecto, id_unidad },
                                formatter: (data) => data?.[0] ? `/file/S3get/${data[0].llave}` : null
                            },
                            {
                                prop: "tipoPlanta",
                                url: "/generic/genericDT/Maestros:Get_Archivos",
                                params: { tipo: "planta", id_proyecto },
                                formatter: (data) => data?.[0] ? `/file/S3get/${data[0].llave}` : null
                            }
                        ];


                        const [resProyecto, resPlanta] = await Promise.all(
                            consultas.map((q) => httpFunc(q.url, q.params))
                        );

                        this.tipoProyecto = resProyecto.data?.length
                            ? consultas[0].formatter(resProyecto.data)
                            : null;

                        this.tipoPlanta = resPlanta.data?.length
                            ? consultas[1].formatter(resPlanta.data)
                            : null;

                        this.selectedApto = apto;
                        this.id_cliente = GlobalVariables.id_cliente;

                    } catch (error) {
                        console.error("Error al cargar las imágenes del apartamento:", error);
                    }
                }

                let img = await fetch('../../img/ico/svg/logo-capital.svg');
                img = await img.text();
                await this.$nextTick();
                const container = document.getElementById('logo-capital');
                if (container) container.innerHTML = img;

                if (id_unidad) {
                    let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidad', { id_unidad });
                    this.unidadOpcion = await resp.data[0][0];
                }

                if (this.unidades && this.unidades.length > 0) {
                    const updatePromises = this.unidades.map(unidad => {
                        let payload = unidad;
                        return httpFunc('/generic/genericST/ProcesoNegocio:Upd_Unidades', payload);
                    });
                    try {
                        let results = await Promise.all(updatePromises);
                    } catch (error) {
                        console.error("Error en alguna actualización del batch:", error);
                    }
                }
            }

            this.currentSubmode = index;
        },
        isTabBlocked(index) {
            if (this.mode === 0 && index === 1 && !this.policyAccepted && this.iscliente && this.ObjCliente.nombres !== '') {
                return true;
            }
            if (this.mode === 0 && (index === 2 || index === 3)) {
                return true;
            }
            if (this.mode === 1 && index === 3) {
                return true;
            }
            return false;
        },
        ///////// Visitas ////////////
        prepararDatosVisita() {
            const tipoRegistro = this.tipo_registro
                .filter(item => item.checked)
                .map(item => item.id_tipo_registro);

            const modoAtencion = this.modo_atencion
                .filter(item => item.checked)
                .map(item => item.id_modo_atencion);

            return {
                ...this.ObjVisita,
                id_proyecto: GlobalVariables.id_proyecto,
                id_cliente: this.id_cliente,
                usuario: GlobalVariables.username,
                id_sala_venta: GlobalVariables.sala.id_sala_venta,
                tipo_registro: tipoRegistro.join(','),
                modo_atencion: modoAtencion.join(',')
            };
        },

        validateModeVisita() {
            if (this.ObjVisita.id_visita != null) {
                showMessage("Esta visita no se puede actualizar.");
                return false;
            }

            if (!this.validarCampos(this.ObjVisita, this.camposObligatorios)) {
                return false;
            }

            if (!this.ObjVisita.id_tipo_registro || !this.ObjVisita.id_modo_atencion) {
                showMessage("Debe seleccionar al menos un Tipo de Registro y un Modo de Atención.");
                return false;
            }

            return true;
        },

        async nuevaVisita() {
            if (!this.validateModeVisita()) {
                return "Error";
            }

            showProgress();
            try {
                const datosVisita = this.prepararDatosVisita();
                const resp = await httpFunc('/generic/genericST/ProcesoNegocio:Ins_Registro', datosVisita);

                if (resp.data.includes("OK")) {
                    this.registro = true;
                    await this.setSubmode(1);
                    showMessage("Visita creada correctamente.");
                    return "OK";
                } else {
                    showMessage("Error al crear la visita.");
                    return "Error";
                }
            } catch (error) {
                console.error('Error al crear visita:', error);
                showMessage("Error al crear la visita.");
                return "Error";
            } finally {
                hideProgress();
            }
        },

        actualizarCheckboxes(lista, valorSeleccionado, campoId) {
            lista.forEach(item => {
                item.checked = valorSeleccionado ? (item[campoId] == valorSeleccionado) : false;
            });
        },

        async editarVisita(id_visita) {
            try {
                this.ObjVisita.id_visita = id_visita;
                const resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Registro', { id_visita });

                const data = resp.data[0][0];

                Object.assign(this.ObjVisita, {
                    id_categoria: data.id_categoria_medio,
                    id_medio: data.id_medio,
                    id_motivo_compra: data.id_motivo_compra,
                    id_referencia: data.id_referencia,
                    otro_texto: data.otro_texto,
                    descripcion: data.descripcion,
                    id_presupuesto_vivienda: data.id_presupuesto_vivienda,
                    id_tipo_tramite: data.id_tipo_tramite,
                    id_tipo_registro: data.id_tipo_registro,
                    id_modo_atencion: data.id_modo_atencion
                });

                this.actualizarCheckboxes(this.tipo_registro, data.tipo_registro, 'id_tipo_registro');
                this.actualizarCheckboxes(this.modo_atencion, data.modo_atencion, 'id_modo_atencion');

                this.camposBloqueados = true;
            } catch (error) {
                console.error('Error al editar visita:', error);
                showMessage('Error al cargar la visita.');
            }
        },
        contarProyectos(lista) {
            const contador = {};
            lista.forEach(item => {
                if (!contador[item.proyecto]) {
                    contador[item.proyecto] = 0;
                }
                contador[item.proyecto]++;
            });
            this.contadorProyectos = contador;
        },
        antencionRapida() {
            this.iscliente = false;
            this.israpida = true;
            this.policyAccepted = true;
            this.isClienteVetado = false;
            this.ObjCliente.numeroDocumento = '';
            this.ObjCliente.nombres = '';
            this.ObjCliente.email1 = '';
        },
        async exportExcel(tabla) {
            try {
                showProgress();
                let datos = JSON.parse(JSON.stringify(tabla));
                datos.forEach(row => {
                        for (const key in row) key.startsWith('id_') && key !== 'id_visita' && delete row[key];
                    }
                );
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
        //////// mode 2 ////////////
        async showAtencionModal() {
            this.mostrarModal = true
        },
        async getCotizaciones() {
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Cotizaciones', {
                    id_cliente: this.id_cliente,
                    id_proyecto: GlobalVariables.id_proyecto
                });

                if (!resp || !resp.data) {
                    console.error('Respuesta inválida del servidor:', resp);
                    this.cotizaciones = [];
                    this.nombre = '';
                    return;
                }

                this.cotizaciones = Array.isArray(resp.data[0]) ? resp.data[0] : (Array.isArray(resp.data) ? resp.data : []);
                this.nombre = this.cotizaciones[0]?.nombre || '';

                if (this.cotizaciones.length === 0) {
                    return;
                }

                const unidadesPromises = this.cotizaciones.map(item =>
                    this.cargarUnidadesCotizacion(item.cotizacion)
                );

                const unidadesResults = await Promise.all(unidadesPromises);

                this.cotizaciones = this.cotizaciones.map((item, index) => ({
                    ...item,
                    unidades: unidadesResults[index].unidades,
                    importe: unidadesResults[index].totalFinal
                }));
            } catch (error) {
                console.error('Error al cargar cotizaciones:', error);
                throw error;
            } finally {
                hideProgress();
            }
        },
        async cargarUnidadesCotizacion(cotizacionId) {
            try {
                const respa = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidades_Cotizacion', {
                    id_cliente: this.id_cliente,
                    id_proyecto: GlobalVariables.id_proyecto,
                    cotizacion: cotizacionId
                });

                const parseNumber = str =>
                    typeof str === 'string' ? parseFloat(str.replace(/\./g, '').replace(',', '.')) : Number(str) || 0;

                const unidades = (respa.data[0] || []).map(unidad => ({
                    ...unidad,
                    valor_unidad: parseNumber(unidad.valor_unidad),
                    valor_descuento: parseNumber(unidad.valor_descuento)
                }));

                const totalFinal = unidades.reduce(
                    (acc, u) => acc + u.valor_unidad - u.valor_descuento,
                    0
                );

                return { unidades, totalFinal, rawData: respa.data[0]?.[0] };
            } catch (error) {
                console.error(`Error al cargar unidades de cotización ${cotizacionId}:`, error);
                return { unidades: [], totalFinal: 0, rawData: null };
            }
        },
        async cargarCotizacion(cotizacionId) {
            try {
                if (!cotizacionId) {
                    return { unidades: [], totalFinal: 0 };
                }

                this.cotizacionId = cotizacionId;

                const { unidades, totalFinal, rawData } = await this.cargarUnidadesCotizacion(cotizacionId);

                if (!rawData) {
                    console.warn(`No se encontraron datos para la cotización ${cotizacionId}`);
                    return { unidades, totalFinal };
                }

                this.añoentrega = rawData.fecha_entrega?.match(/\d{4}/)?.[0] || '';
                this.d_fecha_entrega = rawData.fecha_entrega_f || '';
                this.f_cotizacion = rawData.created_on ? rawData.created_on.split('T')[0] : '';
                this.d_tna_antes = rawData.antes_p_equ;
                this.d_tna_despues = rawData.despues_p_equ;
                this.d_fecha_escrituracion = rawData.fecha_escrituracion;
                this.f_creacion = rawData.created_on;
                this.d_fecha_pe = rawData.fecha_p_equ;
                this.consecutivo = rawData.consecutivo;
                this.valor_reformas = rawData.valor_reformas || 0;
                this.valor_acabados = rawData.valor_acabados || 0;
                this.valor_separacion = rawData.valor_separacion || 0;
                this.id_negocios_unidades = rawData.id_negocios_unidades || 0;

                if (this.subsidio_vivienda && this.subsidio_vivienda.length > 0) {
                    this.listaAniosEntrega = this.subsidio_vivienda
                        .map(s => s.periodo)
                        .filter(p => p)
                        .sort((a, b) => a - b);
                } else {
                    const añoActual = new Date().getFullYear();
                    this.listaAniosEntrega = Array.from({ length: 6 }, (_, i) => añoActual + i);
                }

                this.cotizaciones = this.cotizaciones.map(c =>
                    Number(c.cotizacion) === Number(cotizacionId)
                        ? { ...c, unidades, importe: totalFinal }
                        : c
                );

                this.cotizacionActiva = cotizacionId;
                this.totalFinal = totalFinal;
                this.importeOriginal = totalFinal;

                return { unidades, totalFinal };
            } catch (error) {
                console.error('Error al cargar cotización:', error);
                throw error;
            }
        },
        async seleccionarCotizacion(cotizacionId, id) {
            try {
                this.idcotizacion = id || null;
                this.cotizacionSeleccionada = cotizacionId;

                const { unidades } = await this.cargarCotizacion(cotizacionId);

                this.unidades = unidades;

                this.limpiarDatosOpcion();

                if (this.mode === 3) {
                    await this.prepararDatosOpcion();
               
                    const borrador = await this.verificarBorradorExistente();
                    if (borrador) {
                        await this.mostrarModalBorrador(borrador);
                    }
                }
            } catch (error) {
                console.error('Error al seleccionar cotización:', error);
                this.unidades = [];
                this.limpiarDatosOpcion();
            }
        },
        async addCotizacion() {
            try {
                const formatoFecha = new Date().toISOString().slice(0, 19).replace('T', ' ');

                const siguienteId = this.cotizaciones.length > 0
                    ? Math.max(...this.cotizaciones.map(c => parseInt(c.cotizacion) || 0)) + 1
                    : 1;

                let id_cotizacion = 0;

                if (this.id_cliente !== 0) {
                    const resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Ins_Cotizacion', {
                        id_proyecto: GlobalVariables.id_proyecto,
                        id_cliente: this.id_cliente,
                        cotizacion: siguienteId,
                        usuario: GlobalVariables.username
                    });

                    const rawId = resp.data?.[0]?.[0]?.id_cotizacion;
                    id_cotizacion = rawId?.includes(':')
                        ? rawId.split(':')[1]
                        : rawId || 0;
                }

                this.cotizaciones.push({
                    cotizacion: siguienteId,
                    fecha: formatoFecha,
                    descripcion: '',
                    importe: 0,
                    id_proyecto: GlobalVariables.id_proyecto,
                    id_cliente: this.id_cliente,
                    id_cotizacion
                });

                this.cotizacionActiva = siguienteId;

                return siguienteId;

            } catch (error) {
                console.error('Error al agregar cotización:', error);
                throw error;
            }
        },
        eliminarCotizacionActivaSiVacia(event) {
            if (event.key === 'Escape' && this.cotizacionActiva != null) {
                const index = this.cotizaciones.findIndex(c => c.cotizacion === this.cotizacionActiva);
                if (index !== -1) {
                    const item = this.cotizaciones[index];
                    if (!item.descripcion && item.importe === 0) {
                        this.cotizaciones.splice(index, 1);
                        this.cotizacionActiva = null;
                    }
                }
            }
        },
        async guardarCotizacion() {
            this.mostrarModal = false;
            try {
                const cotizacion = this.cotizaciones.find(
                    c => c.cotizacion === this.cotizacionSeleccionada
                );

                if (!cotizacion) {
                    showMessage("No se encontró la cotización seleccionada.");
                    return;
                }

                let resp = await httpFunc(
                    '/generic/genericDT/ProcesoNegocio:Ins_Cotizacion',
                    { ...cotizacion, id_cliente: this.id_cliente }
                );

                resp = resp.data;

                if (resp[0].id_cotizacion > 0) {
                    showMessage("Cotización creada correctamente. ID: " + resp[0].id_cotizacion);
                } else {
                    showMessage("Error al guardar la cotización.");
                }
            } catch (error) {
                console.error(error);
                showMessage("Error al crear la cotización.");
            }
        },
        async campoObligatorio() {
            let res = (await httpFunc("/generic/genericDT/Proyectos:Get_Proyecto", {
                id_proyecto: GlobalVariables.id_proyecto
            })).data;

            if (res.length) this.proyecto = res[0];

            let id_sala_venta = this.proyecto.id_sala_venta;
            let modulo = this.mode + 1;
            let resp = (await httpFunc("/generic/genericDS/ProcesoNegocio:Get_Obligatorio", {
                id_sala_venta,
                modulo
            })).data;
            this.camposObligatorios = resp[0].map(r => r.campobd);
            this.nombreCampos = resp[0].map(r => r.campo)
        },
        validarCampos(obj, camposObligatorios) {
            for (let i = 0; i < camposObligatorios.length; i++) {
                let campo = camposObligatorios[i];
                if (obj[campo] === undefined || obj[campo] === null || obj[campo].toString().trim() === '') {
                    let nombreCampo = this.nombreCampos && this.nombreCampos[i] ? this.nombreCampos[i] : campo;
                    showMessage(`El campo obligatorio '${nombreCampo}' no ha sido diligenciado.`);
                    return false;
                }
            }
            return true;
        },
        hasData(index) {
            if (index === 0) return this.registroCompras.length > 0;
            return false;
        },
        activeTabs(id_cliente) {
            if (
                this.registroCompras[0]?.id_cliente !== id_cliente
            ) {
                this.registroCompras = [];
            }
        },
        async sincliente() {
            await this.limpiarObj();
            this.id_cliente = 0;
            await this.seleccionarCotizacion(null);
            await this.getCotizaciones();
            this.cotizacionSeleccionada = null;
            this.policyAccepted = true;
            this.mode = 2;
        },
        async continuarCliente() {
            let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_SaveCliente', {
                username: GlobalVariables.username
            });

            const clienteObj = resp?.data?.[0]?.[0];

            if (!clienteObj) {
                showMessage("Debe seleccionar un cliente para continuar.");
                return;
            }

            this.cliente = clienteObj.cliente;

            this.busquedaCliente(true);

        },
        normalizarFecha(str) {
            if (!str) return "";

            str = str.split(" ")[0];

            str = str.replace(/\//g, '-');
            let partes = str.split('-');

            if (partes.length === 3) {
                if (partes[0].length === 4) {
                    let [anio, mes, dia] = partes;
                    mes = mes.padStart(2, '0');
                    dia = dia.padStart(2, '0');
                    return `${anio}-${mes}-${dia}`;
                } else {
                    let [dia, mes, anio] = partes;
                    mes = mes.padStart(2, '0');
                    dia = dia.padStart(2, '0');
                    return `${anio}-${mes}-${dia}`;
                }
            }

            return str;
        },
        abrirNuevoModulo() {
            if (!this.cotizacionSeleccionada) {
                return showMessage("Debe seleccionar una cotización para agregar unidades.");
            }

            const cotizacion = this.cotizaciones.find(c => c.cotizacion === this.cotizacionSeleccionada);
            if (!cotizacion) {
                return showMessage("La cotización seleccionada no existe.");
            }

            if (cotizacion.status === 'Opcionada') {
                return showMessage("No se pueden agregar más items a una cotización que ya está opcionada.");
            }

            const hoyStr = new Date().toISOString().slice(0, 10);
            const fechaStr = (cotizacion.fecha instanceof Date)
                ? cotizacion.fecha.toISOString().slice(0, 10)
                : this.normalizarFecha(cotizacion.fecha);

            if (fechaStr !== hoyStr) {
                return showMessage("Solo puede abrir cotizaciones del día de hoy.");
            }

            const idProyecto = GlobalVariables.id_proyecto;
            const url = './?loc=Proyectos&SubLoc=ProcesosUnidades&id_proyecto=' + idProyecto + '&id_cliente=' + this.id_cliente + '&cotizacion=' + this.cotizacionSeleccionada
                + '&id_cotizacion=' + (this.idcotizacion || '');
            const screenWidth = window.screen.availWidth;
            const screenHeight = window.screen.availHeight;
            const features = [
                'toolbar=no',
                'location=no',
                'status=no',
                'menubar=no',
                'scrollbars=yes',
                'resizable=yes',
                `width=${screenWidth}`,
                `height=${screenHeight}`,
                'top=100',
                'left=100'
            ].join(',');

            GlobalVariables.ventanaUnidades = window.open(url, 'VentanaModuloUnidades', features);

            this.iniciarMonitoreoVentanaUnidades();
        },

        iniciarMonitoreoVentanaUnidades() {
            if (this.ventanaUnidadesCheckInterval) {
                clearInterval(this.ventanaUnidadesCheckInterval);
            }

            this.ventanaUnidadesCheckInterval = setInterval(() => {
                if (GlobalVariables.ventanaUnidades && GlobalVariables.ventanaUnidades.closed) {
                    clearInterval(this.ventanaUnidadesCheckInterval);
                    this.ventanaUnidadesCheckInterval = null;
                    GlobalVariables.ventanaUnidades = null;
                }
            }, 500);
        },

        detenerMonitoreoVentanaUnidades() {
            if (this.ventanaUnidadesCheckInterval) {
                clearInterval(this.ventanaUnidadesCheckInterval);
                this.ventanaUnidadesCheckInterval = null;
            }
        },

        async cerrarVentanaUnidadesConValidacion() {
            if (this.mode === 3 && this.tieneCambiosPendientes && !this.esOpcionGuardada) {
                return new Promise((resolve) => {
                    showConfirm(
                        'Tienes cambios sin guardar en la opción. ¿Deseas guardar antes de cerrar?',
                        async () => {
                            await this.enviarYOpcionar();
                            this.tieneCambiosPendientes = false;
                            this.cerrarVentanaUnidadesForzado();
                            resolve();
                        },
                        () => {
                            this.tieneCambiosPendientes = false;
                            this.cerrarVentanaUnidadesForzado();
                            resolve();
                        },
                        null,
                        'Guardar',
                        'Cerrar sin guardar'
                    );
                });
            } else {
                this.cerrarVentanaUnidadesForzado();
            }
        },

        cerrarVentanaUnidadesForzado() {
            if (GlobalVariables.ventanaUnidades && !GlobalVariables.ventanaUnidades.closed) {
                GlobalVariables.ventanaUnidades.close();
                GlobalVariables.ventanaUnidades = null;
            }
            this.detenerMonitoreoVentanaUnidades();
        },
        async refrescarImportes() {
            const parseNumber = (str) => {
                if (typeof str === 'string') {
                    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
                }
                return Number(str) || 0;
            };

            for (const cotizacion of this.cotizaciones) {
                let respa = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidades_Cotizacion', {
                    id_cliente: this.id_cliente,
                    cotizacion: cotizacion.cotizacion,
                    id_proyecto: GlobalVariables.id_proyecto,
                });

                const unidades = (respa.data[0] || []).map(unidad => ({
                    ...unidad,
                    valor_unidad: parseNumber(unidad.valor_unidad),
                    valor_descuento: parseNumber(unidad.valor_descuento)
                }));

                cotizacion.unidades = unidades;

                const sumaValores = unidades.reduce((total, unidad) => total + unidad.valor_unidad, 0);
                const sumaDescuentos = unidades.reduce((total, unidad) => total + unidad.valor_descuento, 0);
                const totalFinal = sumaValores - sumaDescuentos;

                cotizacion.importe = totalFinal;
            }
        },
        async dropitem(item) {
            let res = await httpFunc("/generic/genericST/ProcesoNegocio:Del_Item", {
                id_negocios_unidades: item.id_negocios_unidades,
                terminarAtencion: 0,
                id_visita: this.id_visita
            });

            res = res.data;
            this.mostrarModal = false;

            if (res == 'OK') {
                this.seleccionarCotizacion(item.cotizacion);
                this.abrirNuevoModulo();
            }

        },
        async terminarAtencion() {
            if (!this.asuntoSeleccionado) {
                showMessage('Por favor seleccione un tipo de seguimiento');
                return;
            }
            const unidadesAsignadas = this.unidades.filter(u => u.is_asignado == 1);

            if (unidadesAsignadas.length === 0) {
                showMessage('No hay unidades asignadas para terminar la atención');
                return;
            }

            showProgress();
            try {
                const promises = unidadesAsignadas.map(unidad =>
                    httpFunc("/generic/genericST/ProcesoNegocio:Upd_Item", {
                        id_negocios_unidades: unidad.id_negocios_unidades,
                        asunto: this.asuntoSeleccionado
                    })
                );

                const results = await Promise.all(promises);

                const errores = results.filter(res => res.isError);
                if (errores.length > 0) {
                    throw new Error(`Error al actualizar ${errores.length} unidad(es)`);
                }

                await this.cerrarVentanaUnidadesConValidacion();

                showMessage(`Atención finalizada exitosamente.`);

                await new Promise(resolve => setTimeout(resolve, 1500));

                if (GlobalVariables.proyectosApp) {
                    GlobalVariables.proyectosApp.lateralMenu = false;
                    GlobalVariables.proyectosApp.proyecto = null;
                    GlobalVariables.proyectosApp.setMainMode('InicioProyecto');
                    GlobalVariables.proyectosApp.setRuta([]);
                }
            } catch (error) {
                console.error('Error al terminar atención:', error);
                showMessage('Error: ' + (error.message || 'No se pudo terminar la atención'));
            } finally {
                hideProgress();
            }
        },
        async modalveto() {
            this.vetoData = null;
            try {
                let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Veto', {
                    id_cliente: this.id_cliente,
                });
                this.vetoData = resp.data[0] || [];
                this.showModal = true;
            } catch (e) {
                this.vetoData = [{ motivo: "Error al consultar", vetado_por: "", fecha: "" }];
            }
        },
        closeModal() {
            this.showModal = false;
        },
        async deleteCotiz(cotiz) {
            showProgress();
            let res = null;
            try {
                res = await httpFunc('/generic/genericST/ProcesoNegocio:Del_Cotizacion', { id_cotizacion: cotiz.id_cotizacion });
                if (res.isError || res.data !== 'OK') throw res;
                await this.getCotizaciones();
                await this.refrescarImportes();
            } catch (e) {
                console.error(e);
                showMessage('Error: ' + e.errorMessage || e.data);
            }
            hideProgress();
        },
        reqOperation(msg, okCallback, cancelCallback, item, textOk, textCancel) {
            showConfirm(msg, okCallback, cancelCallback, item, textOk, textCancel);
        },
        formatoMoneda(num) {
        
            if (num === null || num === undefined || num === '') {
                return '';
            }
            const numeroLimpio = typeof num === 'number' ? num : this.cleanNumber(num);
            return "$ " + new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(numeroLimpio);
        },
        //////// mode 3 ////////////
        async cargarFactor() {

            this.factorSeleccionado = null;


            if (!this.esOpcionGuardada) {
                this.anioSeleccionado = "";
                this.listaAnios = [];
                this.unidadSeleccionada = 0;
                this.tipoFinanciacionSeleccionada = '';
            }

            if (!this.bancoSeleccionado || this.bancoSeleccionado === 0) {
                this.unidadSeleccionada = 0;
                this.anioSeleccionado = "";
                this.unidadesDisponibles = [];
                this.tipoFinanciacionSeleccionada = '';
                return;
            }

            if (!this.esOpcionGuardada && this._ultimoTipoFinanciacion !== this.bancoSeleccionado) {
                this.ingresos_mensuales = 0;
                this.valor_credito_final = 0;
                this.cuota_inicial_final = 0;

                this.$nextTick(() => {
                    if (this.$refs.inputIngresos) this.$refs.inputIngresos.blur();
                });

                this._ultimoTipoFinanciacion = this.bancoSeleccionado;
            }

            if (!this.bancoSeleccionado) return;

            let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_FactorPorBanco', {
                id_banco: this.bancoSeleccionado
            });

            this.factoresBanco = resp.data[0];

            this.unidadesDisponibles = [...new Set(this.factoresBanco.filter(f => f.valor != 0).map(f => f.unidad))];

            const res = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_BancoPlazos', {
                id_proyecto: GlobalVariables.id_proyecto,
                consecutivo: this.consecutivo,
                id_banco: this.bancoSeleccionado
            });

            if (res.data && res.data[0] && res.data[0].length > 0) {
                const bancoPlazo = res.data[0][0];
                const diasEscrituracion = Number(bancoPlazo.dias_escrituracion) || 0;
                const ultimaCuota = Number(bancoPlazo.ultima_cuota) || 0;

                if (this.esOpcionGuardada) {
                    return;
                }

                if (this.d_fecha_entrega) {
                    let fechaEntrega = new Date(this.d_fecha_entrega);
                    const mes = fechaEntrega.getMonth() + 1;
                    const dia = fechaEntrega.getDate();

                    let fechaBaseEscr = new Date(fechaEntrega);

                    if ((mes === 1) || (mes === 2 && dia <= 15)) {
                        fechaBaseEscr = new Date(fechaEntrega.getFullYear(), 1, 15);
                    }

                    const fechaEscrituracion = new Date(fechaBaseEscr);
                    fechaEscrituracion.setDate(fechaEscrituracion.getDate() - diasEscrituracion);

                    const yyyyE = fechaEscrituracion.getFullYear();
                    const mmE = String(fechaEscrituracion.getMonth() + 1).padStart(2, '0');
                    const ddE = String(fechaEscrituracion.getDate()).padStart(2, '0');
                    this.d_fecha_escrituracion = `${yyyyE}-${mmE}-${ddE}`;

                    const fechaUltimaCuota = new Date(fechaEscrituracion);
                    fechaUltimaCuota.setDate(fechaUltimaCuota.getDate() - ultimaCuota);

                    const yyyyU = fechaUltimaCuota.getFullYear();
                    const mmU = String(fechaUltimaCuota.getMonth() + 1).padStart(2, '0');
                    const ddU = String(fechaUltimaCuota.getDate()).padStart(2, '0');
                    this.d_fecha_ulti_cuota = `${yyyyU}-${mmU}-${ddU}`;

                    let fechaHoy = new Date();
                    let fechaPrimeraCuota = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth() + 1, 1);

                    let diaSemana = fechaPrimeraCuota.getDay();
                    if (diaSemana === 0) fechaPrimeraCuota.setDate(2);
                    if (diaSemana === 6) fechaPrimeraCuota.setDate(3);

                    const yyyyC = fechaPrimeraCuota.getFullYear();
                    const mmC = String(fechaPrimeraCuota.getMonth() + 1).padStart(2, '0');
                    const ddC = String(fechaPrimeraCuota.getDate()).padStart(2, '0');
                    this.d_fecha_cuota = `${yyyyC}-${mmC}-${ddC}`;
                }
            }
        },
        async onSeleccionContado() {
            if (this.esOpcionGuardada) {
                return;
            }

            const respa = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidades_Cotizacion', {
                id_cliente: this.id_cliente,
                id_proyecto: GlobalVariables.id_proyecto,
                cotizacion: this.cotizacionId
            });

            this.añoentrega = respa.data[0][0]?.fecha_entrega.match(/\d{4}/)?.[0] || '';
            this.d_fecha_entrega = respa.data[0][0]?.fecha_entrega_f || '';
            this.f_cotizacion = (respa.data[0][0]?.created_on || '').split('T')[0].split(' ')[0];
            this.d_tna_antes = respa.data[0][0]?.antes_p_equ;
            this.d_tna_despues = respa.data[0][0]?.despues_p_equ;
            this.d_fecha_escrituracion = respa.data[0][0]?.fecha_escrituracion;
            this.f_creacion = respa.data[0][0]?.created_on;
            this.d_fecha_pe = respa.data[0][0]?.fecha_p_equ;
            this.consecutivo = respa.data[0][0]?.consecutivo;
            if (!this.d_fecha_escrituracion) return;

            let fechaEscrit = new Date(this.d_fecha_escrituracion);

            let fechaCuota = new Date(fechaEscrit);
            fechaCuota.setDate(fechaCuota.getDate() - 30);

            while (true) {
                const day = fechaCuota.getDay();

                if (day === 0 || day === 6) {
                    fechaCuota.setDate(fechaCuota.getDate() - 1);
                } else {
                    break;
                }
            }

            const yyyy = fechaCuota.getFullYear();
            const mm = String(fechaCuota.getMonth() + 1).padStart(2, "0");
            const dd = String(fechaCuota.getDate()).padStart(2, "0");

            this.d_fecha_ulti_cuota = `${yyyy}-${mm}-${dd}`;

            if (this.pagoSeleccionado === 'contado') {
                this.ingresos_mensuales = '0';
                this.caja_compensacion = '';
                this.valor_subsidio = '0';
                this.cuota_inicial_final = this.importeOriginal;
                this.valor_credito = 0;
            }

        },
        nombreBanco(id) {
            if (!this.banco_financiador || !Array.isArray(this.banco_financiador)) return '';
            const banco = this.banco_financiador.find(b => b.id_bancos_financiador === id);
            return banco ? banco.banco : '';
        },
        nombrePlan(planSeleccionado, tipoFinanciacionSeleccionada) {
            if ((!this.planes_pago || !Array.isArray(this.planes_pago)) &&
                (!this.tipo_financiacion || !Array.isArray(this.tipo_financiacion))) {
                return '';
            }

            if (planSeleccionado) {
                const plan = this.planes_pago.find(p =>
                    p.id_planes_pago === planSeleccionado || p.plan === planSeleccionado
                );
                return plan ? (plan.plan || plan.nombre || plan.descripcion) : '';
            }

            if (tipoFinanciacionSeleccionada) {
                const tipo = this.tipo_financiacion.find(t =>
                    t.tipo_financiacion === tipoFinanciacionSeleccionada
                );
                return tipo ? tipo.tipo_financiacion : '';
            }

            return '';
        },
        nombreCaja(id) {
            if (!this.cajas_compensacion || !Array.isArray(this.cajas_compensacion)) return '';
            const caja = this.cajas_compensacion.find(c => c.id_caja === id);
            return caja ? (caja.nombre || caja.caja) : '';
        },
        cargarAnios() {
            if (!this.unidadSeleccionada) {
                this.listaAnios = [];
                return;
            }

            this.tipoSeleccionado = this.unidadSeleccionada;

            const factores = this.factoresBanco.filter(f =>
                f.unidad === this.unidadSeleccionada && f.valor != 0
            );

            this.listaAnios = [...new Set(
                factores.map(f => parseInt(String(f.factor).replace(/\D/g, ''), 10))
            )].sort((a, b) => a - b);

        },

        async isSubsidio() {
            let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Proyecto', {
                id_proyecto: GlobalVariables.id_proyecto
            });
            let dato = resp.data[0][0].id_tipo_vis
            let estado = resp.data[0][0].estado_publicacion_final

            this.subsidioActivo = dato != 4;
            this.tipo_factor = dato == 4 ? 'NO VIS' + " + " + estado : 'VIS' + " + " + estado;
        },
        parseNumberFromString(s) {
            if (!s && s !== 0) return 0;
            const cleaned = String(s).replace(/\./g, '').replace(/,/g, '.');
            const n = Number(cleaned);
            return isNaN(n) ? 0 : n;
        },
        onNumberInput(field) {
            if (field === 'principalStr') {
                const cleaned = this.principalStr.replace(/[^0-9.,]/g, '');
                this.principalStr = cleaned;
            }
        },
        formatCurrency(v) {
            const dec = this.decimales;
            return Number(v).toLocaleString(undefined, { minimumFractionDigits: dec, maximumFractionDigits: dec });
        },
        monthsBetween(d1, d2) {
            const a = new Date(d1);
            const b = new Date(d2);
            if (isNaN(a) || isNaN(b)) return 0;
            return (b.getFullYear() - a.getFullYear()) * 12 + (b.getMonth() - a.getMonth());
        },
        addMonths(dateStr, n) {
            const d = new Date(dateStr);
            const day = d.getDate();
            d.setMonth(d.getMonth() + n);
            if (d.getDate() !== day) {
                d.setDate(0);
            }
            return d.toISOString().slice(0, 10);
        },
        simulateBalance(paymentAmount, principalValue, monthsTotal, monthsBefore, tnaAntesPct, tnaDespuesPct) {
            let bal = principalValue;
            for (let m = 0; m < monthsTotal; m++) {
                const rate = ((m < monthsBefore) ? tnaAntesPct : tnaDespuesPct) / 12 / 100;
                const interest = bal * rate;
                bal = bal + interest - paymentAmount;
            }
            return bal;
        },
        calcularMesesMaximos() {
            if (this.esOpcionGuardada) {
                return;
            }

            if (!this.d_fecha_escrituracion || !this.d_fecha_cuota) return;

            const entrega = new Date(this.d_fecha_escrituracion);
            const cuota = new Date(this.d_fecha_cuota);

            let meses = (entrega.getFullYear() - cuota.getFullYear()) * 12;
            meses += entrega.getMonth() - cuota.getMonth();
            meses = Math.max(0, meses - 2);

            if (meses > this.meses) {
                meses = this.meses;
            }

            this.meses_max = meses;
            this.d_meses = meses;
        },
        validarMeses(value) {
            const num = Number(value);
            if (num < 1) this.d_meses = 1;
            if (num > this.meses_max) this.d_meses = this.meses_max;
        },
        generarTabla() {
            if (!this.d_fecha_cuota || !this.d_meses || !this.cuota_inicial) {
                showMessage('Faltan datos requeridos');
                return;
            }
            this.tablaAmortizacion = true;

            if(this.ultimaCuotaDigitada !== 0){
                return;
            }

            const cuotaInicialCambio = this.cuota_inicial_final_anterior !== null && this.cuota_inicial_final_anterior !== this.cuota_inicial_final;

            if (!cuotaInicialCambio) {
                const tieneCuotasDigitadas = this.tablaPeriodos.some(fila => {
                    const valor = String(fila.cuota_deseada || '').trim();
                    return valor !== '';
                });

                if (tieneCuotasDigitadas) {
                    return;
                }
            }

            this.cuota_inicial_final_anterior = this.cuota_inicial_final;

            const limpiarNumero = this.cleanNumber.bind(this);
            const redondear0 = (num) => Math.round(num);

            const [anioBase, mesBase, diaBase] = this.d_fecha_cuota.split('-').map(Number);
            const partesPE = this.d_fecha_pe.split('-');
            const anioPE = parseInt(partesPE[0]);
            const mesPE = parseInt(partesPE[1]) - 1;
            const diaPE = parseInt(partesPE[2]);
            const fechaPE = new Date(anioPE, mesPE, diaPE);

            const capital = limpiarNumero(this.cuota_inicial_final);
            const tnaAntes = limpiarNumero(this.d_tna_antes);
            const tnaDespues = limpiarNumero(this.d_tna_despues);
            const n = limpiarNumero(this.d_meses);

            let saldo = capital;
            this.tablaPeriodos = [];

            let tnaActual = tnaAntes;
            const iBase = tnaAntes / PORCENTAJE_A_DECIMAL / MESES_POR_ANO;

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
                    const iNueva = tnaActual / PORCENTAJE_A_DECIMAL / MESES_POR_ANO;
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

                const iPeriodo = tnaActual / PORCENTAJE_A_DECIMAL / MESES_POR_ANO;
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

            if (this.id_opcion && this.esOpcionGuardada) {
                this.$nextTick(async () => {
                    await this.guardarTablaAmortizacion(this.id_opcion, false);
                });
            }
        },
        recalcularFila(index) {
            if (this.cargandoTablaDesdeDB) {
                return;
            }

            const limpiarNumero = this.cleanNumber.bind(this);
            this.ultimaCuotaResultado = 0;

            const redondear0 = (num) => Math.round(num);
            
            if (!this.valor_credito_final_base) {
                this.valor_credito_final_base = this.valor_credito_final;
            }

            const calcularPMT = (i, n, p) => {
                if (i === 0) return p / n;
                const factor = Math.pow(1 + i, n);
                return (i * p * factor) / (factor - 1);
            };

            const fila = this.tablaPeriodos[index];
            const totalPeriodos = this.tablaPeriodos.length;

            const iPeriodo = fila.tna / PORCENTAJE_A_DECIMAL / MESES_POR_ANO;

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

                const iPeriodoSig = f.tna / PORCENTAJE_A_DECIMAL / MESES_POR_ANO;
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
            this.valor_credito_final = this.valor_credito_final_base + totalSaldosNegativos;

            if (this.pagoSeleccionado === 'financiado') {
                const ultima = this.tablaPeriodos[this.tablaPeriodos.length - 1];

                if (ultima) {
                    const cuotaDeseada = limpiarNumero(ultima.cuota_deseada);
                    const cuotaCalculada = limpiarNumero(ultima.cuota_calculada);
                    this.ultimaCuotaDigitada = cuotaDeseada;

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
                    if (ultima.saldo_final < 0 && this.pagoSeleccionado === 'financiado') {
                        this.ultimaCuotaResultado = ultima.saldo_final;
                        return;
                    }

                    if (ultima.saldo_final < 1 && ultima.saldo_final > -1) {
                        ultima.saldo_final = 0;
                        this.ultimaCuotaResultado = 0;
                    }
                    else if (ultima.saldo_final !== 0 && ultima.saldo_inicial > 0) {
                        const saldoAnterior = ultima.saldo_inicial;
                        const interesUltimo = ultima.intereses;
                        ultima.principal = redondear0(saldoAnterior);
                        ultima.cuota_calculada = redondear0(saldoAnterior + interesUltimo);
                        ultima.saldo_final = 0;
                        this.ultimaCuotaResultado = 0;
                    }
                }
            }

            if (this.id_opcion && this.esOpcionGuardada) {
                this.$nextTick(async () => {
                    await this.guardarTablaAmortizacion(this.id_opcion, false);
                });
            }
        },
        formatearMoneda(valor) {
            if (valor === null || valor === undefined || valor === '') {
                return '';
            }
            const numeroLimpio = this.cleanNumber(valor);
            return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(numeroLimpio);
        },
        validar(index) {
            if (this.cargandoTablaDesdeDB) {
                return;
            }

            const fila = this.tablaPeriodos[index];
            const originalValue = fila.cuota_deseada;

            this.$nextTick(() => {
                if (!originalValue || originalValue.trim() === '') {
                    fila.cuota_deseada = '';
                    return;
                }
                const numeroParaFormato = this.cleanNumber(originalValue);
                fila.cuota_deseada = this.formatearMoneda(numeroParaFormato);
            });
        },
        async verAmortizacion() {
            if (this.d_meses == 0) {
                showMessage("Debe seleccionar Fecha 1ra Cuota.");
                return;
            }

            if (this.id_opcion && this.esOpcionGuardada) {
                await this.cargarTablaDesdeDB();
            } else {
                await this.generarTabla();
            }
        },
        async cargarTablaDesdeDB() {
            try {
                const resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Amortizacion', {
                    id_opcion: this.id_opcion
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
        async cerrarModalTabla() {
            if (this.id_opcion && this.esOpcionGuardada && this.tablaPeriodos && this.tablaPeriodos.length > 0) {
                await this.guardarTablaAmortizacion(this.id_opcion, false);
            }
            this.tablaAmortizacion = false;
        },
        formatoTNA(valor) {
            const valorLimpio = typeof valor === 'string' ? valor.replace(/%/g, '') : valor;
            return valorLimpio !== null && valorLimpio !== undefined && valorLimpio !== '' ? `${valorLimpio}%` : '';
        },
        actualizarTNA(tipo, valor) {
            let valorLimpio = valor.toString().replace(/[^0-9,.]/g, '');
            if (tipo === 'antes') {
                this.d_tna_antes = valorLimpio;
            } else if (tipo === 'despues') {
                this.d_tna_despues = valorLimpio;
            }
        },
        printPDF(id) {
            this.$nextTick(() => {
                setTimeout(() => {
                    const content = document.getElementById(id);
                    const tablaLandscape = document.getElementById('tabla-amortizacion-landscape');

                    html2pdf().set({
                        margin: [25, 10, 10, 10],
                        filename: 'cotizacion.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: {
                            scale: 2,
                            useCORS: true,
                            allowTaint: false,
                            logging: false,
                            windowWidth: 1024
                        },
                        pagebreak: { mode: 'css' },
                        jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
                    }).from(content).toPdf().get('pdf').then(async pdfPortrait => {

                        await this.agregarLogosEnTodasLasPaginas(pdfPortrait);

                        if (this.tablaPeriodos && this.tablaPeriodos.length > 0 && tablaLandscape) {
                            await this.renderTablaAmortizacion(pdfPortrait, tablaLandscape);
                        }

                        const pdfUrl = pdfPortrait.output('bloburl');
                        window.open(pdfUrl, '_blank');

                    }).catch((error) => {
                        console.error('Error al generar PDF:', error);
                        alert('Error al generar el PDF: ' + error.message);
                    });
                }, 100);
            });
        },
        async agregarLogosEnTodasLasPaginas(pdf) {
            const totalPages = pdf.internal.getNumberOfPages();

            const logoCapital = '../img/ico/logo-capital.png';

            const loadImageWithDimensions = (url) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = 'anonymous';
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        resolve({
                            base64: canvas.toDataURL('image/png'),
                            width: img.width,
                            height: img.height
                        });
                    };
                    img.onerror = reject;
                    img.src = url;
                });
            };

            try {
                const logoCapitalData = await loadImageWithDimensions(logoCapital);
                const logoProyectoData = this.logoProyecto ? await loadImageWithDimensions(this.logoProyecto) : null;

                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i);
                    const pageWidth = pdf.internal.pageSize.getWidth();
                    const pageHeight = pdf.internal.pageSize.getHeight();

                    const maxHeightCapital = 18;
                    const ratioCapital = logoCapitalData.width / logoCapitalData.height;
                    const heightCapital = maxHeightCapital;
                    const widthCapital = heightCapital * ratioCapital;
                    pdf.addImage(logoCapitalData.base64, 'PNG', 10, 5, widthCapital, heightCapital);

                    pdf.setFontSize(14);
                    pdf.setTextColor(0, 154, 185);
                    pdf.setFont(undefined, 'bold');
                    pdf.text('Cotización', pageWidth / 2, 11, { align: 'center' });

                    pdf.setFontSize(9);
                    pdf.setTextColor(0, 0, 0);
                    pdf.setFont(undefined, 'normal');
                    pdf.text(`Numero Cotizacion #: ${this.cotizacionSeleccionada || ''}`, pageWidth / 2, 16, { align: 'center' });
                    pdf.text(`Fecha Creado: ${this.f_cotizacion || ''}`, pageWidth / 2, 20, { align: 'center' });

                    if (logoProyectoData) {
                        const maxHeightProyecto = 18;
                        const ratioProyecto = logoProyectoData.width / logoProyectoData.height;
                        const heightProyecto = maxHeightProyecto;
                        const widthProyecto = heightProyecto * ratioProyecto;
                        const xPos = pageWidth - widthProyecto - 10;
                        pdf.addImage(logoProyectoData.base64, 'PNG', xPos, 5, widthProyecto, heightProyecto);
                    }

                    // Agregar pie de página
                    pdf.setFontSize(9);
                    pdf.setFont(undefined, 'normal');

                    // URL a la izquierda (negro)
                    pdf.setTextColor(0, 0, 0);
                    pdf.text('www.constructoracapital.com', 10, pageHeight - 10);

                    // Nombre del proyecto en el centro (azul)
                    const nombreProyecto = GlobalVariables.proyecto?.nombre || '';
                    pdf.setTextColor(0, 154, 185);
                    pdf.setFont(undefined, 'bold');
                    pdf.text(nombreProyecto, pageWidth / 2, pageHeight - 10, { align: 'center' });

                    // Número de página a la derecha (negro)
                    pdf.setTextColor(0, 0, 0);
                    pdf.setFont(undefined, 'normal');
                    pdf.text(`${i}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
                }
            } catch (error) {
                console.error('Error cargando logos:', error);
            }
        },
        async renderTablaAmortizacion(pdfPortrait, tablaLandscape) {

            const parent = tablaLandscape.parentElement;
            const originalParentStyles = {
                display: parent.style.display,
                position: parent.style.position,
                left: parent.style.left,
                top: parent.style.top
            };

            parent.style.display = 'block';
            parent.style.position = 'absolute';
            parent.style.left = '-9999px';
            parent.style.top = '0';

            await this.$nextTick();
            await new Promise(r => setTimeout(r, 500));

            const canvas = await html2canvas(tablaLandscape, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.98);

            pdfPortrait.addPage('letter', 'landscape');

            const pageWidth = 279.4;
            const pageHeight = 215.9;

            const marginX = 8;
            const marginY = 5;
            const maxWidth = pageWidth - (marginX * 2);
            const maxHeight = pageHeight - marginY - 5;

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const imgRatio = imgWidth / imgHeight;

            let finalWidth = maxWidth;
            let finalHeight = finalWidth / imgRatio;

            if (finalHeight > maxHeight) {
                finalHeight = maxHeight;
                finalWidth = finalHeight * imgRatio;
            }

            const xPos = (pageWidth - finalWidth) / 2;
            const yPos = marginY;

            pdfPortrait.addImage(
                imgData,
                'JPEG',
                xPos,
                yPos,
                finalWidth,
                finalHeight,
                undefined,
                'FAST'
            );

            // Agregar pie de página
            const currentPage = pdfPortrait.internal.getNumberOfPages();
            pdfPortrait.setFontSize(9);
            pdfPortrait.setFont(undefined, 'normal');

            // URL a la izquierda (negro)
            pdfPortrait.setTextColor(0, 0, 0);
            pdfPortrait.text('www.constructoracapital.com', 10, pageHeight - 10);

            // Nombre del proyecto en el centro (azul)
            const nombreProyecto = GlobalVariables.proyecto?.nombre || '';
            pdfPortrait.setTextColor(0, 154, 185);
            pdfPortrait.setFont(undefined, 'bold');
            pdfPortrait.text(nombreProyecto, pageWidth / 2, pageHeight - 10, { align: 'center' });

            // Número de página a la derecha (negro)
            pdfPortrait.setTextColor(0, 0, 0);
            pdfPortrait.setFont(undefined, 'normal');
            pdfPortrait.text(`${currentPage}`, pageWidth - 15, pageHeight - 10, { align: 'right' });

            parent.style.display = originalParentStyles.display;
            parent.style.position = originalParentStyles.position;
            parent.style.left = originalParentStyles.left;
            parent.style.top = originalParentStyles.top;
        },

        guardarYGenerarPDF() {
            this.tablaPeriodos.forEach((fila, i) => this.recalcularFila(i));
            this.printPDF('contenedor-pdf-completo');
        },
        async guardarTablaAmortizacion(idOpcion, mostrarMensaje = false) {
            try {
                if (!idOpcion) {
                    return false;
                }

                if (!this.tablaPeriodos || this.tablaPeriodos.length === 0) {
                    return false;
                }

                const tablaParaGuardar = this.tablaPeriodos.map(fila => {
                    let fechaParaDB = fila.fecha;
                    if (fila.fecha && fila.fecha.includes('/')) {
                        const partes = fila.fecha.split('/');
                        if (partes.length === 3) {
                            fechaParaDB = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
                        }
                    }

                    let cuotaDeseadaLimpia = null;
                    if (fila.cuota_deseada) {
                        const valorLimpio = this.cleanNumber(fila.cuota_deseada);
                        cuotaDeseadaLimpia = valorLimpio > 0 ? valorLimpio : null;
                    }

                    return {
                        periodo: fila.periodo,
                        fecha: fechaParaDB,
                        saldo_inicial: fila.saldo_inicial,
                        tna: fila.tna,
                        cuota_deseada: cuotaDeseadaLimpia,
                        cuota_calculada: fila.cuota_calculada,
                        intereses: fila.intereses,
                        principal: fila.principal,
                        saldo_final: fila.saldo_final
                    };
                });

                const respAmort = await httpFunc('/generic/genericST/ProcesoNegocio:Ins_Amortizacion', {
                    id_opcion: idOpcion,
                    tabla_json: JSON.stringify(tablaParaGuardar)
                });

                if (respAmort.isError) {
                    if (mostrarMensaje) {
                        showMessage('Error al guardar la tabla de amortización');
                    }
                    return false;
                }

                if (mostrarMensaje) {
                    showMessage('Tabla de amortización guardada correctamente');
                }
                return true;
            } catch (error) {
                console.error('Error al guardar tabla de amortización:', error);
                if (mostrarMensaje) {
                    showMessage('Error al guardar la tabla de amortización');
                }
                return false;
            }
        },
        async enviarYOpcionar() {
            if (!this.cotizacionSeleccionada) {
                showMessage('Debe seleccionar una cotización');
                return;
            }

            if (!this.idcotizacion) {
                showMessage('No se encontró el ID de la cotización');
                return;
            }

        
            let id_tipo = null;
            if (this.unidadSeleccionada && this.unidadSeleccionada !== 0) {
                const factor = this.factoresBanco.find(f => f.unidad === this.unidadSeleccionada);
                id_tipo = factor ? factor.id_factor : null;
                this.tipoSeleccionado = id_tipo;
            }

   
            let id_modalidad = null;
            if (this.tipoFinanciacionSeleccionada) {
                const tipoFin = this.tipo_financiacion.find(t => t.tipo_financiacion === this.tipoFinanciacionSeleccionada);
                id_modalidad = tipoFin ? tipoFin.id_tipo_financiacion : null;
                this.modalidadSeleccionada = id_modalidad;
            }

         
            if (!this.esOpcionGuardada) {

                const valorCreditoMillon = (this.valor_credito * this.factorBanco) / 1000000;

                this.cuota_max_financiable = Math.floor(valorCreditoMillon);
 
                this.ingr_regs_max = valorCreditoMillon > 0 ? Math.floor(valorCreditoMillon / 0.40) : 0;

                const ingresos = parseInt(this.f_ingresos_mensuales.toString().replace(/\D/g, '')) || 0;
                const factor = this.factorBanco || 0;
                const valorCredito = this.valor_credito || 0;

                if (factor !== 0 && ingresos !== 0) {
                    const factorEnMillones = factor / 1000000;
                    const maxPorIngresos = (ingresos * 0.40) / factorEnMillones;
                    this.fin_max_permisible = Math.min(valorCredito, Math.floor(maxPorIngresos));
                } else {
                    this.fin_max_permisible = 0;
                }
            }

            showProgress();
            try {
                const opcionData = {
                    fecha_entrega: this.esOpcionGuardada ? this.opcion_fecha_entrega : this.d_fecha_entrega,
                    valor_reformas: this.cleanNumber(this.esOpcionGuardada ? this.opcion_valor_reformas : this.valor_reformas) || 0,
                    valor_acabados: this.cleanNumber(this.esOpcionGuardada ? this.opcion_valor_acabados : this.valor_acabados) || 0,
                    valor_descuento_adicional: this.cleanNumber(this.valor_descuento_adicional) || 0,
                    valor_separacion: this.cleanNumber(this.esOpcionGuardada ? this.opcion_valor_separacion : this.valor_separacion) || 0,
                    valor_escrituras: this.cleanNumber(this.valor_escrituras) || 0,
                    notariales: this.cleanNumber(this.valor_notariales) || 0,
                    beneficiencia: this.cleanNumber(this.valor_beneficiencia) || 0,
                    registro: this.cleanNumber(this.valor_registro) || 0,
                    pago_contado: this.pagoSeleccionado?.toLowerCase() === 'contado' ? 1 : 0,
                    pago_financiado: this.pagoSeleccionado?.toLowerCase() === 'financiado' ? 1 : 0,
                    id_entidad: this.bancoSeleccionado || null,
                    id_tipo: this.tipoSeleccionado || null,
                    id_anios: this.anioSeleccionado || null,
                    id_modalidad: this.modalidadSeleccionada || null,
                    //subsidio_activo: this.subsidioActivo || null,
                    ingresos_familiares: this.cleanNumber(this.ingresos_mensuales) || 0,
                    cesantias: this.cleanNumber(this.cesantias) || 0,
                    ahorros: this.cleanNumber(this.ahorros) || 0,
                    fin_max_permisible: this.cleanNumber(this.fin_max_permisible) || 0,
                    cuota_permisible: this.cleanNumber(this.cuota_permisible) || 0,
                    cuota_max_financiable: this.cleanNumber(this.cuota_max_financiable) || 0,
                    ingr_regs_max: this.cleanNumber(this.ingr_regs_max) || 0,
                    anio_entrega: this.seleccionAnioEntrega || null,
                    valor_subsidio: this.cleanNumber(this.valor_subsidio) || 0,
                    id_caja_compensacion: this.caja_compensacion || null,
                    meses: this.d_meses || 0,
                    importe_financiacion: this.cleanNumber(this.valor_credito_final) || 0,
                    cuota_inicial: this.cleanNumber(this.cuota_inicial_final) || 0,
                    fecha_primera_cuota: this.esOpcionGuardada ? this.opcion_fecha_primera_cuota : this.d_fecha_cuota,
                    fecha_ultima_cuota: this.esOpcionGuardada ? this.opcion_fecha_ultima_cuota : this.d_fecha_ulti_cuota,
                    fecha_escrituracion: this.esOpcionGuardada ? this.opcion_fecha_escrituracion : this.d_fecha_escrituracion,
                    id_banco_factor: this.idFactorBanco || null
                };

                let resp;
                let mensaje;

                if (this.id_opcion) {
                    opcionData.id_opcion = this.id_opcion;
                    resp = await httpFunc('/generic/genericST/ProcesoNegocio:Upd_Opcion', opcionData);
                    mensaje = 'Opción actualizada correctamente';
                } else {
                    opcionData.id_cotizacion = this.idcotizacion;
                    opcionData.created_by = GlobalVariables.username;
                    resp = await httpFunc('/generic/genericST/ProcesoNegocio:Ins_Opcion', opcionData);
                    mensaje = 'Opción creada correctamente';
                }

                if (resp.isError) {
                    throw new Error(resp.errorMessage || 'Error al guardar la opción');
                }

                let idOpcionFinal = this.id_opcion;
                if (!this.id_opcion) {
                    let resultString = null;

                    if (resp.data && resp.data.result) {
                        resultString = resp.data.result;
                    }
                    else if (resp.data && resp.data[0] && resp.data[0][0] && resp.data[0][0].result) {
                        resultString = resp.data[0][0].result;
                    }
                    else if (resp.data && resp.data[0] && resp.data[0].result) {
                        resultString = resp.data[0].result;
                    }

                    if (resultString) {
                        const match = resultString.match(/ok-id_opcion:(\d+)/);
                        if (match) {
                            idOpcionFinal = parseInt(match[1]);
                            this.id_opcion = idOpcionFinal;
                        }
                    } else {
                        try {
                            const respOpcion = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Opcion', {
                                id_cotizacion: this.idcotizacion,
                                id_proyecto: GlobalVariables.id_proyecto,
                                id_cliente: this.id_cliente
                            });

                            if (respOpcion.data && respOpcion.data[0] && respOpcion.data[0][0]) {
                                idOpcionFinal = respOpcion.data[0][0].id_opcion;
                                this.id_opcion = idOpcionFinal;
                            }
                        } catch (error) {
                            console.error('Error al consultar opción creada:', error);
                        }
                    }
                }

                if (idOpcionFinal && this.tablaPeriodos && this.tablaPeriodos.length > 0) {
                    await this.guardarTablaAmortizacion(idOpcionFinal, false);
                }

                await this.eliminarBorrador();

                this.tieneCambiosPendientes = false;

                showMessage(mensaje);
                await this.limpiarObj();
                this.mode = 0;

            } catch (error) {
                console.error('Error al enviar y opcionar:', error);
                showMessage('Error: ' + (error.message || 'No se pudo guardar la opción'));
            } finally {
                hideProgress();
            }
        },
        async onChangeAnio() {
            if (this.esOpcionGuardada) {
                return;
            }

            if (!this.anioSeleccionado || !this.bancoSeleccionado) return;
            try {

                let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_FactorMillon', {
                    id_banco: this.bancoSeleccionado,
                    unidadSeleccionada: this.unidadSeleccionada,
                    anioSeleccionado: this.anioSeleccionado + ' años',
                    tipo_factor: this.tipo_factor
                });
                this.factorBanco = resp.data[0][0].valor;
                this.idFactorBanco = resp.data[0][0].id_banco_factor;
                this.tipoFinanciacionSeleccionada = '';

            } catch (err) {
                console.error("Error al obtener factor por banco:", err);
            }
        },
        calcularCuotaInicialFinal() {
            if (this.esOpcionGuardada) {
                return;
            }

            const nuevoMax = this.valor_maxfinanciable;
            this.valor_credito = this.valor_credito_base;
            this.cuota_inicial = this.cuota_inicial_base;
            const creditoActual = this.valor_credito || 0;

            if (creditoActual > nuevoMax) {
                const restante = creditoActual - nuevoMax;
                this.valor_credito_max = nuevoMax;
                this.cuota_inicial += restante;
            } else {
                this.valor_credito_max = creditoActual;
            }

            if (!this.valor_credito_final_base || this.valor_credito_final === this.valor_credito_final_base) {
                this.valor_credito_final = this.valor_credito_max || 0;
            }

            let cuota = this.cleanNumber(this.cuota_inicial);
            let totalAportes = this.cleanNumber(this.cesantias) + this.cleanNumber(this.ahorros);

            if (this.pagoSeleccionado?.toLowerCase() === 'financiado') {
                totalAportes += this.cleanNumber(this.valor_subsidio);
            }

            cuota -= totalAportes;
            cuota -= this.cleanNumber(this.cuota_escritura_final);

            if (!this.subsidioActivo) {
                cuota -= this.cleanNumber(this.valor_separacion);
            }

            this.cuota_inicial_final = Math.max(0, cuota);
        },
        onInputIngresos() {
      
            if (this.esOpcionGuardada) {
                return;
            }
            this.calcularCuotaInicialFinal();
        },
        onBlurIngresos() {
           
            if (this.esOpcionGuardada) {
                return;
            }

            this.editandoIngresos = true;
            this.ultimaCuotaDigitada = 0;
            this.$nextTick(() => {
                this.calcularCuotaInicialFinal();
                this.editandoIngresos = false;
            });
        },
        async abrirModalCliente() {
            this.clientes = [];

            const resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Cotizacion_Cliente', {
                id_cotizacion: this.idcotizacion
            });

            const lista = resp?.data?.[0] ?? [];

            const existeCliente = this.clientes.some(c => c.id_cliente === this.ObjClienteOpcional.id_cliente);

            if (!existeCliente) {
                this.clientes.unshift({
                    nombres: this.ObjCliente.nombres,
                    apellido1: this.ObjCliente.apellido1,
                    apellido2: this.ObjCliente.apellido2,
                    numeroDocumento: this.ObjCliente.numeroDocumento,
                    id_cliente: this.ObjCliente.id_cliente,
                    porcentaje: this.ObjCliente.porcentaje_copropiedad,
                    direccion: this.ObjCliente.direccion,
                    ciudad: this.ObjCliente.ciudad,
                    departamento: this.ObjCliente.departamento,
                    pais: this.ObjCliente.pais,
                    email1: this.ObjCliente.email1,
                    email2: this.ObjCliente.email2,
                    telefono1: this.ObjCliente.telefono1,
                    telefono2: this.ObjCliente.telefono2,
                    tipoDocumento: this.ObjCliente.tipoDocumento,
                    paisExpedicion: this.ObjCliente.paisExpedicion,
                    ciudadExpedicion: this.ObjCliente.ciudadExpedicion,
                    fechaExpedicion: this.ObjCliente.fechaExpedicion,
                    fechaNacimiento: this.ObjCliente.fechaNacimiento
                });
            } else {
                const idx = this.clientes.findIndex(c => c.id_cliente === this.ObjClienteOpcional.id_cliente);
                if (idx > 0) {
                    const cliente = this.clientes.splice(idx, 1)[0];
                    this.clientes.unshift(cliente);
                }
            }

            for (const item of lista) {
                const existe = this.clientes.some(c => c.id_cliente === item.id_cliente);

                if (!existe) {
                    this.clientes.push({
                        nombres: item.nombres,
                        apellido1: item.apellido1,
                        apellido2: item.apellido2,
                        numeroDocumento: item.numero_documento,
                        id_cliente: item.id_cliente,
                        porcentaje: item.porcentaje_copropiedad,
                        direccion: item.direccion,
                        ciudad: item.ciudad,
                        departamento: item.departamento,
                        pais: item.pais,
                        email1: item.email1,
                        email2: item.email2,
                        telefono1: item.telefono1,
                        telefono2: item.telefono2,
                        tipoDocumento: item.tipo_documento,
                        paisExpedicion: item.pais_expedicion,
                        ciudadExpedicion: item.ciudad_expedicion,
                        fechaExpedicion: item.fecha_expedicion,
                        fechaNacimiento: item.fecha_nacimiento
                    });
                }
            }
            this.mostrarModalCliente = true;
            this.initIntlTel(this.ObjClienteOpcional);
        },

        async guardarPorcentaje(c) {

            if (c.porcentaje === '' || c.porcentaje == null) {
                return;
            }

            const valor = Number(c.porcentaje);

            if (isNaN(valor) || valor < 0) {
                showMessage("El porcentaje no es válido.", 2);
                c.porcentaje = '';
                return;
            }

            const suma = this.clientes
                .filter(x => x !== c)
                .reduce((acc, x) => acc + Number(x.porcentaje || 0), 0);

            const total = suma + valor;

            if (total > 100) {
                showMessage("La suma total de porcentajes no puede superar el 100%.", 2);
                c.porcentaje = ''; 
            }
        
            try {
                const resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Upd_Cotizacion_Cliente',
                    {
                        id_cliente: c.id_cliente,
                        porcentaje: valor
                    }
                );

            } catch (e) {
                console.error("Error guardando porcentaje", e);
            }
        },

        async addCliente() {
            const consulta = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Cliente', {
                cliente: this.ObjClienteOpcional.numeroDocumento
            });

            const clienteExistente = consulta?.data?.[0]?.[0]?.id_cliente ?? null;

            if (clienteExistente) {
                await httpFunc('/generic/genericDT/ProcesoNegocio:Ins_Cotizacion_Cliente', {
                    id_cliente: clienteExistente,
                    id_cotizacion: this.idcotizacion
                });

                return;
            }
            let obj = {};
            Object.keys(this.ObjClienteOpcional).forEach(k => (this.ObjClienteOpcional[k] || this.ObjClienteOpcional[k] === 0) && (obj[k] = this.ObjClienteOpcional[k]))
            const resp = await httpFunc('/generic/genericDT/ProcesoNegocio:Ins_Cliente', obj);

            const texto = resp?.data?.[0]?.result || "";
            const nuevoId = Number(texto.match(/\d+/)?.[0] || 0);

            if (!nuevoId) {
                showMessage("No fue posible obtener el ID del cliente creado.");
                return;
            }

            const clientes = [nuevoId];

            if (this.id_cliente > 0) {
                clientes.push(this.id_cliente);
            }

            for (const id of clientes) {
                await httpFunc('/generic/genericDT/ProcesoNegocio:Ins_Cotizacion_Cliente', {
                    id_cliente: id,
                    id_cotizacion: this.idcotizacion
                });
            }

        },

        calcularEscrituras() {
     
            if (this.esOpcionGuardada) {
                return;
            }

            const not = this.cleanNumber(this.valor_notariales);
            const ben = this.cleanNumber(this.valor_beneficiencia);
            const reg = this.cleanNumber(this.valor_registro);
            this.valor_escrituras = not + ben + reg;
        },
        validarNumero(e) {
            e.target.value = e.target.value.replaceAll(/[^0-9\.]/g, '');
        },
        validarTexto(e) {
            e.target.value = e.target.value.replaceAll(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '');
        },
        formatearFechaParaInput(fecha) {
            if (!fecha) return '';


            if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}/.test(fecha)) {
                return fecha.split('T')[0];
            }

            if (typeof fecha === 'string' && /\d{1,2}\/\d{1,2}\/\d{4}/.test(fecha)) {
                const partes = fecha.split(' ')[0].split('/');
                const dia = partes[0].padStart(2, '0');
                const mes = partes[1].padStart(2, '0');
                const anio = partes[2];
                const resultado = `${anio}-${mes}-${dia}`;
                return resultado;
            }

            if (fecha instanceof Date) {
                const year = fecha.getFullYear();
                const month = String(fecha.getMonth() + 1).padStart(2, '0');
                const day = String(fecha.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            try {
                const d = new Date(fecha);
                if (!isNaN(d.getTime())) {
                    const year = d.getFullYear();
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const day = String(d.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            } catch (e) {
                console.error('Error formateando fecha:', e);
            }

            return '';
        },
        clearDavivienda() {
            this.davivienda = {
                propertyPrice: Math.round(this.cleanNumber(this.importeActiva)) || 0,
                amount: Math.round(this.cleanNumber(this.valor_credito_final)) || 0,
                instalments: 1,
                customerInformation: {
                    documentType: null,
                    documentNumber: null,
                    names: null,
                    firstLastname: null,
                    secondLastName: null,
                    monthlyIncome: Math.round(this.cleanNumber(this.ingresos_mensuales)) || 0,
                    workActivity: null,
                    contractType: null,
                    birthdate: null,
                    mobileNumber: null,
                    email: null,
                    redirectionURL: "https://dev.serlefinpbi.com"
                },
                builderInformation: {
                    deliveryDate: this.display_fecha_entrega.replaceAll('-', '/'),
                    adviserId: this.asesor.za1_id,
                    projectId: GlobalVariables.proyecto.za1_id,
                    email: this.asesor.email
                }
            };
        },
        async requestDavivienda() {
            this.davivienda.customerInformation.documentType = this.ObjCliente.tipoDocumento;
            this.davivienda.customerInformation.documentNumber = this.ObjCliente.numeroDocumento;
            this.davivienda.customerInformation.names = this.ObjCliente.nombres;
            this.davivienda.customerInformation.firstLastname = this.ObjCliente.apellido1;
            this.davivienda.customerInformation.secondLastName = this.ObjCliente.apellido2;
            this.davivienda.customerInformation.birthdate = this.ObjCliente.fechaNacimiento;
            this.davivienda.customerInformation.mobileNumber = this.ObjCliente.telefono1 || this.ObjCliente.telefono2;
            this.davivienda.customerInformation.email = this.ObjCliente.email1 || this.ObjCliente.email2;
            let ciudad = GlobalVariables.proyecto.sede.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (!this.davivienda.customerInformation.workActivity || 
                (this.davivienda.customerInformation.workActivity == 'EMPLOYEE' && !this.davivienda.customerInformation.contractType))
                showMessage("Debe ingresar actividad laboral y tipo de contrato en caso de EMPLEADO");
            else {
                try {
                    let res = await fetch(`/davivienda/${ciudad}`, {
                        method: 'POST',
                        body: JSON.stringify(this.davivienda)
                    });
                    let headers = Object.fromEntries(res.headers), body = null;
                    if (headers['content-type'] == "application/json") body = await res.json();
                    else body = await res.text();
                    if (res.status != 200) {
                        console.error(`Error ${res.status}: `, body);
                        showMessage(`Error ${res.status}`);
                    }
                    else {
                        console.log(body);
                        this.davForm = false;
                    }
                }
                catch (e) {
                    console.error(e);
                    showMessage("Error: Lo sentimos, no se pudo establecer conexión con Davivienda.");
                }
            }
        },
        async guardarTablaManualmente() {
            if (!this.id_opcion) {
                showMessage('No hay una opción guardada para actualizar la tabla');
                return;
            }

            if (!this.tablaPeriodos || this.tablaPeriodos.length === 0) {
                showMessage('No hay datos en la tabla de amortización');
                return;
            }

            showProgress();
            try {
                const resultado = await this.guardarTablaAmortizacion(this.id_opcion, true);
                if (!resultado) {
                    showMessage('Error al guardar la tabla de amortización');
                }
            } catch (error) {
                console.error('Error al guardar tabla manualmente:', error);
                showMessage('Error al guardar la tabla de amortización');
            } finally {
                hideProgress();
            }
        },
        async exportExcelAmortizacion() {
            try {
                showProgress();

                if (typeof ExcelJS === 'undefined') {
                    await new Promise((resolve, reject) => {
                        const script = document.createElement('script');
                        script.src = '../../js/lib/exceljs.min.js';
                        script.onload = () => {
                            setTimeout(() => {
                                if (typeof ExcelJS !== 'undefined') {
                                    resolve();
                                } else {
                                    reject(new Error('ExcelJS no se cargó correctamente'));
                                }
                            }, 100);
                        };
                        script.onerror = (error) => {
                            reject(new Error('Error al cargar ExcelJS: ' + error.message));
                        };
                        document.head.appendChild(script);
                    });
                }

                const toNumber = (value) => {
                    if (value === null || value === undefined || value === '') return 0;
                    if (typeof value === 'number') return value;
                    let str = value.toString();
                    str = str.replace(/[$\s]/g, '');
                    str = str.replace(/\./g, '');
                    str = str.replace(/,/g, '.');
                    let num = parseFloat(str);
                    return isNaN(num) ? 0 : num;
                };

                if (typeof ExcelJS === 'undefined') {
                    throw new Error('ExcelJS no está disponible');
                }

                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Tabla Amortización');

                worksheet.columns = [
                    { width: 15 },
                    { width: 15 },
                    { width: 20 },
                    { width: 18 },
                    { width: 20 },
                    { width: 20 }
                ];

                const borderThin = {
                    top: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                    left: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                    bottom: { style: 'thin', color: { argb: 'FFD0D0D0' } },
                    right: { style: 'thin', color: { argb: 'FFD0D0D0' } }
                };

                let currentRow = 1;

                worksheet.mergeCells('A1:F1');
                const titleCell = worksheet.getCell('A1');
                titleCell.value = 'TABLA DE AMORTIZACIÓN';
                titleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFFFF' } };
                titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF009AB9' } };
                titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
                titleCell.border = borderThin;
                currentRow++;

                let unidadesTexto = '';
                if (this.unidades && this.unidades.length > 0) {
                    unidadesTexto = this.unidades
                        .map(u => `Torre ${u.consecutivo || ''} Apto ${u.numero_apartamento || ''}`)
                        .join(' || ');
                }

                const infoRows = [
                    ['Proyecto:', GlobalVariables.proyecto.nombre || ''],
                    ['Unidad:', unidadesTexto || 'N/A'],
                    ['Fecha Escrituración:', this.d_fecha_pe || '']
                ];

                infoRows.forEach(([label, value]) => {
                    const row = worksheet.getRow(currentRow);
                    row.getCell(1).value = label;
                    row.getCell(1).font = { bold: true, size: 11 };
                    row.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
                    row.getCell(1).border = borderThin;

                    row.getCell(2).value = value;
                    row.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
                    row.getCell(2).border = borderThin;
                    currentRow++;
                });

                currentRow++;

                const sepRow = worksheet.getRow(currentRow);
                sepRow.getCell(1).value = 'Separación';
                sepRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FFF57C00' } };
                sepRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
                sepRow.getCell(1).border = borderThin;

                sepRow.getCell(6).value = toNumber(this.valor_separacion);
                sepRow.getCell(6).numFmt = '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)';
                sepRow.getCell(6).font = { bold: true, color: { argb: 'FFF57C00' } };
                sepRow.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3E0' } };
                sepRow.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };
                sepRow.getCell(6).border = borderThin;
                currentRow++;

                const gastosRow = worksheet.getRow(currentRow);
                gastosRow.getCell(1).value = 'Gastos Escritura';
                gastosRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FFE64A19' } };
                gastosRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
                gastosRow.getCell(1).border = borderThin;

                gastosRow.getCell(6).value = toNumber(this.valor_escrituras);
                gastosRow.getCell(6).numFmt = '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)';
                gastosRow.getCell(6).font = { bold: true, color: { argb: 'FFE64A19' } };
                gastosRow.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF3E0' } };
                gastosRow.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };
                gastosRow.getCell(6).border = borderThin;
                currentRow++;
             
                const headerRow = worksheet.getRow(currentRow);
                const headers = ['Periodo', 'Fecha', 'Saldo Inicial', 'Cuota Deseada', 'Cuota Calculada', 'Saldo Final'];
                headers.forEach((header, index) => {
                    const cell = headerRow.getCell(index + 1);
                    cell.value = header;
                    cell.font = { bold: true, size: 11, color: { argb: 'FFFFFFFF' } };
                    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF009AB9' } };
                    cell.alignment = { horizontal: 'center', vertical: 'middle' };
                    cell.border = borderThin;
                });
                currentRow++;

                let ultimaFilaPeriodo = currentRow;
                this.tablaPeriodos.forEach((fila, index) => {
                    const dataRow = worksheet.getRow(currentRow);
                    const isEvenRow = index % 2 === 0;
                    const fillColor = isEvenRow ? 'FFF5F5F5' : 'FFFFFFFF';
                    const periodosRestantes = this.tablaPeriodos.length - index;
                    const cuotaDeseada = toNumber(fila.cuota_deseada);

                    dataRow.getCell(1).value = fila.periodo;
                    dataRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
                    dataRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                    dataRow.getCell(1).border = borderThin;

                    dataRow.getCell(2).value = String(fila.fecha || '');
                    dataRow.getCell(2).alignment = { horizontal: 'center', vertical: 'middle' };
                    dataRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                    dataRow.getCell(2).border = borderThin;

                    if (index === 0) {
                        dataRow.getCell(3).value = toNumber(this.cuota_inicial_final);
                    } else {
                        dataRow.getCell(3).value = { formula: `IF(F${currentRow - 1}<=0,0,F${currentRow - 1})` };
                    }
                    dataRow.getCell(3).numFmt = '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)';
                    dataRow.getCell(3).alignment = { horizontal: 'right', vertical: 'middle' };
                    dataRow.getCell(3).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                    dataRow.getCell(3).border = borderThin;

                    const valorCuotaDeseada = String(fila.cuota_deseada || '').trim();
                    if (valorCuotaDeseada !== '') {
                        dataRow.getCell(4).value = cuotaDeseada;
                        dataRow.getCell(4).numFmt = '_($* #,##0_);_($* (#,##0);_($* "0"_);_(@_)';
                    } else {
                        dataRow.getCell(4).value = null;
                        dataRow.getCell(4).numFmt = '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)';
                    }
                    dataRow.getCell(4).alignment = { horizontal: 'right', vertical: 'middle' };
                    dataRow.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                    dataRow.getCell(4).border = borderThin;

                    dataRow.getCell(5).value = { formula: `IF(C${currentRow}<=0,0,IF(D${currentRow}<>"",D${currentRow},ROUND(C${currentRow}/${periodosRestantes},0)))` };
                    dataRow.getCell(5).numFmt = '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)';
                    dataRow.getCell(5).alignment = { horizontal: 'right', vertical: 'middle' };
                    dataRow.getCell(5).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                    dataRow.getCell(5).border = borderThin;

                    dataRow.getCell(6).value = { formula: `IF(C${currentRow}<=0,0,C${currentRow}-E${currentRow})` };
                    dataRow.getCell(6).numFmt = '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)';
                    dataRow.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };
                    dataRow.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fillColor } };
                    dataRow.getCell(6).border = borderThin;

                    ultimaFilaPeriodo = currentRow;

                    currentRow++;
                });

                const primeraFilaPeriodo = ultimaFilaPeriodo - this.tablaPeriodos.length + 1;
                worksheet.addConditionalFormatting({
                    ref: `F${primeraFilaPeriodo}:F${ultimaFilaPeriodo}`,
                    rules: [
                        {
                            type: 'cellIs',
                            operator: 'lessThan',
                            formulae: [0],
                            style: {
                                font: { color: { argb: 'FFFF0000' }, bold: true }
                            }
                        }
                    ]
                });

                currentRow++;

                const importeRow = worksheet.getRow(currentRow);
                importeRow.getCell(1).value = 'Importe Financiación';
                importeRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF0277BD' } };
                importeRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
                importeRow.getCell(1).border = borderThin;

                const valorBase = toNumber(this.valor_credito_final_base) || toNumber(this.valor_credito_final);

                importeRow.getCell(6).value = {
                    formula: `${valorBase}+SUMIF(F${primeraFilaPeriodo}:F${ultimaFilaPeriodo},"<0")`
                };
                importeRow.getCell(6).numFmt = '_($* #,##0_);_($* (#,##0);_($* "0"_);_(@_)';
                importeRow.getCell(6).font = { bold: true, color: { argb: 'FF0277BD' } };
                importeRow.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE1F5FE' } };
                importeRow.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };
                importeRow.getCell(6).border = borderThin;
                currentRow++;

                if (this.valor_subsidio && toNumber(this.valor_subsidio) > 0) {
                    const subsidioRow = worksheet.getRow(currentRow);
                    subsidioRow.getCell(1).value = 'Subsidio No.1';
                    subsidioRow.getCell(1).font = { bold: true, size: 11, color: { argb: 'FF388E3C' } };
                    subsidioRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
                    subsidioRow.getCell(1).border = borderThin;

                    subsidioRow.getCell(6).value = toNumber(this.valor_subsidio);
                    subsidioRow.getCell(6).numFmt = '_($* #,##0_);_($* (#,##0);_($* "-"_);_(@_)';
                    subsidioRow.getCell(6).font = { bold: true, color: { argb: 'FF388E3C' } };
                    subsidioRow.getCell(6).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F5E9' } };
                    subsidioRow.getCell(6).alignment = { horizontal: 'right', vertical: 'middle' };
                    subsidioRow.getCell(6).border = borderThin;
                }

                const nombreArchivo = `tabla_amortizacion_${String(this.cotizacion || 'sin_cotizacion').replace(/[^a-zA-Z0-9]/g, '_')}_${GlobalVariables.proyecto.nombre.replaceAll(' ', '_')}.xlsx`;

                const buffer = await workbook.xlsx.writeBuffer();
                const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = nombreArchivo;
                link.click();
                window.URL.revokeObjectURL(url);

                showMessage('Tabla de amortización exportada exitosamente con fórmulas');

            } catch (e) {
                console.error('Error completo al exportar:', e);
                showMessage('Error al exportar: ' + mensajeError);
            }
            hideProgress();
        }
    },
    computed: {
        id_proyecto() {
            return GlobalVariables.id_proyecto;
        },
        esOpcionGuardada() {
            return this.id_opcion !== null;
        },
        reformaAct() {
            return this.unidadOpcion?.inv_terminado == 1;
        },
        esCotizacionAntigua() {
            if (!this.f_cotizacion) return false;
            const hoyStr = new Date().toISOString().slice(0, 10);
            return this.f_cotizacion !== hoyStr;
        },
        unidadesNoDisponibles() {
            return this.unidades && this.unidades.some(u => u.id_estado_unidad === 2);
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
            return this.valor_credito_final_base - this.excedentePagoCuotaInicial;
        },

        display_fecha_entrega: {
            get() {
                if (this.esOpcionGuardada && this.opcion_fecha_entrega !== null) {
                    return this.formatearFechaParaInput(this.opcion_fecha_entrega);
                }
                return this.formatearFechaParaInput(this.d_fecha_entrega);
            },
            set(val) {
                if (!this.esOpcionGuardada) {
                    this.d_fecha_entrega = val;
                }
            }
        },
        display_fecha_escrituracion: {
            get() {
                if (this.esOpcionGuardada && this.opcion_fecha_escrituracion !== null) {
                    return this.formatearFechaParaInput(this.opcion_fecha_escrituracion);
                }
                return this.formatearFechaParaInput(this.d_fecha_escrituracion);
            },
            set(val) {
                if (!this.esOpcionGuardada) {
                    this.d_fecha_escrituracion = val;
                }
            }
        },
        display_fecha_primera_cuota: {
            get() {
                if (this.esOpcionGuardada && this.opcion_fecha_primera_cuota !== null) {
                    return this.formatearFechaParaInput(this.opcion_fecha_primera_cuota);
                }
                return this.formatearFechaParaInput(this.d_fecha_cuota);
            },
            set(val) {
                if (!this.esOpcionGuardada) {
                    this.d_fecha_cuota = val;
                }
            }
        },
        display_fecha_ultima_cuota: {
            get() {
                if (this.esOpcionGuardada && this.opcion_fecha_ultima_cuota !== null) {
                    return this.formatearFechaParaInput(this.opcion_fecha_ultima_cuota);
                }
                return this.formatearFechaParaInput(this.d_fecha_ulti_cuota);
            },
            set(val) {
                if (!this.esOpcionGuardada) {
                    this.d_fecha_ulti_cuota = val;
                }
            }
        },
        clientesParaPDF() {
            if (this.clientes.length > 0) {
                return this.clientes;
            }
            return [{
                nombres: this.ObjCliente.nombres,
                apellido1: this.ObjCliente.apellido1,
                apellido2: this.ObjCliente.apellido2,
                numeroDocumento: this.ObjCliente.numeroDocumento,
                id_cliente: this.ObjCliente.id_cliente,
                porcentaje: this.ObjCliente.porcentaje_copropiedad || 100,
                direccion: this.ObjCliente.direccion,
                ciudad: this.ObjCliente.ciudad,
                departamento: this.ObjCliente.departamento,
                pais: this.ObjCliente.pais,
                email1: this.ObjCliente.email1,
                email2: this.ObjCliente.email2,
                telefono1: this.ObjCliente.telefono1,
                telefono2: this.ObjCliente.telefono2,
                tipoDocumento: this.ObjCliente.tipoDocumento,
                paisExpedicion: this.ObjCliente.paisExpedicion,
                ciudadExpedicion: this.ObjCliente.ciudadExpedicion,
                fechaExpedicion: this.ObjCliente.fechaExpedicion,
                fechaNacimiento: this.ObjCliente.fechaNacimiento
            }];
        },
        display_valor_reformas() {
            return this.esOpcionGuardada && this.opcion_valor_reformas !== null
                ? this.opcion_valor_reformas
                : this.valor_reformas;
        },
        display_valor_acabados() {
            return this.esOpcionGuardada && this.opcion_valor_acabados !== null
                ? this.opcion_valor_acabados
                : this.valor_acabados;
        },
        display_valor_separacion() {
            return this.esOpcionGuardada && this.opcion_valor_separacion !== null
                ? this.opcion_valor_separacion
                : this.valor_separacion;
        },
        tabClasses() {
            return this.tabs.map((_, index) => {
                if (this.isTabBlocked(index)) {
                    return 'wizarTabDisabled';
                } else if (this.mode === index) {
                    return 'wizarTabActive';
                } else if (!this.tabsIncomplete.includes(index)) {
                    return 'wizarTabIncomplete';
                } else {
                    return 'wizarTabCompleted';
                }
            });
        },
        cuotaMaxima() {
            const ingreso = parseInt(this.f_ingresos_mensuales.toString().replace(/\D/g, '')) || 0;
            return ingreso * PORCENTAJE_CUOTA_MAXIMA;
        },
        valorCreditoMillon() {
            let valor = (this.valor_credito * this.factorBanco) / MILLONES;
            valor = Math.floor(valor);
            return valor;
        },
        minimoFamiliar() {
            if (this.esOpcionGuardada && this.opcion_ingr_regs_max !== null) {
                return this.opcion_ingr_regs_max;
            }

            if (!this.valorCreditoMillon) return 0;
            const calculado = Math.floor(this.valorCreditoMillon / 0.40);
            return calculado;
        },
        valorCreditoMillonFormateado() {
            if (this.esOpcionGuardada && this.opcion_cuota_max_financiable !== null) {
                return this.opcion_cuota_max_financiable;
            }

            if (!this.valorCreditoMillon) return 0;
            return this.valorCreditoMillon;
        },
        valor_maxfinanciable() {
            if (this.esOpcionGuardada && this.opcion_fin_max_permisible !== null) {
                return this.opcion_fin_max_permisible;
            }

            const ingresos = parseInt(this.f_ingresos_mensuales.toString().replace(/\D/g, '')) || 0;
            const factor = this.factorBanco || 0;
            const valorCredito = this.valor_credito || 0;

            if (factor === 0 || ingresos === 0) return 0;

            const factorEnMillones = factor / MILLONES;
            const maxPorIngresos = (ingresos * PORCENTAJE_CUOTA_MAXIMA) / factorEnMillones;

            const calculado = Math.min(valorCredito, Math.floor(maxPorIngresos));

            return calculado;
        },
        proyectosUnicos() {
            const proyectos = this.visitas.map(v => v.proyecto);
            return [...new Set(proyectos)];
        }, visitasFiltradas() {
            if (!this.filtroProyecto) return this.visitas;
            return this.visitas.filter(v => v.proyecto === this.filtroProyecto);
        },
        tramite() {
            return this.modo_atencion.some(item => item.modo_atencion === 'Tramites' && item.checked);
        },
        Otro() {
            return this.modo_atencion.some(item => item.modo_atencion === 'Otro' && item.checked);
        },
        cotizacionesFiltradas() {
            if (this.ishistory) {
                return this.cotizaciones;
            }
            const hoyStr = new Date().toISOString().slice(0, 10);
            return this.cotizaciones.filter(cot => {
                if (!cot.fecha) return false;
                try {
                    let fechaStr;
                    if (cot.fecha instanceof Date) {
                        fechaStr = cot.fecha.toISOString().slice(0, 10);
                    }
                    else if (typeof cot.fecha === 'string') {
                        fechaStr = cot.fecha.slice(0, 10);
                    }
                    else {
                        return false;
                    }
                    return fechaStr === hoyStr;
                } catch (error) {
                    console.warn('Error al procesar fecha:', cot.fecha, error);
                    return false;
                }
            });
        },
        textoCotizacion() {
            if (!this.unidades || this.unidades.length === 0) return "";
            let unidadesTexto = this.unidades
                .map(u => `Torre ${u.consecutivo || ""} ${u.numero_apartamento || ""}`)
                .join(" || ");
            return `${this.nombre} - ${unidadesTexto}`;
        },
        f_valor_descuento_adicional: {
            get() { return this.formatNumber(this.valor_descuento_adicional, false); },
            set(val) { this.valor_descuento_adicional = this.cleanNumber(val); }
        },
        f_valor_escrituras: {
            get() { return this.formatNumber(this.valor_escrituras, false); },
            set(val) { this.valor_escrituras = this.cleanNumber(val); }
        },
        f_valor_notariales: {
            get() { return this.formatNumber(this.valor_notariales, false); },
            set(val) { this.valor_notariales = this.cleanNumber(val); }
        },
        f_valor_beneficiencia: {
            get() { return this.formatNumber(this.valor_beneficiencia, false); },
            set(val) { this.valor_beneficiencia = this.cleanNumber(val); }
        },
        f_valor_registro: {
            get() { return this.formatNumber(this.valor_registro, false); },
            set(val) { this.valor_registro = this.cleanNumber(val); }
        },
        f_valor_separacion: {
            get() { return this.formatNumber(this.display_valor_separacion, false); },
            set(val) {
                if (!this.esOpcionGuardada) {
                    this.valor_separacion = this.cleanNumber(val);
                }
            }
        },
        f_valor_reformas: {
            get() { return this.formatNumber(this.display_valor_reformas, false); },
            set(val) {
                if (!this.esOpcionGuardada) {
                    this.valor_reformas = this.cleanNumber(val);
                }
            }
        },
        f_valor_acabados: {
            get() { return this.formatNumber(this.display_valor_acabados, false); },
            set(val) {
                if (!this.esOpcionGuardada) {
                    this.valor_acabados = this.cleanNumber(val);
                }
            }
        },
        f_valor_cesantias: {
            get() { return this.formatNumber(this.cesantias, false); },
            set(val) { this.cesantias = this.cleanNumber(val); }
        },
        f_valor_ahorros: {
            get() { return this.formatNumber(this.ahorros, false); },
            set(val) { this.ahorros = this.cleanNumber(val); }
        },
        f_ingresos_mensuales: {
            get() { return this.formatNumber(this.ingresos_mensuales, false); },
            set(val) { this.ingresos_mensuales = this.cleanNumber(val); }
        },
        f_factorBanco:{
            get() { return this.formatNumber(this.factorBanco, false); },
            set(val) { this.factorBanco = this.cleanNumber(val); }
        },
        importeActiva() {
            let importe = this.importeBase;

            if (this.reformaActivo) {
                const reforma = this.cleanNumber(this.valor_reformas) + this.cleanNumber(this.valor_acabados);
                importe += reforma;
            }
            importe -= this.cleanNumber(this.valor_descuento_adicional);

            return Math.max(0, importe);
        },
        dentroRangoSubsidio() {
            if (!this.ingresos_mensuales || !this.subsidio_vivienda.length) return true;

            const parseNumber = (valor) => {
                if (!valor) return 0;
                return parseFloat(String(valor).replace(/\$/g, '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.'));
            };

            const ingresosLimpios = parseNumber(this.ingresos_mensuales);

            const registroActual = this.subsidio_vivienda.find(s => s.periodo == new Date().getFullYear())
                || this.subsidio_vivienda[0];

            if (!registroActual) return true;

            const smmlv = parseNumber(registroActual.smmlv);

            return ingresosLimpios <= smmlv * 4;
        },
        f_instalments: {
            get() { return this.formatNumber(this.davivienda.instalments, false); },
            set(val) { this.davivienda.instalments = this.cleanNumber(val); }
        },
        f_monthlyIncome: {
            get() { return this.formatNumber(this.davivienda.customerInformation.monthlyIncome, false); },
            set(val) { this.davivienda.customerInformation.monthlyIncome = this.cleanNumber(val); }
        },
    },
    watch: {
        visitasFiltradas: {
            handler(val) {
                this.contarProyectos(val);
            },
            immediate: true,
            deep: true
        },
        importeActiva() {
            if (this.tipoFinanciacionSeleccionada) {
                this.calcularFinanciacion();
            }
        },

        bancoSeleccionado(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
        },
        tipoFinanciacionSeleccionada(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
        },
        ingresos_mensuales(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
        },
        anioSeleccionado(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
        },
        pagoSeleccionado(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
            if (this.ingresos_mensuales) {
                this.onSeleccionContado();
            }
        },
        ahorros(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
            if (this.ingresos_mensuales) {
                this.onInputIngresos();
            }
        },
        cesantias(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
            if (this.ingresos_mensuales) {
                this.onInputIngresos();
            }
        },
        valor_subsidio(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
            if (this.ingresos_mensuales) {
                this.onInputIngresos();
            }
        },
        valor_separacion(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
            if (this.ingresos_mensuales) {
                this.onInputIngresos();
            }
        },
        subsidioActivo(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
        },
        caja_compensacion(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
        },
        seleccionAnioEntrega(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
            this.calcularSubsidio();
        },
        d_fecha_entrega(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
        },
        d_fecha_cuota(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
            this.calcularMesesMaximos();
        },
        d_fecha_escrituracion(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
            this.calcularMesesMaximos();
        },
        valor_descuento_adicional(val, oldVal) {
            if (this.mode === 3 && oldVal !== undefined && !this.esOpcionGuardada) {
                this.tieneCambiosPendientes = true;
            }
            if (this.tipoFinanciacionSeleccionada) {
                this.calcularFinanciacion();
            }
        },
        f_valor_escrituras(newVal) {
            const sep = Math.max(0, this.cleanNumber(this.valor_separacion));
            const esc = Math.max(0, this.cleanNumber(newVal));
            const diferencia = sep - esc;
            this.cuota_escritura_final = diferencia;
            if (this.ingresos_mensuales) {
                this.onInputIngresos();
            }
        },
        f_valor_notariales() {
            this.calcularEscrituras();
        },
        f_valor_beneficiencia() {
            this.calcularEscrituras();
        },
        f_valor_registro() {
            this.calcularEscrituras();
        },
        dentroRangoSubsidio(nuevoValor) {
            if (!nuevoValor) {
                this.seleccionAnioEntrega = '';
                this.valor_subsidio = 0;
                this.caja_compensacion = '';
            }
        },

        f_ingresos_mensuales() {
            if (this.seleccionAnioEntrega) {
                this.calcularSubsidio();
            }
        }
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.eliminarCotizacionActivaSiVacia);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        this.detenerMonitoreoVentanaUnidades();
        if (window.activeMiniModule === this) {
            window.activeMiniModule = null;
        }
    },
    beforeUnmount() {
        window.removeEventListener('message', this.handleMessages);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        this.detenerMonitoreoVentanaUnidades();
        if (window.activeMiniModule === this) {
            window.activeMiniModule = null;
        }
    },
}