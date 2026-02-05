export default {
    data() {
        return {
            mainmode: 1,
            mode: 0,
            ruta: [],
            // Data arrays for each section
            obras: [],
            proyectosDisponibles: [],
            concreteras: [],
            laboratorios: [],
            clasesMuestra: [],
            tiposMuestra: [],
            // Filters for each section
            filtroObras: { nombre: "" },
            filtroConcreteras: { nombre: "" },
            filtroLaboratorios: { nombre: "" },
            filtroClasesMuestra: { nombre: "" },
            filtroTiposMuestra: { nombre: "" },
            // Form data
            formData: {
                id: "",
                id_proyecto: "",
                id_concretera: "",
                nombre: "",
                descripcion: "",
                politica_recoleccion: 0,
                logo: "",
                logoPreview: "",
                logoFile: null,
                logoChanged: false
            },
            currentSection: ""
        }
    },
    async mounted() {
        this.setMainMode(1);
    },
    methods: {
        getMainModeTitle() {
            const titles = {
                1: "Selección de Obras",
                2: "Concretera",
                3: "Laboratorio",
                4: "Clase Muestra",
                5: "Tipo Muestra"
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
                case 1: await this.getObras(); break;
                case 2: await this.getConcreteras(); break;
                case 3: await this.getLaboratorios(); break;
                case 4: await this.getClasesMuestra(); break;
                case 5: await this.getTiposMuestra(); break;
            }
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
                // TODO: Implementar llamada al stored procedure
                // const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_Laboratorios", this.filtroLaboratorios);
                // this.laboratorios = response.data || [];
                this.laboratorios = [];
            } catch (error) {
                console.error("Error al obtener laboratorios:", error);
            }
            hideProgress();
        },
        // CLASES MUESTRA
        async getClasesMuestra() {
            showProgress();
            try {
                // TODO: Implementar llamada al stored procedure
                // const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_ClasesMuestra", this.filtroClasesMuestra);
                // this.clasesMuestra = response.data || [];
                this.clasesMuestra = [];
            } catch (error) {
                console.error("Error al obtener clases de muestra:", error);
            }
            hideProgress();
        },
        // TIPOS MUESTRA
        async getTiposMuestra() {
            showProgress();
            try {
                // TODO: Implementar llamada al stored procedure
                // const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_TiposMuestra", this.filtroTiposMuestra);
                // this.tiposMuestra = response.data || [];
                this.tiposMuestra = [];
            } catch (error) {
                console.error("Error al obtener tipos de muestra:", error);
            }
            hideProgress();
        },
        // OBRAS SPECIFIC METHODS
        async startNewObra() {
            showProgress();
            this.proyectosDisponibles = await this.getProyectosDisponibles();
            this.formData = {
                id_proyecto: "",
                nombre: "",
                politica_recoleccion: 0
            };
            this.currentSection = 'obras';
            this.setMode(1);
            hideProgress();
        },
        editObra(item) {
            this.formData = {
                id_proyecto: item.id_proyecto,
                nombre: item.nombre,
                politica_recoleccion: item.politica_recoleccion
            };
            this.currentSection = 'obras';
            this.setMode(2);
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
        startNew(section) {
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
            } else {
                this.formData = { id: "", nombre: "", descripcion: "" };
            }
            this.setMode(1);
        },
        selectItem(item, section) {
            this.currentSection = section;
            if (section === 'concreteras') {
                this.formData = {
                    id_concretera: item.id_concretera,
                    nombre: item.nombre,
                    logo: item.logo || "",
                    logoPreview: item.logo ? '/file/S3get/' + item.logo : "",
                    logoFile: null,
                    logoChanged: false
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
                    // Obras uses parametrizacion_obra_cc (logo comes from main project system)
                    sp = this.mode == 1
                        ? 'CuadrosCalidad:Ins_Proyecto_CC'
                        : 'CuadrosCalidad:Upd_Proyecto_CC';
                    params = {
                        id_proyecto: this.formData.id_proyecto,
                        politica_recoleccion: this.formData.politica_recoleccion || 0,
                        usuario: GlobalVariables.username
                    };
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
                } else {
                    // TODO: Implement other sections (laboratorios, etc.)
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
        reqRemoveObra(id_proyecto) {
            showConfirm(
                '¿Está seguro de deshabilitar esta obra de Cuadros de Calidad?',
                this.removeObra,
                null,
                id_proyecto
            );
        },
        // Disable/remove a project from CC (called after confirmation)
        async removeObra(id_proyecto) {
            showProgress();
            try {
                const response = await httpFunc('/generic/genericST/CuadrosCalidad:Del_Proyecto_CC', {
                    id_proyecto: id_proyecto,
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
                return s3Response.data[0]?.llave || null;
            } catch (error) {
                console.error("Error al subir logo:", error);
                showMessage("Error al subir el logo");
                return null;
            }
        }
    }
};
