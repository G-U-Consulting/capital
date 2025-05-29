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
            logoPreview: null,
            slidePreview: null,
            plantaPreview: null,
            previews: [],
            previewsAvo: [],
            files: [],
            filesAvo:[],
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
                documentos: {is_img: '0'},
             
            },
            logoPreview: null,
            slidePreview: null,
            plantaPreview: null,
            logoFile: null,
            slideFile: null,
            plantaFile: null,
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

        };
    },
    watch: {
        previewsAvo: {
            deep: true,
            handler(newVal) {
                localStorage.setItem("previewsAvo", JSON.stringify(newVal));
            }
        },
        plantaPreview(val) {
            this.updatePlantaPreviewAll();
          },
          slidePreview(val) {
            this.updatePlantaPreviewAll();
          },
          logoPreview(val) {
            this.updatePlantaPreviewAll();
          },
          previews: {
            handler(val) {
              this.updatePlantaPreviewAll();
            },
            deep: true
          },
          previewsAvo: {
            handler(val) {
              this.updatePlantaPreviewAll();
            },
            deep: true
          },
          videos: {
            handler(val) {
              this.updatePlantaPreviewAll();
            },
            deep: true
          },
          videosReco: {
            handler(val) {
              this.updatePlantaPreviewAll();
            },
            deep: true
          }
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
        getPreviewSrc() {
            return '../../img/ico/youtobe.png';
        },
        allItems() {
            return this.plantaPreviewAll;
        }
    },
    async mounted() {
        this.tabsIncomplete = this.mediaTabs.map((_, index) => index);
        GlobalVariables.miniModuleCallback("StartMediaMdule", null);
        this.setSubmode(0);
        this.updatePlantaPreviewAll();

    },
    methods: {
        updatePlantaPreviewAll() {
            this.plantaPreviewAll = [
              { src: this.plantaPreview },
              { src: this.slidePreview },
              { src: this.logoPreview },
              ...(this.previews || []),
              ...(this.previewsAvo || []),
              ...(this.videos?.filter(v => v.link) || []),
              ...(this.videosReco?.filter(v => v.link) || [])
            ];
        },
        setMode(mode) {
            this.mode = mode;
             if(mode == 0)
                 GlobalVariables.miniModuleCallback("StartMediaMdule", null);
        },
        async setSubmode(index) {
            this.submode = index;
 
            if (index == 0) {

                const resImg = await httpFunc("/generic/genericDT/Medios:Get_variables", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo: 'imagenes',
                });
                const grupo_img = resImg.data.map(item => item.grupo);
        
                const resVid = await httpFunc("/generic/genericDT/Medios:Get_variables", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo: 'videos',
                });
                const grupo_vid = resVid.data.map(item => item.grupo);
        
                const resVir = await httpFunc("/generic/genericDT/Medios:Get_variables", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo: 'Recorridos virt',
                });
                const grupo_vir = resVir.data.map(item => item.grupo);
        
                await this.construirTablas(grupo_img, grupo_vid, grupo_vir);

                const resAvo = await httpFunc("/generic/genericDT/Medios:Get_variables", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo: 'avances de obra',
                });
                const grupo_avo = resAvo.data.map(item => item.grupo);
        
                await this.construirTablas(grupo_img, grupo_vid, grupo_vir,grupo_avo);
               
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
                2: 'imagenes',
                3: 'videos',
                4: 'recorridos virt',
                5: 'avances de obra'
            };
            const modulo = modulos[index];
            if (!modulo) return;
            try {
                const res = await httpFunc("/generic/genericDT/Medios:Get_variables", {
                    id_proyecto: GlobalVariables.id_proyecto,
                    modulo
                });
                this.grupo_proyectos = res.data;

            } catch (error) {
                console.log(error);
            }
        },
        construirTablas(grupo_img, grupo_vid,grupo_vir,grupo_avo) {
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
                    datos: grupo_vid,
                    activo: true,
                    error: true
                },
                {
                    titulo: 'Agrupamiento de Recorridos Virtuales',
                    datos: grupo_vir,
                    activo: true,
                    error: false
                },
                {
                    titulo: 'Periodos de Avances de obra',
                    datos: grupo_avo,
                    activo: true,
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
                            this.previewsAvo.push({ src: e.target.result, file });
                            this.filesAvo.push(file);
                        };
                        reader.readAsDataURL(file);
                    });
                }
            }
        },
        extractYouTubeId(url) {
            const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[1].length === 11) ? match[1] : null;
        },
        removeImage(index) {
            this.previews.splice(index, 1);
            this.files.splice(index, 1);
            this.previewsAvo.splice(index, 1);
            this.filesAvo.splice(index, 1);
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
        //////////////////////////////////////
        async uploadFiles() {
            const form = new FormData();
           
    
            function getFile(f) {
                if (!f) return null;
                return f instanceof File ? f : f.file || null;
            }

            if (this.submode === 1) {
                [this.logoFile, this.slideFile, this.plantaFile].forEach(fObj => {
                    const file = getFile(fObj);
                    if (file) form.append(file.name, file);
                });
            } else if (this.submode === 2) {
                this.files.forEach(fObj => {
                    const file = getFile(fObj) || fObj;
                    if (file) form.append(file.name, file);
                });
            } else if (this.submode === 5)  {
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
        async S3UploadFiles() {
            const getFile = (f) => f instanceof File ? f : f?.file || null;
           
            showProgress();
            const response = await httpFunc("/file/S3upload", this.serverFiles);

            if (response.isError) {
                showMessage(response.errorMessage);
                return;
            }

            const folderMap = {
                1: 'principal',
                2: 'imagenes',
                5: 'avances de obra'
            };

            const folder = folderMap[this.submode] || 'principal';
         
            if (this.submode === 1) {
                const fileList = [this.logoFile, this.slideFile, this.plantaFile].map(getFile).filter(Boolean);

                this.S3Files = fileList.map((file, index) => ({
                    file,
                    name: file.name,
                    orden: index,
                    id_documento: response.data[index]?.Id,
                    id_proyecto: GlobalVariables.id_proyecto,
                    tipo: ['logo', 'slide', 'planta'][index]
                }));
            } else {
                this.S3Files = response.data.map((item, index) => ({
                    id_documento: item.Id,
                    name: item.FileName,
                    id_proyecto: GlobalVariables.id_proyecto,
                    tipo: folder,
                    orden: index, 
                    link: item.Url
                }));
            }
            if (this.submode === 5 && Array.isArray(this.filesAvo)) {
                const startIndex = this.S3Files.length;

                const filteredAndMappedItems = this.filesAvo
                    .filter(item => item?.isVideo === true || (item?.link))
                    .map((item, idx) => ({
                        id_documento: '1',
                        name: 'Video',
                        id_proyecto: GlobalVariables.id_proyecto,
                        tipo: folder,
                        orden: startIndex + idx,
                        link: item.Url || item.link
                    }));

                this.S3Files.push(...filteredAndMappedItems);
            }
          
            for (const archivo of this.S3Files) {
                const result = await httpFunc("/generic/genericST/Medios:Del_Archivos", {
                    nombre: archivo.name || '',
                    orden: archivo.orden,
                    id_documento: archivo.id_documento,
                    id_proyecto: archivo.id_proyecto,
                    tipo: archivo.tipo,
                    id_grupo_proyecto: this.selectedGrupoId
                });

                if (result.isError) {
                    showMessage(`Error al eliminar archivo: ${archivo.id_documento}`);
                    hideProgress();
                    return;
                }
            }

    
            for (const archivo of this.S3Files) {
                const result = await httpFunc("/generic/genericST/Medios:Ins_Archivos", {
                    nombre: archivo.name || '',
                    orden: archivo.orden,
                    id_documento: archivo.id_documento || 1,
                    id_proyecto: archivo.id_proyecto,
                    id_grupo_proyecto: this.selectedGrupoId,
                    tipo: archivo.tipo,
                    link: archivo.link
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
                const tipos = ['logo', 'slide', 'planta'];
                const seenKeys = new Set();
        
                for (let tipo of tipos) {
                    const res = await httpFunc("/generic/genericDT/Medios:Get_Archivos", {
                        id_proyecto: GlobalVariables.id_proyecto,
                        tipo,
                        id_grupo_proyecto: this.selectedGrupoId,
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
                        this.previewsAvo.push({ previewSrc: file.link, videoUrl: file.link, isVideo: true });
                        this.filesAvo.push(file);
                    } else if (this.submode === 2) {
                        this.previews.push({ previewSrc: file.link, videoUrl: file.link, isVideo: true });
                        this.files.push(file);
                    }
                    continue;
                }

                const imagePath = "/file/S3get/" + file.llave;
                const blob = await this.fetchImageAsBlob(imagePath);
                if (!blob) continue;

                const fileObj = new File([blob], file.documento, { type: blob.type });

                const src = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(fileObj);
                });

                if (this.submode === 1) {
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
                    this.previews.push({ src, file: fileObj });
                    this.files.push(fileObj);
                } else if (this.submode === 5) {
                    this.previewsAvo.push({ src, file: fileObj });
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
            this.logoPreview = null;
            this.logoFile = null;
            this.slidePreview = null;
            this.slideFile = null;
            this.plantaPreview = null;
            this.plantaFile = null;
            this.previews = [];
            this.files = [];
            this.previewsAvo = [];
            this.filesAvo = [];
        },
        async GrupUploadFiles() {
            const folderMap = {
                1: 'principal',
                2: 'imagenes',
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

            if (this.selectedGrupoId) {
                this.loadImg();
            }

        },
        modImg(){
            this.modeimg = false; 
            this.previews = []; 
            this.files = [];
        },
        modAvo(){
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
                    grupo: this.newGrupVid,
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
            for (const [index, archivo] of this.videos.entries())  {
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
     
            if(this.submode == 3){
                this.modevid = true;
                this.setSubmode(3);
                this.videos = [{
                  nombre: '',
                  descripcion: '',
                  link: ''
                }];
            }
            if(this.submode == 4){
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
            this.modalVisible = true;
            history.pushState(null, "", "#modal-carrusel");
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

        /////////////////////////////////////////////////////

        // fullScreen() {
        //     let cont = document.getElementById("cont-rotafolio");
            
        //     if (cont.requestFullscreen) {
        //         cont.requestFullscreen();
        //     } else if (cont.mozRequestFullScreen) {
        //         cont.mozRequestFullScreen();
        //     } else if (cont.webkitRequestFullscreen) {
        //         cont.webkitRequestFullscreen();
        //     } else if (cont.msRequestFullscreen) {
        //         cont.msRequestFullscreen();
        //     }
        // },
        async setTime() {
            let res = await httpFunc('/generic/genericDT/General:Get_Variable', {nombre_variable: 'CarDurac'});
            if (res.data.length && res.data[0].valor) 
                this.time = parseFloat(res.data[0].valor.replace(',','.')) * 1000;
        },
        isImage(item) {
            this.setTime()
            const valueToCheck = item?.content || item?.url;
            const isBase64 = item?.src?.startsWith('data:image/');
          
            return item && (typeof valueToCheck === 'string' && valueToCheck.match(/\.(jpeg|jpg|png|gif)$/i) || isBase64);
          },
        isVideo(item) {
            return item && (item.previewSrc || item.videoUrl)?.includes('youtube.com');
        },
        formatURL(url) {
            try {
                const urlObj = new URL(url);
                if (urlObj.hostname.includes("youtube.com") && urlObj.searchParams.has("v")) {
                    return `https://www.youtube.com/embed/${urlObj.searchParams.get("v")}?autoplay=1&enablejsapi=1&mute=1`;
                } else if (urlObj.hostname.includes("youtu.be")) {
                    return `https://www.youtube.com/embed/${urlObj.pathname.slice(1)}?autoplay=1&enablejsapi=1&mute=1`;
                }
                return url;
            } catch (e) {
                return '';
            }
        },
        initVideo() {
            // inicialización opcional para videos YouTube embebidos
        },
        play() {
            this.fullScreen();
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
    }
};
