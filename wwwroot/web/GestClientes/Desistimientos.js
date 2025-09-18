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
            ventas: [],
            estados: [],
            cliVentas: [],
            cuentas: [],
            desistimiento: {},
            cliente: {},
            venta: {},
            cuenta: {},
            selCliente: {},
            searchID: null,
            searchDoc: null,
            isNew: true,

            desistimiento: { id_categoria: '', id_fiduciaria: '', etapa: '', id_penalidad: '' },

            filtros: {
                desistimientos: {}
            },

            showGestion: false,
            showInfo: false,
            showCuentas: false,
            showDocs: false,
            showDatamart: false,
            showLiq: false,
            showCarta: false,

            newRow: false,

            tooltipVisibleL: false,
            tooltipVisibleR: false,
            tooltipX: 0,
            tooltipY: 0,
            previews: [],
            files: [],
            draggedFile: null,
            dragIndex: null,
            tooltipMsg: "Arrastra o haz clic para cargar archivos.",

            editRow: true,
            selRow: null
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
                this.searchDoc = null;
                this.searchID = null;
                this.cliVentas = [];
                this.cliente = {};
                this.ruta = [this.ruta[0], { text: "Nuevo", action: () => this.setMode(1) }];
                this.setRuta();
            }
            if (mode === 2) {
                this.ruta = [this.ruta[0],
                {
                    text: !this.isNew ? `Edición - Venta ${this.desistimiento.id_venta}` : 'Creación',
                    action: () => this.setMode(2)
                }];
                this.setRuta();
            }
            if (mode === 3) {
                this.ruta = [this.ruta[0], this.ruta[1], { text: 'Aprobación', action: () => this.setMode(3) }];
                this.setRuta();
                await this.loadAccounts();
            }
        },
        async loadData() {
            showProgress();
            [this.desistimientos, this.categorias, this.penalidades, this.fiduciarias, this.ventas, this.estados] =
                (await httpFunc("/generic/genericDS/Clientes:Get_Desistimientos", {})).data;
            hideProgress();
        },
        async loadAccounts() {
            showProgress();
            this.cuentas = (await httpFunc("/generic/genericDT/Clientes:Get_Cuentas",
                { id_desistimiento: this.desistimiento.id_desistimiento })).data;
            hideProgress();
        },
        validarNumero(e, int) {
            let val = e.target.value;
            if (!val) val = '0';
            val = val.replace(int ? /[^0-9.]/g : /[^0-9.,]/g, '');
            if (!int && [...val].reduce((a, b) => a + (b === ',' ? 1 : 0), 0) > 1)
                val = val.slice(0, val.lastIndexOf(',')) + val.slice(val.lastIndexOf(',') + 1);
            val = val.replace(/^0+(\d)/, '$1');
            e.target.value = val;
        },
        valMax(e, max) {
            let val = this.cleanNumber(e.target.value);
            if (Number(val) > max) e.target.value = max.toString();
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
        onAddAccount() {
            this.newRow = !this.newRow;
            this.cuenta = {};
        },
        onFind() {
            if (this.searchID)
                this.cliVentas = this.ventas.filter(v => v.id_venta === this.searchID);
            if (this.searchDoc)
                this.cliVentas = this.ventas.filter(v => v.numero_documento === this.searchDoc);
            if (this.cliVentas.length) {
                let v = this.cliVentas[0];
                this.cliente = {
                    id_cliente: v.id_cliente,
                    nombres: v.nombres,
                    apellido1: v.apellido1,
                    apellido2: v.apellido2,
                    numero_documento: v.numero_documento,
                    nombre_cliente: v.nombre_cliente
                };
            } else {
                this.cliente = {};
                showMessage('No se encontraron ventas.')
            }

        },
        onSelectDes(des) {
            this.tooltipVisibleL = false;
            this.tooltipVisibleR = false;
            this.desistimiento = { ...des };

            Object.keys(this.desistimiento).forEach(k => this.desistimiento[k] = this.desistimiento[k].replace(',', '.'));
            this.cliente = {
                id_cliente: des.id_cliente,
                nombres: des.nombres,
                apellido1: des.apellido1,
                apellido2: des.apellido2,
                numero_documento: des.numero_documento,
                nombre_cliente: des.nombre_cliente
            };
            this.venta = this.ventas.find(v => v.id_venta === des.id_venta) || {};
            this.isNew = false;
            this.setMode(2);
        },
        onSelectVenta(venta) {
            this.desistimiento = this.desistimientos.find(d => d.id_desistimiento === venta.id_desistimiento) ||
            {
                id_categoria: '',
                id_fiduciaria: '',
                etapa: '',
                id_penalidad: '',
                id_estado: '1',
                id_fiduciaria: venta.id_fiduciaria,
                id_venta: venta.id_venta,
                unidad: venta.unidad,
                created_by: GlobalVariables.username,
                created_on: this.formatDatetime('', 'bdatetime'),
            };
            Object.keys(this.desistimiento).forEach(k => this.desistimiento[k] = this.desistimiento[k].replace(',', '.'));
            this.venta = venta;
            this.isNew = !this.desistimiento.id_desistimiento;
            this.setMode(2);
        },
        async onSave(hold) {
            showProgress();
            let res = null;
            try {
                Object.keys(this.desistimiento).forEach(k => !this.desistimiento[k] && delete this.desistimiento[k]);
                res = await httpFunc(`/generic/genericST/Clientes:${this.isNew ? 'Ins' : 'Upd'}_Desistimiento`, this.desistimiento);
                if (res.isError || res.data !== 'OK') throw res;
                await this.loadData();
                !hold && await this.setMode(0);
            } catch (e) {
                console.error(e);
                showMessage('Error: ' + e.errorMessage || e.data);
            }
            hideProgress();
        },


        updateCursor(event) {
            this.tooltipX = event.clientX + 10;
            this.tooltipY = event.clientY + 10;
        },
        updateCursorRight(event) {
            this.tooltipX = document.body.getBoundingClientRect().width - event.clientX + 2;
            this.tooltipY = event.clientY + 10;
        },
        async handleDragOver(event) {
            event.preventDefault();
        },
        async handleSubDrop(e) {
            const files = e.dataTransfer.files;
            if (files.length > 0) this.fileUpload({ target: { files } });
        },
        async handleDrop(event) {
            if (this.dragIndex !== null) {
                const dropTarget = event.target.closest('.image-card');
                if (dropTarget) {
                    const dropIndex = Array.from(event.currentTarget.querySelectorAll('.image-card')).indexOf(dropTarget);
                    if (dropIndex !== -1 && dropIndex !== this.dragIndex) {
                        const draggedItem = this.previews[this.dragIndex];
                        const draggedFile = this.files[this.dragIndex];

                        this.previews.splice(this.dragIndex, 1);
                        this.files.splice(this.dragIndex, 1);

                        this.previews.splice(dropIndex, 0, draggedItem);
                        this.files.splice(dropIndex, 0, draggedFile);
                        this.dragIndex = null;
                        return;
                    }
                }
                this.dragIndex = null;
                return;
            }
            if (event.dataTransfer.files.length > 0) {
                let droppedFiles = { ...event.dataTransfer.files }, files = [];
                for (const key in droppedFiles)
                    files.push({ newName: droppedFiles[key].name, file: droppedFiles[key] });
                this.processFiles(files);
            }
        },
        async removeImage(index) {
            this.previews.splice(index, 1);
            this.files.splice(index, 1);
        },
        async handleFileChange(event) {
            let selectedFiles = { ...event.target.files }, files = [];
            for (const key in selectedFiles)
                files.push({ newName: selectedFiles[key].name, file: selectedFiles[key] });
            this.processFiles(files);
        },
        async processFiles(files) {
            let noDocs = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i].file;
                const exists = this.files.some(existingFile => existingFile.name === file.name);
                if (!exists) {
                    let ext = file.name.split('.').pop();
                    if (file.type.startsWith('image/') || this.getIcon(ext)) {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            if (file.type.startsWith('image/')) {
                                let f = { src: e.target.result, file: file, newName: files[i].newName };
                                Object.defineProperty(f, 'content', {
                                    get() { return this.src; },
                                    set(val) { this.src = val; }
                                });
                                await this.previews.push(f);
                            }
                            else await this.previews.push({ file: file, src: this.getIcon(ext), content: e.target.result, newName: files[i].newName });
                            this.files.push(file);
                        };
                        reader.readAsDataURL(file);
                    } else noDocs.push(file.name);
                }
            }
            noDocs.length && showMessage(`Error: Documentos no soportados\n${noDocs.join(', ')}`);
        },
        getURLFile(file) {
            return URL.createObjectURL(file);
        },
        getIcon(ext) {
            ext = ext.toLowerCase();
            let base = '/img/ico/';
            if (["doc", "docx", "docm", "dot", "dotx", "dotm"].includes(ext)) return base + 'Word.png';
            if (["xls", "xlsx", "xlsm", "xlsb", "xlt", "xltx", "xltm", 'csv'].includes(ext)) return base + 'Excel.png';
            if (["ppt", "pptx", "pptm", "pot", "potx", "potm", "pps", "ppsx", "ppsm",].includes(ext)) return base + 'PowerPoint.png';
            if (["mdb", "accdb"].includes(ext)) return base + 'Access.png';
            if (["mdb", "accdb"].includes(ext)) return base + 'Visio.png';
            if (["pdf", "txt", "odt", "odg", "ods", "odp", "odf", "pub", "md", "xml", "json", "rtf", "tex"].includes(ext))
                return base + ext + '.png';
            else return false;
        },
        async dragStart(index) {
            this.dragIndex = index;
        },
        formatDatetime(text, type = 'datetime', _date) {
            const date = _date || (text ? new Date(text) : new Date());
            let day = date.getDate().toString().padStart(2, '0'),
                month = (date.getMonth() + 1).toString().padStart(2, '0'),
                year = date.getFullYear(),
                hour = (date.getHours() % 12 || 12).toString().padStart(2, '0'),
                minutes = date.getMinutes().toString().padStart(2, '0'),
                meridian = date.getHours() >= 12 ? 'p. m.' : 'a. m.';
            if (type === 'date')
                return `${day}/${month}/${year}`;
            if (type === 'bdate')
                return `${year}-${month}-${day}`;
            if (type === 'bdatetime')
                return `${year}-${month}-${day} ${date.getHours().toString().padStart(2, '0')}:${minutes}`;
            if (type === 'time')
                return `${hour}:${minutes} ${meridian}`;
            if (type === 'vtime')
                return `${date.getHours().toString().padStart(2, '0')}:${minutes}`
            return `${day}/${month}/${year} ${hour}:${minutes} ${meridian}`;
        },

        async setEstado(id) {
            this.desistimiento.id_estado = id;
            if (id === '3') this.desistimiento.fec_com_coordinacion = this.formatDatetime('', 'bdate');
            if (id === '4') this.desistimiento.fec_com_direccion = this.formatDatetime('', 'bdate');
            this.onSave(true);
        },

        async onSaveAccount() {
            showProgress();
            let res = null;
            try {
                Object.keys(this.cuenta).forEach(k => !this.cuenta[k] && delete this.cuenta[k]);
                this.cuenta.id_desistimiento = this.desistimiento.id_desistimiento;
                this.id_cliente = this.selCliente.id_cliente;
                res = await httpFunc(`/generic/genericST/Clientes:${this.newRow ? 'Ins' : 'Upd'}_Cuenta`, this.cuenta);
                if (res.isError || res.data !== 'OK') throw res;
                this.newRow = false;
                await this.loadAccounts();
            } catch (e) {
                console.error(e);
                showMessage('Error: ' + e.errorMessage || e.data);
            }
            hideProgress();
        },
        async onDeleteAccount(cuenta) {
            showProgress();
            let res = null;
            try {
                res = await httpFunc(`/generic/genericST/Clientes:Del_Cuenta`, { id_cuenta: cuenta.id_cuenta });
                if (res.isError || res.data !== 'OK') throw res;
                this.newRow = false;
                this.editRow = false;
                await this.loadAccounts();
            } catch (e) {
                console.error(e);
                showMessage('Error: ' + e.errorMessage || e.data);
            }
            hideProgress();
        }
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
        f_cant_incumplida: {
            get() { return this.formatNumber(this.desistimiento['cant_incumplida'], false); },
            set(val) { this.desistimiento['cant_incumplida'] = this.cleanNumber(val); }
        },
        f_radicado: {
            get() { return this.desistimiento['radicado']; },
            set(val) { this.desistimiento['radicado'] = this.cleanNumber(val); }
        },

        f_v_venta_neto: {
            get() { return this.formatNumber(this.desistimiento['v_venta_neto'], false); },
            set(val) { this.desistimiento['v_venta_neto'] = this.cleanNumber(val); }
        },
        f_v_abonado: {
            get() {
                let val = Number(this.cleanNumber(this.f_a_capital)) + Number(this.cleanNumber(this.f_a_intereses));
                return this.formatNumber(val.toString(), false);
            },
        },
        f_a_capital: {
            get() { return this.formatNumber(this.desistimiento['a_capital'], false); },
            set(val) { this.desistimiento['a_capital'] = this.cleanNumber(val); }
        },
        f_a_intereses: {
            get() { return this.formatNumber(this.desistimiento['a_intereses'], false); },
            set(val) { this.desistimiento['a_intereses'] = this.cleanNumber(val); }
        },
        f_condonacion: {
            get() { return this.formatNumber(this.desistimiento['condonacion'], false); },
            set(val) { this.desistimiento['condonacion'] = this.cleanNumber(val); }
        },
        f_imp_reformas: {
            get() { return this.formatNumber(this.desistimiento['imp_reformas'], false); },
            set(val) { this.desistimiento['imp_reformas'] = this.cleanNumber(val); }
        },

        f_pnl_pcv: {
            get() { return this.formatNumber(this.desistimiento['pnl_pcv'], true); },
            set(val) {
                if (Number(this.cleanNumber(val)) > 100) this.desistimiento['pnl_pcv'] = '100';
                else this.desistimiento['pnl_pcv'] = this.cleanNumber(val);
            }
        },
        f_pnl_aplicada_ptg: {
            get() { return this.formatNumber(this.desistimiento['pnl_aplicada_ptg'], true); },
            set(val) {
                if (Number(this.cleanNumber(val)) > 100) this.desistimiento['pnl_aplicada_ptg'] = '100';
                else this.desistimiento['pnl_aplicada_ptg'] = this.cleanNumber(val);
            }
        },
        f_pnl_aplicada_val: {
            get() {
                let val = Number(this.cleanNumber(this.f_a_capital)) * Number(this.cleanNumber(this.f_pnl_aplicada_ptg)) / 100;
                return this.formatNumber(val.toString(), false);
            },
        },
        f_pnl_bruta: {
            get() {
                let val = Number(this.cleanNumber(this.f_a_capital)) * Number(this.cleanNumber(this.f_pnl_aplicada_ptg)) / 100;
                return this.formatNumber(val.toString(), false);
            },
        },
        f_pnl_neta: {
            get() {
                let val = Number(this.cleanNumber(this.f_pnl_aplicada_val)) - Number(this.cleanNumber(this.f_interes))
                    - Number(this.cleanNumber(this.f_imp_reformas));
                return this.formatNumber(val.toString(), false);
            },
        },
        f_devolucion: {
            get() {
                let val = Number(this.cleanNumber(this.f_a_capital)) - Number(this.cleanNumber(this.f_pnl_aplicada_val));
                return this.formatNumber(val.toString(), false);
            },
        },
        f_v4xmil: {
            get() {
                let val = Number(this.cleanNumber(this.f_devolucion)) * 0.004;
                return this.formatNumber(val.toString(), false);
            },
        },
        f_liquido: {
            get() {
                let val = Number(this.cleanNumber(this.f_devolucion)) - Number(this.cleanNumber(this.f_v4xmil));
                return this.formatNumber(val.toString(), false);
            },
        },
        f_extra_prorroga_carta: {
            get() { return this.formatNumber(this.desistimiento['extra_prorroga_carta'], false); },
            set(val) { this.desistimiento['extra_prorroga_carta'] = this.cleanNumber(val); }
        },
        f_val_carta: {
            get() {
                let val = Number(this.cleanNumber(this.f_pnl_neta)) - Number(this.cleanNumber(this.f_gasto)) - Number(this.cleanNumber(this.f_extra_prorroga_carta));
                return this.formatNumber(val.toString(), false);
            },
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