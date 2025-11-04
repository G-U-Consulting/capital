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
            visitas: [],
            banco_financiador: [],
            planSeleccionado: '',
            iscliente: false,
            israpida: false,
            cliente: '',
            isboton: true,
            tablaAmortizacion: false,
            tab: ['Registros de visita', 'Registros de compras'],
            activeTab: 0,
            visitas: [],
            id_cliente: 0,
            filtroProyecto: '',
            contadorProyectos: {},
            cotizaciones: [],
            unidades: [],
            tipoProyecto: null,
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

            bancoSeleccionado: 0,
            unidadSeleccionada: "",
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
            ingresos_mensuales: 0,

            cuota_inicial: 0,
            valor_credito: 0,
            cesantias: 0,
            ahorros: 0,
            seleccionPlan: 0,
            valor_descuento_adicional: 0,
            valor_escrituras: 0,
            valor_separacion: 0,

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
            d_fecha_pe: '',
            d_fecha_cuota: null,
            d_meses: 0,
            meses_max: 0,
            fechaAnterior: null,
            tablaPeriodos: [],
            f_cotizacion: '',
            unidadOpcion: '',

        };
    },
    async mounted() {
        this.tabsIncomplete = this.tabs.map((_, index) => index);
        GlobalVariables.miniModuleCallback("ProcesoNegocio", null);
        let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Variables', {});
        this.categoria = resp.data[0];
        this.medio = resp.data[1];
        this.motivo_compra = resp.data[2];
        this.referencia = resp.data[3];
        this.tipo_registro = resp.data[4];
        this.modo_atencion = resp.data[5];
        this.presupuesto_vivienda = resp.data[6];
        this.tipo_tramite = resp.data[7];
        this.planes_pago = resp.data[8];
        this.tipo_financiacion = resp.data[9];
        this.banco_financiador = resp.data[10];
        this.tipo_factor = resp.data[11];
        this.cajas_compensacion = resp.data[12];
        this.subsidio_vivienda = resp.data[13];
        this.campoObligatorio();
        window.addEventListener('keydown', this.eliminarCotizacionActivaSiVacia);
        window.addEventListener('message', this.handleMessages);
        this.isSubsidio()
 
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
			let cleaned = value.replace(/['.]/g, "");
			cleaned = cleaned.replace(",", ".");
			return cleaned;
		},
		validarFormato(e) {
			e.target.value = e.target.value.replaceAll(/[^0-9\.,]/g, '');
			if (e.target.value == '') e.target.value = '0';
			e.target.value = e.target.value.replace(/^0+(\d)/, '$1');
		},
        toggleApto(apto) {
			let i = this.ids_unidades.indexOf(apto.id_unidad);
			i === -1 ? this.ids_unidades.push(apto.id_unidad) : this.ids_unidades.splice(i, 1);
		},
        calcularSubsidio() {
            if (!this.ingresos_mensuales || !this.seleccionAnioEntrega) {
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
                return parseFloat(valor.replace(/\./g, '').replace(',', '.'));
            };
            const smmlv = parseNumber(registro.smmlv);
            const smmlv_0_2 = parseNumber(registro.smmlv_0_2);
            const smmlv_2_4 = parseNumber(registro.smmlv_2_4);

            if (this.ingresos_mensuales <= smmlv * 2) {
                this.valor_subsidio = smmlv_0_2;
            } else if (this.ingresos_mensuales <= smmlv * 4) {
                this.valor_subsidio = smmlv_2_4;
            } else {
                this.valor_subsidio = 0;
            }
            console.log("Año:", this.seleccionAnioEntrega,
                "Ingresos:", this.ingresos_mensuales,
                "SMMLV:", smmlv,
                "Subsidio:", this.valor_subsidio);
        },
        calcularFinanciacion() {
            if (!this.tipoFinanciacionSeleccionada || !this.importeActiva) {
                this.cuota_inicial = 0;
                this.valor_credito = 0;
                return;
            }

            const plan = this.tipo_financiacion.find(
                p => p.tipo_financiacion === this.tipoFinanciacionSeleccionada
            );
            if (!plan || !plan.tipo_financiacion) return;

            const match = plan.tipo_financiacion.match(/(\d+)[^\d]+(\d+)/);
            if (!match) {
                this.cuota_inicial = 0;
                this.valor_credito = 0;
                return;
            }

            const [_, pctInicial, pctCredito] = match.map(Number);

            const baseCredito = this.toNumber(this.importeActiva) * (pctCredito / 100);

            const baseInicial = this.toNumber(this.importeActiva) * (pctInicial / 100);

            const cuotaInicialTotal =
                baseInicial +
                this.toNumber(this.valor_reformas) +
                this.toNumber(this.valor_acabados) -
                this.toNumber(this.valor_descuento_adicional) -
                this.toNumber(this.valor_separacion) -
                this.toNumber(this.valor_escrituras);

            let totalAportes = this.toNumber(this.cesantias) + this.toNumber(this.ahorros);
            if (String(this.pagoSeleccionado).toLowerCase() === 'financiado') {
                totalAportes += this.toNumber(this.valor_subsidio);
            }

            if (totalAportes >= cuotaInicialTotal) {
                const excedente = totalAportes - cuotaInicialTotal;
                this.cuota_inicial = 0;
                this.valor_credito = Math.max(Math.round(baseCredito - excedente), 0);
            } else {
                this.cuota_inicial = Math.round(cuotaInicialTotal - totalAportes);
                this.valor_credito = Math.round(baseCredito);
            }
        },

        calcularPlanPago() {
            if (!this.planSeleccionado || !this.importeActiva) {
                this.cuota_inicial = 0;
                this.valor_credito = 0;
                return;
            }

            const plan = this.planes_pago.find(p => p.id_planes_pago == this.planSeleccionado);
            if (!plan || !plan.descripcion) return;

            let pctInicial = 0;
            let pctFinal = 0;
            const match = plan.descripcion.match(/(\d+)\s*%.*?(\d+)\s*%/);
            if (match) {
                pctInicial = Number(match[1]);
                pctFinal = Number(match[2]);
            } else if (/100\s*%/.test(plan.descripcion)) {
                pctInicial = 100;
                pctFinal = 0;
            } else {
                this.cuota_inicial = 0;
                this.valor_credito = 0;
                return;
            }
            const baseTotal =
                this.toNumber(this.importeActiva) +
                this.toNumber(this.valor_reformas) +
                this.toNumber(this.valor_acabados) -
                this.toNumber(this.valor_descuento_adicional) -
                this.toNumber(this.valor_escrituras) -
                this.toNumber(this.valor_separacion);

            const baseInicial = baseTotal * (pctInicial / 100);
            const baseCredito = baseTotal * (pctFinal / 100);
            const totalAportes = this.toNumber(this.cesantias) + this.toNumber(this.ahorros);

            this.cuota_inicial = Math.max(Math.round(baseInicial - totalAportes), 0);
            this.valor_credito = Math.round(baseCredito);
        },
        toNumber(value) {
            if (!value) return 0;
            return Number(
                String(value)
                    .replace(/\./g, '')
                    .replace(',', '.')
            ) || 0;
        },
        async handleMessages(event) {
            if (event.data?.type === 'REFRESH_COTIZACION') {
                await this.seleccionarCotizacion(event.data.cotizacionId);
            }
        },
        async handleNext(nextIndex) {
            if (this.mode === 0 && nextIndex === 1) {
                const camposObligatorios = [
                    { campo: "nombres", label: "Nombres" },
                    { campo: "apellido1", label: "Primer Apellido" },
                    { campo: "apellido2", label: "Segundo Apellido" },
                    { campo: "fechaNacimiento", label: "Fecha de Nacimiento" },
                    { campo: "direccion", label: "Dirección" },
                    { campo: "ciudad", label: "Ciudad" },
                    { campo: "barrio", label: "Barrio" },
                    { campo: "departamento", label: "Departamento" },
                ];

                const faltante = camposObligatorios.find(c => !this.ObjCliente[c.campo] || this.ObjCliente[c.campo].trim() === "");

                if (faltante) {
                    showMessage(`Debe diligenciar el campo obligatorio: ${faltante.label}`);
                    return;
                }

                if (!this.policyAccepted) {
                    showMessage("Debe aceptar la política para continuar.");
                    return;
                }
                 await this.nuevoCliente();
            }

            if (this.mode === 1 && nextIndex === 2) {
                if (this.registro == false && this.noregistro != true) {
                    var resp = await this.nuevaVisita();
                }
                if (resp?.includes("Error")) {
                    return;
                }
            }

            if (this.mode === 2 && nextIndex === 3) {

                var  id_unidad  = this.unidades[0]?.id_unidad;
                let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidad', { id_unidad });
                this.unidadOpcion = await resp.data[0][0];

                if (!this.cotizacionSeleccionada) {
                    return showMessage("No hay cotización seleccionada.");
                }

                const cotizacion = this.cotizaciones.find(c => c.cotizacion === this.cotizacionSeleccionada);
                if (!cotizacion) {
                    return showMessage("No hay cotización seleccionada.");
                }

                const hoyStr = new Date().toISOString().slice(0, 10);
                const fechaStr = (cotizacion.fecha instanceof Date)
                    ? cotizacion.fecha.toISOString().slice(0, 10)
                    : this.normalizarFecha(cotizacion.fecha);

                if (fechaStr !== hoyStr) {
                    return showMessage("Solo puede opcionar cotizaciones del día de hoy.");
                }

                if (cotizacion.importe <= 0) {
                    return showMessage("La cotización seleccionada no tiene Item.");
                }
            }

            if (this.policyAccepted || nextIndex === 0) {
                if (this.mode === 0 && nextIndex === 2) { return; }
                if (this.mode === 0 && nextIndex === 3) { return; }
                if (this.mode === 1 && nextIndex === 3) { return; }
                this.mode = nextIndex;
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

            const { is_atencion_rapida, ...edit } = this.ObjCliente;
            const { is_atencion_rapida: _, ...orig } = this.ObjClienteOriginal;
            const huboCambio = JSON.stringify(edit) !== JSON.stringify(orig);

            let cliente = await httpFunc('/generic/genericDT/ProcesoNegocio:Ins_Cliente', this.ObjCliente);
            cliente = cliente.data;

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
            }
         
            this.isboton = true;
            this.mode = 1;
            this.israpida = false;
            this.policyAccepted = false;
            this.iscliente = !israpida;
            this.acceptPolicy(true);
        },
        async limpiarObj() {
            if (this.mode == 0 || this.mode == 3) {
                this.ObjCliente = {
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
        async busquedaCliente() {
            let cliente = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Cliente', { cliente: this.cliente });
            let obj = {
                username: GlobalVariables.username,
                cliente: this.cliente,
            };
            await httpFunc('/generic/genericDT/ProcesoNegocio:Ins_SaveCliente', obj);
            cliente = cliente.data;

            if (cliente && cliente[0] && cliente[0][0]) {
                this.ObjCliente.nombres = cliente[0][0].nombres;
                this.ObjCliente.apellido1 = cliente[0][0].apellido1;
                this.ObjCliente.apellido2 = cliente[0][0].apellido2;
                this.ObjCliente.direccion = cliente[0][0].direccion;
                this.ObjCliente.ciudad = cliente[0][0].ciudad;
                this.ObjCliente.barrio = cliente[0][0].barrio;
                this.ObjCliente.departamento = cliente[0][0].departamento;
                this.ObjCliente.pais = cliente[0][0].pais;
                this.ObjCliente.email1 = cliente[0][0].email1;
                this.ObjCliente.email2 = cliente[0][0].email2;
                this.ObjCliente.telefono1 = cliente[0][0].telefono1;
                this.ObjCliente.telefono2 = cliente[0][0].telefono2;
                this.ObjCliente.tipoDocumento = cliente[0][0].tipo_documento;
                this.ObjCliente.numeroDocumento = cliente[0][0].numero_documento;
                this.ObjCliente.paisExpedicion = cliente[0][0].pais_expedicion;
                this.ObjCliente.departamentoExpedicion = cliente[0][0].departamento_expedicion;
                this.ObjCliente.ciudadExpedicion = cliente[0][0].ciudad_expedicion;
                this.ObjCliente.fechaExpedicion = cliente[0][0].fecha_expedicion;
                this.id_cliente = cliente[0][0].id_cliente;
                this.ObjCliente.isPoliticaAceptada = cliente[0][0].is_politica_aceptada;
                this.isClienteVetado = cliente[0][0].is_vetado == "1";
                this.ObjCliente.isTitular = cliente[0][0].is_titular;
                this.ObjCliente.fechaNacimiento = cliente[0][0].fecha_nacimiento;
                this.ObjCliente.nit = cliente[0][0].nit;
                this.ObjCliente.nombreEmpresa = cliente[0][0].nombre_empresa;

                if (this.ObjCliente.isPoliticaAceptada == 1) {
                    this.policyAccepted = true;
                } else {
                    this.policyAccepted = false;
                }

                this.ObjClienteOriginal = { ...this.ObjCliente };

                /// Dev
                this.registroCompras = [
                    {
                        fecha: '2025-06-01',
                        proyecto: 'Proyecto A',
                        tipo: 'Compra',
                        modo: 'Contado',
                        descripcion: 'Compra de materiales A',
                        id_cliente: '111111'
                    },
                    {
                        fecha: '2025-06-15',
                        proyecto: 'Proyecto B',
                        tipo: 'Compra',
                        modo: 'Crédito',
                        descripcion: 'Compra de herramientas B',
                        id_cliente: '111111'
                    }
                ]
                this.activeTabs(this.cliente);
                //////
                this.iscliente = true;
                this.isboton = false;
                this.israpida = false;
            } else {
                this.ObjCliente.nombres = '';
                this.iscliente = false;
                showMessage("No se encontró el cliente.");
                this.limpiarObj();
            }

        },
        async setSubmode(index) {
            this.campoObligatorio();

            if (GlobalVariables.ventanaUnidades && !GlobalVariables.ventanaUnidades.closed) {
                GlobalVariables.ventanaUnidades.close();
                GlobalVariables.ventanaUnidades = null;
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
                    this.limpiarObj();
                }
            }

            if (index == 2) {   
                await this.seleccionarCotizacion(null);
                await this.getCotizaciones();
                this.cotizacionSeleccionada = null;
            }

            if (index == 3) {
                this.asesor = GlobalVariables.username;
                if (this.unidades[0]?.id_unidad && GlobalVariables.id_proyecto) {
                    try {
                        var  id_proyecto  = GlobalVariables.id_proyecto;
                        var  id_unidad  = this.unidades[0]?.id_unidad;
                     
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

                let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidad', { id_unidad });

                this.unidadOpcion = await resp.data[0][0];

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
        ///////// mode 1 ////////////
        async nuevaVisita() {
   
            this.ObjVisita.id_proyecto = GlobalVariables.id_proyecto;
            this.ObjVisita.usuario = GlobalVariables.username;
            this.ObjVisita.id_cliente = this.id_cliente;
            const tipo = this.tipo_registro
                .filter(item => item.checked)
                .map(item => item.id_tipo_registro);
            this.ObjVisita.tipo_registro = tipo.join(',');

            const estadopublicacion = this.modo_atencion
                .filter(item => item.checked)
                .map(item => item.id_modo_atencion);
            this.ObjVisita.modo_atencion = estadopublicacion.join(',');
            if (this.ObjVisita.id_visita != null) {
                showMessage("Esta visita no se puede actualizar.");
                return "Error";
            }
            if (!this.validarCampos(this.ObjVisita, this.camposObligatorios)) return;
            if (this.ObjVisita.tipo_registro === '' || this.ObjVisita.modo_atencion === '') {
                showMessage("Debe seleccionar al menos un Tipo de Registro y un Modo de Atención.");
                return "Error";
            }
            showProgress();
            try {
                let resp = await httpFunc('/generic/genericST/ProcesoNegocio:Ins_Registro', this.ObjVisita);
                hideProgress();
                resp = resp.data;
                if (resp.includes("OK")) {
                    this.registro = true;
                    await this.setSubmode(1);
                    showMessage("Visita creada correctamente.");
                    return "OK";
                }
            } catch (error) {
                hideProgress();
                showMessage("Error al crear la visita.");
            }
        },
        async editarVisita(id_visita) {
            this.ObjVisita.id_visita = id_visita;
            let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Registro', { id_visita: id_visita });
            this.ObjVisita.id_categoria = resp.data[0][0].id_categoria_medio;
            this.ObjVisita.id_medio = resp.data[0][0].id_medio;
            this.ObjVisita.id_motivo_compra = resp.data[0][0].id_motivo_compra;
            this.ObjVisita.id_referencia = resp.data[0][0].id_referencia;
            this.ObjVisita.otro_texto = resp.data[0][0].otro_texto;
            this.ObjVisita.descripcion = resp.data[0][0].descripcion;
            this.ObjVisita.id_presupuesto_vivienda = resp.data[0][0].id_presupuesto_vivienda;
            this.ObjVisita.id_tipo_tramite = resp.data[0][0].id_tipo_tramite;

            var tFSeleccionada = resp.data[0][0].tipo_registro;
            this.tipo_registro.forEach(item => {
                if (tFSeleccionada) {
                    item.checked = (item.id_tipo_registro == tFSeleccionada);
                } else {
                    item.checked = false;
                }
            });
            var tFSeleccionada = resp.data[0][0].modo_atencion;
            this.modo_atencion.forEach(item => {
                if (tFSeleccionada) {
                    item.checked = (item.id_modo_atencion == tFSeleccionada);
                } else {
                    item.checked = false;
                }
            });
            this.camposBloqueados = true;
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
        antencionRapida(){
            this.iscliente =  false;
            this.israpida = true;
            this.policyAccepted = true;
            this.isClienteVetado = false;
            this.ObjCliente.numeroDocumento = '';
            this.ObjCliente.nombres = '';
            this.ObjCliente.email1 = '';
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

                this.cotizaciones = resp.data[0] || [];
                this.nombre = await resp.data[0][0]?.nombre || '';

                this.cotizaciones.forEach(async (item, index) => {
                    const { unidades, totalFinal } = await this.cargarCotizacion(item.cotizacion);

                    this.cotizaciones[index] = {
                        ...this.cotizaciones[index],
                        unidades,
                        importe: totalFinal
                    };
                });
            } finally {
                hideProgress();
            }
        },
        async cargarCotizacion(cotizacionId) {
            const respa = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidades_Cotizacion', {
                id_cliente: this.id_cliente,
                id_proyecto: GlobalVariables.id_proyecto,
                cotizacion: cotizacionId
            });

            this.añoentrega = respa.data[0][0]?.fecha_entrega.match(/\d{4}/)?.[0] || '';
            this.d_fecha_entrega = respa.data[0][0]?.fecha_entrega;
            this.f_cotizacion = (respa.data[0][0]?.created_on || '').split('T')[0].split(' ')[0];
            this.d_tna_antes = respa.data[0][0]?.antes_p_equ;
            this.d_tna_despues = respa.data[0][0]?.despues_p_equ;
            this.d_fecha_escrituracion = respa.data[0][0]?.fecha_escrituracion;
            this.f_creacion = respa.data[0][0]?.created_on;
            this.d_fecha_pe = respa.data[0][0]?.fecha_p_equ;

            function parseFecha(fechaStr) {
                if (!fechaStr) return null;
                const [fechaPart, horaPart, meridiano] = fechaStr.split(' ');
                const [dia, mes, anio] = fechaPart.split('/').map(Number);
                let [hora, minuto, segundo] = horaPart ? horaPart.split(':').map(Number) : [0, 0, 0];
                if (meridiano && meridiano.toLowerCase().includes('p') && hora < 12) hora += 12;
                if (meridiano && meridiano.toLowerCase().includes('a') && hora === 12) hora = 0;

                return new Date(anio, mes - 1, dia, hora, minuto, segundo);
            }
            function getPrimerDiaHabilSiguienteMes(fechaStr) {
                const fecha = parseFecha(fechaStr);
                if (!fecha || isNaN(fecha)) return null;

                let siguienteMes = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 1);

                let dia = siguienteMes.getDay();
                if (dia === 0) siguienteMes.setDate(siguienteMes.getDate() + 1);
                else if (dia === 6) siguienteMes.setDate(siguienteMes.getDate() + 2);

                return siguienteMes.toISOString().split('T')[0];
            }

            this.d_fecha_cuota = getPrimerDiaHabilSiguienteMes(this.f_creacion);

            let añoActual = new Date().getFullYear();
            let añoEntrega = parseInt(this.añoentrega);

            this.valor_reformas = respa.data[0][0]?.valor_reformas || 0;
            this.valor_acabados = respa.data[0][0]?.valor_acabados || 0;
            this.valor_separacion = respa.data[0][0]?.valor_separacion || 0;

            if (añoEntrega && añoEntrega >= añoActual) {
                this.listaAniosEntrega = Array.from(
                    { length: añoEntrega - añoActual + 1 },
                    (_, i) => añoActual + i
                );
            } else {
                this.listaAniosEntrega = [añoActual];
            }

            const parseNumber = str =>
                typeof str === 'string' ? parseFloat(str.replace(/\./g, '').replace(',', '.')) : Number(str) || 0;

            let sumaValores = 0;
            let sumaDescuentos = 0;

            const unidades = respa.data[0].map(unidad => {
                const valor_unidad = parseNumber(unidad.valor_unidad);
                const valor_descuento = parseNumber(unidad.valor_descuento);
                sumaValores += valor_unidad;
                sumaDescuentos += valor_descuento;
                return { ...unidad, valor_unidad, valor_descuento };
            });

            const totalFinal = sumaValores - sumaDescuentos;

            this.cotizaciones = this.cotizaciones.map(c =>
                Number(c.cotizacion) === Number(cotizacionId)
                    ? { ...c, unidades, importe: totalFinal }
                    : c
            );

            this.cotizacionActiva = cotizacionId;
            this.importeActiva = totalFinal;

            return { unidades, totalFinal };
        },
        async seleccionarCotizacion(cotizacionId, id) {
            this.idcotizacion = id || null;
            this.cotizacionSeleccionada = cotizacionId;

            await this.cargarCotizacion(cotizacionId);

            this.unidades = this.cotizaciones.find(
                c => Number(c.cotizacion) === Number(cotizacionId)
            )?.unidades || [];
        }, 
        async addCotizacion() {

            const nuevaFecha = new Date();
            const pad = num => String(num).padStart(2, '0');
            const yyyy = nuevaFecha.getFullYear();
            const MM = pad(nuevaFecha.getMonth() + 1);
            const dd = pad(nuevaFecha.getDate());
            const hh = pad(nuevaFecha.getHours());
            const mm = pad(nuevaFecha.getMinutes());
            const ss = pad(nuevaFecha.getSeconds());
            const formatoFecha = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;

            let siguienteId = 1;
            if (this.cotizaciones.length > 0) {
                const ids = this.cotizaciones.map(c => parseInt(c.cotizacion) || 0);
                siguienteId = Math.max(...ids) + 1;
            }
            let id_cotizacion = 0;

            if (this.id_cliente != 0) {
                let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Ins_Cotizacion', {
                    id_cotizacion: 0,
                    id_proyecto: GlobalVariables.id_proyecto,
                    id_cliente: this.id_cliente,
                    cotizacion: siguienteId,
                    usuario: GlobalVariables.username
                });

                id_cotizacion = resp.data[0][0].id_cotizacion;

                //if (id_cotizacion == '-1') {
                //    showMessage("Ya existe una cotización activa para este cliente en el día de hoy.");
                //    return;
                //}
            }
            this.cotizaciones.push({
                cotizacion: siguienteId,
                fecha: formatoFecha,
                descripcion: '',
                importe: 0,
                id_proyecto: GlobalVariables.id_proyecto,
                id_cliente: this.id_cliente,
                id_cotizacion: id_cotizacion ?? 0,
                cotizacion: siguienteId
            });

            this.cotizacionActiva = siguienteId;
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
                    cotizacion
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

            this.busquedaCliente();

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

                const unidades = respa.data[0].map(unidad => ({
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
        async dropitem(item){
            let res = await httpFunc("/generic/genericST/ProcesoNegocio:Del_Item", {
                id_negocios_unidades: item.id_negocios_unidades,
                terminarAtencion: 0,
                id_visita: this.id_visita
            });

            res = res.data;
            this.mostrarModal = false;

            if(res == 'OK'){
                this.seleccionarCotizacion(item.cotizacion);
                this.abrirNuevoModulo();
            }

        },
        async terminarAtencion() {
            let res = await httpFunc("/generic/genericST/ProcesoNegocio:Del_Item", {
                terminarAtencion: 1,
                id_cliente: this.id_cliente,
                id_proyecto: GlobalVariables.id_proyecto,
                id_visita: this.id_visita
            });
            let respa = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidades_Cotizacion', {
                id_cliente: this.id_cliente,
                id_proyecto: GlobalVariables.id_proyecto,
            });
            this.cliente = null;
            this.ObjCliente = {};
            this.mode = 0;
            this.policyAccepted = false;
            this.unidades = [];
            this.mostrarModal = false;

            GlobalVariables.ventanaUnidades?.close();
            GlobalVariables.ventanaUnidades = null;

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
        async deleteCotiz(cotiz){
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
        onBlurDescuento(e, item) {
            const el = e.target;
            const digits = (el.innerText || "").replace(/[^0-9]/g, "");
            const num = digits === "" ? 0 : Number(digits);
            item.valor_descuento = num;
            item.editValor = null;
            item.editando = false;
            this.recalcularImporte();
            el.innerText = this.formatoMoneda(num);
        },
        formatoMoneda(num) {
            return "$ " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        recalcularImporte() {
            const id = this.cotizacionSeleccionada || this.cotizacionActiva;
            const cot = this.cotizaciones.find(c => Number(c.cotizacion) === Number(id));
            if (!cot) return;

            const totalBruto = cot.unidades.reduce((sum, u) => sum + (u.valor_unidad || 0), 0);
            const totalDescuentos = cot.unidades.reduce((sum, u) => sum + (u.valor_descuento || 0), 0);
            const nuevoImporte = totalBruto - totalDescuentos;

            cot.importe = nuevoImporte;
            if (Number(cot.cotizacion) === Number(this.cotizacionActiva)) {
                this.importeActiva = nuevoImporte;
            }
        },
        //////// mode 3 ////////////
        async cargarFactor() {
            this.factorSeleccionado = null;
            this.anioSeleccionado = "";
            this.listaAnios = [];
            this.unidadSeleccionada = "";

            if (!this.bancoSeleccionado || this.bancoSeleccionado === 0) {
                this.unidadSeleccionada = "";
                this.anioSeleccionado = "";
                this.unidadesDisponibles = [];
                return;
            }

            if (!this.bancoSeleccionado) return;

            let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_FactorPorBanco', {
                id_banco: this.bancoSeleccionado
            });

            this.factoresBanco = resp.data[0];

            this.unidadesDisponibles = [...new Set(this.factoresBanco.filter(f => f.valor != 0).map(f => f.unidad))];
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
            if (!this.unidadSeleccionada) {a
                this.listaAnios = [];
                return;
            }
            this.listaAnios = [
                ...new Set(
                    this.factoresBanco
                        .filter(f => f.unidad === this.unidadSeleccionada)
                        .filter(f => f.valor != 0)
                        .map(f => f.factor)
                )
            ].sort((a, b) => parseInt(a) - parseInt(b));
        },
        async isSubsidio() {
            let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Poyecto', {
                id_proyecto: GlobalVariables.id_proyecto
            });
            let dato = resp.data[0][0].id_tipo_vis
            this.subsidioActivo = dato != 4;
        },
        onCambioValor() {
            this.valor_reformas = this.f_valor_reformas;
            this.valor_acabados = this.f_valor_acabados;
            this.valor_descuento_adicional = this.f_valor_descuento_adicional;
            this.valor_escrituras = this.f_valor_escrituras;
            this.valor_separacion = this.f_valor_separacion;
            this.calcularFinanciacion();
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
            if (!this.d_fecha_escrituracion|| !this.d_fecha_cuota) return;

            const entrega = new Date(this.d_fecha_escrituracion);
            const cuota = new Date(this.d_fecha_cuota);

            let meses = (entrega.getFullYear() - cuota.getFullYear()) * 12;
            meses += entrega.getMonth() - cuota.getMonth();
            meses = Math.max(0, meses - 2);

            if (this.d_meses !== meses) {
                this.d_meses = meses;
            }

            this.meses_max = meses;
        },
        validarMeses(value) {
            const num = Number(value);
            if (num < 1) this.d_meses = 1;
            if (num > this.meses_max) this.d_meses = this.meses_max;
        },
        generarTabla() {
            if (!this.d_fecha_cuota || !this.d_meses || !this.cuota_inicial || !this.d_tna_antes || !this.d_tna_despues || !this.d_fecha_pe) {
                showMessage('Faltan datos requeridos');
                return;
            }
            this.tablaAmortizacion = true;
            const limpiarNumero = (valor) => {
                if (typeof valor === 'string') {
                    return Number(
                        valor.replace(/\./g, '')
                            .replace(',', '.')
                            .trim()
                    ) || 0;
                }
                return Number(valor) || 0;
            };

            const redondear0 = (num) => Math.round(num);

            const [anioBase, mesBase, diaBase] = this.d_fecha_cuota.split('-').map(Number);
            const partesPE = this.d_fecha_pe.split('-');
            const anioPE = parseInt(partesPE[0]);
            const mesPE = parseInt(partesPE[1]) - 1;
            const diaPE = parseInt(partesPE[2]);
            const fechaPE = new Date(anioPE, mesPE, diaPE);

            const capital = limpiarNumero(this.cuota_inicial);
            const tnaAntes = limpiarNumero(this.d_tna_antes);
            const tnaDespues = limpiarNumero(this.d_tna_despues);
            const n = limpiarNumero(this.d_meses);

            let saldo = capital;
            this.tablaPeriodos = [];

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
            //this.tablaPeriodos = periodos;
        },
        limpiarNumero(valor) {
            if (typeof valor === 'string') {
                const valorLimpio = valor.replace(/\./g, '').replace(',', '.').trim();
                if (valorLimpio === '') return null;
                return Number(valorLimpio);
            }
            return Number(valor) || 0;
        },
        recalcularFila(index) {
            const limpiarNumero = this.limpiarNumero;

            const redondear0 = (num) => Math.round(num);

            const calcularPMT = (i, n, p) => {
                if (i === 0) return p / n;
                const factor = Math.pow(1 + i, n);
                return (i * p * factor) / (factor - 1);
            };

            const fila = this.tablaPeriodos[index];
            const totalPeriodos = this.tablaPeriodos.length;

            const cuotaDeseadaInput = limpiarNumero(fila.cuota_deseada);
            const iPeriodo = fila.tna / 100 / 12;

            let cuotaEfectiva;

            if (cuotaDeseadaInput === null) {
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
                cuotaEfectiva = cuotaDeseadaInput;
            }

            const cuotaParaCalculo = Number(cuotaEfectiva) || 0;

            const interesPeriodo = redondear0(fila.saldo_inicial * iPeriodo);
            const principalPeriodo = redondear0(cuotaParaCalculo - interesPeriodo);
            const saldoFinal = redondear0(fila.saldo_inicial - principalPeriodo);

            fila.cuota_calculada = cuotaParaCalculo;
            fila.intereses = interesPeriodo;
            fila.principal = principalPeriodo;
            fila.saldo_final = saldoFinal;

            let saldoTemp = saldoFinal;
            for (let i = index + 1; i < this.tablaPeriodos.length; i++) {
                const f = this.tablaPeriodos[i];
                f.saldo_inicial = saldoTemp;
                const iPeriodoSig = f.tna / 100 / 12;
                const interesSig = redondear0(saldoTemp * iPeriodoSig);
                let cuotaSig;
                const cuotaDeseadaSig = limpiarNumero(f.cuota_deseada);
                if (cuotaDeseadaSig !== null) {
                    cuotaSig = cuotaDeseadaSig;
                } else {
                    if (f.periodo <= totalPeriodos && saldoTemp > 0) {
                        const periodosRestantesSig = totalPeriodos - f.periodo + 1;
                        cuotaSig = redondear0(
                            calcularPMT(iPeriodoSig, periodosRestantesSig, Math.abs(saldoTemp))
                        );
                    } else {
                        cuotaSig = 0;
                    }
                }
                const principalSig = redondear0(cuotaSig - interesSig);
                const saldoFinalSig = redondear0(saldoTemp - principalSig);
                f.intereses = interesSig;
                f.principal = principalSig;
                f.cuota_calculada = cuotaSig;
                f.saldo_final = saldoFinalSig;

                saldoTemp = saldoFinalSig;
            }
            const ultima = this.tablaPeriodos[this.tablaPeriodos.length - 1];
            if (ultima && ultima.saldo_final < 1 && ultima.saldo_final > -1) {
                ultima.saldo_final = 0;
            } else if (ultima && ultima.saldo_final !== 0 && ultima.saldo_inicial > 0) {
                const saldoAnterior = ultima.saldo_inicial;
                const interesUltimo = ultima.intereses;
                ultima.principal = redondear0(saldoAnterior);
                ultima.cuota_calculada = redondear0(saldoAnterior + interesUltimo);
                ultima.saldo_final = 0;
            }
        },
        formatearMoneda(valor) {
            if (valor === null || valor === undefined || valor === '') {
                return '';
            }
            const numeroLimpio = this.limpiarNumero(valor);
            if (numeroLimpio === null) {
                return '';
            }
            return new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0 }).format(numeroLimpio);
        },
        validar(index) {
            const fila = this.tablaPeriodos[index];
            const originalValue = fila.cuota_deseada;

            this.$nextTick(() => {
                const numeroParaFormato = this.limpiarNumero(originalValue);
                if (numeroParaFormato === null && originalValue.trim() === '') {
                    fila.cuota_deseada = '';
                    return;
                }
                if (numeroParaFormato !== null) {
                    fila.cuota_deseada = this.formatearMoneda(numeroParaFormato);
                }
            });
        },
        async verAmortizacion(){
            if(this.d_meses == 0){
                showMessage("Debe seleccionar Fecha 1ra Cuota.");
                return;
            }
            await this.generarTabla(); 
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
                const content = document.getElementById(id);
                html2pdf().set({
                    margin: 0,
                    letterRendering: false,
                    filename: 'tabla.pdf',
                    image: { type: 'jpeg', quality: 0.8 },
                    html2canvas: { scale: 2 },
                    jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' }
                }).from(content).outputPdf('bloburl').then((pdfUrl) => {
                    window.open(pdfUrl, '_blank');
                });
            });
        },
        guardarYGenerarPDF() {
            this.tablaPeriodos.forEach((fila, i) => this.recalcularFila(i));
            this.printPDF('contenedor-pdf-completo');
        },
        async enviarYOpcionar(){
            
            await this.limpiarObj();
            await this.limpiarNumero()
            showMessage("Opción creada correctamente")
            this.mode = 0;
        }
 
    },
    computed: {
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
            } else {
                const hoy = new Date();
                const yyyy = hoy.getFullYear();
                const mm = String(hoy.getMonth() + 1).padStart(2, '0');
                const dd = String(hoy.getDate()).padStart(2, '0');
                const hoyStr = `${yyyy}-${mm}-${dd}`;
                return this.cotizaciones.filter(cot => {
                    let fecha = cot.fecha;
                    if (fecha instanceof Date) {
                        const fyyyy = fecha.getFullYear();
                        const fmm = String(fecha.getMonth() + 1).padStart(2, '0');
                        const fdd = String(fecha.getDate()).padStart(2, '0');
                        return `${fyyyy}-${fmm}-${fdd}` === hoyStr;
                    }
        
                    if (fecha.includes('-') && fecha.includes(':')) {
                        const fechaStr = fecha.split(' ')[0];
                        return fechaStr === hoyStr;
                    }

                    if (fecha.includes('/')) {
                        const partesFecha = fecha.split(' ')[0].split('/');
                        if (partesFecha.length === 3) {
                            const [dia, mes, anio] = partesFecha;
                            const normalizada = `${anio}-${mes}-${dia}`;
                            return normalizada === hoyStr;
                        }
                    }
                    return false;
                });
            }
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
        f_valor_separacion: {
            get() { return this.formatNumber(this.valor_separacion, false); },
			set(val) { this.valor_separacion = this.cleanNumber(val); }
        },
        f_valor_reformas: {
			get() { return this.formatNumber(this.valor_reformas, false); },
			set(val) { this.valor_reformas = this.cleanNumber(val); }
		},
        f_valor_acabados: {
			get() { return this.formatNumber(this.valor_acabados, false); },
			set(val) { this.valor_acabados = this.cleanNumber(val); }
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
    },
    watch: {
        tipoFinanciacionSeleccionada() { this.calcularFinanciacion(); },
        importeActiva() { this.calcularFinanciacion(); },
        cesantias() { this.calcularFinanciacion(); },
        ahorros() { this.calcularFinanciacion(); },
        valor_subsidio() { this.calcularFinanciacion(); },
        pagoSeleccionado() { this.calcularFinanciacion(); },
        f_valor_reformas: 'onCambioValor',
        f_valor_acabados: 'onCambioValor',
        f_valor_descuento_adicional: 'onCambioValor',
        f_valor_escrituras: 'onCambioValor',
        f_valor_separacion: 'onCambioValor',
        visitasFiltradas: {
            handler(val) {
                this.contarProyectos(val);
            },
            immediate: true,
            deep: true
        },
        d_fecha_cuota() {
            this.calcularMesesMaximos();
        },
        d_fecha_escrituracion() {
            this.calcularMesesMaximos();
        },
     
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.eliminarCotizacionActivaSiVacia);
    },
     beforeUnmount() {
        window.removeEventListener('message', this.handleMessages);
    },
}