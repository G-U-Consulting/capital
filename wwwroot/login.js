const { createApp } = Vue;
const mainDivId = "#loginContentDiv";
var vm = null, loginVue = null;
loginVue = {
    data() {
        return {
            duracion: "",
            images: [],
            index: 0
        };
    },
    async mounted() {
        let response = await axios.post("/generic/genericDS/Presentacion:Get_Presentacion", {});
        this.duracion = response.data.data[0][0].valor;
        await this.fetchImages();
        if (this.images.length) {
            this.updateImage();
            setInterval(this.updateImage, this.duracion * 1000);
        }

    },
    computed: {
        carouselStyle() {
            return this.images.length
                ? {
                      backgroundImage: `url('${this.images[this.index]}')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "background-image 0.5s"
                  }
                : {};
        }
    },
    methods: {
        async fetchImages() {
            try {
                let { data } = await axios.get("/img/carrusel");
                this.images = data.images || [];
            } catch (err) {
                console.error("Error:", err);
                this.images = [];
            }
        },

        updateImage() {
            const el = document.getElementById("pDiv");
            if (el) {
                el.style.backgroundImage = `url('${this.images[this.index]}')`;
                el.style.backgroundSize = "cover";
                el.style.backgroundPosition = "center";
                el.style.transition = "background-image 0.5s";
                this.index = (this.index + 1) % this.images.length;
            }
        }
    }
};
vm = createApp(loginVue).mount(mainDivId);
