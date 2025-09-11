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
            showDocs: false,

            newRow: false,

            tooltipVisible: false,
            tooltipX: 0,
            tooltipY: 0,
            previews: [],
            files: [],
            draggedFile: null,
            dragIndex: null,
            tooltipMsg: "Arrastra o haz clic para cargar archivos.",
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
        onAddAccount() {
            this.newRow = !this.newRow;
        },



        updateCursor(event) {
            this.tooltipX = event.clientX + 10;
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