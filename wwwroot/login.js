const { createApp } = Vue;
const mainDivId = "#loginContentDiv";
var vm = null, loginVue = null;
loginVue = {
    data() {
        return {
            duracion: "",
            images: [],
            index: 0,
            loginData: {
                username: "",
                password: ""
            },
            errorMessage: "",
            autType: "",
        };
    },
    async mounted() {
        hideProgress();
        let response = await axios.post("/util/Presentacion", {});
        this.duracion = response.data.data[0][0].valor;
        await this.fetchImages();
        console.log(this.images)
        if (this.images.length) {
            this.updateImage();
            setInterval(this.updateImage, this.duracion * 1000);
        }
    },
    methods: {
        async fetchImages() {
            
            try {
                const { data } = await axios.post("/util/Presentacion", {});
                if (data.data[1]) {
                    this.images = data.data[1].map(x => `/img/carrusel/${x.a}`);
                }
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
        }, 
        validateUser: function () {
            if (this.loginData.username.indexOf("@serlefin.com") >= 0) {
                this.autType = "azure";
                window.location = "./auth/getADRedirectPage"
            } else
                this.autType = "local";
        },
        async login() {
            this.errorMessage = "";
            showProgress();
            var data = await httpFunc("/auth/login", this.loginData);
            if (data.isError == false)
                window.location = "./";
            else {
                this.errorMessage = data.errorMessage;
                hideProgress();
            }
            
        }
    }
};
vm = createApp(loginVue).mount(mainDivId);

function showProgress() {
    document.getElementById("divProcess").style.display = "block";
    return false;
}
function hideProgress() {
    document.getElementById("divProcess").style.display = "none";
    return false;
}