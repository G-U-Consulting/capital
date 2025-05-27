export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            cargos: [],
            ruta: [],
            editCargo: {
                "id_cargo": "",
                "cargo": "",
                "descripcion": "",
            },
            createCargo: {
                "id_cargo": "",
                "cargo": "",
                "descripcion": "",
            },
            seachCargo: "",
            /*SEGURIDAD*/
            passwordPolicy: {
                minLength: 15,
                minNumbers: 1,
                minSpecialChars: 1,
                history: 3,
                maxDaysChange: 60
            },
            files: [],
            previews: [],
            message: "",
            duracion: "3",
            intervalTime: 3000
        }
    }, 
    async mounted() {
        this.setMainMode(1);
    },
    methods: {
        setRuta() {
            let subpath = [this.getMainPath()];
            let nuevo = { text: 'Nuevo', action: () => this.setMode(1) },
                editar = { text: 'Edición', action: () => this.setMode(2) };
            if (this.mode == 1) subpath.push(nuevo);
            if (this.mode == 2) subpath.push(editar);
            this.ruta = [{
                text: 'ZM', action: () => 
                GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
            }, {text: 'General', action: () => { this.mainmode = 0; this.setMode(0) }}];
            this.ruta = [...this.ruta, ...subpath];
        },
        setMode(mode) {
            this.mode = mode;
            this.setRuta();
        },
        async startNewUser() {
            showProgress();
            this.setMode(1);
            hideProgress();
        },
        async setMainMode(mode) {
            if (mode == 1) {
                showProgress();
                var variables = (await httpFunc("/generic/genericDS/Usuarios:Get_Variables", {})).data;
                this.cargos = variables[0];
                hideProgress();
            } else if (mode == 2) {
                showProgress();
                try {
                    const response = await httpFunc("/generic/genericDS/Seguridad:Get_Seguridad", {});
                    const variables = response.data;

                    if (Array.isArray(variables) && variables.length > 0 && Array.isArray(variables[0]) && variables[0].length > 0) {
                        const data = variables[0][0];
                        if (typeof data.valor === "string") {
                            try {
                                data.valor = JSON.parse(data.valor);
                            } catch (error) {
                                console.log("Error al parsear JSON de valor:", error);
                                return;
                            }
                        }
                        this.passwordPolicy = {
                            minLength: data.valor?.minLength,
                            minNumbers: data.valor?.minNumbers,
                            minSpecialChars: data.valor?.minSpecialChars,
                            history: data.valor?.history,
                            maxDaysChange: data.valor?.maxDaysChange
                        };
                    } else {
                        console.log("No se encontraron datos en Seguridad:Get_Seguridad");
                    }
                } catch (error) {
                    console.log("Error al obtener datos de Seguridad:Get_Seguridad:", error);
                }
                hideProgress();
            } else if (mode == 3) {
                this.fetchCarouselImages();
            }
            this.mainmode = mode;
            this.mode = 0;
            this.setRuta();
        },
        async selectUser(item) {
            showProgress();
            var resp = await httpFunc("/generic/genericDS/Cargos:Get_Cargo", { "id_cargo": item["id_cargo"] });
            resp = resp.data;
            const cargo = resp[0][0];
            this.setMode(2);
            this.editCargo["id_cargo"] = cargo["id_cargo"];
            this.editCargo["cargo"] = cargo["cargo"];
            this.editCargo["descripcion"] = cargo["descripcion"];
        
            hideProgress();
        },
        async agregarCargo() {
            try {
                if(this.createCargo.cargo == ""){
                    console.log("Error");
                    return
                }
                var resp = await httpFunc("/generic/genericST/Cargos:Ins_Cargo", this.createCargo);
                if (resp.data === "OK") {
                    this.setMainMode(1);
                }
            } catch (error) {
                console.log(error);
            }
        },
        async eliminarCargo(item) {
            showConfirm("La Categoria <b>"+item.cargo+"</b> se eliminará permanentemente.", this.delCategoria, null, item);
        },
        async actualizarCargo() {
            if (!this.editCargo.cargo.trim()) {
                console.log("El cargo no puede estar vacío.");
                return;
            }
            let resp = await httpFunc("/generic/genericST/Cargos:Upd_Cargo", this.editCargo);
            if (resp.data === "OK") {
                this.setMainMode(1);
            } else {
                console.log("Error al actualizar el cargo.");
            }
        },
        async delCategoria(item) {
            try {
                const resp = await httpFunc("/generic/genericST/Cargos:Del_Cargo", {
                    id_cargo: item.id_cargo,
                });
                if (resp.data === "OK") {
                    this.setMainMode(1);
                } else {
                    console.log("No se pudo eliminar el cargo. Puede haber usuarios asignados.");
                }
            } catch (error) {
                console.log(error)
            } 
        },
        async seachCargos(){
            this.cargos = (await httpFunc("/generic/genericDT/Cargos:Get_Cargos", { "cargo": this.seachCargo })).data;
        },
        /*SEGURIDAD*/
        async updatePolicy() {
            try {
                const jsonData = JSON.stringify(this.passwordPolicy, null, 2);
                console.log(jsonData);
                var resp = await httpFunc("/generic/genericST/Seguridad:Upd_Seguridad", { valor: jsonData });
                if (resp.data === "OK") {
                    console.log("Política de seguridad actualizada correctamente");
                } else {
                    console.error("Error al actualizar la política:", resp.data);
                }
            } catch (error) {
                console.error("Error en la actualización:", error);
            }
        },
        /*PRESENTACION*/
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
        async fetchCarouselImages() {
            try {
                showProgress();
                let response = (await httpFunc("/generic/genericDS/Presentacion:Get_Presentacion", {})).data;
                if (response[1]) {
                    this.previews = response[1].map(x => `/img/carrusel/${x.a}`);
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
        },
        hasPermission(id) {
            return !!GlobalVariables.permisos.filter(p => p.id_permiso == id).length;
        },
        getMainPath() {
            let path = {};
            if (this.mainmode == 1) path.text = "Categorias Adm";
            if (this.mainmode == 2) path.text = "Política de Contraseña";
            if (this.mainmode == 3) path.text = "Fondo Pantalla";
            path.action = () => this.setMode(0);
            return path;
        }
    }
}