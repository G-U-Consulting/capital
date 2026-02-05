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
                nombre: "",
                descripcion: "",
                politica_recoleccion: 0
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
                // TODO: Implementar llamada al stored procedure
                // const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_Concreteras", this.filtroConcreteras);
                // this.concreteras = response.data || [];
                this.concreteras = [];
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
            this.formData = { id: "", nombre: "", descripcion: "" };
            this.setMode(1);
        },
        selectItem(item, section) {
            this.currentSection = section;
            this.formData = { ...item };
            this.setMode(2);
        },
        async saveData(section) {
            showProgress();
            try {
                let sp = '';
                let params = {};

                if (section === 'obras') {
                    // Obras uses parametrizacion_obra_cc
                    sp = this.mode == 1
                        ? 'CuadrosCalidad:Ins_Proyecto_CC'
                        : 'CuadrosCalidad:Upd_Proyecto_CC';
                    params = {
                        id_proyecto: this.formData.id_proyecto,
                        politica_recoleccion: this.formData.politica_recoleccion || 0,
                        usuario: GlobalVariables.username
                    };
                } else {
                    // TODO: Implement other sections (concreteras, laboratorios, etc.)
                    alert("Sección no implementada");
                    hideProgress();
                    return;
                }

                const response = await httpFunc('/generic/genericST/' + sp, params);
                if (response.isError) {
                    alert("Error: " + response.errorMessage);
                } else {
                    alert("Guardado correctamente");
                    this.setMode(0);
                    this.setMainMode(this.mainmode);
                }
            } catch (error) {
                console.error("Error al guardar:", error);
                alert("Error al guardar");
            }
            hideProgress();
        },
        // Disable/remove a project from CC
        async removeObra(id_proyecto) {
            if (!confirm('¿Está seguro de deshabilitar esta obra de Cuadros de Calidad?')) return;
            showProgress();
            try {
                const response = await httpFunc('/generic/genericST/CuadrosCalidad:Del_Proyecto_CC', {
                    id_proyecto: id_proyecto,
                    usuario: GlobalVariables.username
                });
                if (response.isError) {
                    alert("Error: " + response.errorMessage);
                } else {
                    alert("Obra deshabilitada correctamente");
                    this.getObras();
                }
            } catch (error) {
                console.error("Error al deshabilitar:", error);
                alert("Error al deshabilitar");
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
        }
    }
};
