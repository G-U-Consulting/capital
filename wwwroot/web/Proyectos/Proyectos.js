export default {
    data() {
        return {
            mainmode: 0,
            ruta: [],
            proyecto: null,            
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
            lateralMenu: false,
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
            if (mode == 1) {
                
            }else if(mode == 2){
                this.selectProject(this.editObjProyecto)
                this.mainmode = 1;
                this.mode = 2;
                this.setRuta();
                return;
            }
            else if(mode == 4){
                this.sincoCompanies();
            }
            else if(mode == 5){
                var resp = await httpFunc("/generic/genericDS/General:Get_Informes", {});
                resp = resp.data;
                this.informes = resp[0];
                this.cargues = resp[1];

            }
            
            this.mainmode = mode;
            this.mode = 0;
            this.setRuta();
        },
        pushRuta(text, clickMode){
            this.ruta.push({text: text, clickMode: clickMode});
        },
        selRuta(item){
            if(this.miniModule.setMode != null && item.clickMode != null){
                var i = 0;
                for(; i < this.ruta.length; i++)
                    if(item == this.ruta[i])break;
                if(i == this.ruta.length - 1) return;
                this.ruta.splice(i + 1, this.ruta.length - i - 1);
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
                    this.pushRuta(this.proyecto["nombre"], 2);
                //TODO Quitar
                //this.setMainMode("Unidades");
            } else if(type == "NewProject"){
                this.pushRuta("Nuevo proyecto", 1);
                this.proyecto = null;
            }else if(type == "StartMediaMdule"){
                this.pushRuta("Imágenes y Videos", 1);
            }else if(type == "OpenDocs"){
                this.pushRuta("Documentación", 1);
                return this.proyecto;
            }else if(type == "Bancos"){
                this.pushRuta("Bancos", 1);
                return this.proyecto;
            }else if(type == "Rotafolio"){
                this.pushRuta("Rotafolio", 1);
                return this.proyecto;
            }else if(type == "Recorridos"){
                this.pushRuta("Recorridos", 1);
                return this.proyecto;
            }else if(type == "ProcesoNegocio"){
                this.pushRuta("Proceso de Negocio", 1);
                return this.proyecto;
            }else if(type == "ToggleLateralMenu") this.lateralMenu = !this.lateralMenu;
            
        },
        
        async onUpdate(lista) {
            console.log(lista);
            this.mode = 2;
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
        
        // async getMainPath() {
        //     let path = {};
        //     if (this.mainmode == 1) path.text = "Información Básica";
        //     if (this.mainmode == 2) path.text = "Rotafolio de Proyectos";
        //     if (this.mainmode == 3) path.text = "Unidades";
        //     if (this.mainmode == 4) path.text = "Informes y Cargues";
        //     path.action = () => this.setMode(0);
        //     return path;
        // },
    }
};
