export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            agrupamientoImg: [],
            categoriasMedios: [],
            ciudadelas: [],
            bancos: [],
            fiduciarias: [],
            zAgrupamientosPro: [],
            banco: { id_banco: null, banco: null },
            fiduciaria: { id_fiduciaria: null, fiduciaria: null },
            ciudadela: { id_ciudadela: null, ciudadela: null },
            zAgrupamientoPro: {}
        };
    },
    async mounted() {
        this.loadData();
        this.setMainMode(1);
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
            this.mode = 0;
        },
        setMode(mode) {
            if (mode == 0) this.loadData();
            if (mode == 1 || mode == 2) this.clearItem(this.getItem());
            this.mode = mode;
        },
        hasPermission(id) {
            return !!GlobalVariables.permisos.filter(p => p.id_permiso == id).length;
        },
        async onSelect(selected) {
            this.setMode(2);
            let item = this.getItem();
            Object.keys(selected).forEach(key => item[key] = selected[key]);
            console.log(selected, item);
        },
        async onCreate() {
            showProgress();
            const resp = await httpFunc(`/generic/genericST/Maestros:Ins_${this.getItemName()}`, this.getItem());
            hideProgress();
            if (resp.data === 'OK') this.setMode(0);
            console.log(resp);
        },
        async onUpdate() {
            showProgress();
            const resp = await httpFunc(`/generic/genericST/Maestros:Upd_${this.getItemName()}`, this.getItem());
            hideProgress();
            if (resp.data === 'OK') this.setMode(0);
            console.log(resp);
        },
        getItem() {
            if (this.mainmode == 6) return this.banco;
            if (this.mainmode == 7) return this.fiduciaria;
            if (this.mainmode == 9) return this.ciudadela;
            return null;
        },
        getItemName() {
            if (this.mainmode == 6) return 'Banco';
            if (this.mainmode == 7) return 'Fiduciaria';
            if (this.mainmode == 9) return 'Ciudadela';
            return null;
        },
        clearItem(item) {
            Object.keys(item).forEach(key => item[key] = null);
        },
        async loadData() {
            var resp = (await httpFunc("/generic/genericDS/Maestros:Get_Maestros", {})).data;
            this.ciudadelas = resp[7];
            this.fiduciarias = resp[9];
            this.bancos = resp[10];
        }
    }
};
