export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            desistimientos: [],
            categorias: [], 
            penalidades: [],
            fiduciarias: [],

            desistimiento: { id_categoria: '', id_fiduciaria: '', etapa: '', id_penalidad: ''},

            filtros: {
                desistimientos: {}
            },

            showGestion: false,
            showInfo: false,
            showCuentas: false,
        };
    },
    async mounted() {
        this.ruta = [{ text: 'Desistimientos', action: () => this.setMode(0) }];
        this.setRuta();
        await this.loadData();
    },
    async unmounted() {

    },
    methods: {
        setRuta() {
            GlobalVariables.miniModuleCallback('SetRuta', this.ruta);
        },
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async setMode(mode) {
            this.mode = mode;
            if (mode === 0) {
                this.ruta = [this.ruta[0]];
                this.setRuta();
            }
            if (mode === 1) {
                this.ruta = [this.ruta[0], { text: "Nuevo", action: () => this.setMode(1) }];
                this.setRuta();
            }
        },
        async loadData() {
            [this.categorias, this.penalidades, this.fiduciarias] = 
                (await httpFunc("/generic/genericDS/Clientes:Get_Desistimientos", {})).data;
        },
        validarNumero(e, int) {
            let val = e.target.value;
            if (!val) val = '0';
            val = val.replace(int ? /[^0-9.]/g : /[^0-9.,]/g, '');
            if(!int && [...val].reduce((a, b) => a + (b === ',' ? 1 : 0), 0) > 1)
                val = val.slice(0, val.lastIndexOf(',')) + val.slice(val.lastIndexOf(',') + 1);
            val = val.replace(/^0+(\d)/, '$1');
            e.target.value = val;
        },
        formatNumber(value, dec = true, ndec) {
			if (!value) return "0";
			let [parteEntera, parteDecimal] = value.split(".");
			parteEntera = parteEntera.replace(/\D/g, "");
			parteDecimal = parteDecimal && dec ? parteDecimal.replace(/\D/g, "") : "";
			if (ndec >= 0)
				parteDecimal = dec && ndec > 0 ? parteDecimal.padEnd(ndec, '0') : "";

			let groups = [];
			let len = parteEntera.length;
			for (let i = len; i > 0; i -= 3)
				groups.unshift(parteEntera.substring(Math.max(0, i - 3), i));

			let formattedEntera = groups[0] || "";
			for (let i = 1; i < groups.length; i++)
				formattedEntera += '.' + groups[i];

			let result = formattedEntera;
			if (parteDecimal) {
				if (ndec > 0 && parteDecimal.length > ndec)
					parteDecimal = Math.round(parseInt(parteDecimal) / Math.pow(10, parteDecimal.length - ndec)).toString();
				result += "," + parteDecimal;
			}

			return result;
		},
        cleanNumber(value) {
			let cleaned = value.replace(/['.]/g, "");
			cleaned = cleaned.replace(",", ".");
			return cleaned;
		},
    },
    computed: {
        f_campo: {
			get() { return this.formatNumber(this.desistimiento[this.getCampoPenalidad()], true); },
			set(val) { this.desistimiento[this.getCampoPenalidad()] = this.cleanNumber(val); }
		},
        f_interes: {
			get() { return this.formatNumber(this.desistimiento['interes'], true); },
			set(val) { this.desistimiento['interes'] = this.cleanNumber(val); }
		},
        f_gasto: {
			get() { return this.formatNumber(this.desistimiento['gasto'], true); },
			set(val) { this.desistimiento['gasto'] = this.cleanNumber(val); }
		},
        f_descuento: {
			get() { return this.formatNumber(this.desistimiento['descuento'], true); },
			set(val) { this.desistimiento['descuento'] = this.cleanNumber(val); }
		},
        f_incumplimientos: {
            get() { return this.formatNumber(this.desistimiento['incumplimientos'], false); },
			set(val) { this.desistimiento['incumplimientos'] = this.cleanNumber(val); }
        },

        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => 
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                    ) : []
                ) : [];
            };
        },
        getCampoPenalidad() {
            return () => {
                if (this.desistimiento.id_penalidad) {
                    let penalidad = this.penalidades.find(p => p.id_penalidad == this.desistimiento.id_penalidad);
                    return penalidad ? penalidad.campo : null;
                }
                return null;
            }
        }
    }
}