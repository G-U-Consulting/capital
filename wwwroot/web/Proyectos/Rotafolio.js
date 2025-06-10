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
            interval: null,
            timeout: null,
            playIndex: 0,
            showBar: false,
            vplayer: null,
            time: 8000,
            cont: null,
            showList: false,
            
            lupa: false,
            zoomLens: null,

            zoom: false,
            zoomBox: null,
            isDragging: false,
            startX: 0,
            startY: 0,
            zoomFactor: 1,
            zoomTimeout: null,

            tooltipVisible: false,
            tooltipX: 0,
            tooltipY: 0,
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
        this.handleFullscreen();
    },
    unmounted() {
        this.interval && clearInterval(this.interval);
        this.timeout && clearTimeout(this.timeout);
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async setTime() {
            let res = await httpFunc('/generic/genericDT/General:Get_Variable', { nombre_variable: 'CarDurac' });
            if (res.data.length && res.data[0].valor)
                this.time = parseFloat(res.data[0].valor.replace(',', '.')) * 1000;
        },
        async listResources() {
            this.loading = true;
            this.files = [];
            let id_proyecto = this.proyecto ? this.proyecto.id_proyecto : null;
            if (id_proyecto) {
                let general = null, sostenibilidad = null;
                let res = await httpFunc('/generic/genericDT/Maestros:Get_Documento',
                    { documento: "General,Sostenibilidad", is_img: 1 });
                if (res.data && res.data.length == 2) {
                    let data = res.data.sort((a, b) => a.documento.localeCompare(b.documento));
                    general = await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                        { tipo: data[0].documento, id_maestro_documento: data[0].id_documento });

                    sostenibilidad = await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                        { tipo: data[1].documento, id_maestro_documento: data[1].id_documento });
                }

                let principal = await httpFunc('/generic/genericDT/Maestros:Get_Archivos',
                    { tipo: 'logo,slide,planta', id_proyecto });

                res = await httpFunc('/generic/genericDT/Medios:Get_GrupoProyecto', { id_proyecto });
                let grupos = res.data;
                let modulos = ['imagenes', 'videos', 'avances de obra'];
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
                this.grupos = [{ grupo: 'General', orden: -3, files: general.data, expanded: false },
                { grupo: 'Sostenibilidad', orden: -2, files: sostenibilidad.data, expanded: false },
                { grupo: 'Principal', orden: -1, files: principal.data, expanded: false }, ...grupos];

                await this.orderResources();
                this.files.length && (this.files[0].current = true);
                await this.loadResources();
            }
        },
        async orderResources() {
            let grupos = this.grupos.sort((a, b) => parseInt(a.orden) - parseInt(b.orden));
            grupos.forEach(g => {
                let files = g.files.sort((a, b) => parseInt(a.orden) - parseInt(b.orden)).map(f => {
                    if (f.link) {
                        let link = this.formatURLYouTube(f.link);
                        if (link) {
                            f.link = link;
                            return f;
                        }
                    } else return f;
                });
                this.files = [...this.files, ...files.filter(f => f != undefined)];
            });
        },
        async loadResources() {
            try {
                let files = [...this.files];
                await Promise.all(files.map(async (f, i) => {
                    if (!f.link) {
                        const res = await fetch('/file/S3get/' + f.llave);
                        if (!res.ok) throw new Error(`Error al cargar ${f.llave}: ${res.statusText}`);
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
            this.playIndex = 0;
        },
        fullScreen() {
            if (!this.cont) this.cont = document.getElementById('cont-rotafolio');

            if (this.full) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                this.full = false;
            }
            else {
                if (this.cont.requestFullscreen) {
                    this.cont.requestFullscreen();
                } else if (cont.mozRequestFullScreen) {
                    this.cont.mozRequestFullScreen();
                } else if (cont.webkitRequestFullscreen) {
                    this.cont.webkitRequestFullscreen();
                } else if (cont.msRequestFullscreen) {
                    this.cont.msRequestFullscreen();
                }
                this.full = true;
            }
        },
        handleFullscreen () {
            let handleFullscreenChange = () => {
                if (!document.fullscreenElement && 
                    !document.webkitFullscreenElement && 
                    !document.mozFullScreenElement && 
                    !document.msFullscreenElement) 
                    this.full = false;
                this.lupa = false;
                this.zoom = false;
            }
            document.addEventListener("fullscreenchange", handleFullscreenChange);
            document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
            document.addEventListener("mozfullscreenchange", handleFullscreenChange);
            document.addEventListener("MSFullscreenChange", handleFullscreenChange);
        },
        pause() {
            if (this.interval) clearInterval(this.interval);
            this.interval = null;
            this.stop = true;
        },
        setIndex(i) {
            this.files[this.playIndex].current = false;
            this.playIndex = ((this.playIndex || this.files.length) + i) % this.files.length;
            this.files[this.playIndex].current = true;
            this.resetInterval();
        },
        resetInterval() {
            this.interval && clearInterval(this.interval);
            this.interval = setInterval(() => {
                let img = document.getElementById('img-rotafolio');
                img && (img.style.opacity = .7);
                setTimeout(() => {
                    this.files[this.playIndex].current = false;
                    this.playIndex = (this.playIndex + 1) % this.files.length;
                    this.files[this.playIndex].current = true;
                }, 200);
            }, this.time);
            this.stop = false;
        },
        formatURLYouTube(url) {
            try {
                if (!url.startsWith('https://www.')) url = 'https://www.' + url;
                let urlObj = new URL(url);
                if (urlObj.hostname.includes("youtube.com") && urlObj.searchParams.has("v")) {
                    let videoID = urlObj.searchParams.get("v");
                    return `https://www.youtube.com/embed/${videoID}`;
                } else if (urlObj.hostname.includes("youtu.be")) {
                    let videoID = urlObj.pathname.substring(1);
                    return `https://www.youtube.com/embed/${videoID}`;
                } else return url;
            } catch (e) {
                console.error(e);
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
                    this.lupa = false;
                    this.zoom = false;
                    return true;
                } else {
                    next && this.setIndex(1);
                }
            } else return false;
        },
        onPlayerStateChange(e) {
            if (e.data === YT.PlayerState.ENDED) this.setIndex(1);
        },
        onloadimg(e) {
            this.lupa = false;
            this.zoom = false;
            let img = e.target, rel = img.naturalWidth / img.naturalHeight, min = 150, fact = 1.5;
            let maxheight = img.parentElement.offsetHeight, maxwidth = img.parentElement.offsetWidth;
            let width = Math.min(maxwidth, img.naturalWidth * fact), height = Math.min(maxheight, img.naturalHeight * 1.2);
            let rel2 = width / height;
            if (img.naturalHeight < min) {
                img.width = min * rel;
                img.height = min;
            }
            else if (rel2 > rel / fact && rel2 < rel * fact) {
                img.width = img.naturalWidth * fact;
                img.height = img.naturalHeight * fact;
            }
            else {
                img.width = img.width * fact;
                img.height = img.height * fact;
            }
            img.style.opacity = 1;
        },
        initVideo(e) {
            this.vplayer = new YT.Player("v-player", {
                events: {
                    "onStateChange": this.onPlayerStateChange
                }
            });
            setTimeout(() => {
                let state = this.vplayer && this.vplayer.getPlayerState();
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
        toggleList() {
            this.showList = !this.showList;
        },
        selectFile(file) {
            this.files.forEach(f => f.current = false);
            file.current = true;
            this.playIndex = this.files.indexOf(file);
            this.stop ? this.pause() : this.resetInterval();
        },
        updateCursor(event) {
            this.tooltipX = event.clientX + 10;
            this.tooltipY = event.clientY + 10;
        },
        toggleExpand() {
            let expanded = this.isExpanded();
            this.grupos.forEach(g => g.expanded = !expanded);
        },
        toggleLupa() {
            this.lupa = !this.lupa;
            this.zoomLens = document.getElementById('zoom-lens');
            const img = document.getElementById('img-rotafolio');

            if (this.lupa && img) {
                const zoomFactor = 2;

                this.zoomLens.style.backgroundImage = `url(${img.src})`;
                this.zoomLens.style.backgroundSize = `${img.width * zoomFactor}px ${img.height * zoomFactor}px`;
            }
        },
        movelupa(event) {
            if (this.lupa) {
                const img = document.getElementById('img-rotafolio');
                const imgRect = img.getBoundingClientRect();
                const zoomFactor = 2;

                const scaleX = img.naturalWidth / img.width;
                const scaleY = img.naturalHeight / img.height;

                let offsetX = event.clientX - imgRect.left;
                let offsetY = event.clientY - imgRect.top;

                const lensWidth = this.zoomLens.offsetWidth;
                const lensHeight = this.zoomLens.offsetHeight;

                let lensX = offsetX - lensWidth / 2;
                let lensY = offsetY - lensHeight / 2;

                lensX = Math.max(0, Math.min(lensX, img.width - lensWidth));
                lensY = Math.max(0, Math.min(lensY, img.height - lensHeight));

                let maxX = img.width - lensWidth;
                let maxY = img.height - lensHeight;

                this.zoomLens.style.left = `${lensX + img.offsetLeft}px`;
                this.zoomLens.style.top = `${lensY + img.offsetTop}px`;
                const calcX = img.naturalWidth / (maxX * scaleX * 1.1753);
                const calcY = img.naturalHeight / (maxY * scaleY * 1.1937);

                const bgX = lensX * calcX * zoomFactor ;
                const bgY = lensY * calcY * zoomFactor ;

                this.zoomLens.style.backgroundPosition = `-${bgX}px -${bgY}px`;
            }
        },

        changeZoom(relX, relY) {
            const img = document.getElementById('img-rotafolio');
            this.zoomBox = document.getElementById('zoom-box');
            if (!this.cont) this.cont = document.getElementById('cont-rotafolio');

            if (this.zoom && img) {
                let height = img.height * this.c_zoomFactor, contHeight = this.cont.getBoundingClientRect().height;
                let width = img.width * this.c_zoomFactor, contWidth = this.cont.getBoundingClientRect().width;
                this.zoomBox.style.height = height + 'px';
                this.zoomBox.style.width = width + 'px';
                this.zoomBox.style.top = `calc(${(height - contHeight) / contHeight * -relY}% - 4px)`;
                this.zoomBox.style.left = `calc(${(width - contWidth) / contWidth * -relX}% - 4px)`;
                this.zoomBox.style.backgroundImage = `url(${img.src})`;
                this.zoomBox.style.backgroundSize = `${width}px ${height}px`;
            }
        },
        drag(e) {
            this.isDragging = true;
            e.target.style.cursor = 'grabbing';
            this.startX = e.clientX - e.target.offsetLeft;
            this.startY = e.clientY - e.target.offsetTop;
        },
        noDrag(e) {
            this.isDragging = false;
            e.target.style.cursor = 'grab';
            this.startX = 0;
            this.startX = 0;
        },
        dragImage(e) {
            if (!this.isDragging) return;
            e.preventDefault();
            let contenido = e.target, contenedor = contenido.parentElement;
            let x = e.clientX - this.startX;
            let y = e.clientY - this.startY;

            const maxX = 0;
            const maxY = 0;
            const minX = contenedor.clientWidth - contenido.clientWidth;
            const minY = contenedor.clientHeight - contenido.clientHeight;

            contenido.style.left = Math.min(maxX, Math.max(minX, x)) + 'px';
            contenido.style.top = Math.min(maxY, Math.max(minY, y)) + 'px';
        },
        handleWheel(e) {
            let relX = e.offsetX / e.target.getBoundingClientRect().width * 100;
            let relY = e.offsetY / e.target.getBoundingClientRect().height * 100;
            let factor = [1, 1.25, 1.5, 1.75, 2];
            e.deltaY > 0 
                ? this.c_zoomFactor = factor.reverse().find(f => f < this.c_zoomFactor) || Math.min(...factor)
                : this.c_zoomFactor = factor.find(f => f > this.c_zoomFactor) || Math.max(...factor);
            this.changeZoom(relX, relY);
        }

    },
    computed: {
        isExpanded() {
            return () => this.grupos.every(g => g.expanded);
        },
        c_zoomFactor: {
            get() { return this.zoomFactor },
            set(val) {
                this.zoomTimeout && clearTimeout(this.zoomTimeout);
                val > 1 
                    ? this.zoom = true 
                    : this.zoomTimeout = setTimeout(() => {
                        this.zoom = false;
                    }, 1000);
                this.zoomFactor = val;
            }
        },
    },
}