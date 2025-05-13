export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
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
            tooltipVisible: false,
            tooltipX: 0,
            tooltipY: 0,
            logoPreview: null,
            slidePreview: null,
            plantaPreview: null,
            isExpanded: {
              logo: false,
              slide: false,
              planta: false
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
            bancos: [],
            fiduciaria: [],
            opcionesVisuales: [],
            tabsIncomplete: [],
            previews: [],
            files: [],
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
            mediaTabs: [
                "Principal",
                "Secuencia",
                "Imágenes",
                "Videos",
                "Recorridos Virt",
                "Avances de obra"
            ],
            casoValidator: [],
            //ejemplo informe cargue
            selectCarg: "",
            fileSelected: null,
            selectInfo: "",
            parsInforme: {
                pars: [
                  { parametro: 'Fecha Desde', tipo: 'date', valor: '', visible: true },
                  { parametro: 'Fecha Hasta', tipo: 'date', valor: '', visible: true },
                  { parametro: 'Sala de Negocios:', tipo: 'select', valor: '', opciones: [
                    'Alameda de Zipaquirá',
                    'Mystique 106',
                    'Porto Hayuelos',
                    'Urbania',
                    'Serralta'
                  ], visible: true },
                  { parametro: 'Asesor:', tipo: 'select', valor: '', opciones: ['Asesor1', 'Aesor2'], visible: true },
                  
                ],
                parsLen: 2,
                resultadoEjecucion: null
            },
            sinco: {
                companies: [],
                company: null,
                macroProjects: [],
                macroProject: null,
                projects: [],
                project: null,
                groups: []
            },
            videos: [
                { title: '', description: '', link: '' }
              ],
              hoveredIndex: null,
              selectedRow: null,
              ruta: []
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
    },
    async mounted() {
        this.tabsIncomplete = this.tabs.map((_, index) => index);
        await this.setMainMode(1);
        // this.mode = 2;
    },
    methods: {
        getMainPath() {
            let path = {};
            if (this.mainmode == 1) path.text = "Categorias Adm";
            if (this.mainmode == 2) path.text = "Política de Contraseña";
            if (this.mainmode == 3) path.text = "Fondo Pantalla";
            path.action = () => this.setMode(0);
            return path;
        },
        setRuta() {
            console.log(this.mainmode, this.mode)
            if (this.mainmode !== 3) {
                let subpath = [this.getMainPath()];
                let nuevo = { text: 'Nuevo', action: () => this.setMode(1) },
                    editar = { text: 'Edición', action: () => this.setMode(2) };
                if (this.mode == 1) subpath.push(nuevo);
                if (this.mode == 2) subpath.push(editar);
                this.ruta = [{
                    text: 'ZA', action: () => 
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
                }, {text: 'Proyectos', action: () => { this.mainmode = 0; this.setMode(0) }}];
                this.ruta = [...this.ruta, ...subpath];
            }
            else this.ruta = [{
                    text: 'ZA', action: () => 
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
                }];
        },
        setMode(mode) {
            this.mode = mode;
            this.setRuta();
        },
        async setMainMode(mode) {
            if (mode == 1) {
                this.proyectos = (await httpFunc("/generic/genericDT/Proyectos:Get_Proyectos", {})).data;
                var resp = await httpFunc("/generic/genericDS/Proyectos:Get_Vairables", {});
                resp = resp.data;
                resp[0].forEach(item => item.checked = false);
                this.estado_publicacion = resp[0];
                resp[1].forEach(item => item.checked = false);
                this.tiposVIS = resp[1];
                resp[2].forEach(item => item.checked = false);
                this.tiposFinanciacion = resp[2];
                resp[3].forEach(item => item.checked = false);
                this.opcionesVisuales = resp[3];
                this.sede = resp[4];
                this.zona_proyecto = resp[5];
                this.ciudadela = resp[7];
                this.tipo = resp[6];
                this.pie_legal = resp[8];
                this.fiduciaria = resp[9];
                this.bancos = resp[10];
            } else if(mode == 3){
                this.sincoCompanies();
            }
            if(mode == 4){
                var resp = await httpFunc("/generic/genericDS/General:Get_Informes", {});
                resp = resp.data;

                this.informes = resp[0];
                this.cargues = resp[1];

            }
            this.mainmode = mode;
            this.mode = 0;
            this.setRuta();
        },
        async setSubmode(index) {
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
        async validarEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        async previewImage(event, type) {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                if (type === 'logoPreview') {
                  this.logoPreview = reader.result;
                } else if (type === 'slidePreview') {
                  this.slidePreview = reader.result;
                } else if (type === 'plantaPreview') {
                  this.plantaPreview = reader.result;
                }
              };
              reader.readAsDataURL(file);
            }
          },
        async expandImage(type) {
            this.isExpanded[type] = true;
        },
        async closeModal() {
            this.isExpanded.logo = false;
            this.isExpanded.slide = false;
            this.isExpanded.planta = false;
        },
        async removePreview(type) {
            if (type === 'logo') {
                this.logoPreview = null;
            } else if (type === 'slide') {
                this.slidePreview = null;
            } else if (type === 'planta') {
                this.plantaPreview = null;
            }
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
            var ePSeleccionada = resp[0][0].id_estado_publicacion;
            this.estado_publicacion.forEach(item => {
                if (ePSeleccionada) {
                    item.checked = (item.id_estado_publicacion == ePSeleccionada);
                } else {
                    item.checked = false;
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
            for (const key of Object.keys(this.camposPorSubmode)) {
                const numericKey = parseInt(key, 10);
                this.submode = numericKey;
                await this.setSubmode();
        
            }
            this.submode = 0;
            this.setMode(2);
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
            try {
                showProgress();
                const result = await httpFunc("/generic/genericST/Proyectos:Ins_Proyecto", this.objProyecto);
                hideProgress();
                this.setMainMode(1);
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


            try {
                showProgress();
                const result = await httpFunc("/generic/genericST/Proyectos:Upd_Proyecto", this.editObjProyecto);
                hideProgress();
                this.setMainMode(1);
            } catch (error) {
                console.error("Error al insertar el proyecto:", error);
            }
        }, 
        async hasPermission(id) {
            return !!GlobalVariables.permisos.filter(p => p.id_permiso == id).length;
        },
        async onUpdate(lista) {
            console.log(lista);
            this.setMode(2);
        },
        async sincoCompanies() {
            showProgress();
            var result = (await httpFunc("/api/internal/SincoGetEmpresas", {}));
            this.sinco.companies = result;
            this.setMode(1);
            hideProgress();
        },
        async sincoMacroProjects(item) {
            showProgress();
            this.sinco.company = item;
            var result = (await httpFunc("/api/internal/SincoGetMacroproyectos", item));
            this.sinco.macroProjects = result;
            this.setMode(2);
            hideProgress();
        },
        async sincoProjects(item) {
            showProgress();
            this.sinco.macroProject = item;
            var result = (await httpFunc("/api/internal/SincoGetProyectos", item));
            this.sinco.projects = result;
            this.setMode(3);
            hideProgress();
        },
        async sincoGroups(item) {
            showProgress();
            this.sinco.project = item;
            var result = (await httpFunc("/api/internal/SincoGetAgrupaciones", item));
            result.forEach(item => item["expanded"] = false);
            this.sinco.groups = result;
            this.setMode(4);
            hideProgress();
        },
        async formatoMoneda(val){
            return formatoMoneda(val);
        },
        /////// Informes ////////////
        async handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.fileSelected = file;
            }
        },
        async removeFile() {
            this.fileSelected = null;
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
        async dragStart(index) {
            this.dragIndex = index;
        },
        async dragOver(event) {
            // Necesario para permitir el "drop" en el contenedor
        },
        async handleDrop(event) {
            if (this.dragIndex !== null) {
                const dropTarget = event.target.closest('.image-card');
                if (dropTarget) {
                    const dropIndex = Array.from(event.currentTarget.querySelectorAll('.image-card')).indexOf(dropTarget);
                    if (dropIndex !== -1 && dropIndex !== this.dragIndex) {
                        const draggedItem = this.previews[this.dragIndex];
                        const draggedFile = this.files[this.dragIndex];

                        this.previews.splice(this.dragIndex, 1);
                        this.files.splice(this.dragIndex, 1);

                        this.previews.splice(dropIndex, 0, draggedItem);
                        this.files.splice(dropIndex, 0, draggedFile);
                        this.dragIndex = null;
                        return;
                    }
                }
                this.dragIndex = null;
                return;
            }
            if (event.dataTransfer.files.length > 0) {
                const droppedFiles = event.dataTransfer.files;
                this.processFiles(droppedFiles);
            }
        },
        async removeImage(index) {
            this.previews.splice(index, 1);
            this.files.splice(index, 1);
        },
        async handleFileChange(event) {
            const selectedFiles = event.target.files;
            this.processFiles(selectedFiles);
        },
        async handleDragOver(event) {
            event.preventDefault();
        },
        async processFiles(files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    const exists = this.files.some(existingFile => existingFile.name === file.name);
                    if (!exists) {
                        this.files.push(file);
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.previews.push({ src: e.target.result, file: file });
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
        },
        async clearAllImages() {
            this.previews = [];
            this.files = [];
        },
        async triggerFileInput() {
            this.$refs.fileInput.click();
        },
        async getVideoId(url) {
            const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
            return match ? match[1] : null;
        },
        async addRow() {
            this.videos.push({ title: '', description: '', link: '' });
        },
        async removeRow(index) {
            this.videos.splice(index, 1);
        },
        async selectRow(index) {
            this.selectedRow = index;
        },
        async moveRow(direction) {
            const i = this.selectedRow;
            if (i === null || i < 0 || i >= this.videos.length) return;
          
            if (direction === 'up' && i > 0) {
              const temp = this.videos[i];
              this.videos[i] = this.videos[i - 1];
              this.videos[i - 1] = temp;
              this.selectedRow = i - 1;
            } else if (direction === 'down' && i < this.videos.length - 1) {
              const temp = this.videos[i];
              this.videos[i] = this.videos[i + 1];
              this.videos[i + 1] = temp;
              this.selectedRow = i + 1;
            }
        },
        getMainPath() {
            let path = {};
            if (this.mainmode == 1) path.text = "Información Básica";
            if (this.mainmode == 2) path.text = "Rotafolio de Proyectos";
            if (this.mainmode == 3) path.text = "Unidades";
            if (this.mainmode == 4) path.text = "Informes y Cargues";
            path.action = () => this.setMode(0);
            return path;
        },
        updateCursor(event) {
            this.tooltipX = event.clientX + 10;
            this.tooltipY = event.clientY + 10;
          },
    }
};
