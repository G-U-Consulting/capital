export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            submode: 0,
            proyectos: [],
            objProyecto:{
                zona: "",
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
                created_by: "",
                email_receptor_1: "",
                email_receptor_2: "",
                email_receptor_3: "",
                email_receptor_4: ""
            },
            camposPorSubmode: {
                0: ["nombre","direccion"],
                1: ["subsidios_vis"],
                2: ["dias_separacion", "dias_cierre_sala", "meses_ci", "meta_ventas"],
                3: ["centro_costos"],
                4: ["ciudad_lanzamiento", "fecha_lanzamiento", "latitud", "link_waze", "linea_whatsapp", "inmuebles_opcionados", "tipos_excluidos"],
                5: ["link_general_onelink", "link_especifico_onelink", "link_seguimiento_leads", "link_evaluacion_conocimiento", "link_avance_obra", "link_brochure", "link_especificaciones_tecnicias", "link_cartilla_negocios"],

            },
            validacionEspecial: {
                0: [{ tipo: 'checkbox_group', campo: 'estadosPublicacion', requerimiento: { tipo: 'minimo', valor: 2 } }],
                1: [
                    { tipo: 'checkbox_group', campo: 'tiposVIS', requerimiento: { tipo: 'minimo', valor: 1 } },
                    { tipo: 'checkbox_group', campo: 'tiposFinanciacion', requerimiento: { tipo: 'minimo', valor: 3 } }
                ],
                2: [
                    { tipo: 'email', campo: 'email_cotizaciones' }
                ],
                3: [{ tipo: 'checkbox_group', campo: 'opcionesVisuales', requerimiento: { tipo: 'minimo', valor: 1 } }],
                4: [
                    { tipo: 'email', campo: 'email_receptor_1' },
                    { tipo: 'email', campo: 'email_receptor_2' },
                    { tipo: 'email', campo: 'email_receptor_3' },
                    { tipo: 'email', campo: 'email_receptor_4' }
                ],
            },
            isFormularioCompleto: false, 
            estadosPublicacion: [],
            tiposVIS: [],
            tiposFinanciacion: [], 
            opcionesVisuales: [],
            tabsIncomplete: [],
            tabs: [
                "Datos generales",
                "VIS y financiación",
                "Pagos y Cotizaciones",
                "C. de costos y fiduciaria",
                "Información adicional",
                "Enlaces",
            ]
        };
    },
    computed: {
        progressWidth() {
          return (this.submode / (this.tabs.length - 1)) * 100 + '%';
        }
    },
    async mounted() {
        //await this.setMainMode(1);
        //this.mode = 1;
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
        setSubmode(index) {
            const anteriorIndex = this.submode;
            const validarSubmode = (submodeIndex) => {
                const camposAValidar = this.camposPorSubmode[submodeIndex] || [];
                let submodeIncompleto = camposAValidar.some(campo => {
                    const valor = this.objProyecto[campo];
                    return !valor || valor.toString().trim() === '';
                });

                const validacionesEspecialesSubmode = this.validacionEspecial[submodeIndex] || [];
                validacionesEspecialesSubmode.forEach(validacion => {
                    if (validacion.tipo === 'checkbox_group') {
                        const checkboxes = this[validacion.campo];
                        if (checkboxes) {
                            const seleccionados = checkboxes.filter(item => item.checked).length;
                            if (validacion.requerimiento && validacion.requerimiento.tipo === 'minimo' && seleccionados < validacion.requerimiento.valor) {
                                submodeIncompleto = true;
                            }
                        }
                    } else if (validacion.tipo === 'email') {
                        const emailValue = this.objProyecto[validacion.campo];
                        if (!emailValue || !this.validarEmail(emailValue)) {
                            submodeIncompleto = true;
                        }
                    }
                   
                });
                if (submodeIncompleto) {
                    if (!this.tabsIncomplete.includes(submodeIndex)) {
                        this.tabsIncomplete.push(submodeIndex);
                    }
                } else {
                    const pos = this.tabsIncomplete.indexOf(submodeIndex);
                    if (pos !== -1) {
                        this.tabsIncomplete.splice(pos, 1);
                    }
                }
            };
            if (anteriorIndex !== null) {
                validarSubmode(anteriorIndex);
            }
            if (index > anteriorIndex && anteriorIndex !== null) {
                for (let i = anteriorIndex + 1; i < index; i++) {
                    validarSubmode(i);
                }
            }
            validarSubmode(index);
            this.submode = index;
            this.isFormularioCompleto = this.tabsIncomplete.length === 0;
        },
        validarEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },
    }
};
