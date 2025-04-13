export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            cargos: [],
            ruta: GlobalVariables.ruta ,
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
        }
    }, 
    async mounted() {

    },
    methods: {
        setRuta(...segments) {
            this.ruta = [GlobalVariables.ruta, ...segments].join(" / ");
        },
        async startNewUser() {
            showProgress();
            this.setRuta("Categorias Adm", "Nueva Categoria");
            this.mode = 1;
            hideProgress();
        },
        async setMainMode(mode) {
            if (mode == 1) {
                showProgress();
                this.setRuta("Categorias Adm");
                var variables = (await httpFunc("/generic/genericDS/Usuarios:Get_Variables", {})).data;
                this.cargos = variables[0];
                hideProgress();
            } 
            this.mainmode = mode;
            this.mode = 0;
        },
        async selectUser(item) {
            showProgress();
            var resp = await httpFunc("/generic/genericDS/Cargos:Get_Cargo", { "id_cargo": item["id_cargo"] });
            resp = resp.data;
            const cargo = resp[0][0];
            this.setRuta("Categorias Adm", "Edición Categoria");
            this.mode = 2;
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
        }
    }
}