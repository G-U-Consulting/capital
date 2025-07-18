export default {
    data() {
        return {
            mainmode: 0,
            ruta: [],
            proyecto: null,            
            fileSelected: null,
            lateralMenu: false,
            showList: true
        };
    },
    async mounted() {
        GlobalVariables.miniModuleCallback = this.miniModuleCallback;
        
        await this.setMainMode('EdicionProyectos');
    },
    unmounted(){
        GlobalVariables.miniModuleCallback = null;
    },
    methods: {
        async setMainMode(mode) {
            if(this.mainmode == mode && mode != 'EdicionProyectos')return;
            this.ruta = [];
            this.pushRuta("Proyectos", 0);
            if(this.proyecto != null)
                this.pushRuta(this.proyecto["nombre"], 2);
            this.miniModule = await GlobalVariables.loadMiniModule(mode, this.proyecto, "#projectsMainContent");
            this.mainmode = mode;
            return;
        },
        pushRuta(text, clickMode) {
            const existe = this.ruta.find(r => r.clickMode === clickMode);
            if (!existe) {
                this.ruta.push({ text, clickMode });
            }
        },
        
        selRuta(item) {
            if (this.miniModule.setMode && item.clickMode != null) {
                const index = this.ruta.findIndex(r => r.clickMode === item.clickMode);
                if (index === -1 || index === this.ruta.length - 1) return;
                this.ruta.splice(index + 1);
                this.miniModule.setMode(item.clickMode);
            }
        },

        async miniModuleCallback(type, data){
            if(type == "SartProjectModule"){
                this.lateralMenu = false;
                this.proyecto = null;
            } else if(type == "SelectedProject"){
                this.lateralMenu = true;
                this.proyecto = data;
                if(this.ruta.length < 2)
                    this.pushRuta(this.proyecto["nombre"], 0);
                //TODO Quitar
                //this.setMainMode("Unidades");
            } else if(type == "NewProject"){
                this.pushRuta("Nuevo proyecto", 1);
                this.proyecto = null;
            } else if (type == "ImagenesVideos") {
                this.lateralMenu = true;
                this.proyecto = data;
                if (this.ruta.length < 3)
                this.pushRuta("Imágenes y Videos", 1);
            }else if(type == "OpenDocs"){
                this.pushRuta("Documentación", 3);
                return this.proyecto;
            }else if(type == "Bancos"){
                this.pushRuta("Bancos", 4);
                return this.proyecto;
            }else if(type == "Rotafolio"){
                this.pushRuta("Rotafolio", 5);
                return this.proyecto;
            }else if(type == "Recorridos"){
                this.pushRuta("Recorridos", 6);
                return this.proyecto;
            }else if(type == "ProcesoNegocio"){
                this.pushRuta("Proceso de Negocio", 7);
                return this.proyecto;
            }else if(type == "Clientes"){
                this.pushRuta("Clientes", 8);
                return this.proyecto;
            }else if(type == "MisTareas"){
                this.pushRuta("Mis Tareas", 9)
                return this.proyecto;
            }else if(type == "MiCalendario"){
                this.pushRuta("Mi Calendario", 10)
                return this.proyecto;
            }
            else if(type == "ToggleLateralMenu") this.lateralMenu = !this.lateralMenu;
        },
        async handleFileUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.fileSelected = file;
            }
        },
        async removeFile() {
            this.fileSelected = null;
        },
        toggleList() {
            this.showList = !this.showList;
        }
    }
};
