export default {
    data() {
        return {
            submode: 0,
            mediaTabs: [
                "Principal",
                "Secuencia",
                "Imágenes",
                "Videos",
                "Recorridos Virt",
                "Avances de obra"
            ],
            tabsIncomplete: [],
            files: [],
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
              tablas: [
                {
                  titulo: 'General de C. Capital',
                  datos: ['Grupo xx', 'Grupo xx', 'Grupo xx','','','','','',''],
                  activo: true,
                  error: false
                },
                {
                  titulo: 'Principal de Proyecto',
                  datos: ['Item 1', 'Item 2', 'Item 3','','','','','',''],
                  activo: false,
                  error: false
                },
                {
                  titulo: 'Imágenes de Proyecto',
                  datos: ['Item 1','Item 2', 'Item 3','','','','','',''],
                  activo: true,
                  error: false
                },
                {
                  titulo: 'Vídeos de Proyecto',
                  datos: ['Item 1', 'Item 2', 'Item 3','','','','','',''],
                  activo: false,
                  error: true
                },
                {
                  titulo: 'Recorridos Virtuales',
                  datos: ['Item 1','Item 2', 'Item 3','','','','','',''],
                  activo: true,
                  error: false
                },
                {
                  titulo: 'Avances de las Obras',
                  datos: ['Item 1','Item 2', 'Item 3','','','','','',''],
                  activo: false,
                  error: false
                }
              ],
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
            previews: []
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
    },
    methods: {
        async setSubmode(index) {
            this.submode = index;
        },
        dragStart(index) {
            this.dragIndex = index;
        },
        dragOver(event) {
            // Necesario para permitir el "drop" en el contenedor
        },
        handleDrop(event) {
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
        async triggerFileInput() {
            this.$refs.fileInput.click();
        },
        openModal(link) {
            const id = this.getVideoId(link);
            if (id) {
                this.modalVideoId = id;
            }
        },
        closeModal() {
            this.modalVideoId = null;
        },
        getVideoId(url) {
            const match = url.match(/(?:v=|\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
            return match ? match[1] : null;
        },
        async addRow() {
            this.videos.push({ title: '', description: '', link: '' });
        },
        async removeRow(index) {
            this.videos.splice(index, 1);
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

            // Limpiar selección si no quedan ítems
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
        removeRow(index) {
            this.videosReco.splice(index, 1);
            if (this.selectedRowReco === index) {
                this.selectedRowReco = null;
            } else if (this.selectedRowReco > index) {
                this.selectedRowReco--;
            }
        },
        previewImage(event, type) {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                if (type === 'logoPreview') {
                  this.logoPreview = reader.result;
                } else if (type === 'slidePreview') {
                  this.slidePreview = reader.result;
                } else if (type === 'plantaPreview') {
                  this.plantaPreview = reader.result;
                }
              };
              reader.readAsDataURL(file);
            }
        },
        expandImage(type) {
            this.isExpanded[type] = true;
        },
        closeModal() {
            this.isExpanded.logo = false;
            this.isExpanded.slide = false;
            this.isExpanded.planta = false;
        },
        removePreview(type) {
            if (type === 'logo') {
                this.logoPreview = null;
            } else if (type === 'slide') {
                this.slidePreview = null;
            } else if (type === 'planta') {
                this.plantaPreview = null;
            }
        }
    }
};
