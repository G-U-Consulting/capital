export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            proyecto: null,
            sala: {},

            salas: [],
            proyectos: [],
            t_turnos: [],
            t_turnos_sala: [],
            c_obligatorios: [],
            c_obligatorios_sala: [],

            filtros: {
                
            }
        };
    },
    async mounted() {
        showProgress();
        this.proyecto = await GlobalVariables.miniModuleCallback("SalaInfo", null);
        this.setMainMode('SalaInfo');
        await this.loadData();
        hideProgress();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async loadData() {
            let res = (await httpFunc("/generic/genericDT/Proyectos:Get_Proyecto", 
                { id_proyecto: this.proyecto.id_proyecto })).data;
            res.length && (this.proyecto = res[0]);
            let id_sala = this.proyecto.id_sala_venta;
            [
                this.salas, 
                this.proyectos, 
                this.t_turnos, 
                this.t_turnos_sala, 
                this.c_obligatorios, 
                this.c_obligatorios_sala
            ] = (await httpFunc("/generic/genericDS/Proyectos:Get_Salas", { id_sala })).data;
            if (id_sala) {
                if (this.salas.length) {
                    let sala = this.salas.filter(s => s.id_sala_venta == id_sala);
                    if (sala.length) {
                        this.sala = sala[0];
                        this.proyectos = this.proyectos.map(pro => ({...pro, vpn: this.sala.encuesta_vpn}));
                    }
                }
            }
            this.load_checked();
        },
        async onChangeSala() {
            showProgress();
            this.proyecto.id_sala_venta = this.sala.id_sala_venta;
            await httpFunc("/generic/genericST/Proyectos:Upd_Proyecto2", this.proyecto);
            await this.loadData();
            hideProgress()
        },
        load_checked() {
            this.t_turnos = this.t_turnos.map(t => {
                let checked = !!this.t_turnos_sala.filter(ts => ts.id_tipo_turno == t.id_tipo_turno).length;
                return {...t, checked};
            });
            this.c_obligatorios = this.c_obligatorios.map(c => {
                let checked = !!this.c_obligatorios_sala.filter(cs => cs.id_campo == c.id_campo).length;
                return {...c, checked};
            });
        },
        async onUpdate() {
            showProgress();
            let turnos = this.t_turnos.filter(t => t.checked).map(t => t.id_tipo_turno), 
                obligatorios = this.c_obligatorios.filter(c => c.checked).map(c => c.id_campo);
            this.sala.tipos_turno = turnos.join(',');
            this.sala.campos_obligatorios = obligatorios.join(',');
            let res = await httpFunc("/generic/genericST/Maestros:Upd_SalaVenta", this.sala);
            hideProgress();
            if (res.isError) {
                console.error(res.errorMessage);
                showMessage('Error: ' + res.errorMessage);
            }
        }
    },
    computed: {

    }
}