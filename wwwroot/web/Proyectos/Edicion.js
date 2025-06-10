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
                email_coord_sala: "",
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
                email_coord_sala: "",
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
            previews: [],
            files: [],
            imgsPortada: [],
            viewMode: 'Tabla',
            frontImg: '',
            interval: null
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
        await this.setViewMode();
        await this.setMainMode();
        this.proyectos.forEach(async pro => {
            let res = await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                { tipo: 'logo', id_proyecto: pro.id_proyecto });
                if(res.data && res.data.length)
                    pro.img = '/file/S3get/' + res.data[0].llave;
        });
    },
    methods: {
        async setMainMode() {
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
            this.pie_legal = resp[8];
            this.fiduciaria = resp[9];
        
            this.banco_constructor = resp[10]
                .filter(item => item.banco !== "Carta de compromiso del Cliente")
                .sort((a, b) => a.banco.localeCompare(b.banco));

            const cartaCompromiso = resp[11].find(item => item.banco === "Carta de compromiso del Cliente");
            this.bancos_financiador = resp[11]
                .filter(item => item.banco !== "Carta de compromiso del Cliente")
                .sort((a, b) => a.banco.localeCompare(b.banco));
            if (cartaCompromiso) {
                this.bancos_financiador.unshift(cartaCompromiso);
            }
        
            if (this.inputParameter != null) {
                this.selectProject(this.inputParameter);
            } else {
                this.setMode(0);
            }
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
        async setViewMode(mode) {
            let vista = await GlobalVariables.getPreferences('vistaProyecto', true);
            if (vista) this.viewMode = vista;
            else {
                let data = (await httpFunc("/generic/genericST/Usuarios:Ins_Preferencias", 
                    { usuario: GlobalVariables.username, nombre: 'vistaProyecto', valor: mode || 'Tabla' })).data;
                if (data == 'OK') await this.setViewMode();
            }
        },
        async updateViewMode(mode) {
            if (mode != this.viewMode) {
                this.viewMode = mode;
                let data = (await httpFunc("/generic/genericST/Usuarios:Upd_Preferencias", 
                    { usuario: GlobalVariables.username, nombre: 'vistaProyecto', valor: mode || 'Tabla' })).data;
                if (data == 'OK') await this.setViewMode();
            }
        },
        validarEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
        async selectProject(item, mode = 2) {
            showProgress();
            this.editObjProyecto = {
                ...this.editObjProyecto,
                id_proyecto: item["id_proyecto"] 
              };

              GlobalVariables.id_proyecto = item["id_proyecto"];

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
            this.setMode(mode);
            await GlobalVariables.miniModuleCallback("SelectedProject", item);
            if (mode == 'portada'){
                let item = document.querySelector('.lateralMenuItemSelected');
                item && item.classList.remove('lateralMenuItemSelected');
                await this.loadImg('slide,logo,planta');
            } else {
                let item = document.getElementById('MenuItemEdicion');
                item && !item.classList.contains('lateralMenuItemSelected') 
                    && item.classList.add('lateralMenuItemSelected');
            }
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
        async clearAllImages() {
            this.previews = [];
            this.files = [];
        },
        async processFiles(files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const exists = this.files.some(existingFile => existingFile.name === file.name);
                if (!exists) {
                    this.files.push(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        if (file.type.startsWith('image/')) {
                            let f = { src: e.target.result, file: file };
                            Object.defineProperty(f, 'content', {
                                get() { return this.src; },
                                set(val) { this.src = val; }
                            });
                            this.previews.push(f);
                        }
                        else {
                            this.files.pop();
                            console.error(`Documento no soportado: ${file.name}`);
                        }
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        async openFiles(paths) {
            let files = [];
            try {
                files = await Promise.all(paths.map(async ({ path, name }) => {
                    const res = await fetch(path);
                    if (!res.ok) throw new Error(`Error al cargar ${path}: ${res.statusText}`);
                    const blob = await res.blob();
                    return new File([blob], name, { type: blob.type });
                }));
            } catch (error) {
                console.error("Error al cargar archivos:", error);
            }
            return files;
        },
        async loadImg(tipo) {
            this.clearAllImages();
            clearInterval(this.interval);
            this.imgsPortada = [];
            let res = await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                { tipo, id_proyecto: this.editObjProyecto.id_proyecto });
            if (res.data) {
                res.data.forEach(f => this.imgsPortada.push('/file/S3get/' + f.llave));
                if (this.imgsPortada.length) this.frontImg = this.imgsPortada[0];
            }
            res = await httpFunc('/generic/genericDT/Maestros:Get_Documento',
                { documento: "Sostenibilidad", is_img: 1 });
            if (res.data && res.data.length) {
                let doc = res.data[0];
                res = await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                { tipo: doc.documento, id_maestro_documento: doc.id_documento });
                if (res.data) 
                    res.data.forEach(f => this.imgsPortada.push('/file/S3get/' + f.llave));
            }
            let i = 0;
            this.interval = setInterval(() => {
                if (this.imgsPortada && this.imgsPortada.length) {
                    let img = document.getElementById('img-portada');
                    if (img) {
                        img.style.opacity = 0;
                        setTimeout(() => {
                            i = (i + 1) % this.imgsPortada.length;
                            this.frontImg = this.imgsPortada[i];
                        }, 150);
                        document.getElementById('img-portada').style.opacity = .15;
                    } else clearInterval(this.interval);
                }
            }, 8000);
        },
        onloadimg(e) {
            let img = e.target, rel = img.naturalWidth / img.naturalHeight, min = 150, fact = 1.25;
            let maxheight = img.parentElement.offsetHeight, maxwidth = img.parentElement.offsetWidth;
            let width = Math.min(maxwidth, img.naturalWidth * fact), height = Math.min(maxheight, img.naturalHeight * 1.2);
            let rel2 = width / height;
            if (img.naturalHeight < min) {
                img.width = min * rel;
                img.height = min;
            }
            else if (rel2 > rel / fact && rel2 < rel * fact) {
                img.width = img.naturalWidth * fact;
                img.height = img.naturalHeight * fact;
            }
            else {
                img.width = img.width * fact;
                img.height = img.height * fact;
            }
            img.style.opacity = 1;
        },
        async hasPermission(id) {
            return !!GlobalVariables.permisos.filter(p => p.id_permiso == id).length;
        },
        dragStart(index) {
            this.dragIndex = index;
        },
        dragOver(index) {
            // Permite el drop
        },
        drop(index) {
            if (this.dragIndex === null || this.dragIndex === index) return;
            // Reordena previews y files en paralelo
            const draggedPreview = this.previews[this.dragIndex];
            const draggedFile = this.files[this.dragIndex];
            this.previews.splice(this.dragIndex, 1);
            this.files.splice(this.dragIndex, 1);
            this.previews.splice(index, 0, draggedPreview);
            this.files.splice(index, 0, draggedFile);
            this.dragIndex = null;
        },
        async handleDrop(event) {
            event.preventDefault();
            event.currentTarget.classList.remove("drag-over");
            const files = Array.from(event.dataTransfer.files);
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith("image/")) {
                    this.files.push(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.previews.push({ src: e.target.result, file });
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        async uploadFiles() {
            if (!this.files.length && !this.previews.length) {
                this.message = "No hay archivos para subir.";
                return;
            }
            const form = new FormData();
            // Agrega archivos reales
            this.files.forEach(file => {
                if (file) form.append("file", file);
            });
            try {
                showProgress();
                const uploadResp = await httpFunc("/file/upload", form);
                if (uploadResp.isError || !uploadResp.data) {
                    hideProgress();
                    this.message = uploadResp.errorMessage || "Error al subir archivos al servidor.";
                    return;
                }
                const serverFiles = uploadResp.data;
                const s3Resp = await httpFunc("/file/S3upload", serverFiles);
                if (s3Resp.isError || !s3Resp.data) {
                    hideProgress();
                    this.message = s3Resp.errorMessage || "Error al subir archivos a S3.";
                    return;
                }
                // Aquí puedes registrar en tu base de datos, limpiar arrays, etc.
                this.message = "Archivos subidos y registrados correctamente.";
                this.files = [];
                this.previews = [];
                hideProgress();
            } catch (error) {
                hideProgress();
                this.message = "❌ Error al subir los archivos.";
                console.error("Upload error:", error);
            }
        },
    }
};
