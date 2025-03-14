export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            seachRole: "",
            seachUser: "",
            roles: [],
            accessList: [],
            newRole: {
                "rol": "",
                "permisos": "",
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
            }
        }
    }, 
    async mounted() {
        await this.setMainMode(1);
        this.startNewUser();
    },
    methods: {
        async setMainMode(mode) {
            this.mainmode = mode;
            this.mode = 0;
            if (mode == 1) {
                showProgress();
                this.users = (await httpFunc("/generic/genericDT/Usuarios:Get_Usuarios", { "usuario": this.seachUser })).data;
                console.log(this.users);
                hideProgress();
            } else if (mode == 2) {
                showProgress();
                this.roles = (await httpFunc("/generic/genericDT/Usuarios:Get_Roles", { "rol": this.seachRole })).data;
                hideProgress();
            }
        },
        async startNewRole() {
            showProgress();
            this.accessList = [];
            var tmpList = (await httpFunc("/generic/genericDT/Usuarios:Get_Permisos", { })).data;
            var groups = {};
            tmpList.forEach(function(item){
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
            console.log(this.accessList);
            this.mode = 1;
            this.newRole["rol"] = "";
            this.newRole["permisos"] = "";
            hideProgress();
        },
        async insNewRole() {
            this.newRole["permisos"] = "";
            this.accessList.forEach(function (item) {
                item["list"].forEach(function (sitem) {
                    if (sitem.selected)
                        this.newRole["permisos"] += item["id_permiso"]+",";
                }.bind(this));
            }.bind(this));
            if (this.newRole["permisos"] == "") return;
            if (this.newRole["rol"] == "") return;
            showProgress();
            var resp = await httpFunc("/generic/genericDT/Usuarios:Ins_Rol", this.newRole);
            console.log(resp);
            hideProgress();
            this.setMainMode(2);
        },
        async startNewUser() {
            showProgress();
            this.accessList = [];
            var tmpList = (await httpFunc("/generic/genericDT/Usuarios:Get_Roles", {"rol": ""})).data;
            tmpList.forEach(function (item) {
                item.selected = false;
            }.bind(this));
            this.accessList = tmpList;
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
            this.roles.forEach(function (item) {
                if (sitem.selected)
                    this.newUser["roles"] += item["id_rol"]+",";
            }.bind(this));
            if (this.newRole["usuario"] == "") return;
            showProgress();
            var resp = await httpFunc("/generic/genericST/Usuarios:Ins_Usuario", this.newUser);
            console.log(resp);
            hideProgress();
            this.setMainMode(1);
        }
    }
}