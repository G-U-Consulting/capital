export default {
    data() {
        return {
            mainmode: 0,
            intervalTime: 3000,
            mode: 0,
            files: [],
            previews: [],
            message: "",
       
        }
    }, 
    async mounted() {
        this.fetchCarouselImages();
        console.log("aqui")
        //await this.setMainMode(2);
    },
    methods: {
        async setMainMode(mode) {
            if (mode == 1) {
                showProgress();
        
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
        async removeImage(index) {
            console.log(index)
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
            for (const preview of this.previews) {
                if (typeof preview === "string") {
                    let file = await this.urlToFile(preview);
                    if (file) formData.append("file", file);
                } else {
                    formData.append("file", preview);
                }
            }
            this.files.forEach(file => formData.append("file", file));
            if (formData.has("file")) {
                try {
                    showProgress();
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