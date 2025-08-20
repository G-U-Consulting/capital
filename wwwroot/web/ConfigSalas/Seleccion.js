export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ciudadelas: [],
            zonasProyectos: [],
            salas_ventas: [],
            cordinadores: [],
            sedes: [],
            pro_sala: [],
            proyectos: [],
            proyectos_sala: [],
            t_turnos: [],
            t_turnos_sala: [],
            c_obligatorios: [],
            c_obligatorios_sala: [],

            ciudadela: {},
            zonaProyecto: {},
            sala_venta: {},
            sede: {},
            proyecto_sala: {},

            ruta: [],
            enableEdit: false,
            selRow: null,

            filtros: {
                ciudadelas: { is_active: '', id_sede: '', id_zona_proyecto: '' },
                zonasProyectos: { is_active: '', id_sede: '' },
                salas_ventas: { is_active: '', id_sede: '', id_zona_proyecto: '', id_ciudadela: '' },
                sedes: { is_active: '' },
            },
        };
    },
    async mounted() {
        showProgress();
        this.sala_venta = await GlobalVariables.miniModuleCallback("GetSala", null);
        this.loadData();
        this.setMainMode(0);
        hideProgress();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
            if (this.sala_venta) {
                this.mode = 2;
                this.loadProjects(this.sala_venta);
            }
            else this.mode = 0;
        },
        setMode(mode) {
            if (mode == 0) this.loadData();
            if (mode == 1)
                this.sala_venta = {};
            this.mode = mode;
            let ruta = [];
            if (mode == 1) {
                ruta.push({ text: 'Nueva', action: () => this.setMode(1) });
            }
            if (mode == 2 || mode == 3) {
                ruta.push({ text: `${this.sala_venta.sala_venta} - Edición`, action: () => this.onSelect(this.sala_venta) });
            }
            if (mode == 3) {
                ruta.push({ text: 'Configuración', action: () => this.loadChecked() });
            }
            GlobalVariables.miniModuleCallback('SetRuta', ruta);
        },
        hasPermission(id) {
            return !!GlobalVariables.permisos.filter((p) => p.id_permiso == id)
                .length;
        },
        async onSelect(selected) {
            this.sala_venta = {};
            Object.keys(selected).forEach((key) => (this.sala_venta[key] = selected[key]));
            this.setMode(2);
            GlobalVariables.miniModuleCallback("SeleccionSala", this.sala_venta);
        },
        async onSave() {
            let [item, itemname] = this.getItem(), id = null;
            try {
                showProgress();
                const resp = await httpFunc(`/generic/genericST/Maestros:${this.mode == 1 ? 'Ins' : 'Upd'}_${itemname}`, item, this.mode == 1);
                hideProgress();
                if (this.mode == 1) id = resp.id;
                if (resp.data !== 'OK') throw resp;
            } catch (e) {
                if (e.isError) showMessage('Error: ' + e.errorMessage || e.data);
                console.error(e);
            }
            return id;
        },
        async onSaveSala() {
            let sala = { ...this.sala_venta };
            let id_sala_venta = await this.onSave();
            if (this.mode == 1 && id_sala_venta) 
                this.sala_venta = { id_sede: '', id_zona_proyecto: '', id_ciudadela: '', ...sala, id_sala_venta };
            this.onSelect(this.sala_venta);
            this.loadProjects(this.sala_venta);
        },
        async onChangePF() {
            this.sala_venta = {
                ...this.sala_venta, id_zona_proyecto: '', id_ciudadela: '',
                pro_futuros: this.sala_venta.pro_futuros == '1' ? '0' : '1'
            }
            this.proyectos_sala = [];
            console.log(this.sala_venta);
        },
        getItem() {
            if (this.mainmode == 0) return [this.sala_venta, "SalaVenta", this.salas_ventas];
            return null;
        },
        clearItem(item) {
            if (item) {
                Object.keys(item).forEach((key) => delete item[key]);
            }
        },
        onClear(table) {
            let item = this.filtros[table];
            item = Object.keys(item).forEach((key) => item[key] = '');
        },
        async exportExcel(tabla) {
            try {
                showProgress();
                let datos = this.getFilteredList(tabla);
                var archivo = (await httpFunc("/util/Json2File/excel", datos)).data;
                var formato = (await httpFunc("/util/ExcelFormater", { "file": archivo, "format": "FormatoMaestros" })).data;
                window.open("./docs/" + archivo, "_blank");
            }
            catch (e) {
                console.error(e);
            }
            hideProgress();
        },
        async loadData() {
            [
                this.salas_ventas,
                this.cordinadores,
                this.sedes,
                this.zonasProyectos,
                this.ciudadelas,
                this.t_turnos,
                this.c_obligatorios,
            ] = (await httpFunc("/generic/genericDS/Maestros:Get_Salas", {})).data;
        },
        async loadFields() {
            [this.t_turnos_sala, this.c_obligatorios_sala]
                = (await httpFunc("/generic/genericDS/Maestros:Get_CamposSalas", this.sala_venta)).data;
        },
        formatNumber(value, dec = true) {
            if (!value) return "";
            let [parteEntera, parteDecimal] = value.split(".");
            parteEntera = parteEntera.replace(/\D/g, "");
            parteDecimal = parteDecimal && dec ? parteDecimal.replace(/\D/g, "") : "";

            let groups = [];
            let len = parteEntera.length;
            for (let i = len; i > 0; i -= 3)
                groups.unshift(parteEntera.substring(Math.max(0, i - 3), i));

            let formattedEntera = groups[0] || "";
            for (let i = 1; i < groups.length; i++)
                formattedEntera += '.' + groups[i];

            let result = formattedEntera;
            if (parteDecimal)
                result += "," + parteDecimal;

            return result;
        },
        cleanNumber(value) {
            let cleaned = value.replace(/['.]/g, "");
            cleaned = cleaned.replace(",", ".");
            return cleaned;
        },
        validarFormato(e) {
            e.target.value = e.target.value.replaceAll(/[^0-9\.,]/g, '');
        },
        async toggleState(item) {
            item.is_active = item.is_active == '0' ? '1' : '0';
            await httpFunc(`/generic/genericST/Maestros:Upd_${this.getItem()[1]}`, item);
        },
        async deleteItem(item) {
            let list = this.getItem()[2],
                key = Object.keys(item).filter(k => k.includes('id_'))[0],
                index = list.findIndex(i => i[key] === item[key]),
                res = await httpFunc(`/generic/genericST/Maestros:Del_${this.getItem()[1]}`, item);
            if (res.data === 'OK' && index !== -1) list.splice(index, 1);
            else {
                let msg = res.errorMessage || '';
                showMessage(msg.includes('foreign key constraint fails')
                    ? 'Error: No fue posible eliminar el registro.\nDatos en uso' : msg);
            }
        },
        async requestDelete(item) {
            showConfirm("Se eliminará permanentemente.", this.deleteItem, null, item);
        },
        async removePro(pro) {
            showProgress();
            let res = await httpFunc("/generic/genericST/Maestros:Del_ProyectoSala", pro);
            if (res.isError) {
                console.error(res);
                showMessage('Error: ' + res.errorMessage);
            } else {
                this.proyecto_sala = {};
                this.selRow = null;
                this.enableEdit = false;
                await this.loadProjects(this.sala_venta);
            }
        },
        async reqRemovePro(pro) {
            showConfirm(`Se retirará el proyecto <b>${pro.nombre}</b> de la sala de ventas <b>${this.sala_venta.sala_venta}</b>.`,
                this.removePro, null, pro);
        },
        async loadProjects(sv) {
            showProgress();
            let res = await httpFunc(`/generic/genericDS/Maestros:Get_ProyectoSala`, { id_sala: sv.id_sala_venta });
            if (res.isError) {
                this.pro_sala = [];
                console.error(res);
                showMessage('Error: ' + res.errorMessage);
            } else[this.proyectos, this.pro_sala] = res.data;
            hideProgress();
        },
        async addProjects() {
            showProgress();
            let projects = [...this.proyectos_sala], errorMessage = null;
            if (projects.length) {
                console.log(projects);
                await Promise.all(projects.map(async pro => {
                    if (pro.id_proyecto) {
                        let res = await httpFunc(`/generic/genericST/Maestros:Ins_ProyectoSala`,
                            { id_sala: this.sala_venta.id_sala_venta, id_proyecto: pro.id_proyecto });
                        if (res.isError) {
                            console.error(res);
                            errorMessage |= 'Error: ' + res.errorMessage;
                        }
                    }
                }));
                errorMessage && showMessage(errorMessage);
                this.proyectos_sala = [];
                await this.loadProjects(this.sala_venta);
            }
            hideProgress();
        },
        async onSelectPro(pro, i) {
            if (this.selRow != i && pro.is_active == '1') {
                this.enableEdit && await this.onSavePro();
                this.proyecto_sala = { ...pro };
                this.enableEdit = false;
                this.selRow = i;
            }
        },
        async onSavePro(pro) {
            if (pro) this.proyecto_sala = pro;
            else if (this.selRow != null) {
                showProgress();
                this.proyecto_sala = this.pro_sala[this.selRow];
            }
            let res = await httpFunc('/generic/genericST/Maestros:Upd_ProyectoSala', this.proyecto_sala);
            if (res.data === 'OK') {
                this.proyecto_sala = {};
                this.selRow = null;
                this.enableEdit = false;
                if (!pro) await this.loadProjects(this.sala_venta);
            } else {
                console.error(res);
                showMessage('Error: ' + (res.errorMessage || res.data));
            }
            hideProgress();
        },
        async toggleEdit() {
            this.enableEdit ? await this.onSavePro()
                : this.selRow !== null ? this.enableEdit = true : this.enableEdit = false;
        },
        async toggleFeria(sv) {
            sv.is_feria = sv.is_feria == '0' ? '1' : '0';
            await httpFunc(`/generic/genericST/Maestros:Upd_SalaVenta`, sv);
        },
        async loadChecked() {
            await this.loadFields();
            this.t_turnos = this.t_turnos.map(t => {
                let checked = !!this.t_turnos_sala.filter(ts => ts.id_tipo_turno == t.id_tipo_turno).length;
                return { ...t, checked };
            });
            this.c_obligatorios = this.c_obligatorios.map(c => {
                let checked = !!this.c_obligatorios_sala.filter(cs => cs.id_campo == c.id_campo).length;
                return { ...c, checked };
            });
            this.setMode(3);
        },
        async onUpdateConfig() {
            showProgress();
            let turnos = this.t_turnos.filter(t => t.checked).map(t => t.id_tipo_turno),
                obligatorios = this.c_obligatorios.filter(c => c.checked).map(c => c.id_campo);
            this.sala_venta.tipos_turno = turnos.join(',');
            this.sala_venta.campos_obligatorios = obligatorios.join(',');
            let res = await httpFunc("/generic/genericST/Maestros:Upd_SalaVenta", this.sala_venta);
            hideProgress();
            if (res.isError) {
                console.error(res.errorMessage);
                showMessage('Error: ' + res.errorMessage);
            } else this.mode = 2;
        }
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                    ) : []
                ) : [];
            };
        }
    },
};
