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
            dragIndex: null,
            hoverIndex: null,
            duracion: "3",
            intervalTime: 3000,
            tooltipVisible: false,
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
            }, { text: 'General', action: () => { this.mainmode = 0; this.setMode(0) } }];
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
                // this.fetchCarouselImages();
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
                if (this.createCargo.cargo == "") {
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
            showConfirm("La Categoria <b>" + item.cargo + "</b> se eliminará permanentemente.", this.delCategoria, null, item);
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
        async seachCargos() {
            this.cargos = (await httpFunc("/generic/genericDT/Cargos:Get_Cargos", { "cargo": this.seachCargo })).data;
        },
        async toggleState(item) {
            item.is_active = item.is_active == '0' ? '1' : '0';
            await httpFunc(`/generic/genericST/Proyectos:Upd_Proyecto2`, { id_proyecto: item.id_proyecto, is_active: item.is_active });
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
        dragStart(index) {
            this.dragIndex = index;
        },
        dragOver(event) {
            // Necesario para permitir el "drop" en el contenedor
        },
        handleDragOver(event) {
            event.preventDefault();
        },
        handleFileChange(event) {
            const selectedFiles = event.target.files;
            this.processFiles(selectedFiles);
        },
        async handleDrop(event) {
            if (this.dragIndex !== null) {
                const dropTarget = event.target.closest('.image-card');
                if (dropTarget) {
                    const dropIndex = Array.from(event.currentTarget.querySelectorAll('.image-card')).indexOf(dropTarget);
                    if (dropIndex !== -1 && dropIndex !== this.dragIndex) {
                        const draggedItem = this.previews[this.dragIndex];
                        const draggedFile = this.files[this.dragIndex];

                        this.previews.splice(this.dragIndex, 1);
                        this.files.splice(this.dragIndex, 1);

                        this.previews.splice(dropIndex, 0, draggedItem);
                        this.files.splice(dropIndex, 0, draggedFile);
                        this.dragIndex = null;
                        return;
                    }
                }
                this.dragIndex = null;
                return;
            }
            if (event.dataTransfer.files.length > 0) {
                const droppedFiles = event.dataTransfer.files;
                this.processFiles(droppedFiles);
            }
        },
        async processFiles(files) {
            let noDocs = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const exists = this.files.some(existingFile => existingFile.name === file.name);
                if (!exists) {
                    let ext = file.name.split('.').pop();
                    if (file.type.startsWith('image/') || this.getIcon(ext)) {
                        const reader = new FileReader();
                        reader.onload = async (e) => {
                            if (file.type.startsWith('image/')) {
                                let f = { src: e.target.result, file: file };
                                Object.defineProperty(f, 'content', {
                                    get() { return this.src; },
                                    set(val) { this.src = val; }
                                });
                                await this.previews.push(f);
                            }
                            else await this.previews.push({ file: file, src: this.getIcon(ext), content: e.target.result });
                            this.files.push(file);
                        };
                        reader.readAsDataURL(file);
                    } else noDocs.push(file.name);
                }
            }
            noDocs.length && showMessage(`Error: Documentos no soportados\n${noDocs.join(', ')}`);
        },
        removeImage(index) {
            this.previews.splice(index, 1);
            this.files.splice(index, 1);
        },
        async uploadFiles() {
            const form = new FormData();


            function getFile(f) {
                if (!f) return null;
                return f instanceof File ? f : f.file || null;
            }

            this.files.forEach(fObj => {
                const file = getFile(fObj) || fObj;
                if (file) form.append(file.name, file);
            });

            showProgress();
            const response = await httpFunc("/file/upload", form);
            hideProgress();
            if (response.isError) {
                showMessage(response.errorMessage);
            } else {
                this.serverFiles = response.data;
                this.S3UploadFiles();
            }
        },
        async S3UploadFiles() {
            showProgress();

            const response = await httpFunc("/file/S3upload", this.serverFiles);

            if (response.isError) {
                showMessage(response.errorMessage);
                hideProgress();
                return;
            }
            this.S3Files = response.data.map((item, index) => ({
                id_documento: item.Id,
                name: item.FileName,
                id_proyecto: GlobalVariables.id_proyecto,
                tipo: "Carrusel",
                orden: index,
                link: item.Url
            }));

            let res = await httpFunc("/generic/genericST/Presentacion:Del_Presentacion",
                {});

            if (res.isError) {
                showMessage(`Error al eliminar archivo: ${archivo.id_documento}`);
                hideProgress();
                return;
            }

            this.S3Files.forEach(async archivo => {
                res = await httpFunc("/generic/genericST/Presentacion:Ins_Presentacion", {
                    orden: archivo.orden,
                    id_documento: archivo.id_documento,
                    tipo: archivo.tipo
                });

                if (res.isError) {
                    showMessage(`Error al insertar archivo: ${archivo.id_documento}`);
                    hideProgress();
                    return;
                }
            });
            hideProgress();
        },

        /*SEGURIDAD*/
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