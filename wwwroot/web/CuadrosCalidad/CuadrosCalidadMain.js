export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            // Data arrays for each section
            obras: [],
            proyectosDisponibles: [],
            laboratoriosActivos: [],
            concreteras: [],
            laboratorios: [],
            clasesMuestra: [],
            tiposMuestra: [],
            clasesDisponibles: [],
            // Filters for each section
            filtroObras: { nombre: "" },
            mostrarTodosObras: false,
            filtroConcreteras: { nombre: "" },
            filtroLaboratorios: { nombre: "" },
            filtroClasesMuestra: { nombre: "" },
            filtroTiposMuestra: { descripcion: "" },
            filtroObservaciones: { descripcion: "" },
            // Form data
            formData: {
                id: "",
                id_proyecto: "",
                id_concretera: "",
                nombre: "",
                descripcion: "",
                id_laboratorio: "",
                codigo_laboratorio: "",
                logo: "",
                logoPreview: "",
                logoFile: null,
                logoChanged: false
            },
            currentSection: "",
            showList: window.innerWidth > 1424,
            observaciones: [],
            proyectosCC: [],
            selectedProyectoCC: null,
            searchCC: '',
            personalizacion: { politica_recoleccion: null },
            // Formato Mixer
            mixers: [],
            concretrasActivas: [],
            filtroMixer: { fecha_desde: "", fecha_hasta: "", id_concretera: "" },
            formMixer: {
                id_formato_mixer: "", fecha: "", cantidad_m3: "",
                id_concretera: "", resistencia_psi: "", resistencia_mpa: "",
                asentamiento_esperado: "", asentamiento_real: "",
                temperatura: "", recibido: "0", numero_remision: "",
                observaciones: ""
            },
            // Muestras (standalone view)
            muestrasStandalone: [],
            filtroMuestraStandalone: { id_tipo_muestra: "", id_estado: "", fecha_desde: "", fecha_hasta: "" },
            formMuestraStandalone: {
                id_muestra: "", id_tipo_muestra: "", id_ubicacion: "", id_piso: "",
                id_concretera: "", id_formato_mixer: "", numero_muestra_obra: "",
                fecha: "", dia_recoleccion: "", localizacion: "", observaciones: ""
            },
            // Remisiones
            remisiones: [],
            filtroRemision: { procesado: "", fecha_desde: "", fecha_hasta: "" },
            formRemision: { id_remision: "", consecutivo: "", observaciones: "", fecha_envio: "" },
            muestrasRemision: [],
            muestrasDisponibles: [],
            // Muestras dropdowns (shared)
            tiposMuestraActivos: [],
            ubicacionesActivas: [],
            pisosActivos: [],
            // Excel Export
            filtroExport: { id_tipo_muestra: "", id_ubicacion: "", id_piso: "", fecha_desde: "", fecha_hasta: "" },
            // Dashboard
            dashboardResumen: {},
            filtroDashboard: { id_tipo_muestra: "", id_ubicacion: "", id_piso: "", fecha_desde: "", fecha_hasta: "" },
            dashboardResultados: [],
            dashboardChart: null,
            // Edades (child of TipoMuestra)
            edades: [],
            formEdad: { id_edad_muestra: "", edad: "", color: "" },
            edadMode: 0, // 0=list, 1=adding
            // Autodesk ACC
            ubicaciones: [],
            pisos: [],
            autodeskConnected: false,
            accProjects: [],
            syncingACC: false
        }
    },
    async mounted() {
        await this.getProyectosCC();
        this.setMainMode(0);
    },
    watch: {
        selectedProyectoCC(val) {
            if (val == null) { this.setMainMode(0); return; }
            if (this.mainmode == 6) this.getPersonalizacion();
            if (this.mainmode == 7) this.getUbicaciones();
            if (this.mainmode == 8) this.getPisos();
            if (this.mainmode == 9) this.getObservaciones();
            if (this.mainmode == 10) this.getFormatosMixer();
            if (this.mainmode == 11) this.getRemisiones();
            if (this.mainmode == 13) this.getDashboardResumen();
            if (this.mainmode == 14) this.getMuestrasStandalone();
        }
    },
    methods: {
        getMainModeTitle() {
            const titles = {
                0: "Proyectos",
                1: "Selección de Obras",
                2: "Concretera",
                3: "Laboratorio",
                4: "Clase Muestra",
                5: "Tipo Muestra",
                6: "Personalización",
                7: "Ubicación",
                8: "Pisos",
                9: "Observaciones",
                10: "Formato Mixer",
                11: "Remisiones",
                12: "Descargar en Excel",
                13: "Dashboard",
                14: "Muestras"
            };
            return titles[this.mainmode] || "";
        },
        setRuta() {
            let subpath = [];
            let nuevo = { text: 'Nuevo', action: () => this.setMode(1) },
                editar = { text: 'Edición', action: () => this.setMode(2) };
            if (this.mode == 1) subpath.push(nuevo);
            if (this.mode == 2) subpath.push(editar);
            this.ruta = [
                { text: 'ZC', action: () => GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual) },
                { text: this.getMainModeTitle(), action: () => this.setMode(0) }
            ];
            this.ruta = [...this.ruta, ...subpath];
        },
        setMode(mode) {
            this.mode = mode;
            this.setRuta();
        },
        async setMainMode(mode) {
            this.mainmode = mode;
            this.mode = 0;
            this.setRuta();

            // Load data for the selected section
            switch(mode) {
                case 0: await this.getProyectosCC(); break;
                case 1: await this.getObras(); break;
                case 2: await this.getConcreteras(); break;
                case 3: await this.getLaboratorios(); break;
                case 4: await this.getClasesMuestra(); break;
                case 5: await this.getTiposMuestra(); break;
                case 6: await this.getPersonalizacion(); break;
                case 7: await this.checkAutodeskStatus(); await this.getUbicaciones(); break;
                case 8: await this.checkAutodeskStatus(); await this.getPisos(); break;
                case 9: await this.getObservaciones(); break;
                case 10: this.initMixerFilters(); await this.loadConcretrasActivas(); await this.getFormatosMixer(); break;
                case 11: await this.getRemisiones(); break;
                case 12: await this.loadFilterDropdowns(); break;
                case 13: await this.loadFilterDropdowns(); await this.getDashboardResumen(); break;
                case 14: await this.loadMuestraDropdowns(); await this.getMuestrasStandalone(); break;
            }
        },
        // PROYECTOS CC - Card view
        async getProyectosCC() {
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Proyectos_CC', { nombre: null });
                this.proyectosCC = (resp.data || []).filter(o => o.is_active == '1');
            } catch (e) {
                console.error('Error cargando proyectos CC:', e);
                this.proyectosCC = [];
            }
            hideProgress();
        },
        getSelectedProyecto() {
            if (!this.selectedProyectoCC) return null;
            return this.proyectosCC.find(p => p.id_proyecto_cc == this.selectedProyectoCC) || null;
        },
        getFilteredProyectosCC() {
            if (!this.searchCC) return this.proyectosCC;
            const term = this.searchCC.toLowerCase();
            return this.proyectosCC.filter(o => o.nombre.toLowerCase().includes(term));
        },
        // PERSONALIZACIÓN
        async getPersonalizacion() {
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Personalizacion', {
                    id_proyecto_cc: this.selectedProyectoCC
                });
                if (resp.data && resp.data.length > 0) {
                    this.personalizacion = resp.data[0];
                } else {
                    this.personalizacion = { politica_recoleccion: null };
                }
            } catch (e) {
                console.error('Error cargando personalización:', e);
                this.personalizacion = { politica_recoleccion: null };
            }
            hideProgress();
        },
        async savePersonalizacion() {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Save_Personalizacion', {
                    id_proyecto_cc: this.selectedProyectoCC,
                    politica_recoleccion: this.personalizacion.politica_recoleccion,
                    usuario: GlobalVariables.username
                });
                showMessage('Personalización guardada correctamente');
            } catch (e) {
                console.error('Error guardando personalización:', e);
                showMessage('Error al guardar personalización', 'error');
            }
            hideProgress();
        },
        // OBSERVACIONES
        async getObservaciones() {
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Observaciones', {
                    id_proyecto_cc: this.selectedProyectoCC,
                    descripcion: this.filtroObservaciones.descripcion || null
                });
                this.observaciones = resp.data || [];
            } catch (e) {
                console.error('Error cargando observaciones:', e);
                this.observaciones = [];
            }
            hideProgress();
        },
        async toggleAccion(id_observacion, parametro) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Upd_Observacion_Accion', {
                    id_observacion,
                    id_proyecto_cc: this.selectedProyectoCC,
                    parametro
                });
                await this.getObservaciones();
            } catch (e) {
                console.error('Error actualizando acción:', e);
            }
            hideProgress();
        },
        // OBRAS - Get enabled projects for Cuadros de Calidad
        async getObras() {
            showProgress();
            try {
                const response = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Proyectos_CC', {
                    nombre: this.filtroObras.nombre || null
                });
                this.obras = response.data || [];
            } catch (error) {
                console.error("Error al obtener obras:", error);
            }
            hideProgress();
        },
        getFilteredObras() {
            if (this.mostrarTodosObras) return this.obras;
            return this.obras.filter(o => o.estado === 'Habilitado');
        },
        // CONCRETERAS
        async getConcreteras() {
            showProgress();
            try {
                const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_Concreteras", {
                    nombre: this.filtroConcreteras.nombre || null
                });
                this.concreteras = response.data || [];
            } catch (error) {
                console.error("Error al obtener concreteras:", error);
            }
            hideProgress();
        },
        // LABORATORIOS
        async getLaboratorios() {
            showProgress();
            try {
                const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_Laboratorios", {
                    nombre: this.filtroLaboratorios.nombre || null
                });
                this.laboratorios = response.data || [];
            } catch (error) {
                console.error("Error al obtener laboratorios:", error);
            }
            hideProgress();
        },
        // CLASES MUESTRA
        async getClasesMuestra() {
            showProgress();
            try {
                const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_ClasesMuestra", {
                    nombre: this.filtroClasesMuestra.nombre || null
                });
                this.clasesMuestra = response.data || [];
            } catch (error) {
                console.error("Error al obtener clases de muestra:", error);
            }
            hideProgress();
        },
        // TIPOS MUESTRA
        async getTiposMuestra() {
            showProgress();
            try {
                const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_TiposMuestra", {
                    descripcion: this.filtroTiposMuestra.descripcion || null
                });
                this.tiposMuestra = response.data || [];
            } catch (error) {
                console.error("Error al obtener tipos de muestra:", error);
            }
            hideProgress();
        },
        async getClasesDisponibles() {
            try {
                const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_ClasesMuestra", {
                    nombre: null
                });
                this.clasesDisponibles = response.data || [];
            } catch (error) {
                console.error("Error al obtener clases disponibles:", error);
            }
        },
        // OBRAS SPECIFIC METHODS
        async startNewObra() {
            showProgress();
            this.proyectosDisponibles = await this.getProyectosDisponibles();
            this.laboratoriosActivos = await this.getLaboratoriosActivos();
            this.formData = {
                id_proyecto: "",
                nombre: "",
                id_laboratorio: "",
                codigo_laboratorio: ""
            };
            this.currentSection = 'obras';
            this.setMode(1);
            hideProgress();
        },
        async editObra(item) {
            showProgress();
            this.laboratoriosActivos = await this.getLaboratoriosActivos();
            await this.getACCProjects();
            this.formData = {
                id_proyecto_cc: item.id_proyecto_cc,
                id_proyecto: item.id_proyecto,
                nombre: item.nombre,
                id_laboratorio: item.id_laboratorio,
                codigo_laboratorio: item.codigo_laboratorio,
                acc_project_id: item.acc_project_id || "",
                estado: item.estado
            };
            this.currentSection = 'obras';
            this.setMode(2);
            hideProgress();
        },
        toggleList() {
            this.showList = !this.showList;
        },
        formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return date.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        },
        // COMMON METHODS
        async startNew(section) {
            this.currentSection = section;
            if (section === 'concreteras') {
                this.formData = {
                    id_concretera: "",
                    nombre: "",
                    logo: "",
                    logoPreview: "",
                    logoFile: null,
                    logoChanged: false
                };
            } else if (section === 'laboratorios') {
                this.formData = {
                    id_laboratorio: "",
                    nombre: "",
                    logo: "",
                    logoPreview: "",
                    logoFile: null,
                    logoChanged: false
                };
            } else if (section === 'clasesMuestra') {
                this.formData = { id_clase_muestra: "", descripcion: "" };
            } else if (section === 'tiposMuestra') {
                await this.getClasesDisponibles();
                this.formData = {
                    id_tipo_muestra: "",
                    id_clase_muestra: "",
                    descripcion: "",
                    rango_verde: "",
                    rango_amarillo: "",
                    rango_rojo: "",
                    diametro: ""
                };
            } else if (section === 'observaciones') {
                this.formData = { id_observacion: "", descripcion: "" };
            } else {
                this.formData = { id: "", nombre: "", descripcion: "" };
            }
            this.setMode(1);
        },
        async selectItem(item, section) {
            this.currentSection = section;
            if (section === 'concreteras') {
                this.formData = {
                    id_concretera: item.id_concretera,
                    nombre: item.nombre,
                    logo: item.logo || "",
                    logoPreview: item.logo ? '/file/S3get/' + item.logo : "",
                    logoFile: null,
                    logoChanged: false,
                    estado: item.estado
                };
            } else if (section === 'laboratorios') {
                this.formData = {
                    id_laboratorio: item.id_laboratorio,
                    nombre: item.nombre,
                    logo: item.logo || "",
                    logoPreview: item.logo ? '/file/S3get/' + item.logo : "",
                    logoFile: null,
                    logoChanged: false,
                    estado: item.estado
                };
            } else if (section === 'clasesMuestra') {
                this.formData = {
                    id_clase_muestra: item.id_clase_muestra,
                    descripcion: item.descripcion,
                    estado: item.estado
                };
            } else if (section === 'tiposMuestra') {
                await this.getClasesDisponibles();
                this.formData = {
                    id_tipo_muestra: item.id_tipo_muestra,
                    id_clase_muestra: item.id_clase_muestra,
                    descripcion: item.descripcion,
                    rango_verde: item.rango_verde,
                    rango_amarillo: item.rango_amarillo,
                    rango_rojo: item.rango_rojo,
                    diametro: item.diametro || "",
                    estado: item.estado
                };
                await this.getEdades(item.id_tipo_muestra);
            } else if (section === 'observaciones') {
                this.formData = {
                    id_observacion: item.id_observacion,
                    descripcion: item.descripcion,
                    estado: item.estado
                };
            } else {
                this.formData = { ...item };
            }
            this.setMode(2);
        },
        async saveData(section) {
            showProgress();
            try {
                let sp = '';
                let params = {};

                if (section === 'obras') {
                    if (this.mode == 1) {
                        sp = 'CuadrosCalidad:Ins_Proyecto_CC';
                        params = {
                            id_proyecto: this.formData.id_proyecto,
                            id_laboratorio: this.formData.id_laboratorio,
                            codigo_laboratorio: this.formData.codigo_laboratorio,
                            usuario: GlobalVariables.username
                        };
                    } else {
                        sp = 'CuadrosCalidad:Upd_Proyecto_CC';
                        params = {
                            id_proyecto_cc: this.formData.id_proyecto_cc,
                            id_laboratorio: this.formData.id_laboratorio,
                            codigo_laboratorio: this.formData.codigo_laboratorio,
                            usuario: GlobalVariables.username
                        };
                        // Save ACC mapping if changed
                        if (this.formData.acc_project_id !== undefined) {
                            await httpFunc('/generic/genericST/CuadrosCalidad:Upd_Proyecto_ACC', {
                                id_proyecto_cc: this.formData.id_proyecto_cc,
                                acc_project_id: this.formData.acc_project_id || null,
                                acc_container_id: null,
                                usuario: GlobalVariables.username
                            });
                        }
                    }
                } else if (section === 'concreteras') {
                    // Upload logo if changed
                    let logoKey = this.formData.logo;
                    if (this.formData.logoChanged && this.formData.logoFile) {
                        logoKey = await this.uploadLogo();
                        if (!logoKey && this.formData.logoFile) {
                            hideProgress();
                            return; // Upload failed
                        }
                    }
                    sp = this.mode == 1
                        ? 'CuadrosCalidad:Ins_Concretera'
                        : 'CuadrosCalidad:Upd_Concretera';
                    params = {
                        id_concretera: this.formData.id_concretera || null,
                        nombre: this.formData.nombre,
                        logo: logoKey || null,
                        usuario: GlobalVariables.username
                    };
                } else if (section === 'laboratorios') {
                    // Upload logo if changed
                    let logoKey = this.formData.logo;
                    if (this.formData.logoChanged && this.formData.logoFile) {
                        logoKey = await this.uploadLogo();
                        if (!logoKey && this.formData.logoFile) {
                            hideProgress();
                            return; // Upload failed
                        }
                    }
                    sp = this.mode == 1
                        ? 'CuadrosCalidad:Ins_Laboratorio'
                        : 'CuadrosCalidad:Upd_Laboratorio';
                    params = {
                        id_laboratorio: this.formData.id_laboratorio || null,
                        nombre: this.formData.nombre,
                        logo: logoKey || null,
                        usuario: GlobalVariables.username
                    };
                } else if (section === 'clasesMuestra') {
                    sp = this.mode == 1
                        ? 'CuadrosCalidad:Ins_ClaseMuestra'
                        : 'CuadrosCalidad:Upd_ClaseMuestra';
                    params = {
                        id_clase_muestra: this.formData.id_clase_muestra || null,
                        descripcion: this.formData.descripcion
                    };
                } else if (section === 'tiposMuestra') {
                    sp = this.mode == 1
                        ? 'CuadrosCalidad:Ins_TipoMuestra'
                        : 'CuadrosCalidad:Upd_TipoMuestra';
                    params = {
                        id_tipo_muestra: this.formData.id_tipo_muestra || null,
                        id_clase_muestra: this.formData.id_clase_muestra,
                        descripcion: this.formData.descripcion,
                        rango_verde: this.formData.rango_verde,
                        rango_amarillo: this.formData.rango_amarillo,
                        rango_rojo: this.formData.rango_rojo,
                        diametro: this.formData.diametro || null
                    };
                } else if (section === 'observaciones') {
                    sp = this.mode == 1
                        ? 'CuadrosCalidad:Ins_Observacion'
                        : 'CuadrosCalidad:Upd_Observacion';
                    params = {
                        id_observacion: this.formData.id_observacion || null,
                        id_proyecto_cc: this.selectedProyectoCC,
                        descripcion: this.formData.descripcion,
                        usuario: GlobalVariables.username
                    };
                } else {
                    showMessage("Sección no implementada");
                    hideProgress();
                    return;
                }

                const response = await httpFunc('/generic/genericST/' + sp, params);
                if (response.isError) {
                    showMessage("Error: " + response.errorMessage);
                } else {
                    showMessage("Guardado correctamente");
                    this.setMode(0);
                    this.setMainMode(this.mainmode);
                }
            } catch (error) {
                console.error("Error al guardar:", error);
                showMessage("Error al guardar");
            }
            hideProgress();
        },
        // Request confirmation to disable a project from CC
        reqRemoveObra(id_proyecto_cc) {
            showConfirm(
                '¿Está seguro de deshabilitar esta obra de Cuadros de Calidad?',
                this.removeObra,
                null,
                id_proyecto_cc
            );
        },
        // Disable/remove a project from CC (called after confirmation)
        async removeObra(id_proyecto_cc) {
            showProgress();
            try {
                const response = await httpFunc('/generic/genericST/CuadrosCalidad:Del_Proyecto_CC', {
                    id_proyecto_cc: id_proyecto_cc,
                    usuario: GlobalVariables.username
                });
                if (response.isError) {
                    showMessage("Error: " + response.errorMessage);
                } else {
                    showMessage("Obra deshabilitada correctamente");
                    this.setMode(0);
                    this.getObras();
                }
            } catch (error) {
                console.error("Error al deshabilitar:", error);
                showMessage("Error al deshabilitar");
            }
            hideProgress();
        },
        async activateObra(id_proyecto_cc) {
            showProgress();
            try {
                const response = await httpFunc('/generic/genericST/CuadrosCalidad:Act_Proyecto_CC', {
                    id_proyecto_cc: id_proyecto_cc,
                    usuario: GlobalVariables.username
                });
                if (response.isError) {
                    showMessage("Error: " + response.errorMessage);
                } else {
                    showMessage("Obra habilitada correctamente");
                    this.setMode(0);
                    this.getObras();
                }
            } catch (error) {
                console.error("Error al habilitar:", error);
                showMessage("Error al habilitar");
            }
            hideProgress();
        },
        // Request confirmation to delete a concretera or laboratorio
        reqRemoveItem(id, section) {
            const labels = {
                concreteras: 'esta concretera',
                laboratorios: 'este laboratorio',
                clasesMuestra: 'esta clase de muestra',
                tiposMuestra: 'este tipo de muestra',
                observaciones: 'esta observación'
            };
            showConfirm(
                `¿Está seguro de deshabilitar ${labels[section] || 'este elemento'}?`,
                this.removeItem,
                null,
                { id, section }
            );
        },
        async removeItem({ id, section }) {
            showProgress();
            try {
                let sp = '';
                let params = { usuario: GlobalVariables.username };

                if (section === 'concreteras') {
                    sp = 'CuadrosCalidad:Del_Concretera';
                    params.id_concretera = id;
                } else if (section === 'laboratorios') {
                    sp = 'CuadrosCalidad:Del_Laboratorio';
                    params.id_laboratorio = id;
                } else if (section === 'clasesMuestra') {
                    sp = 'CuadrosCalidad:Del_ClaseMuestra';
                    params.id_clase_muestra = id;
                } else if (section === 'tiposMuestra') {
                    sp = 'CuadrosCalidad:Del_TipoMuestra';
                    params.id_tipo_muestra = id;
                } else if (section === 'observaciones') {
                    sp = 'CuadrosCalidad:Del_Observacion';
                    params.id_observacion = id;
                }

                const response = await httpFunc('/generic/genericST/' + sp, params);
                if (response.isError) {
                    showMessage("Error: " + response.errorMessage);
                } else {
                    showMessage("Deshabilitado correctamente");
                    this.setMode(0);
                    this.setMainMode(this.mainmode);
                }
            } catch (error) {
                console.error("Error al eliminar:", error);
                showMessage("Error al eliminar");
            }
            hideProgress();
        },
        async activateItem(id, section) {
            showProgress();
            try {
                let sp = '';
                let params = { usuario: GlobalVariables.username };

                if (section === 'concreteras') {
                    sp = 'CuadrosCalidad:Act_Concretera';
                    params.id_concretera = id;
                } else if (section === 'laboratorios') {
                    sp = 'CuadrosCalidad:Act_Laboratorio';
                    params.id_laboratorio = id;
                } else if (section === 'clasesMuestra') {
                    sp = 'CuadrosCalidad:Act_ClaseMuestra';
                    params.id_clase_muestra = id;
                } else if (section === 'tiposMuestra') {
                    sp = 'CuadrosCalidad:Act_TipoMuestra';
                    params.id_tipo_muestra = id;
                } else if (section === 'observaciones') {
                    sp = 'CuadrosCalidad:Act_Observacion';
                    params.id_observacion = id;
                }

                const response = await httpFunc('/generic/genericST/' + sp, params);
                if (response.isError) {
                    showMessage("Error: " + response.errorMessage);
                } else {
                    showMessage("Activado correctamente");
                    this.setMode(0);
                    this.setMainMode(this.mainmode);
                }
            } catch (error) {
                console.error("Error al activar:", error);
                showMessage("Error al activar");
            }
            hideProgress();
        },
        // Get available projects (not yet enabled for CC)
        async getProyectosDisponibles() {
            try {
                const response = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Proyectos_Disponibles', {
                    nombre: null
                });
                return response.data || [];
            } catch (error) {
                console.error("Error al obtener proyectos disponibles:", error);
                return [];
            }
        },
        // Get active laboratories for dropdown
        async getLaboratoriosActivos() {
            try {
                const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_Laboratorios", {
                    nombre: null
                });
                return (response.data || []).filter(l => l.is_active == 1);
            } catch (error) {
                console.error("Error al obtener laboratorios activos:", error);
                return [];
            }
        },
        // AUTODESK ACC METHODS
        async getUbicaciones() {
            if (!this.selectedProyectoCC) return;
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Ubicaciones', {
                    id_proyecto_cc: this.selectedProyectoCC
                });
                this.ubicaciones = resp.data || [];
            } catch (e) {
                console.error('Error cargando ubicaciones:', e);
                this.ubicaciones = [];
            }
            hideProgress();
        },
        async getPisos() {
            if (!this.selectedProyectoCC) return;
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Pisos', {
                    id_proyecto_cc: this.selectedProyectoCC
                });
                this.pisos = resp.data || [];
            } catch (e) {
                console.error('Error cargando pisos:', e);
                this.pisos = [];
            }
            hideProgress();
        },
        async checkAutodeskStatus() {
            try {
                const resp = await httpFunc('/autodesk/status', {});
                this.autodeskConnected = resp.connected || false;
            } catch (e) {
                this.autodeskConnected = false;
            }
        },
        connectAutodesk() {
            window.open('/autodesk/auth', '_blank');
        },
        async syncFromACC() {
            if (!this.selectedProyectoCC || this.syncingACC) return;
            this.syncingACC = true;
            showProgress();
            try {
                const resp = await httpFunc('/autodesk/sync/' + this.selectedProyectoCC, {});
                if (resp.isError) {
                    showMessage(resp.message || 'Error al sincronizar', 'error');
                } else {
                    showMessage(resp.message || 'Sincronización completada');
                    await this.getUbicaciones();
                    await this.getPisos();
                }
            } catch (e) {
                console.error('Error sincronizando desde ACC:', e);
                showMessage('Error al sincronizar con Autodesk', 'error');
            }
            this.syncingACC = false;
            hideProgress();
        },
        async getACCProjects() {
            try {
                const resp = await httpFunc('/autodesk/projects', {});
                this.accProjects = resp.data || [];
            } catch (e) {
                console.error('Error cargando proyectos ACC:', e);
                this.accProjects = [];
            }
        },
        async toggleUbicacion(id_ubicacion) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Act_Ubicacion', { id_ubicacion });
                await this.getUbicaciones();
            } catch (e) {
                console.error('Error toggling ubicacion:', e);
            }
            hideProgress();
        },
        async togglePiso(id_piso) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Act_Piso', { id_piso });
                await this.getPisos();
            } catch (e) {
                console.error('Error toggling piso:', e);
            }
            hideProgress();
        },
        // EDADES METHODS (child of TipoMuestra)
        async getEdades(id_tipo_muestra) {
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Edades', {
                    id_tipo_muestra
                });
                this.edades = resp.data || [];
            } catch (e) {
                console.error('Error cargando edades:', e);
                this.edades = [];
            }
        },
        startNewEdad() {
            this.formEdad = { id_edad_muestra: "", edad: "", color: "" };
            this.edadMode = 1;
        },
        editEdad(item) {
            this.formEdad = {
                id_edad_muestra: item.id_edad_muestra,
                edad: item.edad,
                color: item.color || ""
            };
            this.edadMode = 2;
        },
        cancelEdad() {
            this.formEdad = { id_edad_muestra: "", edad: "", color: "" };
            this.edadMode = 0;
        },
        async saveEdad() {
            showProgress();
            try {
                const sp = this.edadMode == 1
                    ? 'CuadrosCalidad:Ins_Edad'
                    : 'CuadrosCalidad:Upd_Edad';
                const params = {
                    id_edad_muestra: this.formEdad.id_edad_muestra || null,
                    id_tipo_muestra: this.formData.id_tipo_muestra,
                    edad: this.formEdad.edad,
                    color: this.formEdad.color || null
                };
                const resp = await httpFunc('/generic/genericST/' + sp, params);
                if (resp.isError) {
                    showMessage('Error: ' + resp.errorMessage);
                } else {
                    showMessage('Edad guardada correctamente');
                    this.cancelEdad();
                    await this.getEdades(this.formData.id_tipo_muestra);
                }
            } catch (e) {
                console.error('Error guardando edad:', e);
                showMessage('Error al guardar edad');
            }
            hideProgress();
        },
        reqRemoveEdad(id_edad_muestra) {
            showConfirm(
                '¿Está seguro de deshabilitar esta edad?',
                this.removeEdad,
                null,
                id_edad_muestra
            );
        },
        async removeEdad(id_edad_muestra) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Del_Edad', { id_edad_muestra });
                await this.getEdades(this.formData.id_tipo_muestra);
            } catch (e) {
                console.error('Error deshabilitando edad:', e);
            }
            hideProgress();
        },
        async activateEdad(id_edad_muestra) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Act_Edad', { id_edad_muestra });
                await this.getEdades(this.formData.id_tipo_muestra);
            } catch (e) {
                console.error('Error activando edad:', e);
            }
            hideProgress();
        },
        // FORMATO MIXER METHODS
        async getFormatosMixer() {
            if (!this.selectedProyectoCC) return;
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_FormatosMixer', {
                    id_proyecto_cc: this.selectedProyectoCC,
                    fecha_desde: this.filtroMixer.fecha_desde || null,
                    fecha_hasta: this.filtroMixer.fecha_hasta || null,
                    id_concretera: this.filtroMixer.id_concretera || null
                });
                this.mixers = resp.data || [];
            } catch (e) {
                console.error('Error cargando formatos mixer:', e);
                this.mixers = [];
            }
            hideProgress();
        },
        async loadConcretrasActivas() {
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Concreteras', { nombre: null });
                this.concretrasActivas = (resp.data || []).filter(c => c.is_active == 1);
            } catch (e) {
                console.error('Error cargando concreteras activas:', e);
                this.concretrasActivas = [];
            }
        },
        async startNewMixer() {
            showProgress();
            await this.loadConcretrasActivas();
            const now = new Date();
            const localISO = now.getFullYear() + '-' +
                String(now.getMonth()+1).padStart(2,'0') + '-' +
                String(now.getDate()).padStart(2,'0') + 'T' +
                String(now.getHours()).padStart(2,'0') + ':' +
                String(now.getMinutes()).padStart(2,'0');
            this.formMixer = {
                id_formato_mixer: "", fecha: localISO, cantidad_m3: "",
                id_concretera: "", resistencia_psi: "", resistencia_mpa: "",
                asentamiento_esperado: "", asentamiento_real: "",
                temperatura: "", recibido: "0", numero_remision: "",
                observaciones: ""
            };
            this.setMode(1);
            hideProgress();
        },
        async editMixer(item) {
            showProgress();
            await this.loadConcretrasActivas();
            this.formMixer = {
                id_formato_mixer: item.id_formato_mixer,
                fecha: item.fecha ? this.toDatetimeLocal(item.fecha) : "",
                cantidad_m3: item.cantidad_m3 || "",
                id_concretera: item.id_concretera || "",
                resistencia_psi: item.resistencia_psi || "",
                resistencia_mpa: item.resistencia_mpa || "",
                asentamiento_esperado: item.asentamiento_esperado || "",
                asentamiento_real: item.asentamiento_real || "",
                temperatura: item.temperatura || "",
                recibido: (item.recibido == '1' || item.recibido === 1) ? "1" : "0",
                numero_remision: item.numero_remision || "",
                observaciones: item.observaciones || "",
                estado: item.estado
            };
            this.setMode(2);
            hideProgress();
        },
        calcMpa() {
            const psi = parseFloat(this.formMixer.resistencia_psi);
            this.formMixer.resistencia_mpa = psi ? (psi * 0.00689476).toFixed(3) : "";
        },
        async saveMixer() {
            showProgress();
            try {
                const isNew = this.mode == 1;
                const sp = isNew ? 'CuadrosCalidad:Ins_FormatoMixer' : 'CuadrosCalidad:Upd_FormatoMixer';
                const params = {
                    id_formato_mixer: this.formMixer.id_formato_mixer || null,
                    id_proyecto_cc: this.selectedProyectoCC,
                    id_concretera: this.formMixer.id_concretera || null,
                    fecha: this.formMixer.fecha || null,
                    cantidad_m3: this.formMixer.cantidad_m3 || null,
                    resistencia_psi: this.formMixer.resistencia_psi || null,
                    asentamiento_esperado: this.formMixer.asentamiento_esperado || null,
                    asentamiento_real: this.formMixer.asentamiento_real || null,
                    temperatura: this.formMixer.temperatura || null,
                    recibido: parseInt(this.formMixer.recibido) || 0,
                    numero_remision: this.formMixer.numero_remision || null,
                    observaciones: this.formMixer.observaciones || null,
                    usuario: GlobalVariables.username
                };
                const raw = await axios.post('/generic/genericST/' + sp, params);
                const resp = raw.data;
                if (resp.isError) {
                    showMessage(resp.errorMessage);
                } else if (resp.data && resp.data.toString().startsWith('ERROR:')) {
                    showMessage(resp.data.toString().replace('ERROR:', ''));
                } else {
                    showMessage('Registro guardado correctamente');
                    this.setMode(0);
                    await this.getFormatosMixer();
                }
            } catch (e) {
                console.error('Error guardando formato mixer:', e);
                showMessage('Error al guardar');
            }
            hideProgress();
        },
        reqRemoveMixer(id) {
            showConfirm(
                '¿Está seguro de deshabilitar este registro de mixer?',
                this.removeMixer,
                null,
                id
            );
        },
        async removeMixer(id) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Del_FormatoMixer', {
                    id_formato_mixer: id,
                    usuario: GlobalVariables.username
                });
                showMessage('Registro deshabilitado');
                await this.getFormatosMixer();
            } catch (e) {
                console.error('Error deshabilitando mixer:', e);
            }
            hideProgress();
        },
        async activateMixer(id) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Act_FormatoMixer', {
                    id_formato_mixer: id,
                    usuario: GlobalVariables.username
                });
                showMessage('Registro activado');
                await this.getFormatosMixer();
            } catch (e) {
                console.error('Error activando mixer:', e);
            }
            hideProgress();
        },
        getTodayStr() {
            return new Date().toISOString().split('T')[0];
        },
        toDatetimeLocal(dateStr) {
            const d = new Date(dateStr);
            if (isNaN(d)) return "";
            return d.getFullYear() + '-' +
                String(d.getMonth() + 1).padStart(2, '0') + '-' +
                String(d.getDate()).padStart(2, '0') + 'T' +
                String(d.getHours()).padStart(2, '0') + ':' +
                String(d.getMinutes()).padStart(2, '0');
        },
        initMixerFilters() {
            const today = this.getTodayStr();
            this.filtroMixer = { fecha_desde: today, fecha_hasta: today, id_concretera: "" };
        },
        clearMixerFilters() {
            this.filtroMixer = { fecha_desde: "", fecha_hasta: "", id_concretera: "" };
            this.getFormatosMixer();
        },
        reqGenerarMuestra(item) {
            showConfirm(
                'Se generará una muestra vinculada a este mixer. ¿Continuar?',
                this.generarMuestra,
                null,
                item
            );
        },
        async generarMuestra(item) {
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericST/CuadrosCalidad:Ins_Muestra_FromMixer', {
                    id_formato_mixer: item.id_formato_mixer,
                    id_proyecto_cc: this.selectedProyectoCC,
                    id_tipo_muestra: this.tiposMuestraActivos.length > 0 ? this.tiposMuestraActivos[0].id_tipo_muestra : null,
                    fecha: null,
                    usuario: GlobalVariables.username
                });
                if (resp.isError) {
                    showMessage('Error: ' + resp.errorMessage);
                } else {
                    showMessage('Muestra #' + (resp.data || '') + ' generada correctamente');
                    await this.getFormatosMixer();
                }
            } catch (e) {
                console.error('Error generando muestra:', e);
                showMessage('Error al generar muestra');
            }
            hideProgress();
        },
        // MUESTRAS STANDALONE METHODS (mainmode 14)
        async getMuestrasStandalone() {
            if (!this.selectedProyectoCC) return;
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Muestras', {
                    id_proyecto_cc: this.selectedProyectoCC,
                    id_remision: null,
                    sin_remision: null,
                    id_tipo_muestra: this.filtroMuestraStandalone.id_tipo_muestra || null,
                    id_estado: this.filtroMuestraStandalone.id_estado || null,
                    fecha_desde: this.filtroMuestraStandalone.fecha_desde || null,
                    fecha_hasta: this.filtroMuestraStandalone.fecha_hasta || null
                });
                this.muestrasStandalone = resp.data || [];
            } catch (e) {
                console.error('Error cargando muestras:', e);
                this.muestrasStandalone = [];
            }
            hideProgress();
        },
        async editMuestraStandalone(item) {
            showProgress();
            await this.loadMuestraDropdowns();
            this.formMuestraStandalone = {
                id_muestra: item.id_muestra,
                id_tipo_muestra: item.id_tipo_muestra || "",
                id_ubicacion: item.id_ubicacion || "",
                id_piso: item.id_piso || "",
                id_concretera: item.id_concretera || "",
                id_formato_mixer: item.id_formato_mixer || "",
                numero_muestra_obra: item.numero_muestra_obra || "",
                fecha: item.fecha ? item.fecha.split('T')[0] : "",
                dia_recoleccion: item.dia_recoleccion || "",
                localizacion: item.localizacion || "",
                observaciones: item.observaciones || "",
                estado: item.estado
            };
            this.setMode(2);
            hideProgress();
        },
        async saveMuestraStandalone() {
            showProgress();
            try {
                const isNew = this.mode == 1;
                const sp = isNew ? 'CuadrosCalidad:Ins_Muestra' : 'CuadrosCalidad:Upd_Muestra';
                const params = {
                    id_muestra: this.formMuestraStandalone.id_muestra || null,
                    id_proyecto_cc: this.selectedProyectoCC,
                    id_formato_mixer: this.formMuestraStandalone.id_formato_mixer || null,
                    id_tipo_muestra: this.formMuestraStandalone.id_tipo_muestra || null,
                    id_ubicacion: this.formMuestraStandalone.id_ubicacion || null,
                    id_piso: this.formMuestraStandalone.id_piso || null,
                    id_concretera: this.formMuestraStandalone.id_concretera || null,
                    numero_muestra_obra: this.formMuestraStandalone.numero_muestra_obra || null,
                    fecha: this.formMuestraStandalone.fecha,
                    dia_recoleccion: this.formMuestraStandalone.dia_recoleccion || null,
                    localizacion: this.formMuestraStandalone.localizacion || null,
                    observaciones: this.formMuestraStandalone.observaciones || null,
                    usuario: GlobalVariables.username
                };
                const resp = await httpFunc('/generic/genericST/' + sp, params);
                if (resp.isError) {
                    showMessage('Error: ' + resp.errorMessage);
                } else {
                    showMessage('Muestra guardada correctamente');
                    this.setMode(0);
                    await this.getMuestrasStandalone();
                }
            } catch (e) {
                console.error('Error guardando muestra:', e);
                showMessage('Error al guardar');
            }
            hideProgress();
        },
        reqRemoveMuestraStandalone(id) {
            showConfirm(
                '¿Está seguro de eliminar esta muestra?',
                this.removeMuestraStandalone,
                null,
                id
            );
        },
        async removeMuestraStandalone(id) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Del_Muestra', {
                    id_muestra: id,
                    usuario: GlobalVariables.username
                });
                showMessage('Muestra eliminada');
                await this.getMuestrasStandalone();
            } catch (e) {
                console.error('Error eliminando muestra:', e);
            }
            hideProgress();
        },
        clearMuestraFilters() {
            this.filtroMuestraStandalone = { id_tipo_muestra: "", id_estado: "", fecha_desde: "", fecha_hasta: "" };
            this.getMuestrasStandalone();
        },
        getDiaRecoleccionLabel(dia) {
            const dias = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 7: 'Domingo' };
            return dias[dia] || '';
        },
        // REMISIONES METHODS
        async getRemisiones() {
            if (!this.selectedProyectoCC) return;
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Remisiones', {
                    id_proyecto_cc: this.selectedProyectoCC,
                    procesado: this.filtroRemision.procesado === "" ? null : this.filtroRemision.procesado,
                    fecha_desde: this.filtroRemision.fecha_desde || null,
                    fecha_hasta: this.filtroRemision.fecha_hasta || null
                });
                this.remisiones = resp.data || [];
            } catch (e) {
                console.error('Error cargando remisiones:', e);
                this.remisiones = [];
            }
            hideProgress();
        },
        async startNewRemision() {
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericST/CuadrosCalidad:Ins_Remision', {
                    id_proyecto_cc: this.selectedProyectoCC,
                    observaciones: null,
                    usuario: GlobalVariables.username
                });
                if (resp.isError) {
                    showMessage('Error: ' + resp.errorMessage);
                } else {
                    showMessage('Remisión creada');
                    await this.getRemisiones();
                }
            } catch (e) {
                console.error('Error creando remision:', e);
                showMessage('Error al crear remisión');
            }
            hideProgress();
        },
        async openRemision(item) {
            showProgress();
            this.formRemision = {
                id_remision: item.id_remision,
                consecutivo: item.consecutivo,
                observaciones: item.observaciones || "",
                fecha_envio: item.fecha_envio ? item.fecha_envio.split('T')[0] : "",
                procesado: item.procesado == '1' || item.procesado === true,
                estado_remision: item.estado_remision
            };
            await this.loadRemisionDetail(item.id_remision);
            await this.loadMuestraDropdowns();
            this.setMode(2);
            hideProgress();
        },
        async loadRemisionDetail(id_remision) {
            try {
                const [assigned, available] = await Promise.all([
                    httpFunc('/generic/genericDT/CuadrosCalidad:Get_Muestras', {
                        id_proyecto_cc: this.selectedProyectoCC,
                        id_remision: id_remision,
                        sin_remision: null, id_tipo_muestra: null, id_estado: null,
                        fecha_desde: null, fecha_hasta: null
                    }),
                    httpFunc('/generic/genericDT/CuadrosCalidad:Get_Muestras', {
                        id_proyecto_cc: this.selectedProyectoCC,
                        id_remision: null,
                        sin_remision: 1, id_tipo_muestra: null, id_estado: null,
                        fecha_desde: null, fecha_hasta: null
                    })
                ]);
                this.muestrasRemision = assigned.data || [];
                this.muestrasDisponibles = available.data || [];
            } catch (e) {
                console.error('Error cargando detalle remision:', e);
            }
        },
        async loadMuestraDropdowns() {
            try {
                const [tipos, ubis, pisos, concs] = await Promise.all([
                    httpFunc('/generic/genericDT/CuadrosCalidad:Get_TiposMuestra', { descripcion: null }),
                    httpFunc('/generic/genericDT/CuadrosCalidad:Get_Ubicaciones', { id_proyecto_cc: this.selectedProyectoCC }),
                    httpFunc('/generic/genericDT/CuadrosCalidad:Get_Pisos', { id_proyecto_cc: this.selectedProyectoCC }),
                    httpFunc('/generic/genericDT/CuadrosCalidad:Get_Concreteras', { nombre: null })
                ]);
                this.tiposMuestraActivos = (tipos.data || []).filter(t => t.is_active == 1);
                this.ubicacionesActivas = (ubis.data || []).filter(u => u.is_active == '1');
                this.pisosActivos = (pisos.data || []).filter(p => p.is_active == '1');
                this.concretrasActivas = (concs.data || []).filter(c => c.is_active == 1);
            } catch (e) {
                console.error('Error cargando dropdowns muestra:', e);
            }
        },
        async assignMuestra(id_muestra) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Assign_Muestra_Remision', {
                    id_muestra: id_muestra,
                    id_remision: this.formRemision.id_remision,
                    accion: 'assign',
                    usuario: GlobalVariables.username
                });
                await this.loadRemisionDetail(this.formRemision.id_remision);
            } catch (e) {
                console.error('Error asignando muestra:', e);
            }
            hideProgress();
        },
        async unassignMuestra(id_muestra) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Assign_Muestra_Remision', {
                    id_muestra: id_muestra,
                    id_remision: this.formRemision.id_remision,
                    accion: 'unassign',
                    usuario: GlobalVariables.username
                });
                await this.loadRemisionDetail(this.formRemision.id_remision);
            } catch (e) {
                console.error('Error desasignando muestra:', e);
            }
            hideProgress();
        },
        async saveRemision() {
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericST/CuadrosCalidad:Upd_Remision', {
                    id_remision: this.formRemision.id_remision,
                    fecha_envio: this.formRemision.fecha_envio || null,
                    observaciones: this.formRemision.observaciones || null,
                    usuario: GlobalVariables.username
                });
                if (resp.isError) {
                    showMessage('Error: ' + resp.errorMessage);
                } else {
                    showMessage('Remisión actualizada');
                }
            } catch (e) {
                console.error('Error guardando remision:', e);
                showMessage('Error al guardar');
            }
            hideProgress();
        },
        reqProcesarRemision() {
            showConfirm(
                '¿Está seguro de procesar esta remisión? Esta acción es irreversible.',
                this.procesarRemision,
                null,
                this.formRemision.id_remision
            );
        },
        async procesarRemision(id_remision) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Procesar_Remision', {
                    id_remision: id_remision,
                    usuario: GlobalVariables.username
                });
                showMessage('Remisión procesada');
                this.setMode(0);
                await this.getRemisiones();
            } catch (e) {
                console.error('Error procesando remision:', e);
                showMessage('Error al procesar');
            }
            hideProgress();
        },
        reqRemoveRemision(id) {
            showConfirm(
                '¿Está seguro de eliminar esta remisión? Las muestras asignadas serán liberadas.',
                this.removeRemision,
                null,
                id
            );
        },
        async removeRemision(id) {
            showProgress();
            try {
                await httpFunc('/generic/genericST/CuadrosCalidad:Del_Remision', {
                    id_remision: id,
                    usuario: GlobalVariables.username
                });
                showMessage('Remisión eliminada');
                this.setMode(0);
                await this.getRemisiones();
            } catch (e) {
                console.error('Error eliminando remision:', e);
            }
            hideProgress();
        },
        clearRemisionFilters() {
            this.filtroRemision = { procesado: "", fecha_desde: "", fecha_hasta: "" };
            this.getRemisiones();
        },
        // EXCEL EXPORT METHODS
        async loadFilterDropdowns() {
            try {
                const [tipos, ubis, pisos] = await Promise.all([
                    httpFunc('/generic/genericDT/CuadrosCalidad:Get_TiposMuestra', { descripcion: null }),
                    httpFunc('/generic/genericDT/CuadrosCalidad:Get_Ubicaciones', { id_proyecto_cc: this.selectedProyectoCC }),
                    httpFunc('/generic/genericDT/CuadrosCalidad:Get_Pisos', { id_proyecto_cc: this.selectedProyectoCC })
                ]);
                this.tiposMuestraActivos = (tipos.data || []).filter(t => t.is_active == 1);
                this.ubicacionesActivas = (ubis.data || []).filter(u => u.is_active == '1');
                this.pisosActivos = (pisos.data || []).filter(p => p.is_active == '1');
            } catch (e) {
                console.error('Error cargando dropdowns:', e);
            }
        },
        async exportExcel() {
            showProgress();
            try {
                const resp = await httpFunc('/generic/exportDataSP/CuadrosCalidad:Export_Muestras', {
                    id_proyecto_cc: this.selectedProyectoCC,
                    id_tipo_muestra: this.filtroExport.id_tipo_muestra || null,
                    id_ubicacion: this.filtroExport.id_ubicacion || null,
                    id_piso: this.filtroExport.id_piso || null,
                    fecha_desde: this.filtroExport.fecha_desde || null,
                    fecha_hasta: this.filtroExport.fecha_hasta || null
                });
                if (resp.data) {
                    window.open('./docs/' + resp.data);
                } else {
                    showMessage('No se generó el archivo');
                }
            } catch (e) {
                console.error('Error exportando:', e);
                showMessage('Error al exportar');
            }
            hideProgress();
        },
        clearExportFilters() {
            this.filtroExport = { id_tipo_muestra: "", id_ubicacion: "", id_piso: "", fecha_desde: "", fecha_hasta: "" };
        },
        // DASHBOARD METHODS
        async getDashboardResumen() {
            if (!this.selectedProyectoCC) return;
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Dashboard_Resumen', {
                    id_proyecto_cc: this.selectedProyectoCC
                });
                this.dashboardResumen = (resp.data && resp.data[0]) || {};
            } catch (e) {
                console.error('Error cargando dashboard resumen:', e);
                this.dashboardResumen = {};
            }
            hideProgress();
        },
        async getDashboardResultados() {
            if (!this.selectedProyectoCC) return;
            showProgress();
            try {
                const resp = await httpFunc('/generic/genericDT/CuadrosCalidad:Get_Dashboard_Resultados', {
                    id_proyecto_cc: this.selectedProyectoCC,
                    id_tipo_muestra: this.filtroDashboard.id_tipo_muestra || null,
                    id_ubicacion: this.filtroDashboard.id_ubicacion || null,
                    id_piso: this.filtroDashboard.id_piso || null,
                    fecha_desde: this.filtroDashboard.fecha_desde || null,
                    fecha_hasta: this.filtroDashboard.fecha_hasta || null
                });
                this.dashboardResultados = resp.data || [];
                this.renderDashboardChart();
            } catch (e) {
                console.error('Error cargando resultados:', e);
                this.dashboardResultados = [];
            }
            hideProgress();
        },
        renderDashboardChart() {
            const canvas = document.getElementById('dashboardChart');
            if (!canvas) return;
            if (this.dashboardChart) this.dashboardChart.destroy();

            const data = this.dashboardResultados;
            if (data.length === 0) return;

            const labels = data.map(d => (d.numero_muestra_obra || d.id_muestra) + ' (' + d.edad + 'd)');
            const valores = data.map(d => parseFloat(d.porcentaje) || 0);
            const rangoVerde = data.length > 0 ? parseFloat(data[0].rango_verde) || 100 : 100;
            const rangoAmarillo = data.length > 0 ? parseFloat(data[0].rango_amarillo) || 80 : 80;
            const rangoRojo = data.length > 0 ? parseFloat(data[0].rango_rojo) || 60 : 60;

            const bgColors = valores.map(v => {
                if (v >= rangoVerde) return 'rgba(40, 167, 69, 0.7)';
                if (v >= rangoAmarillo) return 'rgba(218, 165, 32, 0.7)';
                return 'rgba(220, 53, 69, 0.7)';
            });

            this.dashboardChart = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: '% vs Diseño',
                        data: valores,
                        backgroundColor: bgColors
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        annotation: {
                            annotations: {
                                lineVerde: { type: 'line', yMin: rangoVerde, yMax: rangoVerde, borderColor: '#28a745', borderWidth: 2, borderDash: [5, 5], label: { display: true, content: 'Verde ' + rangoVerde + '%', position: 'end' } },
                                lineAmarillo: { type: 'line', yMin: rangoAmarillo, yMax: rangoAmarillo, borderColor: '#DAA520', borderWidth: 2, borderDash: [5, 5], label: { display: true, content: 'Amarillo ' + rangoAmarillo + '%', position: 'end' } },
                                lineRojo: { type: 'line', yMin: rangoRojo, yMax: rangoRojo, borderColor: '#dc3545', borderWidth: 2, borderDash: [5, 5], label: { display: true, content: 'Rojo ' + rangoRojo + '%', position: 'end' } }
                            }
                        }
                    },
                    scales: { y: { beginAtZero: true, title: { display: true, text: '% vs Diseño' } } }
                }
            });
        },
        exportDashboardChart() {
            const canvas = document.getElementById('dashboardChart');
            if (!canvas) return;
            const link = document.createElement('a');
            link.download = 'dashboard_cuadros_calidad.png';
            link.href = canvas.toDataURL();
            link.click();
        },
        clearDashboardFilters() {
            this.filtroDashboard = { id_tipo_muestra: "", id_ubicacion: "", id_piso: "", fecha_desde: "", fecha_hasta: "" };
            this.getDashboardResumen();
        },
        // LOGO HANDLING METHODS
        previewLogo(event) {
            const file = event.target.files[0];
            if (!file) return;

            // Validate file type
            if (!file.type.startsWith('image/')) {
                showMessage("Error: El archivo debe ser una imagen");
                return;
            }

            // Validate file size (2MB max)
            if (file.size > 2 * 1024 * 1024) {
                showMessage("Error: El archivo debe ser menor a 2MB");
                return;
            }

            this.formData.logoFile = file;
            this.formData.logoChanged = true;

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                this.formData.logoPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        handleLogoDrop(event) {
            const file = event.dataTransfer.files[0];
            if (!file) return;

            if (!file.type.startsWith('image/')) {
                showMessage("Error: El archivo debe ser una imagen");
                return;
            }

            if (file.size > 2 * 1024 * 1024) {
                showMessage("Error: El archivo debe ser menor a 2MB");
                return;
            }

            this.formData.logoFile = file;
            this.formData.logoChanged = true;

            const reader = new FileReader();
            reader.onload = (e) => {
                this.formData.logoPreview = e.target.result;
            };
            reader.readAsDataURL(file);
        },
        removeLogo() {
            this.formData.logoPreview = "";
            this.formData.logoFile = null;
            this.formData.logoChanged = true;
            this.formData.logo = "";
        },
        async uploadLogo() {
            if (!this.formData.logoFile) return null;

            try {
                const form = new FormData();
                form.append(this.formData.logoFile.name, this.formData.logoFile);

                // Step 1: Upload to temp storage
                const uploadResponse = await httpFunc("/file/upload", form);
                if (uploadResponse.isError) {
                    showMessage("Error: " + uploadResponse.errorMessage);
                    return null;
                }

                // Step 2: Upload to S3
                const s3Response = await httpFunc("/file/S3upload", uploadResponse.data);
                if (s3Response.isError) {
                    showMessage("Error: " + s3Response.errorMessage);
                    return null;
                }

                // Return the S3 key
                return s3Response.data[0]?.CacheKey || null;
            } catch (error) {
                console.error("Error al subir logo:", error);
                showMessage("Error al subir el logo");
                return null;
            }
        }
    }
};
