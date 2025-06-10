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
            } else if (mode == 1) {
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
            } else if (mode == 2) {
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
                    this.previews = response[1].map(x => `/file/S3get/${x.llave}`);
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
        async handleDrop(event, targetKey = null) {
            if (this.dragIndex !== null) {
                const dropTarget = event.target.closest('.image-card');
                if (dropTarget) {
                    const dropIndex = Array.from(event.currentTarget.querySelectorAll('.image-card')).indexOf(dropTarget);
                    if (dropIndex !== -1 && dropIndex !== this.dragIndex) {
                        const draggedPreview = this.previews[this.dragIndex];
                        const draggedFile = this.files[this.dragIndex];

                        this.previews.splice(this.dragIndex, 1);
                        this.files.splice(this.dragIndex, 1);

                        this.previews.splice(dropIndex, 0, draggedPreview);
                        this.files.splice(dropIndex, 0, draggedFile);
                    }
                }
                this.dragIndex = null;
                return;
            }

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
            if (!this.files.length && !this.previews.length) {
                this.message = "No hay archivos para subir.";
                return;
            }
            const form = new FormData();
            if (this.files.length) {
                this.files.forEach(file => {
                    if (file) form.append("file", file);
                });
            } else if (this.previews.length) {
                this.previews.forEach(preview => {
                    if (preview) form.append("file", preview);
                });
            }
            try {
                showProgress();
                const uploadResp = await httpFunc("/file/upload", form);
                if (uploadResp.isError || !uploadResp.data) {
                    hideProgress();
                    this.message = uploadResp.errorMessage || "Error al subir archivos al servidor.";
                    return;
                }
                const serverFiles = uploadResp.data;
                const s3Resp = await httpFunc("/file/S3upload", serverFiles);
                if (s3Resp.isError || !s3Resp.data) {
                    hideProgress();
                    this.message = s3Resp.errorMessage || "Error al subir archivos a S3.";
                    return;
                }
                const insRespDel = await httpFunc("/generic/genericST/Presentacion:Del_Presentacion", {});
                if (insRespDel.isError || insRespDel.data !== "OK") {
                    hideProgress();
                    this.message = insRespDel.errorMessage || "Error al eliminar el archivo en la base de datos.";
                    return;
                }
                const s3Files = s3Resp.data;
                let arr = [];
                let index = 0;
                
                for (const file of s3Files) {
                    index++;
                    arr.push({
                        id_documento: file.Id,
                        tipo: 'Carrusel',
                        orden: index
                    });
                    const insResp = await httpFunc("/generic/genericST/Presentacion:Ins_Presentacion", arr[index-1]);
                    if (insResp.isError || insResp.data !== "OK") {
                        hideProgress();
                        this.message = insResp.errorMessage || "Error al registrar archivos en la base de datos.";
                        return;
                    }
                }
                this.message = "Archivos subidos y registrados correctamente.";
                this.files = [];
                this.previews = [];
                this.fetchCarouselImages();
                hideProgress();
            } catch (error) {
                hideProgress();
                this.message = "❌ Error al subir los archivos.";
                console.error("Upload error:", error);
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
            // if (this.mainmode == 1) path.text = "Categorias Adm";
            if (this.mainmode == 1) path.text = "Política de Contraseña";
            if (this.mainmode == 2) path.text = "Fondo Pantalla";
            path.action = () => this.setMode(0);
            return path;
        }
    }
}