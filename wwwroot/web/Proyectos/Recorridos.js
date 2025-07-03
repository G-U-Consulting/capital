export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            proyecto: null,
            grupos: [],

            files: [],
            loading: true,
            stop: true,
            full: false,
            timeout: null,
            playIndex: 0,
            showBar: false,
            vplayer: null,
            time: 8000,
            cont: null,
            showList: false,

            tooltipVisible: false,
            tooltipX: 0,
            tooltipY: 0,
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("Recorridos", null);
        this.setMainMode('Recorridos');
        await this.listResources();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async listResources() {
            this.loading = true;
            this.files = [];
            let id_proyecto = this.proyecto ? this.proyecto.id_proyecto : null;
            if (id_proyecto) {
                let res = await httpFunc('/generic/genericDT/Medios:Get_GrupoProyecto', { id_proyecto });
                let modulos = ['recorridos virt'];
                let grupos = res.data;
                if (grupos) grupos = grupos.filter(g => modulos.includes(g.modulo));
                res = await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                    { tipo: modulos.join(','), id_proyecto })

                modulos.forEach(mod => {
                    let data = res.data.filter(d => d.tipo == mod);
                    grupos.forEach(g => {
                        let temp = data.filter(d => d.id_grupo_proyecto == g.id_grupo_proyecto);
                        g.files = [...(g.files || []), ...temp];
                        g.expanded = false;
                    });
                });
                this.grupos = [...grupos];

                await this.orderResources();
                this.files.length && (this.files[0].current = true);
                this.loading = false;
                this.playIndex = 0;
            }
        },
        async orderResources() {
            let grupos = this.grupos.sort((a, b) => parseInt(a.orden) - parseInt(b.orden));
            grupos.forEach(g => {
                let files = g.files.sort((a, b) => parseInt(a.orden) - parseInt(b.orden)).map(f => {
                    if (f.link) {
                        let link = this.formatURL(f.link);
                        if (link) {
                            f.link = link;
                            return f;
                        }
                    }
                });
                this.files = [...this.files, ...files.filter(f => f != undefined)];
            });
        },
        setIndex(i) {
            this.files[this.playIndex].current = false;
            this.playIndex = ((this.playIndex || this.files.length) + i) % this.files.length;
            this.files[this.playIndex].current = true;
        },
        formatURL(url) {
            try {
                if (!url.startsWith('https://')) url = 'https://' + url;
                let urlObj = new URL(url);
                return url;
            } catch (e) {
                console.error(e);
                showMessage(e.message.includes('Invalid URL')
                    ? 'Algunos recursos no se cargaron: link invalido'
                    : e.message);
                return null;
            }
        },
        redirect(url) {
            window.open(url, '_blank');
        },
        setShowBar() {
            if (!this.cont) this.cont = document.getElementById('cont-rotafolio');
            this.showBar = true;
            this.timeout && clearTimeout(this.timeout);
            this.cont.style.cursor = 'auto';
            this.timeout = setTimeout(() => {
                this.showBar = false;
            }, 2500);
        },
        toggleList() {
            this.showList = !this.showList;
        },
        selectFile(file) {
            this.files.forEach(f => f.current = false);
            file.current = true;
            this.playIndex = this.files.indexOf(file);
        },
        updateCursor(event) {
            this.tooltipX = event.clientX + 10;
            this.tooltipY = event.clientY + 10;
        },
        toggleExpand() {
            let expanded = this.isExpanded();
            this.grupos.forEach(g => g.expanded = !expanded);
        },
    },
    computed: {
        isExpanded() {
            return () => this.grupos.every(g => g.expanded);
        }
    },
}