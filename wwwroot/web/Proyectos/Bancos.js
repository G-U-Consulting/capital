export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            proyecto: null,
            nombrePro: '',

            bancos: [],
            factores: [],
            tipos_factor: [],
            bancos_factores: [],

            banco: {},
            factor: {},
            tipo_factor: {},
            banco_factor: {},
            filtros: {
                bancos: { is_active: '' },
            }
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("Bancos", null);
        this.nombrePro = this.proyecto.nombre;
        this.setMainMode('Bancos');
        await this.loadData();
        this.initMode();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        initMode() {
            this.mode = 0;
            this.ruta = [{ text: `${this.proyecto.nombre} / Bancos`, action: () => this.initMode() }];
            GlobalVariables.miniModuleCallback('SetRuta', this.ruta);
        },
        async loadData() {
            [this.bancos, this.factores, this.tipos_factor, this.bancos_factores] =
                (await httpFunc("/generic/genericDS/Proyectos:Get_Bancos", { id_proyecto: this.proyecto.id_proyecto })).data;
        },
        async onSelectBanco(selected) {
            this.mode = 2;
            this.banco = { ...selected };
            const bfs = {};
            const cbfs = {};
            this.tipos_factor.forEach(tf => {
                let obj = {}, cobj = {};
                this.factores.forEach(f => {
                    obj[f.id_factor] = this.bancos_factores.filter(bf => bf.id_banco == selected.id_banco && bf.id_tipo_factor == tf.id_tipo_factor && bf.id_factor == f.id_factor)[0];
                    cobj[f.id_factor] = { ...obj[f.id_factor] };
                });
                bfs[tf.id_tipo_factor] = obj;
                cbfs[tf.id_tipo_factor] = cobj;
            });
            this.banco_factor = bfs;
            this.copy_bf = cbfs;
            GlobalVariables.miniModuleCallback('SetRuta', [this.ruta[0],
                { text: `Edición - ${selected.banco}`, action: () => { } }
            ]);
        },
        onClear(table) {
            let item = this.filtros[table];
            item = Object.keys(item).forEach((key) => item[key] = '');
        },
        async onUpdateFactor() {
            showProgress();
            const bf = this.banco_factor, cbf = this.copy_bf;
            let error = false, errormsg = '', bfs = [];
            for (const id_tf in bf)
                for (const id_f in bf[id_tf])
                    if (bf[id_tf][id_f].valor != cbf[id_tf][id_f].valor)
                        bfs.push(bf[id_tf][id_f]);
            await Promise.all(bfs.map(async bf =>
                await httpFunc(`/generic/genericST/Maestros:${bf.id_proyecto ? 'Upd' : 'Ins'}_BancoFactor`,
                    { ...bf, id_proyecto: this.proyecto.id_proyecto })))
                .then(res => {
                    let err = res.filter(r => r.isError);
                    if (err && err.length) {
                        error = true;
                        errormsg ||= err[0].errorMessage;
                    }
                })
                .catch(e => console.error(e));
            hideProgress();
            if (error) {
                console.error(errormsg);
                showMessage("Error: " + errormsg);
                this.mode = 2;
                //this.setRuta();
            } else {
                await this.loadData();
                this.mode = 0;
                //this.setRuta();
            }
        },
        formatNumber(value, dec = true) {
            if (!value) return "";
            let [parteEntera, parteDecimal] = value.split(".");
            parteEntera = parteEntera.replace(/\D/g, "");
            parteDecimal = parteDecimal && dec ? parteDecimal.replace(/\D/g, "") : "";

            let groups = [];
            let len = parteEntera.length;
            for (let i = len; i > 0; i -= 3)
                groups.unshift(parteEntera.substring(Math.max(0, i - 3), i));

            let formattedEntera = groups[0] || "";
            for (let i = 1; i < groups.length; i++)
                formattedEntera += '.' + groups[i];

            let result = formattedEntera;
            if (parteDecimal)
                result += "," + parteDecimal;

            return result;
        },
        cleanNumber(value) {
            let cleaned = value.replace(/['.]/g, "");
            cleaned = cleaned.replace(",", ".");
            return cleaned;
        },
        async reset() {
            let res = await httpFunc(`/generic/genericST/Proyectos:Del_BancoFactor`,
                { id_banco: this.banco.id_banco, id_proyecto: this.proyecto.id_proyecto });
            showProgress();
            if (res.data !== 'OK') {
                console.error(res);
                showMessage(res.errorMessage);
            }
            else {
                await this.loadData();
                this.mode = 0;
            }
            hideProgress();
        },
        req(method) {
            showConfirm("Se sincronizarán los valores con los establecidos en el maestro.", method, null, null);
        }
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                    ) : []
                ) : [];
            };
        },
        has_factor() {
            return (id_banco, factor) => {
                let unidades = new Set();
                let factores = this.factores.filter(f => f.factor == factor);
                this.bancos_factores.filter(bf => bf.id_banco == id_banco
                    && factores.map(f => f.id_factor).includes(bf.id_factor))
                    .forEach(bf => bf.valor != '0' &&
                        unidades.add(factores.filter(f => bf.id_factor == f.id_factor)[0].unidad));
                return [...unidades].join('/');
            }
        },
    }
}