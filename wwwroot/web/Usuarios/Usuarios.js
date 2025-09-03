export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            filtro: { id_sede: "", seachUser: "", id_cargo: "" },
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
                "created_by": "",
                "contraseña": ""
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
                "created_by": "",
                "is_active": 0,
                "contraseña": ""
            },
            newPassword: "",
            sendSMSPassword: 0,
            sendEmailPassword: 0,
            hoy: "",
            fechaDesde: "",
            fechaHasta: "",
            sedes: [],
            ruta: [],
            isLocked: false,
            isusaurioEdit: false,
        }
    }, 
    async mounted() {
        var sedes = (await httpFunc("/generic/genericDT/General:Get_Sedes", {})).data;
        sedes.forEach(item => item.checked = false);
        this.sedes = sedes;

        this.inicializarFechas();
        await this.setMainMode(1);

        //this.startNewUser();
        //await this.setMainMode(2);
        //this.startNewRole();
    },
    methods: {
        setRuta() {
            let subpath = [];
            let nuevo = { text: 'Nuevo', action: () => this.setMode(1) },
                editar = { text: 'Edición', action: () => this.setMode(2) };
            if (this.mode == 1) subpath.push(nuevo);
            if (this.mode == 2) subpath.push(editar);
            if (this.mode == 3) subpath = [...subpath, editar,
            { text: 'Permisos Temporales', action: () => this.setMode(3) }];
            if (this.mode == 4) subpath = [...subpath, editar,
            { text: 'Restablecer Contraseña', action: () => this.setMode(4) }];
            this.ruta = [{
                text: 'ZU', action: () => 
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)     
            }, { text: 'Usuarios', action: () => { this.mainmode = 1; this.setMode(0) } }];
            this.ruta = [...this.ruta, ...subpath];
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
                showProgress();
                this.hasPermission(1) && await this.getUsuarios();
                var variables = (await httpFunc("/generic/genericDS/Usuarios:Get_Variables", {})).data;
                this.cargos = variables[0];
                this.tiposUsuario = variables[1];
                var tmpList = (await httpFunc("/generic/genericDT/Usuarios:Get_Roles", { "rol": "", "id_sede" : ""})).data;
                tmpList.forEach(function (item) {
                    item.selected = false;
                    
                }.bind(this));
                this.roleList = tmpList;
                await this.loadAccess();
                hideProgress();
            } else if (mode == 2) {
                showProgress();
                var variables = (await httpFunc("/generic/genericDS/Usuarios:Get_Variables", {})).data;
                this.cargos = variables[0];
                hideProgress();
            } 
            this.mainmode = mode;
            this.mode = 0;
            this.setRuta();
        },
        setMode(mode) {
            this.mode = mode;
            this.setRuta();
        },
        async startNewUser() {
            showProgress();
            this.setMode(1);
            this.newUser["usuario"] = "";
            this.newUser["identificacion"] = "";
            this.newUser["nombres"] = "";
            this.newUser["email"] = "";
            this.newUser["id_cargo"] = "";
            this.newUser["roles"] = "";
            this.rolesAsignados = [];
            hideProgress();
        },
        async getUsuarios() {
            this.users = (await httpFunc("/generic/genericDT/Usuarios:Get_Usuarios", this.filtro)).data;
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
            var resp = await httpFunc("/generic/genericST/Usuarios:Ins_Usuario", this.newUser);
            hideProgress();
            if (resp.data === 'OK') {
                resp = await httpFunc("/auth/createUser", { "username": this.newUser["usuario"], "password": this.newUser["contraseña"] });
                console.log(resp);
            }
            resp.data === 'OK' && showConfirm("¿Desea enviar un email con los datos?", this.notifyEmail, null, this.newUser);

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
        async selectUser(item) {
            showProgress();
          
            var resp = await httpFunc("/generic/genericDS/Usuarios:Get_Usuario", { "id_usuario": item["id_usuario"] });
            resp = resp.data;
        
            var tmpList = resp[1];
            this.rolesAsignados = tmpList;
            this.roleList.forEach(function (sitem) {
                if (tmpList.find((ssitem) => sitem["id_rol"] == ssitem["id_rol"])) {
                    sitem.selected = true;
                } else {
                    sitem.selected = false;
                }
            });
        
            const user = resp[0][0];
            this.setMode(2);
        
            this.editUser["id_usuario"] = user["id_usuario"];
            this.editUser["usuario"] = user["usuario"];
            this.editUser["identificacion"] = user["identificacion"];
            this.editUser["nombres"] = user["nombres"];
            this.editUser["email"] = user["email"];
            this.editUser["id_cargo"] = user["id_cargo"];
            this.editUser["id_tipo_usuario"] = user["id_tipo_usuario"];
            this.editUser["roles"] = user["roles"];
            this.editUser["is_active"] = user["is_active"];
            
            await this.toggleUserActive(false);
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
            hideProgress();
            resp.data === 'OK' && showConfirm("¿Desea enviar un email con los datos actualizados?", this.notifyEmail, null, this.editUser);
            this.setMainMode(1);
        },
        async selectUserInRole(item) {
            await this.setMainMode(1);
            this.selectUser(item);
        },
        async startNewException() {
            this.setMode(3);
        },
        async eliminarRol(item) {
            showConfirm("El Rol <b>"+item.rol+"</b> se eliminará permanentemente.", this.delRol, null, item);
        },
        async delRol(item) {
            const index = item;
            const rolEliminado = this.rolesAsignados.splice(index, 1)[0];
            const itemEnLista = this.roleList.find(r => r.id_rol === rolEliminado.id_rol);
            if (itemEnLista) itemEnLista.selected = false;
        },
        async toggleUserActive(item) {
            if(item){
                this.editUser.is_active = Number(this.editUser.is_active) === 1 ? 0 : 1;
            }
            this.isLocked = (Number(this.editUser.is_active) === 0);
            this.isusaurioEdit = (Number(this.editUser.is_active) !== 0);
        },
        async exportExcel() {
            showProgress();
            var archivo = (await httpFunc("/generic/exportDataSP/Usuarios:Get_Usuarios", this.filtro)).data;
            var formato = (await httpFunc("/util/ExcelFormater", { "file": archivo, "format": "FormatoUsuarios" })).data;
            hideProgress();
            window.open("./docs/" + archivo, "_blank");
        },
        randomPassword(newUser) {
            if (GlobalVariables.passwordPolicy) {
              let {
                history,
                maxDaysChange,
                minLength,
                minNumbers,
                minSpecialChars,
              } = GlobalVariables.passwordPolicy;
              let SpecialChars = ['~','@','#','_','*','%','+',':',';','='], password = [];
              for (let x = 0; x < minLength - minNumbers - minSpecialChars; x++) {
                password.push(String.fromCharCode(Math.floor(Math.random() * 26) + 65));
                if (Math.random() > 0.5) password[x] = password[x].toLowerCase();
              }
              for (let x = 0; x < minNumbers; x++)
                password.push(String.fromCharCode(Math.floor(Math.random() * 10) + 48));
              for (let x = 0; x < minSpecialChars; x++)
                password.push(SpecialChars[Math.floor(Math.random() * SpecialChars.length)]);
              for (let i = password.length - 1; i > 0; i--) {
                const randomIndex = Math.floor(Math.random() * (i + 1));
                [password[i], password[randomIndex]] = [password[randomIndex], password[i]];
              }
              if (newUser) newUser.contraseña = password.join('');
              else this.newPassword = password.join('');
            }
        },
        async changePassword() {
            showProgress();
            if (this.editUser && this.newPassword){
              var resp = await httpFunc("/auth/resetPassword", {
                username: this.editUser.usuario,
                newPassword: this.newPassword,
              });
              if (resp.data === "OK") {
                this.editUser.contraseña = this.newPassword;
                this.sendEmailPassword && this.notifyEmail(this.editUser);
                this.sendSMSPassword && this.notifySMS(this.editUser);
                this.setMode(2);
              } else throw new Error({ message: resp.statusText, path: path, data: data });
            }
            if (this.newPassword) this.cancelPassword;
            hideProgress();
        },
        cancelPassword() {
            this.newPassword = "";
            this.sendEmailPassword = 0;
            this.sendSMSPassword = 0;
            this.setMode(2);
        },
        notifySMS(user) {
            if (user) {
                // Datos de usuario
            }
            else {
                // Reestablecer contraseña
            }
        },
        notifyEmail(user) {
            if (user) {
                // Datos de usuario
            }
            else {
                // Reestablecer contraseña
            }
        },
        hasPermission(id) {
            return !!GlobalVariables.permisos.filter(p => p.id_permiso == id).length;
        }
    }
}