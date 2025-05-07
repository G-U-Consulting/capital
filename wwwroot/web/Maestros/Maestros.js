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
      banco: { id_banco: null, banco: null },
      fiduciaria: { id_fiduciaria: null, fiduciaria: null },
      ciudadela: { id_ciudadela: null, ciudadela: null },
      zonaProyecto: { id_zona_proyecto: null, zona_proyecto: null },
      instructivo: {},
      pie_legal: {
        id_pie_legal: null,
        pie_legal: null,
        texto: null,
        notas_extra: null,
      },
      tramite: {},
      evaluacion: {},
      subsidio: {},
      usuarioAPI: {},
      documento: {},
      factor: { id_factor: null, factor: null },
      banco_factor: {},

      medioIsActive: 0
    };
  },
  async mounted() {
    this.loadData();
    this.setMainMode(1);
  },
  methods: {
    setMainMode(mode) {
      this.mainmode = mode;
      this.mode = 0;
    },
    setMode(mode) {
      if (mode == 0) this.loadData();
      if ((mode == 1 || mode == 2) && this.mainmode != 14)
        this.clearItem(this.getItem()[0]);
      if ((mode == 1 || mode == 2) && (this.mainmode == 10 || this.mainmode == 11)) this.initTinyMce();
      this.mode = mode;
    },
    hasPermission(id) {
      return !!GlobalVariables.permisos.filter((p) => p.id_permiso == id)
        .length;
    },
    async onSelect(selected) {
      this.setMode(2);
      let item = this.getItem()[0];
      Object.keys(selected).forEach((key) => (item[key] = selected[key]));
      if (this.mainmode == 5) this.medioIsActive = item['is_active'] == 1;
    },
    onSelectFactor(selected) {
      console.log(selected);
      this.setMode(3);
      Object.keys(selected).forEach((key) => (this.factor[key] = selected[key]));
      const bfs = this.bancos_factores.filter(bf => bf.id_banco == this.banco.id_banco && bf.id_factor == this.factor.id_factor);
      this.banco_factor = {};
      bfs.forEach(bf => this.banco_factor[bf.id_tipo_factor] = bf);
    },
    async onCreate() {
      let [item, itemname] = this.getItem();
      if (this.mainmode == 5) item['is_active'] = this.medioIsActive ? 1 : null;
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
      if (this.mainmode == 5) item['is_active'] = this.medioIsActive ? 1 : null;
      showProgress();
      const resp = await httpFunc(
        `/generic/genericST/Maestros:Upd_${itemname}`,
        item
      );
      hideProgress();
      if (resp.data === "OK") this.setMode(0);
    },
    async onCreateBanco() {
      showProgress();
      const resp = await httpFunc(
        `/generic/genericST/Maestros:Ins_Banco`,
        this.banco,
        true
      ),
        bf = this.banco_factor;
      console.log(resp.id);
      for (const key in bf)
        if (typeof bf[key].valor === "number")
          await httpFunc(
            `/generic/genericST/Maestros:Upd_BancoFactor`,
            bf[key]
          );
      hideProgress();
    },
    async onUpdateFactor() {
      showProgress();
      const bf = this.banco_factor;
      let error = false;
      for (const key in bf) {
        console.log(bf[key]);
        let resp = await httpFunc(`/generic/genericST/Maestros:Upd_BancoFactor`, bf[key]);
        if (resp.data !== 'OK') error = true;
      }
      hideProgress();
      if (!error) this.mode = 2;
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
    clearItem(item) {
      Object.keys(item).forEach((key) => (item[key] = null));
      if (this.mainmode == 5) this.medioIsActive = 0;
    },
    async loadData() {
      var resp = (
        await httpFunc("/generic/genericDS/Maestros:Get_Maestros", {})
      ).data;
      console.log(resp);
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
      if (sub) for (const key in sub) this.subsidio[key] = sub[key];
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
    initTinyMce() {
      setTimeout(async () => {
        let conf = {
          language: 'es',
          setup: (editor) => {
            editor.on('change', () => {
              editor.save();
              editor.getElement().dispatchEvent(new Event('input'));
            });
          },
          plugins: [
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'link', 'lists', 'searchreplace', 'table', 'visualblocks', 'wordcount',
            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'mentions', 'tableofcontents', 'footnotes', 'autocorrect', 'typography', 'inlinecss', 'markdown'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link table | spellcheckdialog | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat code',
          height: 300,
          menubar: false
        }, selectors = this.mainmode == 10 ? ['#editor-pro', '#editor-cie', '#editor-not'] : ['#editor-tex', '#editor-not'];

        selectors.forEach(async s => {
          let con = { ...conf, selector: s };
          tinymce.remove(s);
          await tinymce.init(con);
        });
      }, 100);
    }
  },
};
