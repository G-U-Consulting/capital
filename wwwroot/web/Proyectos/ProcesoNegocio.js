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
            Obj: {
                NewClient: '',
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
            ]
          
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
            if (this.mode === 0 && nextIndex === 1 && !this.policyAccepted) {
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
          save() {
            this.policyAccepted = false;
            this.mode = 0;
            showMessage("Los datos se guardaron correctamente.");
          },
    }
}