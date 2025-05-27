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
            timeout: null,
            playIndex: 0,
            showBar: false,
            vplayer: null,
            time: 8000,
            cont: null
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("Rotafolio", null);
        this.setMainMode('Rotafolio');
        var tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        await this.setTime();
        await this.listResources();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async setTime() {
            let res = await httpFunc('/generic/genericDT/General:Get_Variable', {nombre_variable: 'CarDurac'});
            if (res.data.length && res.data[0].valor) 
                this.time = parseFloat(res.data[0].valor.replace(',','.')) * 1000;
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

                let modulos = ['imagenes','videos','recorridos virt','avances de obra'];
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
            }
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
                    if (f.link) {
                        let link = this.formatURLYouTube(f.link); // f.link;
                        this.files[i].link = link;
                    }
                    else {
                        const res = await fetch('/file/S3get/' + f.path);
                        if (!res.ok) throw new Error(`Error al cargar ${f.path}: ${res.statusText}`);
                        const blob = await res.blob(),
                            file = new File([blob], f.name, { type: blob.type }),
                            reader = new FileReader();
                        reader.onload = async (e) => 
                            file.type.startsWith('image/') && (this.files[i].content = e.target.result);
                        reader.readAsDataURL(file);
                    }
                }));
            } catch (error) {
                console.error("Error al cargar archivos:", error);
            }
            this.loading = false;
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
            }, this.time);
            this.stop = false;
        },
        formatURLYouTube(url) {
            try {
                let urlObj = new URL(url);
                if (urlObj.hostname.includes("youtube.com") && urlObj.searchParams.has("v")) {
                    let videoID = urlObj.searchParams.get("v");
                    return `https://www.youtube.com/embed/${videoID}`;
                } else if (urlObj.hostname.includes("youtu.be")) {
                    let videoID = urlObj.pathname.substring(1);
                    return `https://www.youtube.com/embed/${videoID}`;
                } else return url;
            } catch(e) {
                showMessage(e.message.includes('Invalid URL') 
                    ? 'Algunos videos no se cargaron: link invalido' 
                    : e.message);
                return null;
            }
        },
        isVideo(item, next) {
            if (item && !this.loading) {
                if (!item.content && item.link) {
                    if (this.interval) clearInterval(this.interval);
                    this.interval = null;
                    return true;
                } else {
                    next && this.setIndex(1);
                }
            } else return false;
        },
        onPlayerStateChange(e) {
            if (e.data === YT.PlayerState.ENDED) this.setIndex(1);
        },
        initVideo(e) {
            this.vplayer = new YT.Player("v-player", {
                events: {
                    "onStateChange": this.onPlayerStateChange
                }
            });
            setTimeout(() => {
                let state = this.vplayer.getPlayerState();
                if (state !== YT.PlayerState.PLAYING) {
                    this.vplayer.mute();
                    this.vplayer.playVideo();
                }
            }, 1000);
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
}