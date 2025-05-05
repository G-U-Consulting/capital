export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            agrupamientosImg: [],
            mediosPublicitarios: [],
            categoriasMedios: [],
            ciudadelas: [],
            bancos: [],
            fiduciarias: [],
            zonasProyectos: [],
            instructivos: [],
            pies_legales: [],
            tramites: [],
            usuariosAPI: [],
            documentos: [],
            factores: [],
            bancos_factores: [],
            tipos_factor: [],

            agrupamientoImg: {},
            categoriaMedio: {},
            medioPublicitario: {},
            banco: { id_banco: null, banco: null },
            fiduciaria: { id_fiduciaria: null, fiduciaria: null },
            ciudadela: { id_ciudadela: null, ciudadela: null },
            zonaProyecto: { id_zona_proyecto: null, zona_proyecto: null },
            instructivo: {},
            pie_legal: { id_pie_legal: null, pie_legal: null, texto: null, notas_extra: null },
            tramite: {},
            evaluacion: {},
            subsidio: {},
            usuarioAPI: {},
            documento: {},
            factor: { id_factor: null, factor: null },
            banco_factor: { }
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
            if (mode == 1 || mode == 2) this.clearItem(this.getItem()[0]);
            this.mode = mode;
        },
        hasPermission(id) {
            return !!GlobalVariables.permisos.filter(p => p.id_permiso == id).length;
        },
        async onSelect(selected) {
            this.setMode(2);
            let item = this.getItem()[0];
            Object.keys(selected).forEach(key => item[key] = selected[key]);
            if (this.mainmode == 6) {
                this.bancos_factores.filter(bf => bf.id_banco === item.id_banco).forEach(bf => this.banco_factor[bf.id_factor + '-' + bf.id_tipo_factor] = bf);
                
            console.log(this.banco_factor);
            }
            console.log(selected, item);
        },
        async onCreate() {
            let [item, itemname] = this.getItem();
            try{
                showProgress();
            const resp = await httpFunc(`/generic/genericST/Maestros:Ins_${itemname}`, item);
            hideProgress();
            if (resp.data === 'OK') this.setMode(0);
            console.log(resp);
            }
            catch(e){
                console.log(e);
            }
        },
        async onUpdate() {
            let [item, itemname] = this.getItem();
            showProgress();
            const resp = await httpFunc(`/generic/genericST/Maestros:Upd_${itemname}`, item);
            hideProgress();
            if (resp.data === 'OK') this.setMode(0);
            console.log(resp);
        },
        async onUpdateBanco() {
            showProgress();
            const resp = await httpFunc(`/generic/genericST/Maestros:Upd_Banco`, this.banco);
            if (resp.data == 'OK') {
                this.banco_factor.forEach(bf => {
                    if (bf.valor instanceof Number){

                    }
                });
            }
            hideProgress();
            console.log(this.banco_factor);
        },
        getItem() {
            if (this.mainmode == 3) return [this.agrupamientoImg, 'Agrupamiento'];
            if (this.mainmode == 4) return [this.categoriaMedio, 'Categoria'];
            if (this.mainmode == 5) return [this.medioPublicitario, 'Medio'];
            if (this.mainmode == 6) return [this.banco, 'Banco'];
            if (this.mainmode == 7) return [this.fiduciaria, 'Fiduciaria'];
            if (this.mainmode == 8) return [this.zonaProyecto, 'ZonaProyecto'];
            if (this.mainmode == 9) return [this.ciudadela, 'Ciudadela'];
            if (this.mainmode == 11) return [this.pie_legal, 'PieLegal'];
            if (this.mainmode == 12) return [this.tramite, 'Tramites'];
            if (this.mainmode == 13) return [this.evaluacion, 'Evaluacion'];
            if (this.mainmode == 14) return [this.subsidio, 'Subsidio'];
            if (this.mainmode == 15) return [this.usuarioAPI, 'UsuarioAPI'];
            if (this.mainmode == 16) return [this.documento, 'Documentos'];
            return null;
        },
        clearItem(item) {
            Object.keys(item).forEach(key => item[key] = null);
        },
        async loadData() {
            var resp = (await httpFunc("/generic/genericDS/Maestros:Get_Maestros", {})).data;
            console.log(resp);
            this.zonasProyectos = resp[5];
            this.ciudadelas = resp[7];
            this.pies_legales = resp[8];
            this.fiduciarias = resp[9];
            this.bancos = resp[10];
            this.factores = resp[11];
            this.tipos_factor = resp[12];
            this.bancos_factores = resp[13];
        }
    }
};
