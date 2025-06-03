export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            tabsIncomplete: [],
            tabs: [
                "Bienvenida",
                "Registro",
                "Cotización",
                "Opción",
                "Vinculación",
                "Cierre"
            ],
            showPolicyModal: false,
            policyAccepted: false,
            ObjCliente: {
              NewNombres: '',
              NewApellido1: '',
              NewApellido2: '',
              NewDireccion: '',
              NewCiudad: '',
              NewBarrio: '',
              NewDepartamento: '',
              NewPais: '',
              NewEmail1: '',
              NewEmail2: '',
              NewTelefono1: '',
              NewTelefono2: '',
              NewTipoDocumento: '',
              NewNumeroDocumento: '',
              NewPaisExpedicion: '',
              NewDepartamentoExpedicion: '',
              NewCiudadExpedicion: '',
              NewFechaExpedicion: '',

            },
            tipo: [
                "Presencial",
                "Telefónico",             
                "WhatsApp",
                "Email",
                "Videollamada"
            ],
            Modo: [
                "Rápida",
                "Información",
                "Cierre",
                "Trámites",
                "Otro"
            ],
            iscliente: false,
            cliente: '',
            isboton: true,
        };
    },
    computed: {
        tabClasses() {
          return this.tabs.map((_, index) => {
            if (this.mode === index) {
              return 'wizarTabActive';
            } else if (!this.tabsIncomplete.includes(index)) {
              return 'wizarTabCompleted';
            } else {
              return 'wizarTabIncomplete';
            }
          });
        },
        buttonLabel() {
            return this.mode === 5 ? 'Guardar' : 'Siguiente';
        }
    },
    async mounted() {
        this.tabsIncomplete = this.tabs.map((_, index) => index);
        GlobalVariables.miniModuleCallback("ProcesoNegocio", null);
    },
    methods: {
      handleNext(nextIndex) {
        if (this.mode === 0 && nextIndex === 1 && !this.policyAccepted && this.iscliente && this.ObjCliente.NewNombres !== '') {
          this.showPolicyModal = true;
        } else if (this.policyAccepted || nextIndex === 0) {
          this.mode = nextIndex;
        }
      },
      acceptPolicy() {
        this.policyAccepted = true;
        this.showPolicyModal = false;
        this.mode = 1;
      },
      declinePolicy() {
        this.showPolicyModal = false;
        this.mode = 0;
      },
      handleAction() {
        if (this.mode === 5) {
          this.save();
        } else {
          this.handleNext(this.mode + 1);
        }
      },
        async nuevoCliente() {
            let cliente = await httpFunc('/generic/genericDT/ProcesoNegocio:Ins_Cliente', this.ObjCliente);
            cliente = cliente.data;
            if (cliente[0].result.includes("OK")) {
                this.iscliente = false;
                this.isboton = true;
                this.mode = 0;
                this.policyAccepted = false;
                this.limpiarObj();
                if (cliente[0].result.includes('Insert')) { showMessage("Cliente creado correctamente."); } else showMessage("Cliente actualizado correctamente.");
            } else {
                this.limpiarObj();
                showMessage("Error al crear el cliente.");
            }
        },
      async limpiarObj() {
        this.ObjCliente = {
            NewNombres: '',
            NewApellido1: '',
            NewApellido2: '',
            NewDireccion: '',
            NewCiudad: '',
            NewBarrio: '',
            NewDepartamento: '',
            NewPais: '',
            NewEmail1: '',
            NewEmail2: '',
            NewTelefono1: '',
            NewTelefono2: '',
            NewTipoDocumento: '',
            NewNumeroDocumento: '',
            NewPaisExpedicion: '',
            NewDepartamentoExpedicion: '',
            NewCiudadExpedicion: '',
            NewFechaExpedicion: '',
        };
      },
      async busquedaCliente(){
        let cliente = await  httpFunc('/generic/genericDS/ProcesoNegocio:Get_Variables', {cliente: this.cliente});
        cliente = cliente.data;

        if (cliente && cliente[0] && cliente[0][0]) {
            this.ObjCliente.NewNombres = cliente[0][0].nombres;
            this.ObjCliente.NewApellido1 = cliente[0][0].apellido1;
            this.ObjCliente.NewApellido2 = cliente[0][0].apellido2;
            this.ObjCliente.NewDireccion = cliente[0][0].direccion;
            this.ObjCliente.NewCiudad = cliente[0][0].ciudad;
            this.ObjCliente.NewBarrio = cliente[0][0].barrio;
            this.ObjCliente.NewDepartamento = cliente[0][0].departamento;
            this.ObjCliente.NewPais = cliente[0][0].pais;
            this.ObjCliente.NewEmail1 = cliente[0][0].email1;
            this.ObjCliente.NewEmail2 = cliente[0][0].email2;
            this.ObjCliente.NewTelefono1 = cliente[0][0].telefono1;
            this.ObjCliente.NewTelefono2 = cliente[0][0].telefono2;
            this.ObjCliente.NewTipoDocumento = cliente[0][0].tipo_documento;
            this.ObjCliente.NewNumeroDocumento = cliente[0][0].numero_documento;
            this.ObjCliente.NewPaisExpedicion = cliente[0][0].pais_expedicion;
            this.ObjCliente.NewDepartamentoExpedicion = cliente[0][0].departamento_expedicion;
            this.ObjCliente.NewCiudadExpedicion = cliente[0][0].ciudad_expedicion;
            this.ObjCliente.NewFechaExpedicion = cliente[0][0].fecha_expedicion;

            this.iscliente = true;
            this.isboton = false;
        } else {
            this.ObjCliente.NewNombres = '';
            this.iscliente = false;
            showMessage("No se encontró el cliente.");
        }

      }
    }
}