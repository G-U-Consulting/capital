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
                    this.previews = response.data.images;

                } else {
                    this.message = "❌ No se encontraron imágenes en el servidor.";
                }
                hideProgress();
            } catch (error) {
                this.message = "❌ Error al cargar imágenes.";
            }
        },
        async handleDragOver(event) {
            event.preventDefault();
            event.currentTarget.classList.add("drag-over");
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
        async removeImage(index) {
            this.previews.splice(index, 1);
        },
        async handleFileChange(event) {
            this.files = Array.from(event.target.files);
            this.files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previews.unshift(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        },
        async uploadFiles() {
            let formData = new FormData();
            for (let i = 0; i < this.previews.length; i++) {
                if (typeof this.previews[i] === "string") {
                    let file = await this.urlToFile(this.previews[i]);
                    if (file) formData.append("file", file);
                }
            }
            this.files.forEach(file => formData.append("file", file));
            if (formData.has("file")) {
                try {
                    showProgress();
                    await httpFunc("/generic/genericST/Presentacion:Upd_Presentacion", {
                        duracion: this.duracion,
                    });
                    let response = await httpFunc("/api/upload", formData);
                    this.message = response.message;
                    this.files = [];
                    this.previews = [];
                    await this.fetchCarouselImages();
                    hideProgress();
                } catch (error) {
                    this.message = "❌ Ocurrió un error.";
                }
            } else {
                this.message = "⚠️ No hay imágenes para subir.";
            }
        },
        async urlToFile(imageUrl) {
            try {
                let response = await fetch(imageUrl);
                let blob = await response.blob();
                let fileName = imageUrl.split("/").pop();
                return new File([blob], fileName, { type: blob.type });
            } catch (error) {
                console.error("Error al convertir imagen:", error);
                return null;
            }
        }
    }
}