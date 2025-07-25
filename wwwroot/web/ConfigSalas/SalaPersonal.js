export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            onlyActive: false,
            searchID: null,
            usuarios: [],

            usuario: {},
            sala: {},

            filtros: {
                usuarios: {}
            }
        };
    },
    async mounted() {
        this.sala = await GlobalVariables.miniModuleCallback("GetSala", null);
        await this.loadData();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async loadData() {
            this.usuarios = (await httpFunc("/generic/genericDT/Proyectos:Get_Personal", { id_sala: this.sala.id_sala_venta })).data;
        },
        async searchUser() {
            if (this.searchID) {
                let users = (await httpFunc("/generic/genericDT/Usuarios:Get_Usuarios", { seachUser: this.searchID, id_sede: '', id_cargo: '' })).data;
                users = users.filter(u => u.is_active == '1');
                if (users.length) this.usuario = users[0].is_active == '1' ? users[0] : {};
                else {
                    showMessage("No se encontró el usuario");
                    this.usuario = {};
                }
            }
        },
        async onAddUser() {
            let id_usuario = this.usuario.id_usuario;
            if (id_usuario) {
                if (this.usuarios.some(u => u.id_usuario === id_usuario))
                    showMessage("El usuario ya está asignado");
                else {
                    showProgress();
                    let res = (await httpFunc("/generic/genericST/Proyectos:Ins_Personal",
                        { id_sala: this.sala.id_sala_venta, id_usuario }));
                    if (res.data === 'OK') {
                        this.usuarios.push({...this.usuario, permanente: '0'});
                        this.searchID = null;
                        this.usuario = {};
                    }
                    else {
                        console.error(res);
                        showMessage('Error: ' + res.errorMessage);
                    }
                    hideProgress();
                }
            }
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
        },
        onChangeStateView() {
            if (this.onlyActive) this.filtros.usuarios['is_active'] = '1';
            else delete this.filtros.usuarios['is_active'];
        },
        async toggleFix(user) {
            user.permanente = user.permanente == '0' ? '1' : '0';
            let res = (await httpFunc("/generic/genericST/Proyectos:Upd_Personal",
                { id_sala: this.sala.id_sala_venta, id_usuario: user.id_usuario, permanente: user.permanente }));
            if (res.isError) {
                console.error(res);
                showMessage('Error: ' + res.errorMessage)
            }
        }
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                    ) : []
                ).sort((a, b) => {
                    if (a.cargo.toLowerCase() < b.cargo.toLowerCase()) return -1;
                    if (a.cargo.toLowerCase() > b.cargo.toLowerCase()) return 1;
                    if (a.nombres.toLowerCase() < b.nombres.toLowerCase()) return -1;
                    if (a.nombres.toLowerCase() > b.nombres.toLowerCase()) return 1;
                    return 0;
                }) : [];
            };
        },
    }
}