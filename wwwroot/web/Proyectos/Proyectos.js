export default {
    data() {
        return {
            mainmode: 0,
            ruta: [],
            salas: [],
            sala: {},
            proyecto: null,
            fileSelected: null,
            lateralMenu: false,
            showList: window.innerWidth > 1424,
            ocultarLayout: true,
        };
    },

    async mounted() {
        GlobalVariables.miniModuleCallback = this.miniModuleCallback;
        GlobalVariables.proyectosApp = this;
        const params = new URLSearchParams(GlobalVariables.urlParams);
        if (!params.get('SubLoc')) {
            delete GlobalVariables.isSubLoc;
            await this.setMainMode('InicioProyecto');
            this.ocultarLayout = false;
            this.setRuta([]);
            return;
        }
        GlobalVariables.isSubLoc = true;
        const subLoc = params.get('SubLoc');
        const id_proyecto = params.get('id_proyecto');
        const id_cliente = params.get('id_cliente');
        this.id_cotizacion = params.get('id_cotizacion');
        GlobalVariables.id_sala_venta = params.get('id_sala_venta');
        this.cotizacion = params.get('cotizacion');
        this.id_cliente = id_cliente;
        this.setProyecto(id_proyecto, subLoc);
    },

    unmounted() {
        GlobalVariables.miniModuleCallback = null;
        GlobalVariables.proyectosApp = null;
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
                action: () =>
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
            }, {
                text: 'Proyectos',
                action: async () => {
                    this.proyecto = null;
                    this.lateralMenu = false;
                    await this.setMainMode('InicioProyecto');
                    this.setRuta([]);
                    if (this.miniModule && this.miniModule.setMode) {
                        this.miniModule.setMode(0);
                    }
                }
            }, ...subpath];
        },

        async setProyecto(id, subLoc) {
            var resp = await httpFunc("/generic/genericDT/Proyectos:Get_Proyecto", { "id_proyecto": id });
            this.proyecto = resp.data[0];
            this.setMainMode(subLoc);
            GlobalVariables.id_proyecto = id;
            GlobalVariables.proyecto = this.proyecto;
            GlobalVariables.id_cliente = this.id_cliente;
            GlobalVariables.id_cotizacion = this.id_cotizacion;
            GlobalVariables.cotizacion = this.cotizacion;
        },

        async selSalaVenta() {
            showProgress();
            this.salas = (await httpFunc("/generic/genericDT/Proyectos:Get_Salas", { "id_proyecto": this.proyecto.id_proyecto })).data;
            hideProgress();
            if (GlobalVariables.sala)
                this.sala = this.salas.find(s => s.id_sala_venta == GlobalVariables.sala.id_sala_venta) || {};
            else this.sala = {};
            let $modal = document.getElementById('modalOverlaySala');
            $modal && ($modal.style.display = 'flex');
        },
        setSalaSesion() {
            GlobalVariables.sala = this.sala;
            let $modal = document.getElementById('modalOverlaySala');
            $modal && ($modal.style.display = 'none');
            this.setMainMode('ProcesoNegocio');
        },
        closeModal(id) {
            document.getElementById(id).style.display = 'none';
        },
        async setMainMode(mode, sel = false) {
            if (GlobalVariables.ventanaUnidades && !GlobalVariables.ventanaUnidades.closed) {
                GlobalVariables.ventanaUnidades.close();
                GlobalVariables.ventanaUnidades = null;
            }

            if (this.mainmode === mode && mode !== 'InicioProyecto') return;

            this.mainmode = mode;
            this.miniModule = await GlobalVariables.loadMiniModule(mode, this.proyecto, "#projectsMainContent");
        },

        getPathName(mode) {
            if (mode === 'EdicionProyectos') return `${this.proyecto.nombre}`;
            if (mode === 'Clientes') return `${this.proyecto.nombre}`;
            if (mode === 'Medios') return `${this.proyecto.nombre}`;
            if (mode === 'Documentacion') return `${this.proyecto.nombre} `;
            if (mode === 'Bancos') return `${this.proyecto.nombre}`;
            if (mode === 'Recorridos') return `${this.proyecto.nombre}`;
            if (mode === 'Rotafolio') return `${this.proyecto.nombre}`;
            if (mode === 'ProcesoNegocio') return `${this.proyecto.nombre}`;
            if (mode === 'MiCalendario') return `${this.proyecto.nombre}`;
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
                    this.ocultarLayout = false;
                    this.setRuta([{ text: this.proyecto.nombre, action: () => {} }]);
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

                case "GoToProjectHome":
                    this.lateralMenu = true;
                    await this.setMainMode('InicioProyecto');
                    this.setRuta([{ text: this.proyecto.nombre, action: () => {} }]);
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
