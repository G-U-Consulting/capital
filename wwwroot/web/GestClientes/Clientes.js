export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            selIndex: null,
            ruta: [],
            clientes: [],
            visitas: [],
            listas: [],
            ventas: [],

            cliente: {},
            veto: {},

            filtros: {
                clientes: { is_atencion_rapida: '' }
            },

            showDireccion: false,
            showVisitas: false,
            showCompras: false,
            showListas: false,
            showDesc: false,

            saveData: {},

            tooltipMsg: '',
            tooltipVisible: false,
            tooltipX: 0,
            tooltipY: 0,
        };
    },
    async mounted() {
        await this.loadData();
        this.saveData = await GlobalVariables.miniModuleCallback('GetData');
        if (this.saveData && this.saveData.selIndex >= 0) this.selIndex = this.saveData.selIndex;
        if (this.saveData && this.saveData.filtros) this.filtros = this.saveData.filtros;
        const params = new URLSearchParams(GlobalVariables.urlParams);
        if (params.get('id_cliente')) {
            let cliente = this.clientes.find(c => c.id_cliente == params.get('id_cliente'));
            if (cliente) this.onSelect(cliente);
        }
    },
    async unmounted() {
        if (this.chart) this.chart.destroy();
    },
    methods: {
        setRuta() {
            GlobalVariables.miniModuleCallback('SetRuta', this.ruta);
        },
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async setMode(mode) {
            if (this.mode != mode) {
                this.mode = mode;
                await Promise.resolve();
                if (mode === 0) GlobalVariables.miniModuleCallback('StartModule');
                if (mode === 1) {
                    this.ruta = [{ text: `${this.cliente.numero_documento} - Edición` }];
                    this.setRuta();
                }
                if (mode === 'chart') this.initChart();
                if (mode === 'd3') this.initD3();
            }
        },
        async loadData() {
            showProgress();
            this.clientes = (await httpFunc("/generic/genericDT/Clientes:Get_Clientes", {})).data;
            hideProgress();
        },
        async loadDetails() {
            showProgress();
            [this.visitas, this.listas, this.ventas] = (await httpFunc("/generic/genericDS/Clientes:Get_DetalleCliente",
                { id_cliente: this.cliente.id_cliente })).data;
            hideProgress();
        },
        onClear(table) {
            let item = this.filtros[table];
            item = Object.keys(item).forEach((key) => item[key] = '');
        },
        async setIndex(i) {
            this.selIndex = i;
            this.saveData.selIndex = i;
            GlobalVariables.miniModuleCallback('SaveData', { ...this.saveData });
        },
        async onSelect(cliente) {
            this.cliente = { ...cliente };
            await this.loadDetails();
            this.setMode(1);
            this.initIntlTel(this.cliente);
        },
        toggleAtencion() {
            console.log(this.filtros.clientes);
        },
        async onSave() {
            showProgress();
            let a = true;
            const obligatorios = [
                { campo: "nombres", label: "Nombres" },
                { campo: "apellido1", label: "Primer Apellido" },
                { campo: "apellido2", label: "Segundo Apellido" },
                { campo: "fecha_nacimiento", label: "Fecha de Nacimiento" },
                { campo: "direccion", label: "Dirección" },
                { campo: "ciudad", label: "Ciudad" },
                { campo: "barrio", label: "Barrio" },
                { campo: "departamento", label: "Departamento" },
                { campo: "tipo_documento", label: "Tipo de Documento" },
                { campo: "numero_documento", label: "Número de Documento" },
            ];
            obligatorios.forEach(ob => {
                if (!this.cliente[ob.campo]) {
                    showMessage(`Campo obligatorio: ${ob.label}`);
                    a = false;
                    return;
                }
            })
            if (a) {
                let res = null;
                try {
                    res = await (httpFunc('/generic/genericST/Clientes:Upd_Cliente', this.cliente));
                    if (res.isError || res.data !== 'OK') throw res;
                    this.setMode(0);
                } catch (e) {
                    console.error(e);
                    showMessage('Error: ' + e.errorMessage || e.data);
                }
            }
            hideProgress();
        },
        openModal() {
            let $modal = document.getElementById('modalOverlay');
            if ($modal) $modal.style.display = 'flex';
        },
        closeModal(e) {
            if (e && e.target.matches('#modalOverlay')) {
                e.target.style.display = 'none';
            }
            if (!e || e.target.matches('.modal-cerrar.events')) {
                let $modal = document.getElementById('modalOverlay');
                $modal && ($modal.style.display = 'none');
            }
        },
        updateCursorRight(event) {
            this.tooltipX = document.body.getBoundingClientRect().width - event.clientX + 2;
            this.tooltipY = event.clientY + 10;
        },
        formatNumber(value, dec = true) {
            if (!value) return "";
            let [parteEntera, parteDecimal] = value.split(",");
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
        async exportExcel(tabla) {
            try {
                showProgress();
                let datos = this.getFilteredList(tabla);
                var archivo = (await httpFunc("/util/Json2File/excel", datos)).data;
                var formato = (await httpFunc("/util/ExcelFormater", { "file": archivo, "format": "FormatoMaestros" })).data;
                window.open("./docs/" + archivo, "_blank");
            }
            catch (e) {
                console.error(e);
            }
            hideProgress();
        },
        async initIntlTel(cliente) {
            await Promise.resolve();
            let tmptel1 = document.getElementById('telefono1'), tmptel2 = document.getElementById('telefono2');
            if (!this.iti1 || (![...tmptel1.parentElement.classList].includes('iti'))) {
                this.tel1 = tmptel1;
                if (this.tel1) {
                    this.iti1 = intlTelInput(this.tel1, {
                        initialCountry: cliente.pais_tel1 || "co",
                        separateDialCode: true,
                    });
                    this.tel1.addEventListener("countrychange", () => {
                        const countryData = this.iti1.getSelectedCountryData();
                        cliente.pais_tel1 = countryData.iso2;
                        cliente.codigo_tel1 = '+' + countryData.dialCode;
                    });
                }
            }
            else this.iti1.setCountry(cliente.pais_tel1 || "co");
            if (!this.iti2 || (![...tmptel2.parentElement.classList].includes('iti'))) {
                this.tel2 = tmptel2;
                if (this.tel2) {
                    this.iti2 = intlTelInput(this.tel2, {
                        initialCountry: cliente.pais_tel2 || "co",
                        separateDialCode: true,
                    });
                    this.tel2.addEventListener("countrychange", () => {
                        const countryData = this.iti2.getSelectedCountryData();
                        cliente.pais_tel2 = countryData.iso2;
                        cliente.codigo_tel2 = '+' + countryData.dialCode;
                    });
                }
            }
            else this.iti2.setCountry(cliente.pais_tel2 || "co");
        },
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                if (this.filtros.clientes.nombre_id || this.filtros.clientes.pais || this.filtros.clientes.departamento
                    || this.filtros.clientes.ciudad || this.filtros.clientes.is_atencion_rapida) {
                    this.saveData.filtros = this.filtros;
                    GlobalVariables.miniModuleCallback('SaveData', { ...this.saveData });
                }
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
                        if (tabla == 'clientes' && key == 'nombre_id')
                            return this.filtros[tabla][key] === ''
                                || String(item['nombre']).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                                || String(item['numero_documento']).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
                        else return this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
                    }) : []
                ) : [];
            };
        },
    }
}