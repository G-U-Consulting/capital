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
            interval: null,
            playIndex: 0,
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("Rotafolio", null);
        this.setMainMode('Rotafolio');
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
                let res = await httpFunc('/generic/genericDT/Maestros:Get_Documento', 
                    { documento: "General,Sostenibilidad", is_img: 1 });
                if (res.data && res.data.length) {
                    res.data.forEach(async doc => {
                        this.addResources(await httpFunc('/generic/genericDT/Maestros:Get_Archivos', 
                        { tipo: doc.documento, id_maestro_documento: doc.id_documento }))
                    });
                }

                this.addResources(await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                    { tipo: 'logo,slide,planta', id_proyecto }));

                let modulos = ['imagenes','videos','recorridos virt','obras'];
                res = await httpFunc('/generic/genericDT/Medios:Get_GrupoProyecto', { id_proyecto });
                let grupos = res.data.sort((a, b) => parseInt(a.orden) - parseInt(b.orden));
                res = await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                    { tipo: modulos.join(','), id_proyecto })
                    
                modulos.forEach(mod => {
                    let data = res.data.filter(d => d.tipo == mod);
                    grupos.forEach(g => {
                        let temp = data.filter(d => d.id_grupo_proyecto == g.id_grupo_proyecto);
                        this.addResources({ data: temp });
                    });
                });

                this.loadResources();
                console.log(this.files);
            }

            this.loading = false;
        },
        addResources(res) {
            let data = res.data;
            if (data && data.length)
                data.sort((a, b) => parseInt(a.orden) - parseInt(b.orden)).forEach(d => 
                    this.files.push({path: d.llave, content: null, link: d.link || null, name: d.documento}));
        },
        async loadResources() {
            try {
                let files = [...this.files];
                await Promise.all(files.map(async (f, i) => {
                    const res = await fetch('/file/S3get/' + f.path);
                    if (!res.ok) throw new Error(`Error al cargar ${f.path}: ${res.statusText}`);
                    const blob = await res.blob(),
                        file = new File([blob], f.name, { type: blob.type }),
                        reader = new FileReader();
                    reader.onload = async (e) => 
                        file.type.startsWith('image/') && (this.files[i].content = e.target.result);
                    reader.readAsDataURL(file);
                }));
                console.log(this.files);
            } catch (error) {
                console.error("Error al cargar archivos:", error);
            }
        },
        fullScreen() {
            let cont = document.getElementById("cont-rotafolio");
            
            if (cont.requestFullscreen) {
                cont.requestFullscreen();
            } else if (cont.mozRequestFullScreen) {
                cont.mozRequestFullScreen();
            } else if (cont.webkitRequestFullscreen) {
                cont.webkitRequestFullscreen();
            } else if (cont.msRequestFullscreen) {
                cont.msRequestFullscreen();
            }
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
            this.playIndex = ((this.playIndex || this.files.length) + i) % this.files.length;
            this.resetInterval();
        },
        resetInterval() {
            if (this.interval) clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.playIndex = (this.playIndex + 1) % this.files.length;
            }, 5000);
            this.stop = false;
        }
    }
}