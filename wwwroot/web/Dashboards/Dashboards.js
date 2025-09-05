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
        await this.setMainMode(0);
    },
    unmounted() {
        GlobalVariables.miniModuleCallback = null;
    },
    methods: {
        setRuta(subpath) {
            this.ruta = [{
                text: 'ZI', action: () =>
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
            }, {
                text: 'Dashboards', action: () => { this.cliente = null; this.setMainMode(0); }
            }, ...subpath];
        },
        async setMainMode(mode) {
            if (this.mainmode === mode && mode !== 0) return;
            this.mainmode = mode;
            await this.$nextTick();
            if (mode) this.miniModule = await GlobalVariables.loadMiniModule(mode, this.cliente, "#mainContent");
            else this.setRuta([]);
        },
        async miniModuleCallback(type, data) {
            if (type == "StartModule") {
                this.lateralMenu = true;
                this.cliente = null;
                this.setMainMode(0);
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
