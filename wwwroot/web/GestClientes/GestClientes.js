export default {
    data() {
        return {
            mainmode: 0,
            ruta: [],
            cliente: null,
            submode: 0,

            lateralMenu: true,
            showList: true
        };
    },
    async mounted() {
        GlobalVariables.miniModuleCallback = this.miniModuleCallback;
        await this.setMainMode('Clientes');
    },
    unmounted() {
        GlobalVariables.miniModuleCallback = null;
    },
    methods: {
        setRuta(subpath) {
            this.ruta = [{
                text: 'ZG', action: () =>
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
            }, {
                text: 'Clientes', action: () => { this.cliente = null; this.setMainMode('Clientes'); this.setRuta([]); }
            }, ...subpath];
        },
        async setMainMode(mode) {
            if (this.mainmode == mode && mode != 'Clientes') return;
            this.mainmode = mode;
            this.miniModule = await GlobalVariables.loadMiniModule(mode, this.cliente, "#mainContent");
            if (mode === 'Clientes') this.setRuta([]);
        },
        async miniModuleCallback(type, data) {
            if (type == "StartModule") {
                this.lateralMenu = true;
                this.cliente = null;
                this.ruta[1].action();
            } 
            else if (type == "SetRuta") this.setRuta(data);
            else if (type == "ToggleLateralMenu") this.lateralMenu = !this.lateralMenu;
        },

        toggleList() {
            this.showList = !this.showList;
        }
    }
};
