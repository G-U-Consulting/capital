export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            cargos: [],
            ruta: GlobalVariables.ruta ,
            editCargo: {
                "id_cargo": "",
            },
            nuevoCargo: "",
            actulCargo: false,
            nuevoDescripcion: "",
            mostrarModal: false,
            indiceAEliminar: null,
            valorEliminar: ""
        }
    }, 
    async mounted() {

    },
    methods: {
        setRuta(...segments) {
            this.ruta = [GlobalVariables.ruta, ...segments].join(" / ");
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
        async agregarCargo() {
            if (this.nuevoCargo.trim()) {
                try {
                    var resp = await httpFunc("/generic/genericST/Cargos:Ins_Cargo", { cargo: this.nuevoCargo , Descripcion: this.nuevoDescripcion });
        
                    if (resp.data === "OK") {
                        this.setMainMode(1);
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
            this.indiceAEliminar = item;
            this.mostrarModal = true;
            this.valorEliminar = "Categoría"
        },
        async confirmarEliminacion() {
            try {
                const resp = await httpFunc("/generic/genericST/Cargos:Del_Cargo", {
                    id_cargo: this.indiceAEliminar,
                });

                if (resp.data === "OK") {
                    this.setMainMode(1);
                } else {
                    console.log("No se pudo eliminar el cargo. Puede haber usuarios asignados.");
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.log("No se puede eliminar el cargo porque hay usuarios asignados.");
                } else {
                    console.log("Ocurrió un error inesperado. Inténtalo de nuevo.");
                }
            } finally {
                this.mostrarModal = false;
                this.indiceAEliminar = null;
            }
        },
        async cancelarEliminacion() {
            this.mostrarModal = false;
            this.indiceAEliminar = null;
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
                this.setMainMode(1);
            } else {
                console.log("Error al actualizar el cargo.");
            }
        },
        async seleccionarCargo(cargo, id_cargo, Descripcion) {
            this.nuevoDescripcion = Descripcion;
            this.nuevoCargo = cargo;
            this.editCargo.id_cargo = id_cargo;
            this.actulCargo = true;
        }
    }
}