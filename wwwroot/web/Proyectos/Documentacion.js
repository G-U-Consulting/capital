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
        window.activeMiniModule = this;
        window.activeMiniModule.name = "Documentacion";
        this.loadFiles();
        this.setRuta();
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
            let oversizedFiles = [];
            const maxSize = 5 * 1024 * 1024;

            for (let i = 0; i < files.length; i++) {
                const file = files[i].file;

                if (file.size > maxSize) {
                    oversizedFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                    continue;
                }

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

            if (oversizedFiles.length) {
                showMessage(`Los siguientes archivos exceden el tamaño máximo de 5MB:\n${oversizedFiles.join('\n')}`);
            }
            if (noDocs.length) {
                showMessage(`Error: Documentos no soportados\n${noDocs.join(', ')}`);
            }
        },
        getURLFile(file) {
            return URL.createObjectURL(file);
        },
        async openFiles(paths) {
            let files = [];
            try {
                files = await Promise.all(paths.map(async ({ path, name, newName }) => {
                    const res = await fetch(path);
                    if (!res.ok) throw new Error(`Error al cargar ${path}: ${res.statusText}`);
                    const blob = await res.blob();
                    return { newName, file: new File([blob], name, { type: blob.type }) };
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
            if (["vsd", "vsdm", "vsdx", "vssx", "vssm"].includes(ext)) return base + 'Visio.png';
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
            let form = new FormData();
            this.previews.forEach(pre => form.append(pre.file.name, pre.file));
            let res = await httpFunc("/file/upload", form);
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
                let paths = res.data.map(f => { return { path: base + f.llave, name: f.documento, newName: f.nombre_documento } });
                let files = await this.openFiles(paths);
                await this.processFiles(files);

                let previews = [];
                let interval = setInterval(() => {
                    if (this.previews.length == files.length) {
                        Promise.all(files.map(async ({ newName, file }) => {
                            await this.previews.forEach(pre => {
                                if (pre.file.name == file.name) previews.push(pre);
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
                nombre: this.previews[i]?.newName || item.Name,
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
        },
        setRuta() {
            if (GlobalVariables.miniModuleCallback) {
                this.ruta = [{
                    text: `${GlobalVariables.nombre_proyecto || GlobalVariables.proyecto?.nombre || this.proyecto?.nombre || ''}`,
                    action: () => {
                        GlobalVariables.miniModuleCallback('GoToProjectHome', null);
                    }
                }, {
                    text: 'Documentación',
                    action: () => {}
                }];
                GlobalVariables.miniModuleCallback('SetRuta', this.ruta);
            }
        }
    }
}