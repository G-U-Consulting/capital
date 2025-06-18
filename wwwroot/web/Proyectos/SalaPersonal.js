export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            proyecto: null,
            searchID: null,
            usuarios: [],

            usuario: {},
            sala: {},

            filtros: {

            }
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("SalaPersonal", null);
        this.setMainMode('SalaPersonal');
        await this.loadData();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async loadData() {
            let res = (await httpFunc("/generic/genericDS/Proyectos:Get_Personal", { id_sala: this.proyecto.id_sala_venta })).data;
            if (res[0].length) this.sala = res[0][0];
            this.usuarios = res[1];
            console.log(this.sala, this.usuarios, res);
        },
        async searchUser() {
            if (this.searchID) {
                let users = (await httpFunc("/generic/genericDT/Usuarios:Get_Usuarios", { searchID: this.searchID, id_sede: '', id_cargo: '', seachUser: '@' })).data;
                console.log(users);
                if (users.length) this.usuario = users[0].is_active == '1' ? users[0] : {};
                else this.usuario = {};
            }
        },
        async onAddUser() {
            showProgress();
            let res = (await httpFunc("/generic/genericST/Proyectos:Ins_Personal",
                { id_sala: this.sala.id_sala_venta, id_usuario: this.usuario.id_usuario }));
            if (res.data === 'OK') {
                this.usuarios.push(this.usuario);
                this.searchID = null;
                this.usuario = {};
            }
            else {
                console.error(res);
                showMessage('Error: ' + res.errorMessage);
            }
            hideProgress();
        },
        async onDelUser(user) {
            showProgress();
            let res = (await httpFunc("/generic/genericST/Proyectos:Del_Personal",
                { id_sala: this.sala.id_sala_venta, id_usuario: user.id_usuario }));
            if (res.data === 'OK') 
                this.usuarios = this.usuarios.filter(u => u.id_usuario != user.id_usuario);
            else {
                console.error(res);
                showMessage('Error: ' + res.errorMessage);
            }
            hideProgress();
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
        },
    }
}