export default {
    data() {
        return {
            mainmode: 0,
            ruta: [],
            proyecto: null,
            fileSelected: null,
            lateralMenu: false,
            showList: window.innerWidth > 1424,
            ocultarLayout: true,
        };
    },

    async mounted() {
        GlobalVariables.miniModuleCallback = this.miniModuleCallback;
        const params = new URLSearchParams(GlobalVariables.urlParams);
        if (!params.get('SubLoc')) {
            await this.setMainMode('InicioProyecto');
            this.ocultarLayout = false;
            return;
        }
        const subLoc = params.get('SubLoc');
        const id_proyecto = params.get('id_proyecto');
        const id_cliente = params.get('id_cliente');
        this.id_cotizacion = params.get('id_cotizacion');
        this.id_cliente = id_cliente;
        this.setProyecto(id_proyecto, subLoc);
    },

    unmounted() {
        GlobalVariables.miniModuleCallback = null;
    },

    methods: {
        pushRuta(text, clickMode) {
            const existe = this.ruta.find(r => r.clickMode === clickMode);
            if (!existe) {
                this.ruta.push({ text, clickMode });
            }
        },

        setRuta(subpath) {
            this.ruta = [{
                text: 'ZA',
                action: null,
            }, {
                text: 'Proyectos',
                action: () => {
                    this.lateralMenu = false;
                    this.proyecto = null;
                    this.setMainMode('InicioProyecto');
                    this.setRuta([]);
                }
            }, ...subpath];
        },

        async setProyecto(id,subLoc) {
            var resp = await httpFunc("/generic/genericDT/Proyectos:Get_Proyecto", { "id_proyecto": id });
            this.proyecto = resp.data[0];
            this.setMainMode(subLoc);
            GlobalVariables.id_proyecto = id;
            GlobalVariables.proyecto = this.proyecto;
            GlobalVariables.id_cliente = this.id_cliente;
            GlobalVariables.id_cotizacion = this.id_cotizacion;
        },

        async setMainMode(mode, sel = false) {

            if (GlobalVariables.ventanaUnidades && !GlobalVariables.ventanaUnidades.closed) {
                GlobalVariables.ventanaUnidades.close();
                GlobalVariables.ventanaUnidades = null;
            }

            if (this.mainmode === mode && mode !== 'InicioProyecto') return;

            this.mainmode = mode;
            this.miniModule = await GlobalVariables.loadMiniModule(mode, this.proyecto, "#projectsMainContent");

            let ruta = [];
            if (mode !== 'InicioProyecto' || sel) {
                ruta.push({ text: this.getPathName(mode), action: () => {} });
            }
            this.setRuta(ruta);
        },

        getPathName(mode) {
            if (mode === 'EdicionProyectos') return `${this.proyecto.nombre} / Edición Proyecto`;
            if (mode === 'Clientes') return `${this.proyecto.nombre} / Clientes`;
            if (mode === 'Medios') return `${this.proyecto.nombre} / Imágenes y Vídeos`;
            if (mode === 'Documentacion') return `${this.proyecto.nombre} / Documentación`;
            if (mode === 'Bancos') return `${this.proyecto.nombre} / Bancos`;
            if (mode === 'Recorridos') return `${this.proyecto.nombre} / Recorridos`;
            if (mode === 'Rotafolio') return `${this.proyecto.nombre} / Rotafolio`;
            if (mode === 'ProcesoNegocio') return `${this.proyecto.nombre} / Proceso Negocio`;
            if (mode === 'MiCalendario') return `${this.proyecto.nombre} / Calendario`;
            return '';
        },

        async miniModuleCallback(type, data) {
            switch (type) {
                case "SartProjectModule":
                    this.lateralMenu = false;
                    this.proyecto = null;
                    break;

                case "SelectedProject":
                    this.lateralMenu = true;
                    this.proyecto = data;
                    if (this.ruta.length <= 2) this.pushRuta(this.proyecto["nombre"], 0);
                    break;

                case "NewProject":
                    this.pushRuta("Nuevo Proyecto", 1);
                    this.proyecto = null;
                    break;

                case "ImagenesVideos":
                    this.pushRuta("Imagenes y Videos", 2);
                    return this.proyecto;
                    break;

                case "OpenDocs":
                    this.pushRuta("Documentación", 3);
                    return this.proyecto;

                case "Bancos":
                    this.pushRuta("Bancos", 4);
                    return this.proyecto;

                case "Rotafolio":
                    this.pushRuta("Rotafolio", 5);
                    return this.proyecto;

                case "Recorridos":
                    this.pushRuta("Recorridos", 6);
                    return this.proyecto;

                case "ProcesoNegocio":
                    this.pushRuta("Proceso de Negocio", 7);
                    return this.proyecto;

                case "Clientes":
                    this.pushRuta("Clientes", 8);
                    return this.proyecto;

                case "MisTareas":
                    this.pushRuta("Mis Tareas", 9);
                    return this.proyecto;

                case "MiCalendario":
                    this.pushRuta("Mi Calendario", 10);
                    return this.proyecto;

                case "ToggleLateralMenu":
                    this.lateralMenu = !this.lateralMenu;
                    break;

                case "SetRuta":
                    this.setRuta(data);
                    break;
            }
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
