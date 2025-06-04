export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            subImg: null,
            gruposImg: [],
            mediosPublicitarios: [],
            categoriasMedios: [],
            ciudadelas: [],
            bancos: [],
            fiduciarias: [],
            zonasProyectos: [],
            instructivos: [],
            pies_legales: [],
            tramites: [],
            subsidios: [],
            documentos: [],
            factores: [],
            bancos_factores: [],
            tipos_factor: [],
            tipos_financiacion: [],
            tipos_proyecto: [],
            estados_proyecto: [],
            tipos_vis: [],
            emails: [],

            grupoImg: {},
            categoriaMedio: {},
            medioPublicitario: {},
            banco: {},
            fiduciaria: {},
            ciudadela: {},
            zonaProyecto: {},
            instructivo: {},
            pie_legal: {},
            tramite: {},
            documento: {},
            factor: {},
            banco_factor: {},
            tipo_financiacion: {},
            tipo_proyecto: {},
            estado_proyecto: {},
            tipo_vis: {},
            subsidio: {},

            ruta: [],
            medioIsActive: 0,
            insEditor: 1,
            pieEditor: 1,
            traEditor: 1,
            quills: {},

            filtros: {
                gruposImg: { is_active: '' },
                mediosPublicitarios: { id_categoria: '', is_active: '' },
                categoriasMedios: { is_active: '' },
                ciudadelas: { is_active: '' },
                bancos: { is_active: '' },
                fiduciarias: { is_active: '' },
                zonasProyectos: { is_active: '' },
                instructivos: { is_active: '' },
                pies_legales: { is_active: '' },
                tramites: { is_active: '' },
                documentos: { is_img: '0',  is_active: '' },
                tipos_financiacion: { is_active: '' },
                tipos_proyecto: { is_active: '' },
                estados_proyecto: { is_active: '' },
                tipos_vis: { is_active: '' },
                subsidios: { is_active: '' },
            },

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
        this.loadData();
        this.setMainMode(0);
    },
    methods: {
        setRuta() {
            let subpath = [this.getMainPath()];
            let nuevo = { text: 'Nuevo', action: () => { this.mode = 1; this.setRuta() } },
                editar = { text: 'Edición', action: () => { this.mode = 2; this.setRuta() } };
            if (this.mode == 1) subpath.push(nuevo);
            if (this.mode == 2) subpath.push(editar);
            if (this.mode == 3 && this.mainmode == 6) subpath = [...subpath, editar,
            { text: 'Factores', action: () => { this.mode = 3; this.setRuta() } }];
            this.ruta = [{
                text: 'ZM', action: () =>
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
            }, { text: 'Maestros', action: () => { this.mainmode = 0; this.mode = 0; this.setRuta() } }];
            this.ruta = [...this.ruta, ...subpath];
        },
        setMainMode(mode) {
            this.mainmode = mode;
            this.mode = 0;
            this.setRuta();
        },
        setMode(mode) {
            if (mode == 0) this.loadData();
            if ((mode == 1 || mode == 2))
                this.clearItem(this.getItem()[0]);
            if ((mode == 1 || mode == 2) && (this.mainmode == 10 || this.mainmode == 11 || this.mainmode == 12))
                this.initQuill();
            this.mode = mode;
            this.setRuta();
        },
        hasPermission(id) {
            return !!GlobalVariables.permisos.filter((p) => p.id_permiso == id)
                .length;
        },
        async onSelect(selected) {
            this.setMode(2);
            let item = this.getItem()[0];
            if (this.mainmode == 14) for (const key in selected)
                this.subsidio[key] = key.startsWith('smmlv')
                    ? selected[key].toString().replace(',', '.')
                    : selected[key];
            else Object.keys(selected).forEach((key) => (item[key] = selected[key]));
            if (this.mainmode == 5) this.medioIsActive = item["is_active"] == 1;
            if (this.mainmode == 10) this.insEditor = 1;
            if (this.mainmode == 11) this.pieEditor = 1;
            if (this.mainmode == 12) this.traEditor = 1;
        },
        onSelectFactor(selected) {
            this.setMode(3);
            Object.keys(selected).forEach((key) => (this.factor[key] = selected[key]));
            const bfs = this.bancos_factores.filter((bf) =>
                bf.id_banco == this.banco.id_banco && bf.id_factor == this.factor.id_factor);
            this.banco_factor = {};
            bfs.forEach((bf) => (this.banco_factor[bf.id_tipo_factor] = bf));
        },
        async onSave() {
            let [item, itemname] = this.getItem();
            if (this.mainmode == 5) item["is_active"] = this.medioIsActive ? 1 : null;
            try {
                showProgress();
                const resp = await httpFunc(`/generic/genericST/Maestros:${this.mode == 1 ? 'Ins' : 'Upd'}_${itemname}`, item);
                hideProgress();
                if (resp.data === "OK") this.setMode(0);
                else throw resp;
            } catch (e) {
                console.log(e);
            }
        },
        async onCreateBanco() {
            showProgress();
            try {
                showProgress();
                const resp = await httpFunc(`/generic/genericST/Maestros:Ins_Banco`, this.banco, true);
                if (resp.data === "OK" && resp.id) {
                    this.banco.id_banco = resp.id;
                    this.loadData();
                    this.mode = 2;
                    this.setRuta();
                }
                hideProgress();
            } catch (e) {
                console.error(e);
            }
            hideProgress();
        },
        async onUpdateFactor() {
            showProgress();
            const bf = this.banco_factor;
            let error = false;
            for (const key in bf) {
                let resp = await httpFunc(`/generic/genericST/Maestros:Upd_BancoFactor`, bf[key]);
                if (resp.data !== "OK") error = true;
            }
            hideProgress();
            if (!error) {
                this.mode = 2;
                this.setRuta();
            }
        },
        async onSaveSubsidio() {
/*             if (this.mode == 1) {
                if (this.subImg) {
                    showProgress();
                    try {
                        let form = new FormData();
                        form.append(this.subImg.name, this.subImg);
                        let res = await httpFunc("/file/upload", form);
                        if (res.isError) showMessage(res.errorMessage);
                        else await httpFunc("/file/S3upload", res.data);
                        console.log(res);
                        // Actualizar llave archivo en subsidio['imagen']
                    }
                    catch(e) {
                        console.error(e);
                    }
                    hideProgress();
                }
            } */

            let name = this.subImg 
                ? `subsidio_${this.mode == 1 ? '#' : this.subsidio.id_subsidio}.${this.subImg.name.split(".").pop()}` 
                : null;
            let resp = {};
            showProgress();
            try {
                let sub = { ...this.subsidio };
                if (name) sub.imagen = `/img/subsidio/${name}`;
                resp = await httpFunc(`/generic/genericST/Maestros:${this.mode == 1 ? 'Ins' : 'Upd'}_Subsidio`, sub, this.mode == 1);
                if (resp.data === "OK" && this.subImg) {
                    let file = this.subImg;
                    const newFile = new File([file], resp.id ? name.replace('#', resp.id) : name, { type: file.type });
                    const formData = new FormData();
                    formData.append("file", newFile);
                    resp = await httpFunc("/api/uploadfile/subsidio", formData);
                }
                else if (resp.data !== "OK") throw resp;
                this.setMode(0);
            }
            catch (e) {
                console.error(e);
            }
            hideProgress();
        },
        async onUpdateEmail(){
            showProgress();
            try {
                if(this.emails.every(e => this.isEmail(e.email))) {
                    let resp = await httpFunc('/generic/genericST/Maestros:Upd_Email', 
                        { emails: JSON.stringify(this.emails) }
                    );
                    if (resp.data !== 'OK') throw resp;
                } else throw "Emails inválidos";
            } catch(e) {
                console.error(e);
            }
            hideProgress();
        },
        async onSelectDocument(doc) {
            this.clearAllImages();
            this.setMode(2);
            Object.keys(doc).forEach((key) => (this.documento[key] = doc[key]));
            this.loadFiles(doc.id_documento, 'docs');
        },
        async onSaveDocument() {
            showProgress();
            try {
                this.documento.is_img = '0';
                let resp = await httpFunc(`/generic/genericST/Maestros:${this.mode == 1 ? 'Ins' : 'Upd'}_Documento`, this.documento, this.mode == 1),
                    id_doc = this.mode == 1 ? resp.id : this.documento.id_documento;
                if (resp.data === "OK" && id_doc) {
                    let form = new FormData();
                    this.previews.forEach(pre => form.append(pre.file.name, pre.file));
                    let res = await httpFunc("/file/upload", form);
                    if (res.isError) showMessage(res.errorMessage);
                    else this.uploadS3(res.data, id_doc, 'docs');
                } else throw resp;
                this.setMode(0);
            } catch (e) {
                console.error(e);
            }
            hideProgress();
        },
        async onUpdateImg() {
            let folder = this.mainmode == 1 ? 'General' : 'Sostenibilidad',
                doc = this.documentos.filter(doc => doc.is_img == 1 && doc.documento == folder),
                id_doc = doc && doc.length ? doc[0].id_documento : null;
            showProgress();
            try {
                if (id_doc) {
                    let form = new FormData();
                    this.previews.forEach(pre => form.append(pre.file.name, pre.file));
                    let res = await httpFunc("/file/upload", form);
                    if (res.isError) showMessage(res.errorMessage);
                    else this.uploadS3(res.data, id_doc, folder);
                } else throw "No se encontró " + folder;
            }
            catch(e) {
                console.error(e);
            }
            hideProgress();
        },
        async loadImg() {
            this.clearAllImages();
            let folder = this.mainmode == 1 ? 'General' : 'Sostenibilidad',
                doc = this.documentos.filter(doc => doc.is_img == 1 && doc.documento == folder),
                id_doc = doc && doc.length ? doc[0].id_documento : null;
            id_doc && this.loadFiles(id_doc, folder);
        },
        getItem() {
            if (this.mainmode == 3) return [this.grupoImg, "GrupoImg", this.gruposImg];
            if (this.mainmode == 4) return [this.categoriaMedio, "Categoria", this.categoriasMedios];
            if (this.mainmode == 5) return [this.medioPublicitario, "Medio", this.mediosPublicitarios];
            if (this.mainmode == 6) return [this.banco, "Banco", this.bancos];
            if (this.mainmode == 7) return [this.fiduciaria, "Fiduciaria", this.fiduciarias];
            if (this.mainmode == 8) return [this.zonaProyecto, "ZonaProyecto", this.zonasProyectos];
            if (this.mainmode == 9) return [this.ciudadela, "Ciudadela", this.ciudadelas];
            if (this.mainmode == 10) return [this.instructivo, "Instructivo", this.instructivos];
            if (this.mainmode == 11) return [this.pie_legal, "PieLegal", this.pies_legales];
            if (this.mainmode == 12) return [this.tramite, "Tramite", this.tramites];
            if (this.mainmode == 13) return [this.documento, "Documento", this.documentos];
            if (this.mainmode == 14) return [this.subsidio, "Subsidio", this.subsidios];
            if (this.mainmode == 15) return [this.tipo_financiacion, "TipoFinanciacion", this.tipos_financiacion];
            if (this.mainmode == 16) return [this.tipo_proyecto, "TipoProyecto", this.tipos_proyecto];
            if (this.mainmode == 17) return [this.estado_proyecto, "EstadoProyecto", this.estados_proyecto];
            if (this.mainmode == 18) return [this.tipo_vis, "TipoVIS", this.tipos_vis];
            if (this.mainmode == 19) return [{}, "Email", this.emails];
            return null;
        },
        getMainPath() {
            let path = {};
            if (this.mainmode == 1) path.text = "Imágenes Generales Capital";
            if (this.mainmode == 2) path.text = "Imágenes Sostenibilidad";
            if (this.mainmode == 3) path.text = "Agrupamiento de imágenes";
            if (this.mainmode == 4) path.text = "Categorías medios";
            if (this.mainmode == 5) path.text = "Medios publicitarios";
            if (this.mainmode == 6) path.text = "Bancos";
            if (this.mainmode == 7) path.text = "Fiduciarias";
            if (this.mainmode == 8) path.text = "Zonas agrupamiento proyectos";
            if (this.mainmode == 9) path.text = "Ciudadelas";
            if (this.mainmode == 10) path.text = "Instructivos consignación y cierre";
            if (this.mainmode == 11) path.text = "Pies legales cotizaciones";
            if (this.mainmode == 12) path.text = "Trámites";
            if (this.mainmode == 13) path.text = "Otros Documentos";
            if (this.mainmode == 14) path.text = "Subsidios VIS";
            if (this.mainmode == 15) path.text = "Tipos Financiación";
            if (this.mainmode == 16) path.text = "Tipo Unidades y Ventas";
            if (this.mainmode == 17) path.text = "Estados Proyecto";
            if (this.mainmode == 18) path.text = "Tipologías Proyecto";
            if (this.mainmode == 19) path.text = "Emails Receptores";
            path.action = () => {
                this.mode = 0; this.setRuta(); this.loadData();
            };
            return path;
        },
        clearItem(item) {
            Object.keys(item).forEach((key) => (item[key] = null));
            if (this.mainmode == 5) this.medioIsActive = 0;
        },
        onClear(table) {
            let item = this.filtros[table];
            item = Object.keys(item).forEach((key) => 
                key == "is_img" && this.mainmode == 13 ? item[key] = '0' : item[key] = '');
        },
        async exportExcel(tabla) {
            try {
                showProgress();
                let datos = this.getFilteredList(tabla);
                var archivo = (await httpFunc("/util/Json2Excel", datos)).data;
                var formato = (await httpFunc("/util/ExcelFormater", { "file": archivo, "format": "FormatoMaestros" })).data;
                window.open("./docs/" + archivo, "_blank");
            }
            catch (e) {
                console.log(e);
            }
            hideProgress();
        },
        async loadData() {
            [
                this.gruposImg,
                this.categoriasMedios,
                this.mediosPublicitarios,
                this.bancos,
                this.fiduciarias,
                this.zonasProyectos,
                this.ciudadelas,
                this.instructivos,
                this.pies_legales,
                this.tramites,
                this.documentos,
                this.subsidios,
                this.tipos_financiacion,
                this.tipos_proyecto,
                this.estados_proyecto,
                this.tipos_vis,
                this.emails,

                this.factores,
                this.tipos_factor,
                this.bancos_factores,
            ] = (await httpFunc("/generic/genericDS/Maestros:Get_Maestros", {})).data;
        },
        fileUpload(e) {
            let file = e.target.files[0];
            if (file && !file.type.startsWith("image/")) e.target.value = "";
            else if (file) {
                this.subImg = file;
                this.subsidio.imagen = URL.createObjectURL(file);
            }
        },
        initQuill() {
            this.insEditor = 1;
            this.pieEditor = 1;
            this.traEditor = 1;
            setTimeout(() => {
                this.quills =
                    this.mainmode == 10
                        ? {
                            "#editor-pro": {
                                data: this.instructivo,
                                field: "procedimiento",
                            },
                            "#editor-cie": {
                                data: this.instructivo,
                                field: "documentacion_cierre",
                            },
                            "#editor-not": {
                                data: this.instructivo,
                                field: "notas",
                            },
                        }
                        : this.mainmode == 11
                            ? {
                                "#editor-tex": {
                                    data: this.pie_legal,
                                    field: "texto",
                                },
                                "#editor-not": {
                                    data: this.pie_legal,
                                    field: "notas_extra",
                                },
                            }
                            : {
                                "#editor-tex": {
                                    data: this.tramite,
                                    field: "texto",
                                },
                            };
                const toolbarOptions = [
                    ["bold", "italic", "underline", "strike"], // toggled buttons
                    ["blockquote", "code-block"],
                    ["link", "image", "video"],
                    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
                    [{ script: "sub" }, { script: "super" }], // superscript/subscript
                    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
                    [{ direction: "rtl" }], // text direction
                    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
                    [{ font: [] }],
                    [{ align: [] }],
                    ["clean"], // remove formatting button
                ];
                for (const key in this.quills) {
                    let quill = new Quill(key, {
                        modules: {
                            toolbar: toolbarOptions,
                        },
                        theme: "snow",
                    }),
                        item = this.quills[key];
                    quill.clipboard.dangerouslyPasteHTML(item.data[item.field]);
                    item.quill = quill;
                    quill.on("text-change", (delta, oldDelta, source) => {
                        item.data[item.field] = quill.getSemanticHTML(0, quill.getLength());
                    });
                }
            }, 100);
        },
        formatNumber(value) {
            if (!value) return "";
            let [parteEntera, parteDecimal] = value.split(".");
            parteEntera = parteEntera.replace(/\D/g, "");
            parteDecimal = parteDecimal ? parteDecimal.replace(/\D/g, "") : "";

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
        validarFormato(e) {
            e.target.value = e.target.value.replaceAll(/[^0-9\.,]/g, '');
        },
        validarNombre(e) {
            e.target.value = e.target.value.replaceAll(/[^\w\s]/g, '');
        },
        isEmail(email) {
            let regex = /[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})/i;
            return !email || regex.test(email);
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
                const droppedFiles = event.dataTransfer.files;
                this.processFiles(droppedFiles);
            }
        },
        async removeImage(index) {
            this.previews.splice(index, 1);
            this.files.splice(index, 1);
        },
        async handleFileChange(event) {
            const selectedFiles = event.target.files;
            this.processFiles(selectedFiles);
        },
        async processFiles(files) {
            let noDocs = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const exists = this.files.some(existingFile => existingFile.name === file.name);
                if (!exists) {
                    let ext = file.name.split('.').pop();
                    if (file.type.startsWith('image/') || this.getIcon(ext)) {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            if (file.type.startsWith('image/')) {
                                let f = { src: e.target.result, file: file };
                                Object.defineProperty(f, 'content', {
                                    get() { return this.src; },
                                    set(val) { this.src = val; }
                                });
                                await this.previews.push(f);
                            }
                            else await this.previews.push({ file: file, src: this.getIcon(ext), content: e.target.result });
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
        async openFiles(paths) {
            let files = [];
            try {
                files = await Promise.all(paths.map(async ({ path, name }) => {
                    const res = await fetch(path);
                    if (!res.ok) throw new Error(`Error al cargar ${path}: ${res.statusText}`);
                    const blob = await res.blob();
                    return new File([blob], name, { type: blob.type });
                }));
            } catch (error) {
                console.error("Error al cargar archivos:", error);
            }
            return files;
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
        async clearAllImages() {
            this.previews = [];
            this.files = [];
        },
        async loadFiles(id_doc, tipo) {
            this.clearAllImages();
            let res = await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                { tipo, id_maestro_documento: id_doc }),
                base = '/file/S3get/';
                if (res.data) {
                let paths = res.data.map(f => { return { path: base + f.llave, name: f.documento } });
                let files = await this.openFiles(paths);
                await this.processFiles(files);
                
                let previews = [];
                let interval = setInterval(() => {
                    if(this.previews.length == files.length) {
                        Promise.all(files.map(async f => {
                            await this.previews.forEach(pre => {
                                if (pre.file.name == f.name) previews.push(pre);
                            });
                        })).then(a => this.previews = [...previews]).then(a => {
                            this.files = [];
                            this.previews.forEach(pre => this.files.push(pre.file));
                        }).then(a => clearInterval(interval));
                    } else console.log("Cargando... " + this.previews.length);
                }, 10);
            }
        },
        async uploadS3(data, id_doc, tipo) {
            showProgress();
        
            const response = await httpFunc("/file/S3upload", data);
            console.log(response);
        
            if (response.isError) {
                showMessage(response.errorMessage);
                hideProgress();
                return;
            }
            let S3Files = response.data.map((item, i) => ({
                id_documento: item.Id,
                id_maestro_documento: id_doc,
                tipo,
                orden: i
            }));

            let res = await httpFunc("/generic/genericST/Medios:Del_Archivos", 
                { id_maestro_documento: id_doc, tipo });

            if (res.isError) {
                showMessage(`Error al eliminar archivo: ${archivo.id_documento}`);
                hideProgress();
                return;
            }

            S3Files.forEach(async archivo => {
                res = await httpFunc("/generic/genericST/Medios:Ins_Archivos", {
                    orden: archivo.orden,
                    id_documento: archivo.id_documento,
                    id_maestro_documento: archivo.id_maestro_documento,
                    tipo: archivo.tipo
                });
        
                if (res.isError) {
                    showMessage(`Error al insertar archivo: ${archivo.id_documento}`);
                    hideProgress();
                    return;
                }
            });
            hideProgress();
        },
        async toggleState(item) {
            item.is_active = item.is_active == '0' ? '1' : '0';
            await httpFunc(`/generic/genericST/Maestros:Upd_${this.getItem()[1]}`, item);
        },
        async deleteItem(item) {
            let list = this.getItem()[2],
                key = Object.keys(item).filter(k => k.includes('id_'))[0],
                index = list.findIndex(i => i[key] === item[key]),
                res = await httpFunc(`/generic/genericST/Maestros:Del_${this.getItem()[1]}`, item);
            if (res.data === 'OK' && index !== -1) list.splice(index, 1);
            else {
                let msg = res.errorMessage || ''; 
                showMessage(msg.includes('foreign key constraint fails') 
                    ? 'Error: No fue posible eliminar el registro.\nDatos en uso' : msg);
            }
        },
        async requestDelete(item) {
            showConfirm("Se eliminará permanentemente.", this.deleteItem, null, item);
        },
    },
    computed: {
        f_smmlv: {
            get() { return this.formatNumber(this.subsidio['smmlv']); },
            set(val) { this.subsidio['smmlv'] = this.cleanNumber(val); }
        },
        f_smmlv_0_2: {
            get() { return this.formatNumber(this.subsidio['smmlv_0_2']); },
            set(val) { this.subsidio['smmlv_0_2'] = this.cleanNumber(val); }
        },
        f_smmlv_2_4: {
            get() { return this.formatNumber(this.subsidio['smmlv_2_4']); },
            set(val) { this.subsidio['smmlv_2_4'] = this.cleanNumber(val); }
        },
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item => 
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                    ) : []
                ) : [];
            };
        }
    },
};
