export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            seachRole: "",
            seachUser: "",
            roles: [],
            cargos: [],
            accessList: [],
            selectedAccess: null,
            roleList: [],
            newRole: {
                "rol": "",
                "permisos": "",
                "descripcion": "",
                "created_by": ""
            },
            editRole: {
                "id_rol": "",
                "rol": "",
                "permisos": "",
                "descripcion": "",
                "created_by": ""
            },
            users: [],
            newUser: {
                "usuario": "",
                "identificacion": "",
                "nombres": "",
                "email": "",
                "id_cargo": "",
                "roles": "",
                "created_by": ""
            },
            editUser: {
                "id_usuario": "",
                "usuario": "",
                "identificacion": "",
                "nombres": "",
                "email": "",
                "id_cargo": "",
                "roles": "",
                "created_by": ""
            },
            hoy: "",
            fechaDesde: "",
            fechaHasta: "",
            files: [],
            previews: [],
            message: "",
       
        }
    }, 
    async mounted() {
        this.inicializarFechas();
        this.fetchCarouselImages();
        //await this.setMainMode(1);
        //this.startNewUser();
        await this.setMainMode(2);
        //this.startNewRole();
    },
    methods: {
        agregarCargo() {
            if (this.nuevoCargo.trim() && !this.cargos.includes(this.nuevoCargo)) {
                this.cargos.push(this.nuevoCargo);
                this.newUser.cargo = this.nuevoCargo; // Asigna el nuevo cargo al usuario
                this.nuevoCargo = ''; // Limpia el campo de entrada
            }
        },
        inicializarFechas() {
            this.hoy = new Date().toISOString().split("T")[0];
            this.fechaDesde = this.hoy;
            this.fechaHasta = this.hoy;
        },
        validarDesde() {
            if (this.fechaDesde < this.hoy) {
                this.fechaDesde = this.hoy;
            }
            if (this.fechaHasta < this.fechaDesde) {
                this.fechaHasta = this.fechaDesde;
            }
        },
        validarHasta() {
            if (this.fechaHasta < this.fechaDesde) {
                this.fechaHasta = this.fechaDesde;
            }
        },
        async setMainMode(mode) {
            if (mode == 1) {
                showProgress();
                this.users = (await httpFunc("/generic/genericDT/Usuarios:Get_Usuarios", { "usuario": this.seachUser })).data;
                this.cargos = (await httpFunc("/generic/genericDT/Usuarios:Get_Cargo", { })).data;
                var tmpList = (await httpFunc("/generic/genericDT/Usuarios:Get_Roles", { "rol": "" })).data;
                tmpList.forEach(function (item) {
                    item.selected = false;
                }.bind(this));
                this.roleList = tmpList;
                await this.loadAccess();
                hideProgress();
            } else if (mode == 2) {
                showProgress();
                this.roles = (await httpFunc("/generic/genericDT/Usuarios:Get_Roles", { "rol": this.seachRole })).data;
                await this.loadAccess();
                hideProgress();
            }
            this.mainmode = mode;
            this.mode = 0;
        },
        async startNewRole() {
            showProgress();
            this.accessList.forEach(function (item) {
                for (var key in item["groups"])
                    item["groups"][key]["list"].forEach(function (sitem) {
                        sitem.selected = false;
                    });
            });
            this.mode = 1;
            this.newRole["rol"] = "";
            this.newRole["permisos"] = "";
            this.newRole["descripcion"] = "";
            hideProgress();
        },
        async insNewRole() {
            this.newRole["permisos"] = "";
            this.accessList.forEach(function (item) {
                for (var key in item["groups"])
                    item["groups"][key]["list"].forEach(function (sitem) {
                        if (sitem.selected)
                            this.newRole["permisos"] += sitem["id_permiso"]+",";
                    }.bind(this));
            }.bind(this));
            if (this.newRole["permisos"] == "") return;
            if (this.newRole["rol"] == "") return;
            showProgress();
            var resp = await httpFunc("/generic/genericDT/Usuarios:Ins_Rol", this.newRole);
            hideProgress();
            this.setMainMode(2);
        },
        async selectRole(item) {
            showProgress();
            var resp = await httpFunc("/generic/genericDS/Usuarios:Get_Rol", item);
            resp = resp.data;
            var tmpList = resp[1];
            this.accessList.forEach(function (item) {
                for (var key in item["groups"])
                    item["groups"][key]["list"].forEach(function (sitem) {
                        if (tmpList.find((ssitem) => { return sitem["id_permiso"] == ssitem["id_permiso"] }) == null)
                            sitem.selected = false;
                        else {
                            item["groups"][key].selectedItems++;
                            item["groups"][key].expanded = true;
                            item.selectedItems++;
                            item.expanded = true;

                            sitem.selected = true;
                        }
                    });
            });
            this.mode = 2;
            this.editRole["id_rol"] = resp[0][0]["id_rol"];
            this.editRole["rol"] = resp[0][0]["rol"];
            this.editRole["permisos"] = "";
            this.editRole["descripcion"] = resp[0][0]["descripcion"];
            this.users = resp[2];
            this.selectedAccess = null;
            hideProgress();
        },
        async updateRole() {
            this.editRole["permisos"] = "";
            this.accessList.forEach(function (item) {
                for (var key in item["groups"])
                    item["groups"][key]["list"].forEach(function (sitem) {
                        if (sitem.selected)
                            this.editRole["permisos"] += sitem["id_permiso"] + ",";
                    }.bind(this));
            }.bind(this));
            if (this.editRole["permisos"] == "") return;
            if (this.editRole["rol"] == "") return;
            showProgress();
            var resp = await httpFunc("/generic/genericDO/Usuarios:Upd_Rol", this.editRole);
            hideProgress();
            this.setMainMode(2);
        },
        async startNewUser() {
            showProgress();
            this.mode = 1;
            this.newUser["usuario"] = "";
            this.newUser["identificacion"] = "";
            this.newUser["nombres"] = "";
            this.newUser["email"] = "";
            this.newUser["id_cargo"] = "";
            this.newUser["roles"] = "";
            hideProgress();
        },
        async insNewUser() {
            this.newUser["roles"] = "";
            this.roleList.forEach(function (item) {
                if (item.selected)
                    this.newUser["roles"] += item["id_rol"]+",";
            }.bind(this));
            if (this.newUser["usuario"] == "") return;
            showProgress();
            var resp = await httpFunc("/generic/genericST/Usuarios:Ins_Usuario", this.newUser);
            console.log(resp);
            hideProgress();
            this.setMainMode(1);
        },
        async selectUser(item) {
            showProgress();
            var resp = await httpFunc("/generic/genericDS/Usuarios:Get_Usuario", { "id_usuario": item["id_usuario"]});
            resp = resp.data;
            var tmpList = resp[1];
            this.roleList.forEach(function (sitem) {
                if (tmpList.find((ssitem) => { return sitem["id_rol"] == ssitem["id_rol"] }) == null)
                    sitem.selected = false;
                else
                    sitem.selected = true;
            });
            this.mode = 2;
            this.editUser["id_usuario"] = resp[0][0]["id_usuario"];
            this.editUser["usuario"] = resp[0][0]["usuario"];
            this.editUser["identificacion"] = resp[0][0]["identificacion"];
            this.editUser["nombres"] = resp[0][0]["nombres"];
            this.editUser["email"] = resp[0][0]["email"];
            this.editUser["id_cargo"] = resp[0][0]["id_cargo"];
            this.editUser["roles"] = resp[0][0]["roles"];
            hideProgress();
        },
        async updateUser() {
            this.editUser["roles"] = "";
            this.roleList.forEach(function (item) {
                if (item.selected)
                    this.editUser["roles"] += item["id_rol"] + ",";
            }.bind(this));
            if (this.editUser["usuario"] == "") return;
            showProgress();
            var resp = await httpFunc("/generic/genericST/Usuarios:Upd_Usuario", this.editUser);
            console.log(resp);
            hideProgress();
            this.setMainMode(1);
        },
        async selectUserInRole(item) {
            await this.setMainMode(1);
            this.selectUser(item);
        },
        async loadAccess() {
            this.accessList = [];
            var tmpList = (await httpFunc("/generic/genericDT/Usuarios:Get_Permisos", {})).data;
            var zones = {};
            tmpList.forEach(function (item) {
                let zone = zones[item["zona"]];
                if (zone == null) {
                    zone = {"name": item["zona"], "groups": {}, expanded: false, selectedItems: 0 };
                    zones[item["zona"]] = zone;
                    this.accessList.push(zone);
                }
                let group = zone["groups"][item["grupo"]];
                if (group == null) {
                    group = { "name": item["grupo"], "list": [], expanded: false, selectedItems: 0 };
                    zone["groups"][item["grupo"]] = group;
                }
                item.selected = false;
                group["list"].push(item);
            }.bind(this));
        },
        selectAccess(item, group, zone) {
            this.selectedAccess = { item, group, zone };
        },
        asignAccess() {
            if (!this.selectedAccess.item.selected) {
                this.selectedAccess.item.selected = true;
                this.selectedAccess.group.selectedItems++;
                this.selectedAccess.zone.selectedItems++;
            } else {
                this.selectedAccess.item.selected = false;
                this.selectedAccess.group.selectedItems--;
                this.selectedAccess.zone.selectedItems--;
            }
            
        },
        async startNewException() {
            this.mode = 3;
        },
        async fetchCarouselImages() {
            try {
                let response = await axios.get("/img/carrusel");

                if (response.data.images) {
                    this.previews = response.data.images;

                } else {
                    this.message = "❌ No se encontraron imágenes en el servidor.";
                }
            } catch (error) {
                this.message = "❌ Error al cargar imágenes.";
            }
        },
        async removeImage(index) {
            console.log(index)
            this.previews.splice(index, 1);
        },
        async handleFileChange(event) {
            this.files = Array.from(event.target.files);
            this.files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.previews.unshift(e.target.result);
                };
                reader.readAsDataURL(file);
            });
        },
        async uploadFiles() {
            let formData = new FormData();
            for (const preview of this.previews) {
                if (typeof preview === "string") {
                    let file = await this.urlToFile(preview);
                    if (file) formData.append("file", file);
                } else {
                    formData.append("file", preview);
                }
            }
            this.files.forEach(file => formData.append("file", file));
            if (formData.has("file")) {
                try {
                    let response = await httpFunc("/api/upload", formData);
                    this.message = response.message;
                    this.files = [];
                    this.previews = [];
                    await this.fetchCarouselImages();

                } catch (error) {
                    this.message = "❌ Ocurrió un error.";
                }
            } else {
                this.message = "⚠️ No hay imágenes para subir.";
            }
        },
        async urlToFile(imageUrl) {
            try {
                let response = await fetch(imageUrl);
                let blob = await response.blob();
                let fileName = imageUrl.split("/").pop();
                return new File([blob], fileName, { type: blob.type });
            } catch (error) {
                console.error("Error al convertir imagen:", error);
                return null;
            }
        }
    }
}