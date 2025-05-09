export default {
  data() {
    return {
      mainmode: 0,
      mode: 0,
      subImg: null,
      gruposImg: [],
      mediosPublicitarios: [],
      categoriasMedios: [],
      ciudadelas: [],
      bancos: [],
      fiduciarias: [],
      zonasProyectos: [],
      instructivos: [],
      pies_legales: [],
      tramites: [],
      usuariosAPI: [],
      documentos: [],
      factores: [],
      bancos_factores: [],
      tipos_factor: [],

      grupoImg: {},
      categoriaMedio: {},
      medioPublicitario: {},
      banco: {},
      fiduciaria: {},
      ciudadela: {},
      zonaProyecto: {},
      instructivo: {},
      pie_legal: {},
      tramite: {},
      evaluacion: {},
      subsidio: {},
      usuarioAPI: {},
      documento: {},
      factor: {},
      banco_factor: {},

      ruta: [],
      medioIsActive: 0,
      insEditor: 1,
      pieEditor: 1,
      quills: {},
    };
  },
  async mounted() {
    this.loadData();
    this.setMainMode(0);
  },
  methods: {
    setRuta() {
      let subpath = [this.getMainPath()];
      if (this.mode == 1) subpath.push({ text: 'Nuevo', action: () => { this.mode = 1; this.setRuta() } });
      if (this.mode == 2) subpath.push({ text: 'Edición', action: () => { this.mode = 2; this.setRuta() } });
      if (this.mode == 3 && this.mainmode == 6) subpath = [...subpath,
      { text: 'Edición', action: () => { this.mode = 2; this.setRuta() } },
      { text: 'Factores', action: () => { this.mode = 3; this.setRuta() } }];
      this.ruta = ['ZU', 'Maestros'];
      this.ruta[0] = {
        text: this.ruta[0], action: () => {
          GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual);
          this.setRuta();
        }
      }
      this.ruta[1] = { text: this.ruta[1], action: () => { this.mainmode = 0; this.mode = 0; this.setRuta() } }
      this.ruta = [...this.ruta, ...subpath];
    },
    setMainMode(mode) {
      this.mainmode = mode;
      this.mode = 0;
      this.setRuta();
    },
    setMode(mode) {
      if (mode == 0) this.loadData();
      if ((mode == 1 || mode == 2) && this.mainmode != 14)
        this.clearItem(this.getItem()[0]);
      if ((mode == 1 || mode == 2) && (this.mainmode == 10 || this.mainmode == 11))
        this.initQuill();
      this.mode = mode;
      this.setRuta();
    },
    hasPermission(id) {
      return !!GlobalVariables.permisos.filter((p) => p.id_permiso == id)
        .length;
    },
    async onSelect(selected) {
      this.setMode(2);
      let item = this.getItem()[0];
      Object.keys(selected).forEach((key) => (item[key] = selected[key]));
      if (this.mainmode == 5) this.medioIsActive = item["is_active"] == 1;
      if (this.mainmode == 10) this.insEditor = 1;
      if (this.mainmode == 11) this.pieEditor = 1;
    },
    onSelectFactor(selected) {
      this.setMode(3);
      Object.keys(selected).forEach(
        (key) => (this.factor[key] = selected[key])
      );
      const bfs = this.bancos_factores.filter(
        (bf) =>
          bf.id_banco == this.banco.id_banco &&
          bf.id_factor == this.factor.id_factor
      );
      this.banco_factor = {};
      bfs.forEach((bf) => (this.banco_factor[bf.id_tipo_factor] = bf));
    },
    async onCreate() {
      let [item, itemname] = this.getItem();
      if (this.mainmode == 5) item["is_active"] = this.medioIsActive ? 1 : null;
      try {
        showProgress();
        const resp = await httpFunc(
          `/generic/genericST/Maestros:Ins_${itemname}`,
          item
        );
        hideProgress();
        if (resp.data === "OK") this.setMode(0);
      } catch (e) {
        console.log(e);
      }
    },
    async onUpdate() {
      let [item, itemname] = this.getItem();
      if (this.mainmode == 5) item["is_active"] = this.medioIsActive ? 1 : null;
      try {
        showProgress();
        const resp = await httpFunc(
          `/generic/genericST/Maestros:Upd_${itemname}`,
          item
        );
        hideProgress();
        if (resp.data === "OK") this.setMode(0);
      } catch (e) {
        console.log(e);
      }
    },
    async onCreateBanco() {
      showProgress();
      try {
        showProgress();
        const resp = await httpFunc(
          `/generic/genericST/Maestros:Ins_Banco`,
          this.banco,
          true
        );
        if (resp.data === "OK" && resp.id) {
          this.banco.id_banco = resp.id;
          this.loadData();
          this.mode = 2;
          this.setRuta();
        }
        hideProgress();
      } catch (e) {
        console.log(e);
      }
      hideProgress();
    },
    async onUpdateFactor() {
      showProgress();
      const bf = this.banco_factor;
      let error = false;
      for (const key in bf) {
        let resp = await httpFunc(
          `/generic/genericST/Maestros:Upd_BancoFactor`,
          bf[key]
        );
        if (resp.data !== "OK") error = true;
      }
      hideProgress();
      if (!error) {
        this.mode = 2;
        this.setRuta();
      }
    },
    async onUpdateSubsidio() {
      let name = null;
      let resp = {};
      if (this.subImg) {
        let file = this.subImg;
        const extension = file.name.split(".").pop();
        name = `subsidio_${this.subsidio.id_subsidio}.${extension}`;
        const newFile = new File([file], name, { type: file.type });
        const formData = new FormData();
        formData.append("file", newFile);
        showProgress();
        resp = await httpFunc("/api/uploadfile/subsidio", formData);
      }
      let sub = { ...this.subsidio };
      if (resp.data === "OK" && name) sub.imagen = `/img/subsidio/${name}`;
      Object.keys(sub).forEach(key => sub[key] = key.startsWith('smmlv') ? sub[key].toString().replace(',', '.') : sub[key]);
      resp = await httpFunc(`/generic/genericST/Maestros:Upd_Subsidio`, sub);
      hideProgress();
      if (resp.data === "OK") this.setMode(1);
    },
    getItem() {
      if (this.mainmode == 3) return [this.grupoImg, "GrupoImg"];
      if (this.mainmode == 4) return [this.categoriaMedio, "Categoria"];
      if (this.mainmode == 5) return [this.medioPublicitario, "Medio"];
      if (this.mainmode == 6) return [this.banco, "Banco"];
      if (this.mainmode == 7) return [this.fiduciaria, "Fiduciaria"];
      if (this.mainmode == 8) return [this.zonaProyecto, "ZonaProyecto"];
      if (this.mainmode == 9) return [this.ciudadela, "Ciudadela"];
      if (this.mainmode == 10) return [this.instructivo, "Instructivo"];
      if (this.mainmode == 11) return [this.pie_legal, "PieLegal"];
      if (this.mainmode == 12) return [this.tramite, "Tramite"];
      if (this.mainmode == 13) return [this.evaluacion, "Evaluacion"];
      if (this.mainmode == 14) return [this.subsidio, "Subsidio"];
      if (this.mainmode == 15) return [this.usuarioAPI, "UsuarioAPI"];
      if (this.mainmode == 16) return [this.documento, "Documento"];
      return null;
    },
    getMainPath() {
      let path = {};
      if (this.mainmode == 1) path.text = "Imágenes Generales Capital";
      if (this.mainmode == 2) path.text = "Imágenes Sostenibilidad";
      if (this.mainmode == 3) path.text = "Agrupamiento de imágenes";
      if (this.mainmode == 4) path.text = "Categorías medios";
      if (this.mainmode == 5) path.text = "Medios publicitarios";
      if (this.mainmode == 6) path.text = "Bancos";
      if (this.mainmode == 7) path.text = "Fiduciarias";
      if (this.mainmode == 8) path.text = "Zonas agrupamiento proyectos";
      if (this.mainmode == 9) path.text = "Ciudadelas";
      if (this.mainmode == 10) path.text = "Instructivos consignación y cierre";
      if (this.mainmode == 11) path.text = "Pies legales cotizaciones";
      if (this.mainmode == 12) path.text = "Trámites";
      if (this.mainmode == 14) path.text = "Subsidios VIS";
      if (this.mainmode == 15) path.text = "Usuarios API";
      if (this.mainmode == 16) path.text = "Tipología Documentos";
      path.action = () => { this.mode = 0; this.setRuta(); this.loadData() };
      return path;
    },
    clearItem(item) {
      Object.keys(item).forEach((key) => (item[key] = null));
      if (this.mainmode == 5) this.medioIsActive = 0;
    },
    async loadData() {
      var resp = (
        await httpFunc("/generic/genericDS/Maestros:Get_Maestros", {})
      ).data;
      let subsidio = {};
      [
        this.gruposImg,
        this.instructivos,
        this.tramites,
        subsidio,
        this.categoriasMedios,
        this.mediosPublicitarios,
        this.documentos,
        this.zonasProyectos,
        this.ciudadelas,
        this.pies_legales,
        this.fiduciarias,
        this.bancos,
        this.factores,
        this.tipos_factor,
        this.bancos_factores,
      ] = resp;
      let sub = subsidio[0];
      if (sub) for (const key in sub) this.subsidio[key] =
        key.startsWith('smmlv')
          ? parseFloat(sub[key].toString().replace(',', '.'))
          : sub[key];
    },
    fileUpload(e) {
      let file = e.target.files[0];
      if (file && !file.type.startsWith("image/")) {
        e.target.value = "";
      } else if (file) {
        this.subImg = file;
        this.subsidio.imagen = URL.createObjectURL(file);
      }
    },
    initQuill() {
      this.insEditor = 1;
      this.pieEditor = 1;
      setTimeout(() => {
        this.quills =
          this.mainmode == 10
            ? {
              "#editor-pro": {
                data: this.instructivo,
                field: "procedimiento",
              },
              "#editor-cie": {
                data: this.instructivo,
                field: "documentacion_cierre",
              },
              "#editor-not": {
                data: this.instructivo,
                field: "notas",
              },
            }
            : {
              "#editor-tex": {
                data: this.pie_legal,
                field: "texto",
              },
              "#editor-not": {
                data: this.pie_legal,
                field: "notas_extra",
              },
            };
        const toolbarOptions = [
          ["bold", "italic", "underline", "strike"], // toggled buttons
          ["blockquote", "code-block"],
          ["link", "image", "video"],
          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
          [{ direction: "rtl" }], // text direction
          [{ size: ["small", false, "large", "huge"] }], // custom dropdown
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
          [{ font: [] }],
          [{ align: [] }],
          ["clean"], // remove formatting button
        ];
        for (const key in this.quills) {
          let quill = new Quill(key, {
            modules: {
              toolbar: toolbarOptions,
            },
            theme: "snow",
          }),
            item = this.quills[key];
          quill.clipboard.dangerouslyPasteHTML(item.data[item.field]);
          item.quill = quill;
          quill.on("text-change", (delta, oldDelta, source) => {
            item.data[item.field] = quill.getSemanticHTML(0, quill.getLength());
          });
        }
      }, 100);
    }
  },
};
