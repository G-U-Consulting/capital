export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            proyecto: null,
            documento: {},

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
        this.proyecto = await GlobalVariables.miniModuleCallback("OpenDocs", null);
        this.setMainMode('Documentacion');
        this.loadFiles();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
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
        async onSave() {
            showProgress();
            console.log(this.previews);
            let form = new FormData();
            this.previews.forEach(pre => form.append(pre.file.name, pre.file));
            let res = await httpFunc("/file/upload", form);
            console.log(res);
            if (res.isError) showMessage(res.errorMessage);
            else this.uploadS3(res.data);
            
            hideProgress();
        },
        async loadFiles() {
            this.clearAllImages();
            let res = await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                { tipo: 'docs', id_proyecto: this.proyecto.id_proyecto }),
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
        async uploadS3(data) {
            showProgress();
        
            const response = await httpFunc("/file/S3upload", data),
                id_pro = this.proyecto.id_proyecto;
            console.log(response);
        
            if (response.isError) {
                showMessage(response.errorMessage);
                hideProgress();
                return;
            }
            let S3Files = response.data.map((item, i) => ({
                id_documento: item.Id,
                id_proyecto: id_pro,
                tipo: 'docs',
                orden: i
            }));

            let res = await httpFunc("/generic/genericST/Medios:Del_Archivos", 
                { id_proyecto: id_pro, tipo: 'docs' });

            if (res.isError) {
                showMessage(`Error al eliminar archivo: ${archivo.id_documento}`);
                hideProgress();
                return;
            }

            S3Files.forEach(async archivo => {
                res = await httpFunc("/generic/genericST/Medios:Ins_Archivos", {
                    nombre: archivo.nombre || '',
                    codigo: archivo.codigo || '', 
                    orden: archivo.orden,
                    id_documento: archivo.id_documento,
                    id_proyecto: archivo.id_proyecto,
                    tipo: archivo.tipo
                });
        
                if (res.isError) {
                    showMessage(`Error al insertar archivo: ${archivo.id_documento}`);
                    hideProgress();
                    return;
                }
            });
            hideProgress();
        }
    }
}