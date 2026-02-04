export default {
    data() {
        return {
            mainmode: 1,
            mode: 0,
            ruta: [],
            // Data arrays for each section
            obras: [],
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
                nombre: "",
                descripcion: ""
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
        // OBRAS
        async getObras() {
            showProgress();
            try {
                // TODO: Implementar llamada al stored procedure
                // const response = await httpFunc("/generic/genericDT/CuadrosCalidad:Get_Obras", this.filtroObras);
                // this.obras = response.data || [];
                this.obras = [];
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
                // TODO: Implementar llamada al stored procedure según sección
                // const spMap = {
                //     'obras': { ins: 'CuadrosCalidad:Ins_Obra', upd: 'CuadrosCalidad:Upd_Obra' },
                //     'concreteras': { ins: 'CuadrosCalidad:Ins_Concretera', upd: 'CuadrosCalidad:Upd_Concretera' },
                //     'laboratorios': { ins: 'CuadrosCalidad:Ins_Laboratorio', upd: 'CuadrosCalidad:Upd_Laboratorio' },
                //     'clasesMuestra': { ins: 'CuadrosCalidad:Ins_ClaseMuestra', upd: 'CuadrosCalidad:Upd_ClaseMuestra' },
                //     'tiposMuestra': { ins: 'CuadrosCalidad:Ins_TipoMuestra', upd: 'CuadrosCalidad:Upd_TipoMuestra' }
                // };
                // const sp = this.mode == 1 ? spMap[section].ins : spMap[section].upd;
                // await httpFunc(`/generic/genericST/${sp}`, this.formData);
                alert("Guardado correctamente");
                this.setMode(0);
                // Reload data
                this.setMainMode(this.mainmode);
            } catch (error) {
                console.error("Error al guardar:", error);
                alert("Error al guardar");
            }
            hideProgress();
        }
    }
};
