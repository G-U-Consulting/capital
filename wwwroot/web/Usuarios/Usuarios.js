export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            seachUser: "",
            cargos: [],
            tiposUsuario: [],
            selectedRolId: "",
            rolesAsignados: [],
            accessList: [],
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
            editCargo: {
                "id_cargo": "",
            },
            nuevoCargo: "",
            actulCargo: false,
            nuevoDescripcion: "",
        }
    }, 
    async mounted() {
        this.inicializarFechas();
        //await this.setMainMode(1);
        //this.startNewUser();
        //await this.setMainMode(2);
        //this.startNewRole();
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
                this.setRuta("Editar Cargos");
                var variables = (await httpFunc("/generic/genericDS/Usuarios:Get_Variables", {})).data;
                this.cargos = variables[0];
                hideProgress();
            } 
            this.mainmode = mode;
            this.mode = 0;
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
            this.rolesAsignados = [];
            hideProgress();
        },
        async insNewUser() {
            // Se deben agregar validaciones previas a la inserción
            if (this.newUser["usuario"] == "") return;
        
            const rolesSeleccionados = this.roleList
                .filter(item => item.selected)         
                .map(item => item.id_rol)              
                .join(",");        
              
            this.newUser["roles"] = rolesSeleccionados+",";
            showProgress();
            const resp = await httpFunc("/generic/genericST/Usuarios:Ins_Usuario", this.newUser);
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
        async selectUser(item) {
            showProgress();
        
            var resp = await httpFunc("/generic/genericDS/Usuarios:Get_Usuario", { "id_usuario": item["id_usuario"] });
            resp = resp.data;
        
            var tmpList = resp[1]; // Roles asignados
            this.rolesAsignados = tmpList; // Guardamos para mostrarlos en la tabla
        
            // Marcar roles seleccionados en checkboxes
            this.roleList.forEach(function (sitem) {
                if (tmpList.find((ssitem) => sitem["id_rol"] == ssitem["id_rol"])) {
                    sitem.selected = true;
                } else {
                    sitem.selected = false;
                }
            });
        
            // Set user data
            const user = resp[0][0];
            this.setRuta("Usuarios", "Edición de Usuario");
            this.mode = 2;
        
            this.editUser["id_usuario"] = user["id_usuario"];
            this.editUser["usuario"] = user["usuario"];
            this.editUser["identificacion"] = user["identificacion"];
            this.editUser["nombres"] = user["nombres"];
            this.editUser["email"] = user["email"];
            this.editUser["id_cargo"] = user["id_cargo"];
            this.editUser["id_tipo_usuario"] = user["id_tipo_usuario"];
            this.editUser["roles"] = user["roles"];
        
            hideProgress();
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
        async startNewException() {
            this.setRuta("Usuarios", "Permisos Temporales");
            this.mode = 3;
        },
        /////  Edición Cargos
        async agregarCargo() {
            if (this.nuevoCargo.trim()) {
                try {
                    var resp = await httpFunc("/generic/genericST/Cargos:Ins_Cargo", { cargo: this.nuevoCargo , Descripcion: this.nuevoDescripcion });
        
                    if (resp.data === "OK") {
                        this.setMainMode(2);
                    } else {
                        console.log("No se pudo agregar el cargo. Puede que ya exista.");
                    }
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        console.log("El cargo ya existe. Intenta con otro nombre.");
                    } else {
                        ("Ocurrió un error inesperado. Inténtalo de nuevo.");
                    }
                }
            } else {
                console.log("El nombre del cargo no puede estar vacío.");
            }
        },
        async eliminarCargo(item) {
            try {
                var resp = await httpFunc("/generic/genericST/Cargos:Del_Cargo", { "id_cargo": item });
        
                if (resp.data == "OK") {
                    this.setMainMode(2);
                } else {
                    console.log("No se pudo eliminar el cargo. Puede haber usuarios asignados a este cargo.");
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.log("No se puede eliminar el cargo porque hay usuarios asignados.");
                } else {
                    console.log("Ocurrió un error inesperado. Inténtalo de nuevo.");
                }
            }
        },
        async actualizarCargo() {
            if (!this.nuevoCargo.trim() || !this.editCargo.id_cargo.trim()) {
                console.log("El cargo no puede estar vacío.");
                return;
            }
            let resp = await httpFunc("/generic/genericST/Cargos:Upd_Cargo", {
                id_cargo: this.editCargo.id_cargo,
                cargo: this.nuevoCargo,
                Descripcion: this.nuevoDescripcion,
            });
            if (resp.data === "OK") {
                this.setMainMode(2);
            } else {
                console.log("Error al actualizar el cargo.");
            }
        },
        seleccionarCargo(cargo, id_cargo,Descripcion ) {
            this.nuevoDescripcion = Descripcion;
            this.nuevoCargo = cargo;
            this.editCargo.id_cargo = id_cargo;
            this.actulCargo = true;
        }
    }
}