export default {
    data() {
        return {
            mode: -1,
            submode: 0,
            mediaTabs: [
                "Sec Carrusel",
                "Img Principales",
                "Imágenes",
                "Videos",
                "Recorridos Virt",
                "Avances de obra"
            ],
            tabsIncomplete: [],
            logoPreview: null,
            slidePreview: null,
            plantaPreview: null,
            previews: [],
            previewsAvo: [],
            files: [],
            filesAvo: [],
            videos: [
                { nombre: '', descripcion: '', link: '' }
            ],
            videosReco: [
                { nombre: '', descripcion: '', link: '' }
            ],
            draggedFile: null,
            dragIndex: null,
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
            tooltipMsg: "Arrastra o haz clic para cargar archivos.",
            documentos: [],
            filtros: {
                documentos: { is_img: '0' },
            },
            logoPreview: null,
            slidePreview: null,
            plantaPreview: null,
            logoFile: null,
            slideFile: null,
            plantaFile: null,
            logoChanged: false,
            slideChanged: false,
            plantaChanged: false,
            selectImg: null,
            selectVid: null,
            selectRvr: null,
            selectAvo: null,
            grupo_proyectos: [],
            modeimg: false,
            modeAvo: false,
            modevid: false,
            modevir: false,
            ismodulImg: false,
            ismodulVid: false,
            ismodulRvr: false,
            ismodulAvo: false,
            S3Files: [],
            videoId: null,
            previewSrc: null,
            modalVisible: false,
            plantaPreviewAll: [],
            playIndex: 0,
            interval: null,
            time: 8000,
            stop: false,
            showBar: true,
            loading: false,
            newName: '',
            modalEmbedUrl: null,
            expandedVisible: false,
            expandedImage: null,
            archivosPreview: [],
            uploadedFilesMap: [],
        };
    },
    computed: {
        tabClasses() {
            return this.mediaTabs.map((_, index) => {
                if (this.submode === index) {
                    return 'wizarTabActive';
                } else if (!this.tabsIncomplete.includes(index)) {
                    return 'wizarTabIncomplete';
                } else {
                    return 'wizarTabCompleted';
                }
            });
        },
        getPreviewSrc() {
            return '../../img/ico/youtobe.png';
        },
        allItems() {
            let items = [];

            if (this.tablas && this.tablas.length && this.archivosPreview?.length) {
                const activos = this.archivosPreview.filter(a => a.is_active === '1');

                const addByTab = (index) => {
                    if (this.tablas[index] && !this.tablas[index].activo) {
                        const grupo = activos.filter(a => {
                            if (index === 3) return a.tipo === 'videos';
                            if (index === 2) return a.tipo === 'imagenes';
                            return ['logo', 'slide', 'planta'].includes(a.tipo);
                        }).map(a => {
                            if (a.tipo === 'videos' && a.link) {
                                return {
                                    ...a,
                                    src: this.getPreviewSrc,
                                    isVideo: true 
                                };
                            }
                            return a;
                        });

                        items = items.concat(grupo);
                    }
                };
                addByTab(1);
                addByTab(2); 
                addByTab(0);
                addByTab(3);           
            }
            return items;
        }
    },
    async mounted() {
        this.tabsIncomplete = this.mediaTabs.map((_, index) => index);
        GlobalVariables.miniModuleCallback("ImagenesVideos", GlobalVariables.proyecto);
        window.activeMiniModule = this;
        window.activeMiniModule.name = "Medios";
        await this.setSubmode(0);
    },
    methods: {
        async onToggleChange() {
            await this.loadPreviewItem();
        },
        async setSubmode(index) {
            const hayPendientes =
                this.previews.some(item => !!item.extension) ||
                (this.previewsAvo && this.previewsAvo.some(item => !!item.extension));

            if (hayPendientes) {
                showConfirm(
                    "Tiene elementos pendientes por guardar",
                    () => {
                        this.submode = index;
                        this.previews = [];
                        this.previewsAvo = [];
                    },
                    null,
                    null
                );
                return;
            }

            this.submode = index;
            this.setRuta();

            if (index === 0) {
                const grupo_img = await this.actualizarDatos('imagenes');
                const grupo_vid = await this.actualizarDatos('videos');
                const grupo_vir = await this.actualizarDatos('Recorridos virt');
                const grupo_avo = await this.actualizarDatos('avances de obra');

                await this.construirTablas(grupo_img, grupo_vid, grupo_vir, grupo_avo);
                this.setRuta();
            }
            if (index == 1) {
                this.loadImg()
                return;
            }
            this.modeimg = true;
            this.modeAvo = true;
            this.modevid = true;
            this.modevir = true;
            const modulos = {
                1: 'principal',
                2: 'imagenes',
                3: 'videos',
                4: 'recorridos virt',
                5: 'avances de obra'
            };
            const modulo = modulos[index];
            if (!modulo) return;
            try {
                showProgress();
                const res = await httpFunc("/generic/genericDT/Medios:Get_variables", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo
                });
                hideProgress();
                this.grupo_proyectos = res.data;

            } catch (error) {
                console.log(error);
            }
        },
        async loadPreviewItem() {
            const tipos = [];

            if (this.tablas?.[1] && !this.tablas[1].activo) {
                tipos.push('logo', 'slide', 'planta');
            }

            if (this.tablas?.[2] && !this.tablas[2].activo) {
                tipos.push('imagenes');
            }

            if (this.tablas?.[3] && !this.tablas[3].activo) {
                tipos.push('videos');
            }

            if (!tipos.length) return;

            try {
                const response = await httpFunc('/generic/genericDT/Maestros:Get_Archivos', {
                    tipo: tipos.join(','),
                    id_proyecto: GlobalVariables.id_proyecto
                });

                const archivos = response.data || [];

                let archivosTemp = archivos
                    .filter(a => a.is_active === '1')
                    .map((a, i) => ({
                        src: '',
                        llave: a.llave,
                        nombre: a.documento,
                        orden: a.orden,
                        tipo: a.tipo,
                        is_active: a.is_active,
                        link: a.link
                    }));

                await Promise.all(archivosTemp.map(async (a, i) => {
                    try {
                        const res = await fetch('/file/S3get/' + a.llave);
                        if (!res.ok) throw new Error(`Error al cargar ${a.llave}: ${res.statusText}`);
                        const blob = await res.blob();
                        const reader = new FileReader();

                        await new Promise(resolve => {
                            reader.onload = e => {
                                archivosTemp[i].src = e.target.result;
                                resolve();
                            };
                            reader.readAsDataURL(blob);
                        });
                    } catch (e) {
                        console.warn(`No se pudo cargar archivo ${a.llave}:`, e);
                    }
                }));

                this.archivosPreview = archivosTemp;

            } catch (error) {
                console.error("Error al obtener archivos S3:", error);
            }

            return;
        },
        construirTablas(grupo_img, grupo_vid, grupo_vir, grupo_avo) {
            this.tablas = [
                {
                    titulo: 'Agrupaciones Generales',
                    datos: ['Generales Capital', 'Sostenibilidad'],
                    activo: true,
                    error: false
                },
                {
                    titulo: 'Imágenes Principales',
                    datos: ['Logo', 'Slide ', 'Planta General Termómetro'],
                    activo: true,
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
                    datos: grupo_vid,
                    activo: true,
                    error: true
                },
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

            const droppedText = event.dataTransfer.getData('text');
            if (droppedText && (droppedText.includes('youtube.com') || droppedText.includes('youtu.be'))) {
                const videoId = this.extractYouTubeId(droppedText);
                if (videoId) {
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

                    this.previewsAvo.push({
                        isVideo: true,
                        src: thumbnailUrl,
                        videoUrl: droppedText,
                        name: 'Video de YouTube'
                    });

                    this.filesAvo.push({
                        isVideo: true,
                        Url: droppedText,
                        name: 'Video de YouTube'
                    });
                }
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
                        if (targetKey === 'logoPreview') {
                            this.logoFile = file;
                            this.logoChanged = true;
                        } else if (targetKey === 'slidePreview') {
                            this.slideFile = file;
                            this.slideChanged = true;
                        } else if (targetKey === 'plantaPreview') {
                            this.plantaFile = file;
                            this.plantaChanged = true;
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    Array.from(droppedFiles).forEach(file => {
                        if (!file.type.startsWith("image/")) return;
                        if (file.size > 2 * 1024 * 1024) return;

                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const hasExtension = file.name.includes('.');
                            const defaultName = hasExtension
                                ? file.name.split('.').slice(0, -1).join('.')
                                : file.name;

                            const extension = hasExtension
                                ? file.name.split('.').pop()
                                : file.type.split('/').pop();
                            this.previews.push({
                                src: e.target.result,
                                file: file,
                                newName: defaultName,
                                extension: extension
                            });
                            this.files.push(file);
                        };
                        reader.readAsDataURL(file);
                    });
                }
            }
        },
        async handleDropAvo(event, targetKey = null) {
            if (this.dragIndex !== null) {
                const dropTarget = event.target.closest('.image-card');
                if (dropTarget) {
                    const dropIndex = Array.from(event.currentTarget.querySelectorAll('.image-card')).indexOf(dropTarget);
                    if (dropIndex !== -1 && dropIndex !== this.dragIndex) {
                        const draggedItem = this.previewsAvo[this.dragIndex];
                        const draggedFile = this.filesAvo[this.dragIndex];

                        this.previewsAvo.splice(this.dragIndex, 1);
                        this.filesAvo.splice(this.dragIndex, 1);

                        this.previewsAvo.splice(dropIndex, 0, draggedItem);
                        this.filesAvo.splice(dropIndex, 0, draggedFile);
                        this.dragIndex = null;
                        return;
                    }
                }
                this.dragIndex = null;
                return;
            }

            const droppedText = event.dataTransfer.getData('text');
            if (droppedText && (droppedText.includes('youtube.com') || droppedText.includes('youtu.be'))) {
                const videoId = this.extractYouTubeId(droppedText);
                if (videoId) {
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

                    this.previewsAvo.push({
                        isVideo: true,
                        src: thumbnailUrl,
                        videoUrl: droppedText,
                        name: 'Video de YouTube'
                    });

                    this.filesAvo.push({
                        isVideo: true,
                        Url: droppedText,
                        name: 'Video de YouTube'
                    });
                }
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
                        if (targetKey === 'logoPreview') {
                            this.logoFile = file;
                            this.logoChanged = true;
                        } else if (targetKey === 'slidePreview') {
                            this.slideFile = file;
                            this.slideChanged = true;
                        } else if (targetKey === 'plantaPreview') {
                            this.plantaFile = file;
                            this.plantaChanged = true;
                        }
                    };
                    reader.readAsDataURL(file);
                } else {
                    Array.from(droppedFiles).forEach(file => {
                        if (!file.type.startsWith("image/")) return;
                        if (file.size > 2 * 1024 * 1024) return;

                        const reader = new FileReader();
                        reader.onload = (e) => {
                            this.previewsAvo.push({ src: e.target.result, file });
                            this.filesAvo.push(file);
                        };
                        reader.readAsDataURL(file);
                    });
                }
            }
        },
        removeImage(index) {
            this.previews.splice(index, 1);
            this.files.splice(index, 1);
            this.previewsAvo.splice(index, 1);
            this.filesAvo.splice(index, 1);
        },
        handleFileChange(event, isAvo) {
            const selectedFiles = event.target.files;
            this.processFilesUnified(selectedFiles, isAvo);
        },
        processFilesUnified(files, isAvo) {
            const maxSize = 5 * 1024 * 1024;
            let oversizedFiles = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                if (file.size > maxSize) {
                    oversizedFiles.push(`${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);
                    continue;
                }

                if (file.type.startsWith('image/')) {
                    const fileList = isAvo ? this.filesAvo : this.files;
                    const previewList = isAvo ? this.previewsAvo : this.previews;

                    const exists = fileList.some(existingFile => existingFile.name === file.name);
                    if (!exists) {
                        fileList.push(file);

                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const hasExtension = file.name.includes('.');
                            const newName = hasExtension
                                ? file.name.split('.').slice(0, -1).join('.')
                                : file.name;

                            const extension = hasExtension
                                ? file.name.split('.').pop()
                                : file.type.split('/').pop();

                            previewList.push({
                                src: e.target.result,
                                file: file,
                                newName: newName,
                                extension: extension
                            });
                        };

                        reader.readAsDataURL(file);
                    }
                }
            }

            if (oversizedFiles.length) {
                showMessage(`Los siguientes archivos exceden el tamaño máximo de 5MB:\n${oversizedFiles.join('\n')}`);
            }
        },
        handleDragOver(event) {
            event.preventDefault();
        },
        extractYouTubeId(url) {
            const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[1].length === 11) ? match[1] : null;
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
        openModalRv(url) {
            const embedUrl = this.isEmbedUrl(url);
            if (embedUrl) {
                this.modalEmbedUrl = embedUrl;
            } else {
                showMessage("URL no soportada.");
            }
        },
        isEmbedUrl(url) {
            return url;
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
        selectItem(tablaIndex, itemIndex) {
            const tabla = this.tablas[tablaIndex];
            if (tabla.titulo === 'Agrupaciones Generales' || tabla.titulo === 'Imágenes Principales' || tabla.activo) return;
            this.selected.tablaIndex = tablaIndex;
            this.selected.itemIndex = itemIndex;
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

            const maxSize = 5 * 1024 * 1024; // 5MB en bytes

            if (file.size > maxSize) {
                showMessage(`El archivo "${file.name}" excede el tamaño máximo permitido de 5MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
                event.target.value = "";
                return;
            }

            const reader = new FileReader();
            reader.onload = e => {
                this[target] = e.target.result;
            };
            reader.readAsDataURL(file);

            if (target === 'logoPreview') {
                this.logoFile = { file, tipo: 'logo' };
                this.logoChanged = true;
            } else if (target === 'slidePreview') {
                this.slideFile = { file, tipo: 'slide' };
                this.slideChanged = true;
            } else if (target === 'plantaPreview') {
                this.plantaFile = { file, tipo: 'planta' };
                this.plantaChanged = true;
            }

        },
        expandImage(type) {
            this.isExpanded[type] = true;
        },
        closeModal() {
            this.isExpanded.logo = false;
            this.isExpanded.slide = false;
            this.isExpanded.planta = false;
            this.modalEmbedUrl = null;
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
        configclearAllImages() {
            showConfirm("Se eliminará permanentemente.", this.clearAllImages, null, null);
        },
        async uploadFiles() {
            const form = new FormData();

            function getFile(f) {
                if (!f) return null;
                return f instanceof File ? f : f.file || null;
            }

            
            if (this.submode === 1) {
                this.uploadedFilesMap = [];
                const filesWithTypes = [
                    { file: this.logoFile, tipo: 'logo', orden: 0, changed: this.logoChanged },
                    { file: this.slideFile, tipo: 'slide', orden: 1, changed: this.slideChanged },
                    { file: this.plantaFile, tipo: 'planta', orden: 2, changed: this.plantaChanged }
                ];

               
                filesWithTypes.forEach(item => {
                    const file = getFile(item.file);
                    if (file && item.changed) {
                        form.append(file.name, file);
                        this.uploadedFilesMap.push(item);
                    }
                });
            } else if (this.submode === 2) {
                this.files.forEach(fObj => {
                    const file = getFile(fObj) || fObj;
                    if (file) form.append(file.name, file);
                });
            } else if (this.submode === 5) {
                this.filesAvo.forEach(fObj => {
                    const file = getFile(fObj) || fObj;
                    if (file) form.append(file.name, file);
                });
            }

            showProgress();
            const response = await httpFunc("/file/upload", form);
            hideProgress();
            if (response.isError) {
                showMessage(response.errorMessage);
            } else {
                this.serverFiles = response.data;
                this.S3UploadFiles();
            }
        },
        detectImageExtensionFromSrc(src) {
            if (typeof src !== 'string') return 'unknown';
            const base64 = src.split(',')[1];
            if (!base64) return 'unknown';

            const binary = atob(base64.slice(0, 20));
            const bytes = [...binary].map(c => c.charCodeAt(0));
            const header = bytes.map(b => b.toString(16).padStart(2, '0')).join('');

            if (header.startsWith('89504e47')) return 'png';
            if (header.startsWith('ffd8ff')) return 'jpg';
            if (header.startsWith('47494638')) return 'gif';
            if (header.startsWith('52494646') && header.includes('57454250')) return 'webp';

            return 'unknown';
        },
        async S3UploadFiles() {
            const getFile = (f) => f instanceof File ? f : f?.file || null;

            showProgress();
            const response = await httpFunc("/file/S3upload", this.serverFiles);

            if (response.isError) {
                showMessage(response.errorMessage);
                hideProgress();
                return;
            }

            const folderMap = {
                1: 'principal',
                2: 'imagenes',
                3: 'videos',
                4: 'recorridos virt',
                5: 'avances de obra'
            };

            const folder = folderMap[this.submode] || 'principal';

            if (this.submode === 1) {
                
                const allFiles = [
                    { file: this.logoFile, tipo: 'logo', orden: 0, changed: this.logoChanged },
                    { file: this.slideFile, tipo: 'slide', orden: 1, changed: this.slideChanged },
                    { file: this.plantaFile, tipo: 'planta', orden: 2, changed: this.plantaChanged }
                ];

                let uploadIndex = 0;
                this.S3Files = allFiles
                    .filter(item => getFile(item.file) !== null)
                    .map((item) => {
                        const file = getFile(item.file);
                        let id_documento;

                        if (item.changed) {
                            
                            id_documento = response.data[uploadIndex]?.Id;
                            uploadIndex++;
                        } else {
                           
                            id_documento = file?.id_documento;
                        }

                        return {
                            file: file,
                            name: this.newName,
                            orden: item.orden,
                            id_documento: id_documento || 1,
                            id_proyecto: GlobalVariables.id_proyecto,
                            tipo: item.tipo,
                            changed: item.changed
                        };
                    });

            } else {
                const previewsSource = this.submode === 5 ? this.previewsAvo : this.previews;
                this.S3Files = response.data.map((item, index) => {
                    const preview = previewsSource[index];
                    const extension = preview?.extension
                        || this.detectImageExtensionFromSrc(preview?.src)
                        || '';

                    return {
                        id_documento: item.Id,
                        name: preview?.newName || item.Name,
                        id_proyecto: GlobalVariables.id_proyecto,
                        tipo: folder,
                        orden: index,
                        link: item.Url,
                        extension: extension
                    };
                });
            }
            if (this.submode === 5 && Array.isArray(this.filesAvo)) {
                const startIndex = this.S3Files.length;

                const filteredAndMappedItems = this.filesAvo
                    .filter(item => item?.isVideo === true || (item?.link))
                    .map((item, idx) => ({
                        id_documento: '1',
                        name: this.previewsAvo[idx]?.newName || item.Name,
                        id_proyecto: GlobalVariables.id_proyecto,
                        tipo: folder,
                        orden: startIndex + idx,
                        link: item.Url || item.link,
                    }));

                this.S3Files.push(...filteredAndMappedItems);
            }

            for (const archivo of this.S3Files) {
                const grupoId = (this.submode === 1) ? 0 : this.selectedGrupoId;

                const result = await httpFunc("/generic/genericST/Medios:Del_Archivos", {
                    nombre: archivo.name || '',
                    orden: archivo.orden,
                    id_documento: archivo.id_documento,
                    id_proyecto: archivo.id_proyecto,
                    tipo: archivo.tipo,
                    id_grupo_proyecto: grupoId
                });

                if (result.isError) {
                    showMessage(`Error al eliminar archivo: ${archivo.id_documento}`);
                    hideProgress();
                    return;
                }
            }

            for (const archivo of this.S3Files) {
                const grupoId = (this.submode === 1) ? 0 : this.selectedGrupoId;
                const result = await httpFunc("/generic/genericST/Medios:Ins_Archivos", {
                    nombre: archivo.name || '',
                    orden: archivo.orden,
                    id_documento: archivo.id_documento || 1,
                    id_proyecto: archivo.id_proyecto,
                    id_grupo_proyecto: grupoId,
                    tipo: archivo.tipo,
                    link: archivo.link,
                    extension: archivo.extension || ''
                });

                if (result.isError) {
                    showMessage(`Error al insertar archivo: ${archivo.id_documento}`);
                    hideProgress();
                    return;
                }
            }
            await this.loadImg();
            hideProgress();
        },
        async loadImg() {
            const folderMap = {
                1: 'principal',
                2: 'imagenes',
                3: 'videos',
                4: 'recorridos virt',
                5: 'avances de obra'
            };

            const folder = folderMap[this.submode] || 'principal';
            let archivos = [];

            showProgress();

            if (this.submode === 3) {
                const resp = await httpFunc("/generic/genericDT/Medios:Get_Archivos", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    tipo: folder,
                    id_grupo_proyecto: this.selectedGrupoId
                });

                this.videos = resp.data || [];

                this.videos = this.videos.map(video => ({
                    nombre: video.nombre || '',
                    descripcion: video.descripcion || '',
                    link: video.link || ''
                }));

            }

            if (this.submode === 4) {
                const resp = await httpFunc("/generic/genericDT/Medios:Get_Archivos", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    tipo: folder,
                    id_grupo_proyecto: this.selectedGrupoId
                });

                this.videosReco = resp.data || [];

                this.videosReco = this.videosReco.map(video => ({
                    nombre: video.nombre || '',
                    descripcion: video.descripcion || '',
                    link: video.link || ''
                }));

            }

            if (this.submode === 1) {
                this.logoPreview = null;
                this.slidePreview = null;
                this.plantaPreview = null;
                this.logoFile = null;
                this.slideFile = null;
                this.plantaFile = null;
                this.logoChanged = false;
                this.slideChanged = false;
                this.plantaChanged = false;

                const tipos = ['logo', 'slide', 'planta'];
                const seenKeys = new Set();

                for (let tipo of tipos) {
                    const res = await httpFunc("/generic/genericDT/Medios:Get_Archivos", {
                        id_proyecto: GlobalVariables.id_proyecto,
                        tipo,
                        id_grupo_proyecto: 0, // Para imágenes principales no se usa grupo
                    });

                    if (res?.data?.length) {
                        for (let f of res.data) {
                            if (!seenKeys.has(f.llave)) {
                                seenKeys.add(f.llave);
                                archivos.push(f);
                            }
                        }
                    }
                }
            }
            if (this.submode === 2 || this.submode === 5) {
                 await this.clearAllImages();
                const res = await httpFunc("/generic/genericDT/Medios:Get_Archivos", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    tipo: folder,
                    id_grupo_proyecto: this.selectedGrupoId
                });
                archivos = res.data || [];
            }

            hideProgress();

            for (let file of archivos) {
                const isVideo = !!file.link;

                if (isVideo) {
                    if (this.submode === 5) {
                        this.previewsAvo.push({ previewSrc: file.link, videoUrl: file.link, isVideo: true, newName: file.nombre_documento });
                        this.filesAvo.push(file);
                    } else if (this.submode === 2) {
                        this.previews.push({ previewSrc: file.link, videoUrl: file.link, isVideo: true, newName: file.nombre_documento });
                        this.files.push(file);
                    }
                    continue;
                }

                const imagePath = "/file/S3get/" + file.llave;
                const blob = await this.fetchImageAsBlob(imagePath);
                if (!blob) continue;

                const fileObj = new File([blob], file.nombre_documento, { type: blob.type });

                const src = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(fileObj);
                });

                if (this.submode === 1) {
                    // Guardar el id_documento en el fileObj para usarlo después
                    fileObj.id_documento = file.id_documento;

                    if (file.tipo.includes('logo')) {
                        this.logoPreview = src;
                        this.logoFile = fileObj;
                    } else if (file.tipo.includes('slide')) {
                        this.slidePreview = src;
                        this.slideFile = fileObj;
                    } else if (file.tipo.includes('planta')) {
                        this.plantaPreview = src;
                        this.plantaFile = fileObj;
                    }
                } else if (this.submode === 2) {
                    this.previews.push({ src, file: fileObj , newName: file.nombre_documento });
                    this.files.push(fileObj);
                } else if (this.submode === 5) {
                    this.previewsAvo.push({ src, file: fileObj , newName: file.nombre_documento });
                    this.filesAvo.push(fileObj);
                }
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
            this.logoFile = null;
            this.slideFile = null;
            this.plantaFile = null;
            this.files = [];
            this.filesAvo = [];
            this.previews = [];
            this.previewsAvo = [];

        },
        async GrupUploadFiles() {
            const folderMap = {
                1: 'principal',
                2: 'imagenes',
                3: 'videos',
                4: 'recorridos virt',
                5: 'avances de obra'
            };

            const folder = folderMap[this.submode] || 'principal';
            showProgress();

            try {
                const res = await httpFunc("/generic/genericDT/Medios:Ins_Grupos", {
                    grupo: this.newGrup,
                    orden: 5,
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo: folder
                });
                this.selectImg = res.data[0].result;
                if (res.isError) {
                    hideProgress();
                    if (res.errorMessage && res.errorMessage.includes("Duplicate")) {
                        showMessage("Grupo ya creado");
                    } else {
                        showMessage("Error al crear grupo");
                    }
                    return;
                }

                let resp = await httpFunc("/generic/genericDT/Medios:Get_variables", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo: folder
                });
                this.grupo_proyectos = resp.data;

                this.uploadFiles();
                await this.checkAndLoad(this.submode);
                hideProgress();
            } catch (error) {
                hideProgress();
                showMessage("Error inesperado al crear grupo");
            }
        },
        checkAndLoad() {

            switch (this.submode) {
                case 2:
                    this.selectedGrupoId = this.selectImg;
                    this.ismodulImg = true;
                    break;
                case 3:
                    this.selectedGrupoId = this.selectVid;
                    this.ismodulVid = true;
                    break;
                case 4:
                    this.selectedGrupoId = this.selectRvr;
                    this.ismodulRvr = true;
                    break;
                case 5:
                    this.selectedGrupoId = this.selectAvo;
                    this.ismodulAvo = true;
                    break;
                default:
                    this.selectedGrupoId = 0;
            }
                this.loadImg();
   

        },
        modImg() {
            this.modeimg = false;
            this.previews = [];
            this.files = [];
        },
        modAvo() {
            this.modeAvo = false;
            this.previewsAvo = [];
            this.filesAvo = [];
        },
        async crearGrupoVideos() {
            try {
                showProgress();

                const res = await httpFunc("/generic/genericDT/Medios:Ins_Grupos", {
                    grupo: this.newGrupVid,
                    orden: 5,
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo: 'videos'
                });

                if (res.isError || !res.data || !res.data[0]?.result) {
                    showMessage("El Grupo ya existe.");
                    return;
                }

                this.selectedGrupoId = res.data[0].result;
                this.insertarVideosEnGrupo();
                showMessage("Grupo de videos creado correctamente.");
            } catch (error) {
                console.error("Error al crear grupo:", error);
                showMessage("Ocurrió un error al crear el grupo.");
            } finally {
                hideProgress();
            }
        },
        async crearGrupoReco() {
            try {
                showProgress();

                const res = await httpFunc("/generic/genericDT/Medios:Ins_Grupos", {
                    grupo: this.newGrupReco,
                    orden: 5,
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo: 'recorridos virt'
                });

                if (res.isError || !res.data || !res.data[0]?.result) {
                    showMessage("El Grupo ya existe.");
                    return;
                }

                this.selectedGrupoId = res.data[0].result;
                this.insertarRecoEnGrupo();
                showMessage("Grupo de videos creado correctamente.");
            } catch (error) {
                console.error("Error al crear grupo:", error);
                showMessage("Ocurrió un error al crear el grupo.");
            } finally {
                hideProgress();
            }
        },
        async insertarRecoEnGrupo() {
            if (!this.selectedGrupoId) {
                showMessage("Primero debes crear o seleccionar un grupo.");
                return;
            }

            showProgress();
            for (const [index, archivo] of this.videosReco.entries()) {
                const result = await httpFunc("/generic/genericST/Medios:Del_Archivos", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    id_grupo_proyecto: this.selectedGrupoId,
                    tipo: 'recorridos virt'
                });

                if (result.isError) {
                    showMessage(`Error al eliminar archivo: ${archivo.id_documento}`);
                    hideProgress();
                    return;
                }
            }

            hideProgress();
            try {
                showProgress();

                for (const [index, archivo] of this.videosReco.entries()) {
                    const result = await httpFunc("/generic/genericST/Medios:Ins_Archivos", {
                        orden: index,
                        id_proyecto: GlobalVariables.id_proyecto,
                        id_documento: 1,
                        id_grupo_proyecto: this.selectedGrupoId,
                        tipo: 'recorridos virt',
                        descripcion: archivo.descripcion,
                        video: archivo.nombre,
                        link: archivo.link
                    });

                    if (result.isError) {
                        showMessage(`Error al insertar archivo "${archivo.nombre}".`);
                        return;
                    }
                }

                showMessage("Videos guardados correctamente.");
            } catch (error) {
                console.error("Error al insertar videos:", error);
                showMessage("Ocurrió un error al insertar los videos.");
            } finally {
                hideProgress();
            }
        },
        async insertarVideosEnGrupo() {
            if (!this.selectedGrupoId) {
                showMessage("Primero debes crear o seleccionar un grupo.");
                return;
            }

            showProgress();
            for (const [index, archivo] of this.videos.entries()) {
                const result = await httpFunc("/generic/genericST/Medios:Del_Archivos", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    id_grupo_proyecto: this.selectedGrupoId,
                    tipo: 'videos'
                });

                if (result.isError) {
                    showMessage(`Error al eliminar archivo: ${archivo.id_documento}`);
                    hideProgress();
                    return;
                }
            }

            hideProgress();
            try {
                showProgress();

                for (const [index, archivo] of this.videos.entries()) {
                    const result = await httpFunc("/generic/genericST/Medios:Ins_Archivos", {
                        orden: index,
                        id_proyecto: GlobalVariables.id_proyecto,
                        id_documento: 1,
                        id_grupo_proyecto: this.selectedGrupoId,
                        tipo: 'videos',
                        descripcion: archivo.descripcion,
                        video: archivo.nombre,
                        link: archivo.link
                    });

                    if (result.isError) {
                        showMessage(`Error al insertar archivo "${archivo.nombre}".`);
                        return;
                    }
                }

                showMessage("Videos guardados correctamente.");
            } catch (error) {
                console.error("Error al insertar videos:", error);
                showMessage("Ocurrió un error al insertar los videos.");
            } finally {
                hideProgress();
            }
        },
        volverDesdeVideo() {

            if (this.submode == 3) {
                this.modevid = true;
                this.setSubmode(3);
                this.videos = [{
                    nombre: '',
                    descripcion: '',
                    link: ''
                }];
            }
            if (this.submode == 4) {
                this.modevir = true;
                this.setSubmode(4);
                this.videosReco = [{
                    nombre: '',
                    descripcion: '',
                    link: ''
                }];
            }
        },
        showVideo(videoUrl) {
            this.videoId = this.extractYouTubeId(videoUrl);
        },
        closeVideo() {
            this.videoId = null;
        },
        async openPrevi() {
             if (!this.allItems.length) {
                 showMessage('No hay imágenes ni videos activos para previsualizar.');
                 return;
             }
        
            this.modalVisible = true;
        
            this.playIndex = 0;
        
            var tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        
            if (this.allItems.length) this.resetInterval();
        },
        closePrevi() {
            this.modalVisible = false;
            history.pushState(null, "", window.location.pathname);
        },
        async setTime() {
            let res = await httpFunc('/generic/genericDT/General:Get_Variable', { nombre_variable: 'CarDurac' });
            if (res.data.length && res.data[0].valor)
                this.time = parseFloat(res.data[0].valor.replace(',', '.')) * 1000;
        },
        isImage(item) {
            this.setTime()
            const valueToCheck = item?.content || item?.url;
            const isBase64 = item?.src?.startsWith('data:image/');

            return item && (typeof valueToCheck === 'string' && valueToCheck.match(/\.(jpeg|jpg|png|gif)$/i) || isBase64);
        },
        isVideo(item) {
            const url = item?.previewSrc || item?.videoUrl || item?.link || '';
            return url.includes('youtube') || url.endsWith('.mp4');
        },
        formatURL(item) {
            const url = item?.previewSrc || item?.videoUrl || item?.link || '';
            if (!url) return '';
        
            if (url.includes("youtube.com/watch")) {
                const videoId = url.split("v=")[1]?.split("&")[0];
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
            } else if (url.includes("youtu.be/")) {
                const videoId = url.split("youtu.be/")[1]?.split("?")[0];
                return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
            }
            return url;
        },
        play() {
            this.resetInterval();
        },
        pause() {
            if (this.interval) clearInterval(this.interval);
            this.interval = null;
            this.stop = true;
        },
        setIndex(i) {
            if (!this.allItems.length) return;
            this.playIndex = (this.playIndex + i + this.allItems.length) % this.allItems.length;
            this.resetInterval();
        },
        resetInterval() {
            if (this.interval) clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.playIndex = (this.playIndex + 1) % this.allItems.length;
            }, this.time);
            this.stop = false;
        },
        getImageUrl(item) {
            if (item.src) return item.src;
            if (item.llave) return `/file/S3get/${item.llave}`;
            return '';
        },
        setShowBar() {
            if (!this.cont) this.cont = document.getElementById('cont-rotafolio');
            this.showBar = true;
            this.timeout && clearTimeout(this.timeout);
            this.cont.style.cursor = 'auto';
            this.timeout = setTimeout(() => {
                this.showBar = false;
                this.cont.style.cursor = 'none';
            }, 2500);
        },
        async actualizarDatos(modulo) {
            try {
                const response = await httpFunc("/generic/genericDT/Medios:Get_variables", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo: modulo
                });

                if (response.isError || !response.data) {
                    console.error(`Error al actualizar datos para el módulo: ${modulo}`);
                    return [];
                }

                return response.data.map(item => item.grupo);
            } catch (error) {
                console.error(`Error inesperado al actualizar datos para el módulo: ${modulo}`, error);
                return [];
            }
        },
        async guardarCambios() {
            try {
                const folderMap = {
                    'Agrupamiento de Imágenes de Proyecto': 'imagenes',
                    'Agrupamiento de Vídeos de Proyecto': 'videos',
                    'Agrupamiento de Recorridos Virtuales': 'recorridos virt',
                    'Periodos de Avances de obra': 'avances de obra'
                };

                for (const tabla of this.tablas) {
                    if (tabla.titulo === 'Agrupaciones Generales' || tabla.titulo === 'Imágenes Principales') {
                        continue;
                    }

                    const modulo = folderMap[tabla.titulo] || 'general';
                    const datos = tabla.datos.map((grupo, index) => ({
                        grupo: grupo,
                        orden: index,
                        id_proyecto: GlobalVariables.id_proyecto,
                        modulo: modulo,
                        is_active: tabla.activo
                    }));

                    showProgress();
                    const resp = await httpFunc("/generic/genericST/Medios:Del_variables", {
                        id_proyecto: GlobalVariables.id_proyecto,
                        modulo: modulo
                    });

                    for (const dato of datos) {
                        const response = await httpFunc("/generic/genericST/Medios:Ins_Grupos", {
                            grupo: dato.grupo,
                            orden: dato.orden,
                            id_proyecto: dato.id_proyecto,
                            modulo: dato.modulo,
                            is_active: dato.is_active
                        });

                        if (response.isError) {
                            console.error(`Error al guardar el grupo "${dato.grupo}" en el módulo "${dato.modulo}" con orden ${dato.orden}`);
                            showMessage(`Error al guardar el grupo "${dato.grupo}" en el módulo "${dato.modulo}" con orden ${dato.orden}`);
                            hideProgress();
                            return false;
                        }
                    }
                }
                hideProgress();
                showMessage("Grupos y órdenes guardados correctamente.");
                return true;
            } catch (error) {
                console.error("Error inesperado al guardar grupos y órdenes:", error);
                showMessage("Error inesperado al guardar grupos y órdenes.");
                return false;
            }
        },
        clearSelection() {
            console.log('clearSelection');
            this.selected = {
                tablaIndex: null,
                itemIndex: null,
                tabindex: 0
            };
        },
        expandImagenes(item) {
            this.expandedImage = item.src;
            this.expandedVisible = true;
        },
        closeExpanded() {
            this.expandedVisible = false;
            this.expandedImage = null;
        },
        getSubmodeText() {
            if (this.submode >= 0 && this.submode < this.mediaTabs.length) {
                return this.mediaTabs[this.submode];
            }
            return '';
        },
        setRuta() {
            const submodeText = this.getSubmodeText();
            if (submodeText && GlobalVariables.miniModuleCallback) {
                this.ruta = [{
                    text: `${GlobalVariables.nombre_proyecto || GlobalVariables.proyecto?.nombre || ''}`,
                    action: () => {
                        GlobalVariables.miniModuleCallback('GoToProjectHome', null);
                    }
                }, {
                    text: 'Imágenes y Videos',
                    action: () => {
                        if (this.submode !== 0) {
                            this.setSubmode(0);
                        }
                    }
                }, {
                    text: submodeText,
                    action: () => {}
                }];
                GlobalVariables.miniModuleCallback('SetRuta', this.ruta);
            }
        }
    }
};
