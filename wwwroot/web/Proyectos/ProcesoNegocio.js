export default {
  data() {
    return {
      mainmode: 0,
      mode: 0,
      submode: 1,
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
        NewIsPoliticaAceptada: 0,

      },
      ObjVisita: {
        id_proyecto: '',
        tipo_registro: '',
        modo_atencion: '',
        id_categoria: '',
        id_medio: '',
        id_motivo_compra: '',
        id_referencia: '',
        id_presupuesto_vivienda: '',
        otro_texto: '',
        descripcion: '',
        id_cliente: '',
      },
      modo_atencion: [],
      tipo_registro: [],
      visitas: [],
      iscliente: false,
      cliente: '',
      isboton: true,
      tab: ['Registros de visita', 'Registros de compras'],
      activeTab: 0,
      visitas: [],
      id_cliente: 0,
      filtroProyecto: '',
      contadorProyectos: {},
      cotizaciones: [],
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
    }, proyectosUnicos() {
      const proyectos = this.visitas.map(v => v.proyecto);
      return [...new Set(proyectos)];
    }, visitasFiltradas() {
      if (!this.filtroProyecto) return this.visitas;
      return this.visitas.filter(v => v.proyecto === this.filtroProyecto);
    }
  },
  watch: {
    visitasFiltradas: {
      handler(val) {
        this.contarProyectos(val);
      },
      immediate: true,
      deep: true
    }
  },
  async mounted() {
    this.tabsIncomplete = this.tabs.map((_, index) => index);
    GlobalVariables.miniModuleCallback("ProcesoNegocio", null);
    let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Variables', {});
    this.categoria = resp.data[0];
    this.medio = resp.data[1];
    this.motivo_compra = resp.data[2];
    this.referencia = resp.data[3];
    this.tipo_registro = resp.data[4];
    this.modo_atencion = resp.data[5];
    this.presupuesto_vivienda = resp.data[6];
  },
  methods: {
    async handleNext(nextIndex) {
      if (this.mode === 0 && nextIndex === 1 && !this.policyAccepted && this.iscliente && this.ObjCliente.NewNombres !== '') {
        showMessage("Debe aceptar la política para continuar.");
      } else if (this.policyAccepted || nextIndex === 0) {
        this.mode = nextIndex;
      }
    },
    async acceptPolicy(isChecked) {
      if (isChecked) {
        this.policyAccepted = true;
        this.showPolicyModal = false;
      }
    },
    async declinePolicy() {
      this.showPolicyModal = false;
      this.mode = 0;
    },
    async handleAction() {
      if (this.mode === 5) {
        this.save();
      } else {
        this.handleNext(this.mode + 1);
      }
    },
    async nuevoCliente() {
      if (!this.policyAccepted) {
        showMessage("Debe aceptar la política para continuar.");
        return;
      }
      let cliente = await httpFunc('/generic/genericDT/ProcesoNegocio:Ins_Cliente', this.ObjCliente);
      cliente = cliente.data;
      if (cliente[0].result.includes("OK")) {
        this.iscliente = false;
        this.isboton = true;
        this.mode = 0;
        this.policyAccepted = false;
        // this.limpiarObj();
        this.iscliente = true;
        this.acceptPolicy(true);
        if (cliente[0].result.includes('Insert')) { showMessage("Cliente creado correctamente."); } else showMessage("Cliente actualizado correctamente.");
      } else {
        this.limpiarObj();
        showMessage("Error al crear el cliente.");
      }
    },
    async limpiarObj() {
      if (this.mode == 0) {
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
          NewIdPresupuestoVivienda: '',
          NewIsPoliticaAceptada: 0,
        }
      }
      if (this.mode == 1) {
        this.ObjVisita = {
          tipo_registro: '',
          modo_atencion: '',
          id_categoria: '',
          id_medio: '',
          id_motivo_compra: '',
          id_referencia: '',
          otro_texto: '',
          descripcion: '',
          id_presupuesto_vivienda: '',
        }
        if (Array.isArray(this.tipo_registro)) {
          this.tipo_registro.forEach(item => item.checked = false);
        }
        if (Array.isArray(this.modo_atencion)) {
          this.modo_atencion.forEach(item => item.checked = false);
        }
      }
      this.iscliente = true;
    },
    async busquedaCliente() {
      let cliente = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Cliente', { cliente: this.cliente });
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
        this.id_cliente = cliente[0][0].id_cliente;
        this.ObjCliente.NewIsPoliticaAceptada = cliente[0][0].is_politica_aceptada;

        if (this.ObjCliente.NewIsPoliticaAceptada == 1) {
          this.policyAccepted = true;
        } else {
          this.policyAccepted = false;
        }

        this.iscliente = true;
        this.isboton = false;
      } else {
        this.ObjCliente.NewNombres = '';
        this.iscliente = false;
        showMessage("No se encontró el cliente.");
      }

    },
    async setSubmode(index) {
      if (index == 1) {
        let resp2 = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Registro', { cliente: this.cliente });
        this.visitas = resp2.data[0];
      }
    },

    ///////// mode 1
    async nuevaVisita() {
      this.ObjVisita.id_proyecto = GlobalVariables.id_proyecto;
      this.ObjVisita.id_cliente = this.id_cliente;
      const tipo = this.tipo_registro
        .filter(item => item.checked)
        .map(item => item.id_tipo_registro);
      this.ObjVisita.tipo_registro = tipo.join(',');

      const estadopublicacion = this.modo_atencion
        .filter(item => item.checked)
        .map(item => item.id_modo_atencion);
      this.ObjVisita.modo_atencion = estadopublicacion.join(',');
      if (this.ObjVisita.tipo_registro === '' || this.ObjVisita.modo_atencion === '') {
        showMessage("Debe seleccionar al menos un Tipo de Registro y un Modo de Atención.");
        return;
      }
      if(this.ObjVisita.id_visita != null){
          showMessage("Esta visita no se puede actualizar.");
          return;
      }
      showProgress();
      try {
        let resp = await httpFunc('/generic/genericST/ProcesoNegocio:Ins_Registro', this.ObjVisita);
        hideProgress();
        resp = resp.data;
        if (resp.includes("OK")) {
          await this.setSubmode(1);
          showMessage("Visita creada correctamente.");
        }
      } catch (error) {
        hideProgress();
        showMessage("Error al crear la visita.");
      }
    },
    async editarVisita(id_visita) {
      this.ObjVisita.id_visita = id_visita;
      let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Registro', { id_visita: id_visita });
      this.ObjVisita.id_categoria = resp.data[0][0].id_categoria_medio;
      this.ObjVisita.id_medio = resp.data[0][0].id_medio;
      this.ObjVisita.id_motivo_compra = resp.data[0][0].id_motivo_compra;
      this.ObjVisita.id_referencia = resp.data[0][0].id_referencia;
      this.ObjVisita.otro_texto = resp.data[0][0].otro_texto;
      this.ObjVisita.descripcion = resp.data[0][0].descripcion;
      this.ObjVisita.id_presupuesto_vivienda = resp.data[0][0].id_presupuesto_vivienda;

      var tFSeleccionada = resp.data[0][0].tipo_registro;
      this.tipo_registro.forEach(item => {
        if (tFSeleccionada) {
          item.checked = (item.id_tipo_registro == tFSeleccionada);
        } else {
          item.checked = false;
        }
      });
      var tFSeleccionada = resp.data[0][0].modo_atencion;
      this.modo_atencion.forEach(item => {
        if (tFSeleccionada) {
          item.checked = (item.id_modo_atencion == tFSeleccionada);
        } else {
          item.checked = false;
        }
      });
    },
    contarProyectos(lista) {
      const contador = {};
      lista.forEach(item => {
        if (!contador[item.proyecto]) {
          contador[item.proyecto] = 0;
        }
        contador[item.proyecto]++;
      });
      this.contadorProyectos = contador;
    },

    //////// mode 2

    addCotizacion() {
      this.cotizaciones.push({
        cotizacion: '',
        fecha: '',
        descripcion: '',
        importe: '',
      });
    },

  },
}