export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            cargos: [],
            ruta: [],
            /// Mis Tareas
            proyectos: [],
            tareas: [],
            prioridades: [],
            estados: [],
            proyecto: {},
            selPro: {},
            usuario: {},
            tarea: {},

            filtros: {
                tareas: { activa: '1' }
            },

            editNewRow: false,
            selRow: null,
            enableEdit: false,
            orden: "dead-prio"
        }
    }, 
    async mounted() {
        this.setMainMode(0);
    },
    methods: {
        setRuta() {
            let subpath = [this.getMainPath()];
            this.ruta = [{
                text: 'ZU', action: () => 
                GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
            }, {text: 'Agenda', action: () => { this.mode = -1; this.setMode(-1) }}];
            this.ruta = [...this.ruta, ...subpath];
        },
        async setMainMode(mode) {
            if (mode == 0) {
                await this.loadData();
            } else if (mode == 1) {
               
            } 
            this.mode = mode;
            this.setRuta();
        },
        getMainPath() {
            const labels = ["Mis Tareas", "Mi Calendario"];
            return {
                text: labels[this.mode],
                action: () => this.setMode(this.mode)
            };
        },
        setMode(mode) {
            this.mode = mode;
            this.setRuta();
        },
        //////////////// Mis Tareas ////////////////
        async loadData() {
            showProgress();
            let usuarios = [];
            [usuarios, this.proyectos, this.tareas, this.prioridades, this.estados] =
                (await httpFunc("/generic/genericDS/Proyectos:Get_Tarea", { username: GlobalVariables.username })).data;
            usuarios.length && (this.usuario = usuarios[0]);
            this.selPro = this.proyectos.find(p => p.id_proyecto === this.proyecto.id_proyecto);
            this.onChangePro();
            hideProgress();
        },
        onChangePro() {
            if (this.selPro) {
                let id_pro = this.selPro.id_proyecto;
                id_pro ? this.filtros.tareas.id_proyecto = id_pro : delete this.filtros.tareas.id_proyecto;
            } else delete this.filtros.tareas.id_proyecto;
            this.cancel();
        },
        onChangeActive(e) {
            e.target.checked ? this.filtros.tareas.activa = '1' : delete this.filtros.tareas.activa;
            this.cancel();
        },
        newRow() {
            this.editNewRow = !this.editNewRow;
            this.tarea = { alta: this.formatDate(new Date()) };
            this.selRow = null;
        },
        onSelect(t, i) {
            if (this.selRow != i && t.id_estado != '4') {
                this.tarea = { ...t };
                this.editNewRow = false;
                this.enableEdit = false;
                this.selRow = i;
            }
        },
        async onSave() {
            if (this.enableEdit || this.editNewRow) {
                showProgress();
                if (this.selRow)
                    this.tarea = this.getFilteredList('tareas')[this.selRow];
                let res = await httpFunc(`/generic/genericST/Proyectos:${this.selRow != null ? 'Upd' : 'Ins'}_Tarea`,
                    { ...this.tarea, id_usuario: this.usuario.id_usuario });
                if (res.data === 'OK') {
                    this.tareas =
                        (await httpFunc("/generic/genericDT/Proyectos:Get_Tareas", { id_usuario: this.usuario.id_usuario })).data;
                    this.tarea = {};
                    this.cancel();
                } else {
                    console.error(res);
                    showMessage('Error: ' + (res.errorMessage || res.data));
                }
                hideProgress();
            }
        },
        async onDelete(tarea) {
            showProgress();
            let res = await httpFunc(`/generic/genericST/Proyectos:Del_Tarea`, tarea);
            if (res.data === 'OK') {
                this.tareas =
                    (await httpFunc("/generic/genericDT/Proyectos:Get_Tareas", { id_usuario: this.usuario.id_usuario })).data;
                this.tarea = {};
                this.cancel();
            } else {
                console.error(res);
                showMessage('Error: ' + (res.errorMessage || res.data));
            }
            hideProgress();
        },
        async reqDelete() {
            if (!this.editNewRow)
                showConfirm(`Se eliminará la tarea <b>${this.tarea.descripcion}</b> permanentemente.`, this.onDelete, null, this.tarea);
        },
        cancel() {
            this.editNewRow = false;
            this.selRow = null;
            this.enableEdit = false;
        },
        formatDate(date) {
            let day = date.getDate().toString().padStart(2, '0'),
                month = (date.getMonth() + 1).toString().padStart(2, '0'),
                year = date.getFullYear(),
                hour = (date.getHours() % 12 || 12).toString().padStart(2, '0'),
                minutes = date.getMinutes().toString().padStart(2, '0'),
                meridian = date.getHours() >= 12 ? 'p. m.' : 'a. m.';
            return `${year}-${month}-${day}`;
        }
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(String(this.filtros[tabla][key]).toLowerCase())
                    ) : []
                ).sort((a, b) => {
                    let fecha_a = new Date(a.deadline), fecha_b = new Date(b.deadline),
                        orden_a = parseInt(a.orden_p), orden_b = parseInt(b.orden_p);
                    if (this.orden == 'prio-dead') {
                        if (orden_a == orden_b) return fecha_a <= fecha_b ? -1 : 1;
                        else return orden_b - orden_a;
                    }
                    else {
                        if (a.deadline == b.deadline) return orden_b - orden_a;
                        else return fecha_a <= fecha_b ? -1 : 1;
                    }
                }) : [];
            };
        }
    }
    //////////////// Mi Calendario ////////////////
    
}