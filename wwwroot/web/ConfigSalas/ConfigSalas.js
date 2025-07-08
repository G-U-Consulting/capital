export default {
    data() {
        return {
            mainmode: 0,
            ruta: [],
            sala: null,
            submode: 0,

            lateralMenu: false,
            showList: true
        };
    },
    async mounted() {
        GlobalVariables.miniModuleCallback = this.miniModuleCallback;
        await this.setMainMode('SeleccionSalas');
    },
    unmounted() {
        GlobalVariables.miniModuleCallback = null;
    },
    methods: {
        setRuta(subpath) {
            this.ruta = [{
                text: 'ZM', action: () =>
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
            }, {
                text: 'Salas de ventas', action: () => { this.lateralMenu = false; this.sala = null; this.setMainMode('SeleccionSalas'); this.setRuta([]); }
            }, ...subpath];
        },
        async setMainMode(mode, sel) {
            if (this.mainmode == mode && mode != 'SeleccionSalas') return;
            this.mainmode = mode;
            this.miniModule = await GlobalVariables.loadMiniModule(mode, this.sala, "#mainContent");
            let ruta = [];
            if (mode != 'SeleccionSalas' || sel) ruta.push({ text: this.getPathName(mode), action: () => { } });
            this.setRuta(ruta);
        },
        getPathName() {
            if (this.mainmode == 'SeleccionSalas') return this.sala ? `${this.sala.sala_venta} - Edición` : 'Nuevo';
            if (this.mainmode == 'SalaPersonal') return `${this.sala.sala_venta} - Gestión de Personal`;
            if (this.mainmode == 'SalaCalendario') return `${this.sala.sala_venta} - Calendario`;
            if (this.mainmode == 'ProgMensual') return `${this.sala.sala_venta} - Programación Mensual`;
            return '';
        },
        async miniModuleCallback(type, data) {
            if (type == "StartModule") {
                this.lateralMenu = false;
                this.sala = null;
            } else if (type == "SeleccionSala") {
                this.lateralMenu = true;
                this.sala = data;
            } else if (type == "SalaPersonal") {
                return this.sala;
            } else if (type == "SalaCalendario") {
                return this.sala;
            } else if (type == "GetSala") {
                return this.sala;
            } else if (type == "SetRuta") {
                this.setRuta(data);
            }
            else if (type == "ToggleLateralMenu") this.lateralMenu = !this.lateralMenu;

        },

        toggleList() {
            this.showList = !this.showList;
        }
    }
};
