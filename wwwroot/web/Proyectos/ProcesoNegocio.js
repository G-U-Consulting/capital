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
            },
            modo_atencion: [],
            tipo_registro: [],
            tipo_tramite: [],
            visitas: [],
            iscliente: false,
            israpida: false,
            cliente: '',
            isboton: true,
            tab: ['Registros de visita', 'Registros de compras'],
            activeTab: 0,
            visitas: [],
            id_cliente: 0,
            filtroProyecto: '',
            contadorProyectos: {},
            cotizaciones: [],
            unidades: [],
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
        };
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
        }
    },
    watch: {
        visitasFiltradas: {
            handler(val) {
                this.contarProyectos(val);
            },
            immediate: true,
            deep: true
        }
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.eliminarCotizacionActivaSiVacia);
    },
     beforeUnmount() {
        window.removeEventListener('message', this.handleMessages);
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
        this.campoObligatorio();
        window.addEventListener('keydown', this.eliminarCotizacionActivaSiVacia);
        window.addEventListener('message', this.handleMessages);

    },
    methods: {
        async handleMessages(event) {
            if (event.data?.type === 'REFRESH_COTIZACION') {
                console.log("Actualizando cotización desde Unidades.js");
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
                //const tipo = this.tipo_registro
                //    .filter(item => item.checked)
                //    .map(item => item.id_tipo_registro);
                //this.ObjVisita.tipo_registro = tipo.join(',');

                //const estadopublicacion = this.modo_atencion
                //    .filter(item => item.checked)
                //    .map(item => item.id_modo_atencion);
                //this.ObjVisita.modo_atencion = estadopublicacion.join(',');
                //if (this.ObjVisita.id_visita != null) {
                //    showMessage("Esta visita no se puede actualizar.");
                //    return;
                //}
                //if (!this.validarCampos(this.ObjVisita, this.camposObligatorios)) return;
                //if (this.ObjVisita.tipo_registro === '' || this.ObjVisita.modo_atencion === '') {
                //    showMessage("Debe seleccionar al menos un Tipo de Registro y un Modo de Atención.");
                //    return;
                //}

                let resp = await this.nuevaVisita();

                if (resp?.includes("Error")) {
                    return;
                }

            }

            if (this.mode === 2 && nextIndex === 3) {
                if(!this.cotizacionActiva && !this.importeActiva){
                    showMessage("Debe ingresar un importe y una descripción.");
                    return;
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
            let cliente = await httpFunc('/generic/genericDT/ProcesoNegocio:Ins_Cliente', this.ObjCliente);
            cliente = cliente.data;
            if (cliente[0].result.includes("OK")) {
                if (israpida) {
                    this.iscliente = false;
                    this.israpida = false;
                    this.policyAccepted = false;
                    this.mode = 0;
                    this.isboton = true;
                    this.acceptPolicy(true);
                    if (cliente[0].result.includes('Insert')) { showMessage("Cliente creado correctamente."); } else showMessage("Cliente actualizado correctamente.");
                } else {
                    this.isboton = true;
                    this.mode = 0;
                    this.israpida = false;
                    this.policyAccepted = false;
                    // this.limpiarObj();
                    this.iscliente = true;
                    this.acceptPolicy(true);
                    if (cliente[0].result.includes('Insert')) { showMessage("Cliente creado correctamente."); } else showMessage("Cliente actualizado correctamente.");
                }
            } else {
                this.limpiarObj();
                showMessage("Error al crear el cliente.");
            }
        },
        async limpiarObj() {
            if (this.mode == 0) {
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
            }

            if (index == 2) {
                await this.getCotizaciones();
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
        ///////// mode 1
        async nuevaVisita() {
            this.ObjVisita.id_proyecto = GlobalVariables.id_proyecto;
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
                return;
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
        //////// mode 2
        async showAtencionModal() {
            this.mostrarModal = true
        },
        async getCotizaciones() {
            let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Cotizaciones', {
                id_cliente: this.id_cliente,
                id_proyecto: GlobalVariables.id_proyecto
            });

            this.cotizaciones = resp.data[0] || [];

            for (const item of this.cotizaciones) {
                await this.cargarCotizacion(item.cotizacion);
            }
        },
        async cargarCotizacion(cotizacionId) {
            let respa = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidades_Cotizacion', {
                id_cliente: this.id_cliente,
                id_proyecto: GlobalVariables.id_proyecto,
                cotizacion: cotizacionId
            });

        

            const parseNumber = (str) => {
                if (typeof str === 'string') {
                    return parseFloat(str.replace(/\./g, '').replace(',', '.'));
                }
                return Number(str) || 0;
            };

            const unidades = respa.data[0].map(unidad => ({
                ...unidad,
                valor_unidad: parseNumber(unidad.valor_unidad),
                valor_descuento: parseNumber(unidad.valor_descuento)
            }));

            const sumaValores = unidades.reduce((total, unidad) => total + unidad.valor_unidad, 0);
            const sumaDescuentos = unidades.reduce((total, unidad) => total + unidad.valor_descuento, 0);
            const totalFinal = sumaValores - sumaDescuentos;

            const cotizacion = this.cotizaciones.find(
                c => Number(c.cotizacion) === Number(cotizacionId)
            );

            if (cotizacion) {
                cotizacion.unidades = unidades;
                cotizacion.importe = totalFinal;

                this.cotizacionActiva = cotizacionId;
                this.importeActiva = totalFinal;
            }
        },
        async seleccionarCotizacion(cotizacionId) {
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

            let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Ins_Cotizacion', { 
                id_cotizacion: 0, 
                id_proyecto: GlobalVariables.id_proyecto,
                id_cliente: this.id_cliente,
                cotizacion: siguienteId
            });
            let id_cotizacion = resp.data[0][0].id_cotizacion;

            if (id_cotizacion == '-1') {
                showMessage("Ya existe una cotización activa para este cliente en el día de hoy.");
                return;
            }

            this.cotizaciones.push({
                cotizacion: siguienteId,
                fecha: formatoFecha,
                descripcion: '',
                importe: 0,
                id_proyecto: GlobalVariables.id_proyecto,
                id_cliente: this.id_cliente,
                id_cotizacion: id_cotizacion,
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
            await this.getCotizaciones();
            this.mode = 2;
        },
        async continuarCliente() {
            let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_SaveCliente', { username: GlobalVariables.username });
            const cliente = resp?.data?.[0]?.[0]?.cliente;
            if (cliente === null || cliente === undefined || cliente === '') {
                showMessage("Debe seleccionar un cliente para continuar.");
                return;
            }
            this.cliente = resp.data[0][0].cliente;
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
            if (this.cotizacionSeleccionada == null) {
                showMessage("Debe seleccionar una cotización para agregar unidades.");
                return;
            }
            const cotizacion = this.cotizaciones.find(c => c.cotizacion === this.cotizacionSeleccionada);
            if (!cotizacion) {
                showMessage("La cotización seleccionada no existe.");
                return;
            }
            const hoy = new Date();
            const yyyy = hoy.getFullYear();
            const mm = String(hoy.getMonth() + 1).padStart(2, '0');
            const dd = String(hoy.getDate()).padStart(2, '0');
            const hoyStr = `${yyyy}-${mm}-${dd}`;

            let esDeHoy = false;
            const fecha = cotizacion.fecha;

            if (fecha instanceof Date) {
                const fy = fecha.getFullYear();
                const fm = String(fecha.getMonth() + 1).padStart(2, '0');
                const fd = String(fecha.getDate()).padStart(2, '0');
                esDeHoy = `${fy}-${fm}-${fd}` === hoyStr;
            } else {
                const fechaNorm = this.normalizarFecha(fecha);
                esDeHoy = fechaNorm === hoyStr;
            }


            if (!esDeHoy) {
                showMessage("Solo puede abrir cotizaciones del día de hoy.");
                return;
            }
          const idProyecto = GlobalVariables.id_proyecto;
          const url = './?loc=Proyectos&SubLoc=ProcesosUnidades&id_proyecto=' + idProyecto + '&id_cliente=' + this.id_cliente + '&id_cotizacion=' + this.cotizacionSeleccionada;
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
        formatoMoneda(valor) {
            if (isNaN(valor)) return '';
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(valor);
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
                terminarAtencion: 0
            });

            res = res.data;

            if(res == 'OK'){
                this.seleccionarCotizacion(item.cotizacion);
            }

        },
        async terminarAtencion() {

            let res = await httpFunc("/generic/genericST/ProcesoNegocio:Del_Item", {
                terminarAtencion: 1,
                id_cliente: this.id_cliente,
                id_proyecto: GlobalVariables.id_proyecto
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

            GlobalVariables.ventanaUnidades.close();
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
    },
}