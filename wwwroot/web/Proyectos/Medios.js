export default {
    data() {
        return {
            mode: -1,
            submode: 0,
            mediaTabs: [
                "Secuencia",
                "Principal",
                "Imágenes",
                "Videos",
                "Recorridos Virt",
                "Avances de obra"
            ],
            tabsIncomplete: [],
            files: [],
            draggedFile: null,
            dragIndex: null,
            videos: [
                { title: '', description: '', link: '' }
            ],
            videosReco: [
                { title: '', description: '', link: '' }
            ],
            hoveredIndex: null,
            selectedRow: null,
            selectedRowReco: null,
            modalVideoId: null,
            grupo_img: [],
            tablas: [],
            selected: {
                tablaIndex: null,
                itemIndex: null
            },
            editando: {
                tablaIndex: null,
                itemIndex: null,
            },
            
            tooltipVisible: false,
            tooltipX: 0,
            tooltipY: 0,
            logoPreview: null,
            slidePreview: null,
            plantaPreview: null,
            isExpanded: {
                logo: false,
                slide: false,
                planta: false
            },
            previews: [],
            tooltipMsg: "Arrastra o haz clic para cargar archivos.",
            documentos: [],
            filtros: {
                documentos: {is_img: '0'},
             
            },
            logoPreview: null,
            slidePreview: null,
            plantaPreview: null,
            logoFile: null,
            slideFile: null,
            plantaFile: null,

        };
    },
    computed: {
        tabClasses() {
          return this.mediaTabs.map((_, index) => {
            if (this.submode === index) {
              return 'wizarTabActive';
            } else if (!this.tabsIncomplete.includes(index)) {
              return 'wizarTabCompleted';
            } else {
              return 'wizarTabIncomplete';
            }
          });
        },
    },
    async mounted() {
        this.tabsIncomplete = this.mediaTabs.map((_, index) => index);
        GlobalVariables.miniModuleCallback("StartMediaMdule", null)
        const res = await httpFunc("/generic/genericDT/Medios:Get_vairables", {});
        const grupo_img = res.data.map(item => item.grupo);
        this.construirTablas(grupo_img);
    },
    methods: {
        setMode(mode) {
            this.mode = mode;
            // if(mode == 0)
            //     GlobalVariables.miniModuleCallback("StartMediaMdule", null)
        },
        async setSubmode(index) {
            this.submode = index;
        },
        construirTablas(grupo_img) {
            this.tablas = [
                {
                    titulo: 'Agrupaciones Generales',
                    datos: ['Grupo xx', 'Grupo xx', 'Grupo xx', '', '', '', '', ''],
                    activo: true,
                    error: false
                },
                {
                    titulo: 'Imágenes Principales',
                    datos: ['Item 1', 'Item 2', 'Item 3', '', '', '', '', ''],
                    activo: false,
                    error: false
                },
                {
                    titulo: 'Agrupamiento de Imágenes de Proyecto',
                    datos: grupo_img,
                    activo: true,
                    error: false
                },
                {
                    titulo: 'Agrupamiento de Vídeos de Proyecto',
                    datos: ['Item 1', 'Item 2', 'Item 3', '', '', '', '', ''],
                    activo: false,
                    error: true
                },
                {
                    titulo: 'Agrupamiento de Recorridos Virtuales',
                    datos: ['Item 1', 'Item 2', 'Item 3', '', '', '', '', ''],
                    activo: true,
                    error: false
                },
                {
                    titulo: 'Periodos de Avances de obra',
                    datos: ['Item 1', 'Item 2', 'Item 3', '', '', '', '', ''],
                    activo: false,
                    error: false
                }
            ];
        },
        dragStart(index) {
            this.dragIndex = index;
        },
        dragOver(event) {
            // Necesario para permitir el "drop" en el contenedor
        },
        async handleDrop(event, targetKey = null) {
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
            const droppedFiles = event.dataTransfer.files;
            if (droppedFiles.length > 0) {
                if (targetKey) {
                    const file = droppedFiles[0];
                    if (!file.type.startsWith("image/")) {
                        showMessage("Solo se permiten imágenes.");
                        return;
                    }
                    if (file.size > 2 * 1024 * 1024) {
                        showMessage("La imagen debe pesar menos de 2Mb.");
                        return;
                    }
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this[targetKey] = e.target.result;
                        if (targetKey === 'logoPreview') this.logoFile = file;
                        else if (targetKey === 'slidePreview') this.slideFile = file;
                        else if (targetKey === 'plantaPreview') this.plantaFile = file;
                    };
                    reader.readAsDataURL(file);
                } else {
                    Array.from(droppedFiles).forEach(file => {
                        if (!file.type.startsWith("image/")) return;
                        if (file.size > 2 * 1024 * 1024) return;
        
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.previews.push({ src: e.target.result, file });
                            this.files.push(file);
                        };
                        reader.readAsDataURL(file);
                    });
                }
            }
        },
        removeImage(index) {
            this.previews.splice(index, 1);
            this.files.splice(index, 1);
        },
        handleFileChange(event) {
            const selectedFiles = event.target.files;
            this.processFiles(selectedFiles);
        },
        handleDragOver(event) {
            event.preventDefault();
        },
        processFiles(files) {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    const exists = this.files.some(existingFile => existingFile.name === file.name);
                    if (!exists) {
                        this.files.push(file);
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.previews.push({ src: e.target.result, file: file });
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
        },
        async clearAllImages() {
            this.previews = [];
            this.files = [];
        },
        openModal(link) {
            const id = this.getVideoId(link);
            if (id) {
                this.modalVideoId = id;
            }
        },
        getVideoId(url) {
            const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            return match ? match[1] : null;
        },
        async addRow() {
            this.videos.push({ title: '', description: '', link: '' });
        },
        async selectRow(index) {
            this.selectedRow = index;
        },
        async selectRowReco(index) {
            this.selectedRowReco = index;
        },
        async moveRow(direction) {
            const i = this.selectedRow;
            if (i === null || i < 0 || i >= this.videos.length) return;
          
            if (direction === 'up' && i > 0) {
              const temp = this.videos[i];
              this.videos[i] = this.videos[i - 1];
              this.videos[i - 1] = temp;
              this.selectedRow = i - 1;
            } else if (direction === 'down' && i < this.videos.length - 1) {
              const temp = this.videos[i];
              this.videos[i] = this.videos[i + 1];
              this.videos[i + 1] = temp;
              this.selectedRow = i + 1;
            }
        },
        async updateCursor(event) {
            this.tooltipX = event.clientX + 10;
            this.tooltipY = event.clientY + 10;
        },
        async selectItem(tablaIdx, itemIdx) {
            this.selected.tablaIndex = tablaIdx;
            this.selected.itemIndex = itemIdx;
        },
        async moveRow(direction) {
            const { tablaIndex, itemIndex } = this.selected;
            if (tablaIndex === null || itemIndex === null) return;

            const tabla = this.tablas[tablaIndex];
            const datos = tabla.datos;

            if (direction === 'up' && itemIndex > 0) {
                [datos[itemIndex - 1], datos[itemIndex]] = [datos[itemIndex], datos[itemIndex - 1]];
                this.selected.itemIndex--;
            } else if (direction === 'down' && itemIndex < datos.length - 1) {
                [datos[itemIndex + 1], datos[itemIndex]] = [datos[itemIndex], datos[itemIndex + 1]];
                this.selected.itemIndex++;
            }
        },
        async addRowSec() {
            const { tablaIndex, itemIndex } = this.selected;
            if (tablaIndex === null || itemIndex === null) return;
          
            const datos = this.tablas[tablaIndex].datos;
            datos.splice(itemIndex + 1, 0, '');
            this.selected.itemIndex = itemIndex + 1;
            this.editando = { tablaIndex, itemIndex: itemIndex + 1 };
        },
        async deleteRow() {
            const { tablaIndex, itemIndex } = this.selected;
            if (tablaIndex === null || itemIndex === null) return;

            const datos = this.tablas[tablaIndex].datos;
            datos.splice(itemIndex, 1);

            if (datos.length === 0) {
                this.selected.tablaIndex = null;
                this.selected.itemIndex = null;
            } else {
                this.selected.itemIndex = Math.min(itemIndex, datos.length - 1);
            }
        },
        async onItemEditFinish(i, j) {
            const valor = this.tablas[i].datos[j].trim();
            if (valor === '') {
                this.tablas[i].datos.splice(j, 1);
                if (this.tablas[i].datos.length === 0) {
                    this.selected = { tablaIndex: null, itemIndex: null };
                } else {
                    this.selected.itemIndex = Math.min(j, this.tablas[i].datos.length - 1);
                }
            }
            this.editando = { tablaIndex: null, itemIndex: null };
        },
        selectItem(i, j) {
            const tabla = this.tablas[i];
            if (tabla.titulo === 'General de C. Capital' || tabla.activo) return;

            this.selected.tablaIndex = i;
            this.selected.itemIndex = j;

            this.editando.tablaIndex = i;
            this.editando.itemIndex = j;

            this.$nextTick(() => {
                this.$refs.editInput?.focus?.();
            });
        },
        onItemEditFinish(i, j) {
            this.editando.tablaIndex = null;
            this.editando.itemIndex = null;
        },
        moveRowVid(direction) {
            if (this.selectedRow === null) return;

            const index = this.selectedRow;
            const max = this.videos.length - 1;

            if (direction === 'up' && index > 0) {
                const temp = this.videos[index];
                this.videos.splice(index, 1);
                this.videos.splice(index - 1, 0, temp);
                this.selectedRow = index - 1;
            }

            if (direction === 'down' && index < max) {
                const temp = this.videos[index];
                this.videos.splice(index, 1);
                this.videos.splice(index + 1, 0, temp);
                this.selectedRow = index + 1;
            }
        },
        addRowVid() {
            const newRow = { title: '', description: '', link: '' };

            if (this.selectedRow !== null) {
                this.videos.splice(this.selectedRow + 1, 0, newRow);
                this.selectedRow += 1;
            } else {
                this.videos.push(newRow);
                this.selectedRow = this.videos.length - 1;
            }
        },
        removeRow(index) {
            this.videos.splice(index, 1);
            if (this.selectedRow === index) {
                this.selectedRow = null;
            } else if (this.selectedRow > index) {
                this.selectedRow--;
            }
        },
        moveRowReco(direction) {
            if (this.selectedRowReco === null) return;

            const index = this.selectedRowReco;
            const max = this.videosReco.length - 1;

            if (direction === 'up' && index > 0) {
                const temp = this.videosReco[index];
                this.videosReco.splice(index, 1);
                this.videosReco.splice(index - 1, 0, temp);
                this.selectedRowReco = index - 1;
            }

            if (direction === 'down' && index < max) {
                const temp = this.videosReco[index];
                this.videosReco.splice(index, 1);
                this.videosReco.splice(index + 1, 0, temp);
                this.selectedRowReco = index + 1;
            }
        },
        addRowReco() {
            const newRow = { title: '', description: '', link: '' };

            if (this.selectedRowReco !== null) {
                this.videosReco.splice(this.selectedRowReco + 1, 0, newRow);
                this.selectedRowReco += 1;
            } else {
                this.videosReco.push(newRow);
                this.selectedRowReco = this.videosReco.length - 1;
            }
        },
        removeRowReco(index) {
            this.videosReco.splice(index, 1);
            if (this.selectedRowReco === index) {
                this.selectedRowReco = null;
            } else if (this.selectedRowReco > index) {
                this.selectedRowReco--;
            }
        },
        previewImage(event, target) {
            const file = event.target.files[0];
            if (!file) return;
        
            const reader = new FileReader();
            reader.onload = e => {
                this[target] = e.target.result;
            };
            reader.readAsDataURL(file);
        
            if (target === 'logoPreview') this.logoFile = { file, tipo: 'logo' };
            else if (target === 'slidePreview') this.slideFile = { file, tipo: 'slide' };
            else if (target === 'plantaPreview') this.plantaFile = { file, tipo: 'planta' };

        },
        expandImage(type) {
            this.isExpanded[type] = true;
        },
        closeModal() {
            this.isExpanded.logo = false;
            this.isExpanded.slide = false;
            this.isExpanded.planta = false;
            this.modalVideoId = null;
        },
        removePreview(type) {
            if (type === 'logo') {
                this.logoPreview = null;
            } else if (type === 'slide') {
                this.slidePreview = null;
            } else if (type === 'planta') {
                this.plantaPreview = null;
            }
        },
        configclearAllImages(){
            showConfirm("Se eliminará permanentemente.", this.clearAllImages, null, null);
        },
        async uploadFiles() {
            showProgress();
            var form = new FormData();
            for (let i = 0; i < this.files.length; i++)
                form.append(this.files[i].name, this.files[i]);
            var response = await httpFunc("/file/upload", form);
            console.log(response);
            if (response.isError) {
                showMessage(response.errorMessage);
            } else { 
                this.serverFiles = response.data;
                this.S3UploadFiles();
            }
            hideProgress();
        },
        async S3UploadFiles() {
            showProgress();
        
            const response = await httpFunc("/file/S3upload", this.serverFiles);
            console.log(response);
        
            if (response.isError) {
                showMessage(response.errorMessage);
                hideProgress();
                return;
            }
        
            const folderMap = {
                1: 'Principal',
                2: 'Imagenes',
                5: 'Avances de obra'
            };
            const folder = folderMap[this.submode] || 'Principal';
        
            this.S3Files = response.data.map((item, index) => ({
                id_documento: item.Id,
                id_proyecto: GlobalVariables.id_proyecto,
                tipo: folder,
                orden: index + 1
            }));
        
            for (let archivo of this.S3Files) {
                const result = await httpFunc("/generic/genericST/Medios:Del_Archivos", {
                    nombre: archivo.nombre || '',
                    codigo: archivo.codigo || '',
                    orden: archivo.orden,
                    id_documento: archivo.id_documento,
                    id_proyecto: archivo.id_proyecto,
                    tipo: archivo.tipo
                });
        
                if (result.isError) {
                    showMessage(`Error al eliminar archivo: ${archivo.id_documento}`);
                    hideProgress();
                    return;
                }
            }
            for (let archivo of this.S3Files) {
                const result = await httpFunc("/generic/genericST/Medios:Ins_Archivos", {
                    nombre: archivo.nombre || '',
                    codigo: archivo.codigo || '', 
                    orden: archivo.orden,
                    id_documento: archivo.id_documento,
                    id_proyecto: archivo.id_proyecto,
                    tipo: archivo.tipo
                });
        
                if (result.isError) {
                    showMessage(`Error al insertar archivo: ${archivo.id_documento}`);
                    hideProgress();
                    return;
                }
            }
            hideProgress();
        },
        async loadImg() {
            await this.clearAllImages();
            await imagePath
            let folderMap = {
                1: 'Principal',
                2: 'Imagenes',
                5: 'Avances de obra'
            },
                folder = folderMap[this.submode] || 'Principal';
            const resp = (await httpFunc("/generic/genericDT/Medios:Get_Archivos", { id_proyecto: GlobalVariables.id_proyecto, tipo: folder })).data;
            for (let file of resp) {
                var imagePath = ""
                
                imagePath = "/file/S3get/" + file.llave;

                const blob = await this.fetchImageAsBlob(imagePath);
                if (!blob) continue;

                const fileObj = new File([blob], file.nombre, { type: blob.type });

                const reader = new FileReader();
                reader.onload = (e) => {
                    const src = e.target.result;

                    if (folder.includes('Principal')) {
                        if (file.nombre.includes('logo')) {
                            this.logoPreview = src;
                            this.logoFile = fileObj;
                        } else if (file.nombre.includes('slide')) {
                            this.slidePreview = src;
                            this.slideFile = fileObj;
                        } else if (file.nombre.includes('planta')) {
                            this.plantaPreview = src;
                            this.plantaFile = fileObj;
                        }
                    } else {
                        this.previews.push({ src, file: fileObj });
                        this.files.push(fileObj);
                    }
                };
                reader.readAsDataURL(fileObj);
            }
        },
        async fetchImageAsBlob(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Error al obtener la imagen: ${url}`);
                return await response.blob();
            } catch (error) {
                console.error(error);
                return null;
            }
        },
        clearAllImages() {
            this.logoPreview = null;
            this.logoFile = null;
            this.slidePreview = null;
            this.slideFile = null;
            this.plantaPreview = null;
            this.plantaFile = null;
            this.previews = [];
            this.files = [];
        }
    }
};
