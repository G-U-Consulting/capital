export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            seachRole: "",
            roles: [],
            sedes:[],
            selectedRolId: "",
            rolesAsignados: [],
            accessList: [],
            selectedAccess: null,
            selectedAcces: null,
            roleList: [],
            newRole: {
                "rol": "",
                "permisos": "",
                "descripcion": "",
                "id_sede": "",
                "created_by": ""
            },
            editRole: {
                "id_rol": "",
                "rol": "",
                "permisos": "",
                "id_sede": "",
                "descripcion": "",
                "created_by": ""
            },
            ruta: GlobalVariables.ruta ,
        }
    }, 
    async mounted() {
        showProgress();
        var sedes = (await httpFunc("/generic/genericDT/General:Get_Sedes", {})).data;
        sedes.forEach(item => item.checked = false);
        this.sedes = sedes;
        hideProgress();
        this.setMainMode(1);
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
        async setMainMode(mode) {
            if (mode == 1) {
                showProgress();
                this.setRuta("Roles");
                if(this.hasPermission(6))
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
                "rol": "",
                "permisos": "",
                "descripcion": "",
                "id_sede": "",
                "created_by": ""
            };
            this.sedes.forEach(item => item.checked = false);
            hideProgress();
        },
        async insNewRole() {
            this.newRole["permisos"] = "";
            this.newRole.id_sede = "";
            var sede = this.sedes.find(item => { return item.checked });
            if (sede != null)
                this.newRole.id_sede = sede.id_sede;
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
            this.setMainMode(1);
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
            var sedeSeleccionada = resp[3][0];
            this.sedes.forEach(item => {
                if (sedeSeleccionada) {
                    item.checked = (item.id_sede == sedeSeleccionada.id_sede);
                } else {
                    item.checked = false;
                }
            });
            hideProgress();
        },
        async updateRole() {
            this.editRole["permisos"] = "";
            var sede = this.sedes.find(item => { return item.checked });
            this.editRole.id_sede = "";
            if (sede != null)
                this.editRole.id_sede = sede.id_sede;
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
            this.setMainMode(1);
        },
        async asignarRol() {
            if (!this.selectedRolId) return;
        
            const rol = this.roleList.find(r => r.id_rol === this.selectedRolId);
            const yaAsignado = this.rolesAsignados.find(r => r.id_rol === this.selectedRolId);
        
            if (rol && !yaAsignado) {
              rol.selected = true;
              this.rolesAsignados.push(rol);
              this.selectedRolId = '';
            }
          },
        async eliminarRol(index) {
            const rolEliminado = this.rolesAsignados.splice(index, 1)[0];
            const itemEnLista = this.roleList.find(r => r.id_rol === rolEliminado.id_rol);
            if (itemEnLista) itemEnLista.selected = false;
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
        async selectAccess(item, group, zone) {
            this.selectedAccess = { item, group, zone };
            this.selectedAcces = { item, group, zone };

            if (item) { return this.selectedAccess.zone = null, this.selectedAccess.group = null; } 
            if (group) { return this.selectedAccess.zone = null; }
        
        },
        async asignAccess() {
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
        async asignAccessGrupo() {
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
        async asignAccessZona() {
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
        async exportExcel(){
            const res = await httpFunc("/exportExcel/");
        },
        hasPermission(id) {
            return !!GlobalVariables.permisos.filter(p => p.id_permiso == id).length;
        }
    }
}