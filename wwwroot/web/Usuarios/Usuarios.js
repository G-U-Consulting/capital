export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            seachRole: "",
            seachUser: "",
            roles: [],
            cargos: [],
            tiposUsuario: [],
            accessList: [],
            selectedAccess: null,
            selectedAcces: null,
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
                "id_tipo_usuario": "",
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
                "id_tipo_usuario": "",
                "roles": "",
                "created_by": ""
            },
            hoy: "",
            fechaDesde: "",
            fechaHasta: "",
            ruta: GlobalVariables.ruta ,
        }
    }, 
    async mounted() {
        this.inicializarFechas();
        //await this.setMainMode(1);
        //this.startNewUser();
        //await this.setMainMode(2);
        //this.startNewRole();
    },
    computed: {

        getArrowDirection() {
            if (!this.selectedAccess) return '';

            if (this.selectedAccess.item) {
                console.log(this.selectedAccess.item.selected)
                return this.selectedAccess.item.selected ? '←' : '→';
            }
            if (this.selectedAccess.group) {
                console.log(this.selectedAccess.group.selected)
                return this.selectedAccess.group.selected ? '←' : '→';
            }
            if (this.selectedAccess.zone) {
                console.log(this.selectedAccess.zone.selected)
                return this.selectedAccess.zone.selected ? '←' : '→';
            }

            return '→';
        }
    },
    methods: {
        setRuta(...segments) {
            this.ruta = [GlobalVariables.ruta, ...segments].join(" / ");
        },
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
                this.setRuta("Usuarios");
                showProgress();
                this.users = (await httpFunc("/generic/genericDT/Usuarios:Get_Usuarios", { "usuario": this.seachUser })).data;
                var variables = (await httpFunc("/generic/genericDS/Usuarios:Get_Variables", {})).data;
                this.cargos = variables[0];
                this.tiposUsuario = variables[1];
                var tmpList = (await httpFunc("/generic/genericDT/Usuarios:Get_Roles", { "rol": "" })).data;
                tmpList.forEach(function (item) {
                    item.selected = false;
                    
                }.bind(this));
                this.roleList = tmpList;
                await this.loadAccess();
                hideProgress();
            } else if (mode == 2) {
                showProgress();
                this.setRuta("Roles");
                this.roles = (await httpFunc("/generic/genericDT/Usuarios:Get_Roles", { "rol": this.seachRole })).data;
                await this.loadAccess();
                hideProgress();
            }
            this.mainmode = mode;
            this.mode = 0;
        },
        async startNewRole() {
            showProgress();
            this.setRuta("Roles", "Nuevo Rol");
            this.accessList.forEach(function (zone) {
                zone.selected = false;

                for (var key in zone["groups"]) {
                    let group = zone["groups"][key];
                    group.selected = false;

                    group["list"].forEach(function (sitem) {
                        sitem.selected = false;
                    });
                }
            });
            this.mode = 1;
            this.newRole = {
                rol: "",
                permisos: "",
                descripcion: ""
            };

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
            this.setRuta("Usuarios", "Nuevo Usuario");
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
            this.setRuta("Usuarios" ,"Edición de Usuario");
            this.mode = 2;
            this.editUser["id_usuario"] = resp[0][0]["id_usuario"];
            this.editUser["usuario"] = resp[0][0]["usuario"];
            this.editUser["identificacion"] = resp[0][0]["identificacion"];
            this.editUser["nombres"] = resp[0][0]["nombres"];
            this.editUser["email"] = resp[0][0]["email"];
            this.editUser["id_cargo"] = resp[0][0]["id_cargo"];
            this.editUser["id_tipo_usuario"] = resp[0][0]["id_tipo_usuario"];
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
            this.selectedAcces = { item, group, zone };

            if (item) { return this.selectedAccess.zone = null, this.selectedAccess.group = null; } 
            if (group) { return this.selectedAccess.zone = null; }
        
        },
        asignAccess() {
            const { item, group, zone } = this.selectedAcces;

            if (item) {
                item.selected = !item.selected;
                group.selectedItems += item.selected ? 1 : -1;
                zone.selectedItems += item.selected ? 1 : -1;
                return;
            }
            if (group) {
                group.selected = !group.selected;
                this.asignAccessGrupo();
                return;
            }
            if (zone) {
                zone.selected = !zone.selected; 
                this.asignAccessZona();
            }
        },
        asignAccessGrupo() {
            const { group, zone } = this.selectedAcces;

            if (!group || !zone ) return;

            const selectedCount = group.list.filter(i => i.selected).length;

            if (selectedCount > 0) {
                group.list.forEach(i => {
                    if (i.selected) {
                        i.selected = false;
                    }
                });
                group.selectedItems -= selectedCount;
                zone.selectedItems -= selectedCount;
            } else {
                group.list.forEach(i => {
                    if (!i.selected) {
                        i.selected = true;
                    }
                });
                group.selectedItems = group.list.length;
                zone.selectedItems += group.list.length;
            }
        },
        asignAccessZona() {
            const { zone } = this.selectedAcces;
            if (!zone?.groups) return;

            const groupsArray = Array.isArray(zone.groups) ? zone.groups : Object.values(zone.groups);

            let selectedGroupsCount = groupsArray.filter(group => group.selected).length;
            let totalGroups = groupsArray.length;

            const isAssigning = selectedGroupsCount !== totalGroups;

            groupsArray.forEach(group => {
                group.selected = isAssigning;
                group.list.forEach(i => i.selected = isAssigning);
                group.selectedItems = isAssigning ? group.list.length : 0;
            });

            zone.selected = isAssigning;
            zone.selectedItems = isAssigning ? groupsArray.reduce((sum, group) => sum + group.list.length, 0) : 0;
        },

        async startNewException() {
            this.setRuta("Usuarios", "Permisos Temporales");
            this.mode = 3;
        },

    }
}