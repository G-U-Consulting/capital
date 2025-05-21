export default {
    data() {
        return {
            mode: -1,
            submode: 0,
            proyectos: [],
            estado_publicacion: [],
            selectedEstadoPublicacion: [],
            objProyecto: {
                nombre: "",
                direccion: "",
                id_sede: 0 ,
                id_zona_proyecto: 0,
                id_ciudadela: 0,
                id_tipo_proyecto: 0,
                otra_info: "",
                id_estado_publicacion: 0,

                subsidios_vis: "",
                dias_separacion: "",
                dias_cierre_sala: "",
                meses_ci: "",
                dias_pago_ci_banco_amigo: "",
                dias_pago_ci_banco_no_amigo: "",
                email_cotizaciones: "",
                meta_ventas: "",
                id_pie_legal: 0,
                id_banco_constructor: 0,
                bancos_financiadores: 0,
                id_tipo_financiacion: 0,
                id_tipo_vis: 0,

                centro_costos: "",
                id_fiduciaria: 0,
                id_opcion_visual: 0,

                lanzamiento: 0,
                ciudad_lanzamiento: "",
                fecha_lanzamiento: "",
                latitud: "",
                bloqueo_libres: "",
                inmuebles_opcionados: "",
                tipos_excluidos: "",
                link_waze: "",
                linea_whatsapp: "",

                email_receptor_1: "",
                email_receptor_2: "",
                email_receptor_3: "",
                email_receptor_4: "",

                link_general_onelink: "",
                link_especifico_onelink: "",
                incluir_especificaciones_tecnicias: "",
                link_especificaciones_tecnicias: "",
                incluir_cartilla_negocios_cotizacion: "",
                incluir_cartilla_negocios_opcion: "",
                link_cartilla_negocios: "",
                frame_seguimiento_visible: "",
                link_seguimiento_leads: "",
                frame_evaluacion_conocimiento: "",
                link_evaluacion_conocimiento: "",
                avance_obra_visible: 0,
                link_avance_obra: "",
                incluir_brochure: 0,
                link_brochure: ""
            },
            editObjProyecto: {
                id_proyecto: 0,
                nombre: "",
                direccion: "",
                id_sede: 0 ,
                id_zona_proyecto: 0,
                id_ciudadela: 0,
                id_tipo_proyecto: 0,
                otra_info: "",
                id_estado_publicacion: 0,

                subsidios_vis: "",
                dias_separacion: "",
                dias_cierre_sala: "",
                meses_ci: "",
                dias_pago_ci_banco_amigo: "",
                dias_pago_ci_banco_no_amigo: "",
                email_cotizaciones: "",
                meta_ventas: "",
                id_pie_legal: 0,
                id_banco_constructor: 0,
                id_bancos_financiador: 0,
                id_tipo_financiacion: 0,
                id_tipo_vis: 0,

                centro_costos: "",
                id_fiduciaria: 0,
                id_opcion_visual: 0,

                lanzamiento: 0,
                ciudad_lanzamiento: "",
                fecha_lanzamiento: "",
                latitud: "",
                bloqueo_libres: "",
                inmuebles_opcionados: "",
                tipos_excluidos: "",
                link_waze: "",
                linea_whatsapp: "",

                email_receptor_1: "",
                email_receptor_2: "",
                email_receptor_3: "",
                email_receptor_4: "",

                link_general_onelink: "",
                link_especifico_onelink: "",
                incluir_especificaciones_tecnicias: "",
                link_especificaciones_tecnicias: "",
                incluir_cartilla_negocios_cotizacion: "",
                incluir_cartilla_negocios_opcion: "",
                link_cartilla_negocios: "",
                frame_seguimiento_visible: "",
                link_seguimiento_leads: "",
                frame_evaluacion_conocimiento: "",
                link_evaluacion_conocimiento: "",
                avance_obra_visible: 0,
                link_avance_obra: "",
                incluir_brochure: 0,
                link_brochure: ""
            },
            
            camposPorSubmode: {
                0: ["nombre"],
                1: ["id_banco_constructor"],
                2: ["id_pie_legal"],
                3: ['id_fiduciaria'],
                4: ["ciudad_lanzamiento"],
                5: ["link_general_onelink"],
            },
            validacionEspecial: {
                // 0: [{ tipo: 'checkbox_group', campo: 'ciudadela', requerimiento: { tipo: 'minimo', valor: 1 } }],
                1: [
                    // { tipo: 'checkbox_group', campo: 'tiposVIS', requerimiento: { tipo: 'minimo', valor: 1 } },
                    // { tipo: 'checkbox_group', campo: 'tiposFinanciacion', requerimiento: { tipo: 'minimo', valor: 1 } }
                ],
                2: [
                    // { tipo: 'email', campo: 'email_cotizaciones' }
                ],
                3: [
                    // { tipo: 'checkbox_group', campo: 'opcionesVisuales', requerimiento: { tipo: 'minimo', valor: 1 } }

                ],
                4: [
                    // { tipo: 'email', campo: 'email_receptor_1' },
                    // { tipo: 'email', campo: 'email_receptor_2' },
                    // { tipo: 'email', campo: 'email_receptor_3' },
                    // { tipo: 'email', campo: 'email_receptor_4' }
                ],
            },
            isFormularioCompleto: false,
            tiposVIS: [],
            tiposFinanciacion: [], 
            banco_constructor: [],
            bancos_financiador: [],
            fiduciaria: [],
            opcionesVisuales: [],
            tabsIncomplete: [],
            draggedFile: null,
            dragIndex: null,
            tabs: [
                "Datos generales",
                "Tipología y financiación",
                "Pagos y Cotizaciones",
                "C. de costos y fiduciaria",
                "Información adicional",
                "Enlaces"
            ],
            casoValidator: [],
            filtros: {
                proyectos: { id_zona_proyecto : '' },
            },
            viewTable: true,
        };
    },
    computed: {
        tabClasses() {
          return this.tabs.map((_, index) => {
            if (this.submode === index) {
              return 'wizarTabActive';
            } else if (!this.tabsIncomplete.includes(index)) {
              return 'wizarTabCompleted';
            } else {
              return 'wizarTabIncomplete';
            }
          });
        },
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item => 
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                    ) : []
                ) : [];
            };
        }
    },
    async mounted() {
        this.tabsIncomplete = this.tabs.map((_, index) => index);
        await this.setMainMode();
        
        /* Test */
        this.proyectos[0].img = 'https://www.constructoracapital.com/web_datas/1738868507_logo-vivopark2.jpg';
        this.proyectos[1].img = 'https://www.constructoracapital.com/web_datas/1706039706_logo-ajustado.png';
        this.proyectos[2].img = 'https://www.constructoracapital.com/web_datas/1724858363_urbania-terra.jpg';
        this.proyectos[3].img = 'https://www.constructoracapital.com/web_datas/1645484933_logo-puerto-vallarta.jpg';
        /* End Test */
    },
    methods: {
        async setMainMode(){
            showProgress();
            this.proyectos = (await httpFunc("/generic/genericDT/Proyectos:Get_Proyectos", {})).data;
            var resp = await httpFunc("/generic/genericDS/Proyectos:Get_Vairables", {});
            hideProgress();
            resp = resp.data;
            resp[0].forEach(item => item.checked = false);
            this.estado_publicacion = resp[0];
            resp[1].forEach(item => item.checked = false);
            this.tiposVIS = resp[1];
            resp[2].forEach(item => item.checked = false);
            this.tiposFinanciacion = resp[2];
            resp[3].forEach(item => item.checked = false);
            this.opcionesVisuales = resp[3];
            resp[6].forEach(item => item.checked = false);
            this.tipo = resp[6];
            this.sede = resp[4];
            this.zona_proyecto = resp[5];
            this.ciudadela = resp[7];
            // this.tipo = resp[6];
            this.pie_legal = resp[8];
            this.fiduciaria = resp[9];
            this.banco_constructor = resp[10];
            this.bancos_financiador = resp[11];
            if(this.inputParameter != null)
                this.selectProject(this.inputParameter);
            else    
                this.setMode(0);
          
        },
        setMode(mode) {
            this.mode = mode;
            if(mode == 0)
                GlobalVariables.miniModuleCallback("SartProjectModule", null)
            if(mode == 1)
                GlobalVariables.miniModuleCallback("NewProject", null)
        },
        setSubmode(index) {
            const anteriorIndex = this.submode;
            
            const validarSubmode = (submodeIndex) => {
                const camposAValidar = this.camposPorSubmode[submodeIndex] || [];
                let submodeIncompleto = camposAValidar.some(campo => {
                    const valor1 = this.objProyecto[campo];
                    const valor2 = this.editObjProyecto[campo];
                    return (!valor1 || valor1.toString().trim() === '') &&
                           (!valor2 || valor2.toString().trim() === '');
                });
        
                const validacionesEspecialesSubmode = this.validacionEspecial[submodeIndex] || [];
                validacionesEspecialesSubmode.forEach(validacion => {
                    if (validacion.tipo === 'checkbox_group') {
                        const checkboxes = this[validacion.campo];
                        if (checkboxes) {
                            const seleccionados = checkboxes.filter(item => item.checked).length;
                            if (validacion.requerimiento && validacion.requerimiento.tipo === 'minimo' && seleccionados < validacion.requerimiento.valor) {
                                submodeIncompleto = true;
                            }
                        }
                    } else if (validacion.tipo === 'email') {
                        const email1 = this.objProyecto[validacion.campo];
                        const email2 = this.editObjProyecto[validacion.campo];
                        const valido1 = email1 && this.validarEmail(email1);
                        const valido2 = email2 && this.validarEmail(email2);
                        if (!valido1 && !valido2) {
                            submodeIncompleto = true;
                        }
                    }
                });
        
                if (submodeIncompleto) {
                    if (!this.tabsIncomplete.includes(submodeIndex)) {
                        this.tabsIncomplete.push(submodeIndex);
                    }
                } else {
                    const pos = this.tabsIncomplete.indexOf(submodeIndex);
                    if (pos !== -1) {
                        this.tabsIncomplete.splice(pos, 1);
                    }
                }
            };
        
            if (anteriorIndex !== null) {
                validarSubmode(anteriorIndex);
            }
            if (index > anteriorIndex && anteriorIndex !== null) {
                for (let i = anteriorIndex + 1; i < index; i++) {
                    validarSubmode(i);
                }
            }
            validarSubmode(index);
            this.submode = index;
            this.isFormularioCompleto = this.tabsIncomplete.length === 0;
        },
        validarEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        async selectProject(item) {
            showProgress();
            this.editObjProyecto = {
                ...this.editObjProyecto,
                id_proyecto: item["id_proyecto"] 
              };

            var resp = await httpFunc("/generic/genericDS/Proyectos:Get_Proyecto", { "id_proyecto": item["id_proyecto"] });
            resp = resp.data;
            const proyecto = resp[0][0];
            Object.keys(this.editObjProyecto).forEach(key => {
                if (proyecto[key] !== undefined && proyecto[key] !== null) {
                    this.editObjProyecto[key] = proyecto[key];
                }
            });

            var tViSeleccionada = resp[0][0].id_tipo_vis;
            this.tiposVIS.forEach(item => {
                if (tViSeleccionada) {
                    item.checked = (item.id_tipo_vis == tViSeleccionada);
                } else {
                    item.checked = false;
                }
            });
            var tFSeleccionada = resp[0][0].id_tipo_financiacion;
            this.tiposFinanciacion.forEach(item => {
                if (tFSeleccionada) {
                    item.checked = (item.id_tipo_financiacion == tFSeleccionada);
                } else {
                    item.checked = false;
                }
            });
            var oVSeleccionada = resp[0][0].id_opcion_visual;
            this.opcionesVisuales.forEach(item => {
                if (oVSeleccionada) {
                    item.checked = (item.id_opcion_visual == oVSeleccionada);
                } else {
                    item.checked = false;
                }
            });

            const tipo = (resp[0][0].tipo_proyecto || '')
                .split(',')
                .map(id => parseInt(id));

            this.tipo.forEach(item => {
                const id = parseInt(item.id_tipo_proyecto);
                item.checked = tipo.includes(id);
            });

            const estadopublicacion = (resp[0][0].estado_publicacion || '')
                .split(',')
                .map(id => parseInt(id));

            this.estado_publicacion.forEach(item => {
                const id = parseInt(item.id_estado_publicacion);
                item.checked = estadopublicacion.includes(id);
            });

            const listaContructor = (resp[0][0].banco_constructor || '')
                .split(',')
                .map(id => parseInt(id));

            this.banco_constructor.forEach(item => {
                const id = parseInt(item.id_banco_constructor);
                item.checked = listaContructor.includes(id);
            });

            const listaFinanciadores = (resp[0][0].bancos_financiadores || '')
                .split(',')
                .map(id => parseInt(id));

            this.bancos_financiador.forEach(item => {
                const id = parseInt(item.id_bancos_financiador);
                item.checked = listaFinanciadores.includes(id);
            });
            for (const key of Object.keys(this.camposPorSubmode)) {
                const numericKey = parseInt(key, 10);
                this.submode = numericKey;
                await this.setSubmode();

            }
            this.submode = 0;
            this.setMode(2);
            GlobalVariables.miniModuleCallback("SelectedProject", item)
            hideProgress();
        },
        async newProject() {
            this.casoValidator = [];
            /*
            const validarCampos = (fields) => {
                fields.forEach((campo) => {
                    const valor = this.objProyecto[campo];
                    const invalido = valor == null || (typeof valor === 'string' && valor.trim() === '');
                    if (invalido) {
                        this.casoValidator[campo] = `Error - El valor del campo ${campo} es inválido`;
                    }
                });
            };
            */
            const updates = {
                0: {
                    fields: [
                        "nombre", "direccion", "id_sede", "id_zona",
                        "id_ubicacion_proyecto", "id_tipo_proyecto",
                        "otra_info", "id_estado_publicacion"
                    ]
                },
                1: {
                    fields: [
                        "id_sede", "subsidios_vis", "acabados",
                        "reformas", "id_tipo", "id_torre"
                    ]
                },
                2: {
                    fields: [
                        "dias_separacion", "dias_cierre_sala", "meses_ci",
                        "email_cotizaciones", "meta_ventas",
                        "id_pie_legal", "id_coordinacion"
                    ]
                },
                3: {
                    fields: ["centro_costos", "id_fiduciaria"]
                },
                4: {
                    fields: [
                        "ciudad_lanzamiento", "fecha_lanzamiento",
                        "latitud", "inmuebles_opcionados",
                        "tipos_excluidos", "link_waze", "linea_whatsapp",
                        "email_receptor_1", "email_receptor_2",
                        "email_receptor_3", "email_receptor_4"
                    ]
                },
                5: {
                    fields: [
                        "link_general_onelink", "link_especifico_onelink",
                        "incluir_especificaciones_tecnicias", "link_especificaciones_tecnicias",
                        "incluir_cartilla_negocios_cotizacion", "incluir_cartilla_negocios_opcion",
                        "link_cartilla_negocios", "frame_seguimiento_visible",
                        "link_seguimiento_leads", "frame_evaluacion_conocimiento",
                        "avance_obra_visible", "link_avance_obra",
                        "incluir_brochure", "link_brochure"
                    ]
                }
            };
            const update = updates[this.submode];
            if (!update) {
                console.error('Submodo no válido:', this.submode);
                return { status: 'Error', message: 'Submodo no válido' };
            }
            // validarCampos(update.fields);
            /*
            if (Object.keys(this.casoValidator).length > 0) {
                console.error('Errores de validación:', this.casoValidator);
                return { status: 'Error', message: 'Hay errores de validación', errors: this.casoValidator };
            }
            */
 
            var tVis = this.tiposVIS.find(item => { return item.checked });
            if (tVis != null)
                this.objProyecto.id_tipo_vis = tVis.id_tipo_vis;
            var oVs = this.opcionesVisuales.find(item => { return item.checked });
            if (oVs != null)
                this.objProyecto.id_opcion_visual = oVs.id_opcion_visual;

            var tFn = this.tiposFinanciacion.find(item => { return item.checked });
            if (tFn != null)
                this.objProyecto.id_tipo_financiacion = tFn.id_tipo_financiacion;

            const tipo = this.tipo
                .filter(item => item.checked)
                .map(item => item.id_tipo_proyecto);
            this.objProyecto.tipo_proyecto = tipo.join(',');

            const estadopublicacion = this.estado_publicacion
                .filter(item => item.checked)
                .map(item => item.id_estado_publicacion);
            this.objProyecto.estado_publicacion = estadopublicacion.join(',');

            const bancosconstructor = this.banco_constructor
                .filter(item => item.checked)
                .map(item => item.id_banco_constructor);

            this.objProyecto.banco_constructor = bancosconstructor.join(',');

            const bancosSeleccionados = this.bancos_financiador
                .filter(item => item.checked)
                .map(item => item.id_bancos_financiador);

            this.objProyecto.bancos_financiadores = bancosSeleccionados.join(',');

            try {
                showProgress();
                const result = await httpFunc("/generic/genericST/Proyectos:Ins_Proyecto", this.objProyecto);
                hideProgress();
                this.setMainMode();
            } catch (error) {
                console.error("Error al insertar el proyecto:", error);
            }
        },
        async updateProject(){
            this.casoValidator = [];
            /*
            const validarCampos = (fields) => {
                fields.forEach((campo) => {
                    const valor = this.objProyecto[campo];
                    const invalido = valor == null || (typeof valor === 'string' && valor.trim() === '');
                    if (invalido) {
                        this.casoValidator[campo] = `Error - El valor del campo ${campo} es inválido`;
                    }
                });
            };
            */
            const updates = {
                0: {
                    fields: [
                        "nombre", "direccion", "id_sede", "id_zona",
                        "id_ubicacion_proyecto", "id_tipo_proyecto",
                        "otra_info", "id_estado_publicacion"
                    ]
                },
                1: {
                    fields: [
                        "id_sede", "subsidios_vis", "acabados",
                        "reformas", "id_tipo", "id_torre"
                    ]
                },
                2: {
                    fields: [
                        "dias_separacion", "dias_cierre_sala", "meses_ci",
                        "email_cotizaciones", "meta_ventas",
                        "id_pie_legal", "id_coordinacion"
                    ]
                },
                3: {
                    fields: ["centro_costos", "id_fiduciaria"]
                },
                4: {
                    fields: [
                        "ciudad_lanzamiento", "fecha_lanzamiento",
                        "latitud", "inmuebles_opcionados",
                        "tipos_excluidos", "link_waze", "linea_whatsapp",
                        "email_receptor_1", "email_receptor_2",
                        "email_receptor_3", "email_receptor_4"
                    ]
                },
                5: {
                    fields: [
                        "link_general_onelink", "link_especifico_onelink",
                        "incluir_especificaciones_tecnicias", "link_especificaciones_tecnicias",
                        "incluir_cartilla_negocios_cotizacion", "incluir_cartilla_negocios_opcion",
                        "link_cartilla_negocios", "frame_seguimiento_visible",
                        "link_seguimiento_leads", "frame_evaluacion_conocimiento",
                        "avance_obra_visible", "link_avance_obra",
                        "incluir_brochure", "link_brochure"
                    ]
                }
            };
            const update = updates[this.submode];
            if (!update) {
                console.error('Submodo no válido:', this.submode);
                return { status: 'Error', message: 'Submodo no válido' };
            }
            // validarCampos(update.fields);
            /*
            if (Object.keys(this.casoValidator).length > 0) {
                console.error('Errores de validación:', this.casoValidator);
                return { status: 'Error', message: 'Hay errores de validación', errors: this.casoValidator };
            }
            */
            var tVis = this.tiposVIS.find(item => { return item.checked });
            if (tVis != null)
                this.editObjProyecto.id_tipo_vis = tVis.id_tipo_vis;

            var oVs = this.opcionesVisuales.find(item => { return item.checked });
            if (oVs != null)
                this.editObjProyecto.id_opcion_visual = oVs.id_opcion_visual;

            var tFn = this.tiposFinanciacion.find(item => { return item.checked });
            if (tFn != null)
                this.editObjProyecto.id_tipo_financiacion = tFn.id_tipo_financiacion;
   
            const tipo = this.tipo
                .filter(item => item.checked)
                .map(item => item.id_tipo_proyecto);
            this.editObjProyecto.tipo_proyecto = tipo.join(',');

            const estadopublicacion = this.estado_publicacion
                .filter(item => item.checked)
                .map(item => item.id_estado_publicacion);
            this.editObjProyecto.estado_publicacion = estadopublicacion.join(',');

            const bancosconstructor = this.banco_constructor
                .filter(item => item.checked)
                .map(item => item.id_banco_constructor);
            this.editObjProyecto.banco_constructor = bancosconstructor.join(',');

            const bancosfinanciador = this.bancos_financiador
                .filter(item => item.checked)
                .map(item => item.id_bancos_financiador);
            this.editObjProyecto.bancos_financiadores = bancosfinanciador.join(',');

            try {
                showProgress();
                const result = await httpFunc("/generic/genericST/Proyectos:Upd_Proyecto", this.editObjProyecto);
                hideProgress();
                this.setMainMode();
            } catch (error) {
                console.error("Error al insertar el proyecto:", error);
            }
        }, 
        async cleanObjectData(){
            await this.cleanObject(this.editObjProyecto);
            await this.cleanObject(this.objProyecto);
        },
        async cleanObject(obj) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'string') {
                        obj[key] = "";
                    } else if (typeof obj[key] === 'number') {
                        obj[key] = 0;
                    }
                }
            }
            for (const key of Object.keys(this.camposPorSubmode)) {
                const numericKey = parseInt(key, 10);
                this.submode = numericKey;
                await this.setSubmode();

            }
            this.submode = 0;
        },
        onClear(table) {
            let item = this.filtros[table];
            item = Object.keys(item).forEach((key) => item[key] = '');
        },
        async hasPermission(id) {
            return !!GlobalVariables.permisos.filter(p => p.id_permiso == id).length;
        },
    }
};
