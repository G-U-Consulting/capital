export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: GlobalVariables.ruta,
            passwordPolicy: {
                minLength: 15,
                minNumbers: 1,
                minSpecialChars: 1,
                history: 3,
                maxDaysChange: 60
            }
        };
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
                this.setRuta("Política de Contraseña");
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
            }
            this.mainmode = mode;
            this.mode = 0;
        },
        async updatePolicy() {
            try {
                const jsonData = JSON.stringify(this.passwordPolicy, null, 2);
                console.log(jsonData);
                var resp = await httpFunc("/generic/genericST/Seguridad:Upd_Seguridad", {valor: jsonData});
                if (resp.data === "OK") {
                    console.log("Política de seguridad actualizada correctamente");
                } else {
                    console.error("Error al actualizar la política:", resp.data);
                }
            } catch (error) {
                console.error("Error en la actualización:", error);
            }
        },
        hasPermission(id) {
            return !!GlobalVariables.permisos.filter(p => p.id_permiso == id).length;
        }
    }
};
