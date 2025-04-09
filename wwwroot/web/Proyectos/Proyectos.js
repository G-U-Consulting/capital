export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            submode: 0,
            proyectos: [],
            objProyecto:{
	            id_proyecto: "",
                id_sede: "",
                id_ubicacion_proyecto: "",
                nombre: "",
                id_estado_publicacion: "",
                id_tipo_proyecto: "",
                id_tipo_vis: "",
                subsidios_vis: "",
                id_tipo_financiacion: "",
                dias_separacion: "",
                dias_cierre_sala: "",
                meses_ci: "",
                dias_pago_ci_banco_amigo: "",
                dias_pago_ci_banco_no_amigo: "",
                email_cotizaciones: "",
                email_coordinador_sala: "",
                meta_ventas: "",
                opciones_visaules_proyecto: "",
                centro_costos: "",
                id_pie_legal: "",
                id_fiduciaria: "",
                link_waze: "",
                latitud: "",
                emails: "",
                otra_info: "",
                linea_whatsapp: "",
                direccion: "",
                lanzamiento: "",
                ciudad_lanzamiento: "",
                fecha_lanzamiento: "",
                bloqueo_libres: "",
                inmuebles_opcionados: "",
                tipos_excluidos: "",
                frame_seguimiento_visible: "",
                link_seguimiento_leads: "",
                link_general_onelink: "",
                frame_evaluacion_conocimiento: "",
                link_evaluacion_conocimiento: "",
                link_especifico_onelink: "",
                avance_obra_visible: "",
                link_avance_obra: "",
                incluir_brochure: "",
                link_brochure: "",
                incluir_especificaciones_tecnicias: "",
                link_especificaciones_tecnicias: "",
                incluir_cartilla_negocios_cotizacion: "",
                incluir_cartilla_negocios_opcion: "",
                link_cartilla_negocios: "",
                created_by: ""
            },
            estadosPublicacion: [],
            tiposVIS: [],
            tiposFinanciacion: [], 
            opcionesVisuales: []

        };
    }, 
    async mounted() {
        await this.setMainMode(1);
        this.mode = 1;
    },
    methods: {
        async setMainMode(mode) {
            if (mode == 1) {
                var resp = await httpFunc("/generic/genericDS/Proyectos:Get_Vairables", {});
                resp = resp.data;
                resp[0].forEach(item => item.checked = false);
                this.estadosPublicacion = resp[0];

                resp[1].forEach(item => item.checked = false);
                this.tiposVIS = resp[1];

                resp[2].forEach(item => item.checked = false);
                this.tiposFinanciacion = resp[2];

                resp[3].forEach(item => item.checked = false);
                this.opcionesVisuales = resp[3];
            }
            this.mainmode = mode;
            this.mode = 0;
        },
    }
};
