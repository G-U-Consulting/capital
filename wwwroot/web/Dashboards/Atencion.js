export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],

            filtros: {

            },
        };
    },
    async mounted() {
        this.ruta = [{ text: 'Atención', action: () => this.setMode(0) }];
        this.setRuta();
        await this.loadData();
    },
    async unmounted() {

    },
    methods: {
        setRuta() {
            GlobalVariables.miniModuleCallback('SetRuta', this.ruta);
        },
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async setMode(mode) {
            this.mode = mode;
        },
        async loadData() {

        },
        async getReport() {
            let html = await httpFunc(`/util/reports/test`, {});
            const iframe = document.createElement('iframe'), 
                embed = document.getElementById('embed');
            embed.innerHTML = "";
            embed.appendChild(iframe);
            iframe.frameBorder = 0;
            iframe.allowFullscreen = true;
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.contentDocument.open();
            iframe.contentDocument.write(html);
            iframe.contentDocument.close();
        }
    },
    computed: {

    }
}