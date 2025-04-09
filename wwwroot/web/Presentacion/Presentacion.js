export default {
    data() {
        return {
            mainmode: 0,
            intervalTime: 3000,
            mode: 0,
            files: [],
            previews: [],
            message: "",
            ruta: GlobalVariables.ruta,
            duracion: "3",
        }
    }, 
    async mounted() {
        this.fetchCarouselImages();                                                      
        //await this.setMainMode(2);
    },
    methods: {
        setRuta(...segments) {
            this.ruta = [GlobalVariables.ruta, ...segments].join(" / ");
        },
        async dragStart(index) {
            this.dragIndex = index;
        },
        async dragOver(index) {
            // Esto permite que el drop funcione
        },
        async drop(index) {
            if (this.dragIndex === null || this.dragIndex === index) return;

            const draggedItem = this.previews[this.dragIndex];
            this.previews.splice(this.dragIndex, 1);
            this.previews.splice(index, 0, draggedItem);
            this.dragIndex = null;
        },
        async removeImage(index) {
            this.previews.splice(index, 1);
        },
        async handleFileChange(event) {
            const selectedFiles = event.target.files;
            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                this.files.push(file);

                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previews.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        },
        async setMainMode(mode) {
            if (mode == 1) {
                showProgress();
                this.setRuta("Fondo Pantalla");
                hideProgress();
            }
            this.mainmode = mode;
            this.mode = 0;
        },
        async fetchCarouselImages() {
            try {
                showProgress();
                let response = await axios.get("/img/carrusel");
                if (response.data.images) {
                    this.previews = await response.data.images;
                } else {
                    this.message = "❌ No se encontraron imágenes en el servidor.";
                }
                hideProgress();
            } catch (error) {
                this.message = "❌ Error al cargar imágenes.";
            }
        },
        async handleDragLeave(event) {
            event.currentTarget.classList.remove("drag-over");
        },
        async handleDrop(event) {
            event.preventDefault();
            event.currentTarget.classList.remove("drag-over");

            const files = Array.from(event.dataTransfer.files);
            files.forEach(file => {
                if (file.type.startsWith("image/")) {
                    this.files.push(file);
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.previews.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
        },
        async uploadFiles() {
            let formData = new FormData();

            for (let i = 0; i < this.previews.length; i++) {
                const preview = this.previews[i];
                const filename = `image_${i}.jpg`;
                let file;
                if (preview.startsWith("data:image")) {
                    file = await this.urlToFile(preview, filename);
                } else if (preview.startsWith("/img/carrusel/")) {
                    const fetchedBlob = await fetch(preview).then(r => r.blob());
                    file = new File([fetchedBlob], filename, { type: fetchedBlob.type });
                }
                if (file) {
                    formData.append("file", file);
                }
            }
            if (!formData.has("file")) {
                this.message = "No hay imágenes para subir.";
                return;
            }
            try {
                showProgress();
                await httpFunc("/generic/genericST/Presentacion:Upd_Presentacion", {
                    duracion: this.duracion,
                });
                const response = await httpFunc("/api/upload", formData);
                await new Promise(resolve => setTimeout(resolve, 4000));
                this.message = response.message;
                await this.fetchCarouselImages();
                hideProgress();
            } catch (error) {
                console.error("Upload error:", error);
                this.message = "❌ Error al subir las imágenes.";
            }
        },
        async getFilenameFromDataURL(dataUrl) {
            const match = dataUrl.match(/name=([^;]*)/);
            return match ? match[1] : `image_${Date.now()}.jpg`;
        },
        async urlToFile(dataUrl, filename = "temp.png") {
            try {
                const res = await fetch(dataUrl);
                const blob = await res.blob();
                return new File([blob], filename, { type: blob.type });
            } catch (e) {
                console.error("Error al convertir a archivo:", e);
                return null;
            }
        }
    }
}