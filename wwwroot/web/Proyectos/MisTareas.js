export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
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

            editRow: false,
            selRow: null,
            enableEdit: false
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("MisTareas", null);
        this.setMainMode('MisTareas');
        await this.loadData();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async loadData() {
            let usuarios = [];
            [usuarios, this.proyectos, this.tareas, this.prioridades, this.estados] =
                (await httpFunc("/generic/genericDS/Proyectos:Get_Tarea", { username: GlobalVariables.username })).data;
            usuarios.length && (this.usuario = usuarios[0]);
            this.selPro = this.proyectos.find(p => p.id_proyecto === this.proyecto.id_proyecto);
            this.onChangePro();
        },
        onChangePro() {
            let id_pro = this.selPro.id_proyecto;
            id_pro ? this.filtros.tareas.id_proyecto = id_pro : delete this.filtros.tareas.id_proyecto;
            this.cancel();
        },
        onChangeActive(e) {
            e.target.checked ? this.filtros.tareas.activa = '1' : delete this.filtros.tareas.activa;
            this.cancel();
        },
        newRow() {
            this.editRow = !this.editRow;
            this.tarea = {};
            this.selRow = null;
        },
        onSelect(t, i) {
            if (this.selRow != i) {
                this.tarea = { ...t };
                this.editRow = false;
                this.enableEdit = false;
                this.selRow = i;
            }
        },
        async onSave() {
            if (this.selRow)
                this.tarea = this.getFilteredList('tareas')[this.selRow];
            let res = await httpFunc(`/generic/genericST/Proyectos:${this.selRow ? 'Upd' : 'Ins'}_Tarea`,
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
        },
        async onDelete(tarea) {
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
        },
        async reqDelete() {
            if (!this.editRow)
                showConfirm(`Se eliminará la tarea <b>${this.tarea.descripcion}</b> permanentemente.`, this.onDelete, null, this.tarea);
        },
        cancel() {
            this.editRow = false;
            this.selRow = null;
            this.enableEdit = false;
        }
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(String(this.filtros[tabla][key]).toLowerCase())
                    ) : []
                ) : [];
            };
        }
    }
}