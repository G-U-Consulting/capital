export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            seachRole: "",
            seachUser: "",
            roles: [],
            accessList: [],
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
                "roles": "",
                "created_by": ""
            },
            editUser: {
                "id_usuario": "",
                "usuario": "",
                "identificacion": "",
                "nombres": "",
                "email": "",
                "roles": "",
                "created_by": ""
            }
        }
    }, 
    async mounted() {
        //await this.setMainMode(1);
        //this.startNewUser();
        //await this.setMainMode(2);
        //this.startNewRole();
    },
    methods: {
        async setMainMode(mode) {
            if (mode == 1) {
                showProgress();
                this.users = (await httpFunc("/generic/genericDT/Usuarios:Get_Usuarios", { "usuario": this.seachUser })).data;
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
                item["list"].forEach(function (sitem) {
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
                item["list"].forEach(function (sitem) {
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
                item["list"].forEach(function (sitem) {
                    if (tmpList.find((ssitem) => { return sitem["id_permiso"] == ssitem["id_permiso"] }) == null)
                        sitem.selected = false;
                    else
                        sitem.selected = true;
                });
            });
            this.mode = 2;
            this.editRole["id_rol"] = resp[0][0]["id_rol"];
            this.editRole["rol"] = resp[0][0]["rol"];
            this.editRole["permisos"] = "";
            this.editRole["descripcion"] = resp[0][0]["descripcion"];
            this.users = resp[2];
            hideProgress();
        },
        async updateRole() {
            this.editRole["permisos"] = "";
            this.accessList.forEach(function (item) {
                item["list"].forEach(function (sitem) {
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
            var groups = {};
            tmpList.forEach(function (item) {
                let cat = null;
                if (groups[item["grupo"]] == null) {
                    cat = { "name": item["grupo"], "list": [] };
                    groups[item["grupo"]] = cat;
                    this.accessList.push(cat);
                } else
                    cat = groups[item["grupo"]];
                item.selected = false;
                cat["list"].push(item);
            }.bind(this));
        },
        async startNewException() {
            this.mode = 3;
        }
    }
}