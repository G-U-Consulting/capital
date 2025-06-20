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
      ],
      showPolicyModal: false,
      policyAccepted: false,
      ObjCliente: {
        nombres: '',
        apellido1: '',
        apellido2: '',
        direccion: '',
        ciudad: '',
        barrio: '',
        departamento: '',
        pais: '',
        email1: '',
        email2: '',
        telefono1: '',
        telefono2: '',
        tipoDocumento: '',
        numeroDocumento: '',
        paisExpedicion: '',
        departamentoExpedicion: '',
        ciudadExpedicion: '',
        fechaExpedicion: '',
        isPoliticaAceptada: 0,

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
    this.campoObligatorio();
      
  },
  methods: {
    async handleNext(nextIndex) {
      if (this.mode === 0 && nextIndex === 1 && !this.policyAccepted && this.iscliente && this.ObjCliente.nombres !== '') {
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
      if (!this.validarCampos(this.ObjCliente, this.camposObligatorios)) return;
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
          nombres: '',
          apellido1: '',
          apellido2: '',
          direccion: '',
          ciudad: '',
          barrio: '',
          departamento: '',
          pais: '',
          email1: '',
          email2: '',
          telefono1: '',
          telefono2: '',
          tipoDocumento: '',
          numeroDocumento: '',
          paisExpedicion: '',
          departamentoExpedicion: '',
          ciudadExpedicion: '',
          fechaExpedicion: '',
          idPresupuestoVivienda: '',
          isPoliticaAceptada: 0,
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
        this.ObjCliente.nombres = cliente[0][0].nombres;
        this.ObjCliente.apellido1 = cliente[0][0].apellido1;
        this.ObjCliente.apellido2 = cliente[0][0].apellido2;
        this.ObjCliente.direccion = cliente[0][0].direccion;
        this.ObjCliente.ciudad = cliente[0][0].ciudad;
        this.ObjCliente.barrio = cliente[0][0].barrio;
        this.ObjCliente.departamento = cliente[0][0].departamento;
        this.ObjCliente.pais = cliente[0][0].pais;
        this.ObjCliente.email1 = cliente[0][0].email1;
        this.ObjCliente.email2 = cliente[0][0].email2;
        this.ObjCliente.telefono1 = cliente[0][0].telefono1;
        this.ObjCliente.telefono2 = cliente[0][0].telefono2;
        this.ObjCliente.tipoDocumento = cliente[0][0].tipo_documento;
        this.ObjCliente.numeroDocumento = cliente[0][0].numero_documento;
        this.ObjCliente.paisExpedicion = cliente[0][0].pais_expedicion;
        this.ObjCliente.departamentoExpedicion = cliente[0][0].departamento_expedicion;
        this.ObjCliente.ciudadExpedicion = cliente[0][0].ciudad_expedicion;
        this.ObjCliente.fechaExpedicion = cliente[0][0].fecha_expedicion;
        this.id_cliente = cliente[0][0].id_cliente;
        this.ObjCliente.isPoliticaAceptada = cliente[0][0].is_politica_aceptada;

        if (this.ObjCliente.isPoliticaAceptada == 1) {
          this.policyAccepted = true;
        } else {
          this.policyAccepted = false;
        }

        this.iscliente = true;
        this.isboton = false;
      } else {
        this.ObjCliente.nombres = '';
        this.iscliente = false;
        showMessage("No se encontró el cliente.");
      }

    },
      async setSubmode(index) {
        this.campoObligatorio();
      if (index == 1) {
        let resp2 = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Registro', { cliente: this.cliente });
        this.visitas = resp2.data[0];
      }
      if (index == 2) {
        await this.getCotizaciones();
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
      if(this.ObjVisita.id_visita != null){
          showMessage("Esta visita no se puede actualizar.");
          return;
      }
      if (!this.validarCampos(this.ObjVisita, this.camposObligatorios)) return;
      if (this.ObjVisita.tipo_registro === '' || this.ObjVisita.modo_atencion === '') {
        showMessage("Debe seleccionar al menos un Tipo de Registro y un Modo de Atención.");
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
    async getCotizaciones() {
      let resp = await httpFunc('/generic/genericDS/ProcesoNegocio:Get_Cotizaciones', { id_cliente: this.id_cliente });
      this.cotizaciones = resp.data[0];
    },
    addCotizacion() {
      this.cotizaciones.push({ 
        cotizacion: '',
        fecha: '',
        descripcion: '',
        importe: '',
        id_cliente: this.id_cliente,
      });
    },
    async guardarCotizacion() {
      showProgress();
      try {
        for (let i = 0; i < this.cotizaciones.length; i++) {
          let resp = await httpFunc('/generic/genericST/ProcesoNegocio:Ins_Cotizacion', this.cotizaciones[i]);
          resp = resp.data;
          if (resp.includes("OK")) {
            hideProgress();
            showMessage("Cotización creada correctamente.");  
          } else {
            showMessage("Error al crear la cotización.");
            hideProgress();
            return;
          }
        }
      } catch (error) {
        hideProgress();
        showMessage("Error al crear la cotización.");
      }
    },
    async campoObligatorio() {
      let res = (await httpFunc("/generic/genericDT/Proyectos:Get_Proyecto", {
        id_proyecto: GlobalVariables.id_proyecto
      })).data;
    
      if (res.length) this.proyecto = res[0];
    
      let id_sala_venta = this.proyecto.id_sala_venta;
      let modulo = this.mode+1;
      let resp = (await httpFunc("/generic/genericDS/ProcesoNegocio:Get_Obligatorio", {
        id_sala_venta,
        modulo
      })).data;
        this.camposObligatorios = resp[0].map(r => r.campobd);
        this.nombreCampos = resp[0].map(r => r.campo)
    },
    validarCampos(obj, camposObligatorios) {
      for (let i = 0; i < camposObligatorios.length; i++) {
        let campo = camposObligatorios[i];
        if (obj[campo] === undefined || obj[campo] === null || obj[campo].toString().trim() === '') {
          let nombreCampo = this.nombreCampos && this.nombreCampos[i] ? this.nombreCampos[i] : campo;
          showMessage(`El campo obligatorio '${nombreCampo}' no ha sido diligenciado.`);
          return false;
        }
      }
      return true;
    },
  },
}