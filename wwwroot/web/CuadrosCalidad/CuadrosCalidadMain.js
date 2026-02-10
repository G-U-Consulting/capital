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
                9: "Observaciones"
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
