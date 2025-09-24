export default {
	data() {
		return {
			mode: 0,
			ruta: [],
			tabsIncomplete: [],
			tabmode: 0,
			torres: [],
			u_torres: [],
			aptos: [],
			estados: [],
			tipos: [],
			agrupaciones: [],
			groupedAptos: [],
			ids_unidades: [],
			preview: [],
			clases: [],
			loading: true,
			stats: {
				torres: 0,
				pisos: 0,
				unidades: 0
			},
			viewProperties: {
				megarows: 3,
				rows: 3,
				cols: 3,
				viewType: "classic"
			},
			selection: {
				type: "",
				value: null
			},
			torre: {},
			apto: {},
			grupo: {},

			filtros: {
				aptos: {
					apartamento: '',
					id_estado_unidad: '',
					codigo_planta: '',
					localizacion: '',
					torres: [],
					piso: '',
					id_clase: '',
				},
				agrupaciones: {},
				groupedAptos: {
					apartamento: '',
					id_estado_unidad: '',
					codigo_planta: '',
					localizacion: '',
					piso: '',
					id_clase: '',
				}
			},
			editNewRow: false,
			selRow: null,
			editRow: false,
			selectedApto: null,
			columnasAptos: 8,
			torresFull: [],
			activeTab: 'detalle',
			showModal: false,
			modalImage: null,
			zoom: "torres",
    		showFloating: false,	
		};
	},
	three: null,
	async mounted() {
		//this.computeViews();
		await this.cargarLogoProyecto();
		await this.loadUnidades();
		// this.filtros.aptos.torres = this.torres.map(t => t.idtorre);
	},
	methods: {
		async handleMessages(event) {
            if (event.data?.type === 'REFRESH_UNIDADES') {
                await this.loadUnidades();
            }
        },
		selectApto(apto) {
			this.selectedApto = apto;
			this.showFloating = true;
		},
		closeFloating() {
			this.showFloating = false;
			this.selectedApto = null;
		},
		setRuta() {
			GlobalVariables.miniModuleCallback('SetRuta', this.ruta);
		},
		setTabmode(index) {
			if (this.mode > 0 && index === 0) this.computeViews();
			this.onClearFilters('aptos');
			if (index === 1) {
				this.loadAgrupacion();
				if (this.selRow !== null)
					this.filtros.aptos.id_agrupacion = this.getFilteredList('agrupaciones')[this.selRow].id_agrupacion + '';
				else this.filtros.aptos.id_agrupacion = 'null';
			}
		},
		async loadUnidades() {
			showProgress();
			this.asesor = GlobalVariables.username;
			let [torres, aptos, estados, fiduciarias, instructivos,clases] = (await
				httpFunc('/generic/genericDS/ProcesoNegocio:Get_Unidades', { id_proyecto: GlobalVariables.id_proyecto })).data;

			var resp = await httpFunc("/generic/genericDS/Proyectos:Get_Proyecto", { "id_proyecto": GlobalVariables.id_proyecto });	
			this.edge_estado = resp.data[0][0].edge_estado;
			this.estados = estados;
			this.NwTorre = torres;
			this.clases = clases;
			const claseApartamento = clases.find(c => c.clase === 'Apartamentos');

			if (claseApartamento) {
				this.filtros.aptos.id_clase = claseApartamento.id_clase;
				this.filtros.groupedAptos.id_clase = claseApartamento.id_clase;
			}

			let pisos = new Set(), tipos = new Set();
			if (torres.length && aptos.length) {
				let number_fileds = ['valor_separacion', 'valor_reformas', 'valor_descuento', 'valor_acabados', 'area_total', 'area_privada_cub', 'area_privada_lib', 'acue', 'area_total_mas_acue'];
				aptos.forEach(a => number_fileds.forEach(key => a[key] = a[key].replace(',', '.')));
				torres = torres.map(t => ({ idtorre: t.consecutivo, pisos: [], id_torre: t.id_torre, en_venta: t.en_venta }));
				aptos.forEach(a => {
					a.piso && pisos.add(a.piso);
					a.codigo_planta && tipos.add(a.codigo_planta);
					let torre = torres.find(t => t.id_torre === a.id_torre);
					if (torre) {
						let i = torre.pisos.findIndex(p => p.idpiso == a.piso && p.idtorre == torre.idtorre);
						a.idtorre = torre.idtorre;
						if (i == -1) torre.pisos.push({ idtorre: torre.idtorre, idpiso: (a.piso + ''), unidades: [a] });
						else torre.pisos[i].unidades.push(a);
					}
				});
				torres.sort((a, b) => parseInt(a.idtorre) - parseInt(b.idtorre));
				torres.forEach(item => item.pisos.sort((a, b) => parseInt(a.idpiso) - parseInt(b.idpiso)));
				aptos.sort((a, b) => a.idtorre == b.idtorre
					? parseInt(a.apartamento) - parseInt(b.apartamento)
					: parseInt(a.idtorre) - parseInt(b.idtorre))
				this.torres = torres;
				this.aptos = aptos;
				this.pisos = [...pisos].sort((a, b) => parseInt(b) - parseInt(a));
				this.tipos = [...tipos].sort();

				this.computeViews();

				if (!this._preselectDone) {
					const tVenta = this.torres.find(t => t.en_venta === '1' || t.en_venta === 1 || t.en_venta === true);
					this.$nextTick(() => {
						this.filtros.aptos.torres = tVenta ? [tVenta.idtorre] : [];
					});
					this._preselectDone = true;
				}
			};
			this.loading = false;
			hideProgress();
		},
		async loadAgrupacion() {
			showProgress();
			this.agrupaciones = (await
				httpFunc('/generic/genericDT/Unidades:Get_Agrupacion', { id_proyecto: GlobalVariables.id_proyecto })).data;
			hideProgress();
		},
		openFileDialog: function () {
			document.getElementById("fileUpload").value = null;
			document.getElementById("fileUpload").click();
		},
		handleChangeFile: function (e, update) {
			var self = this;
			showProgress();
			const file = e.target.files[0];
			Papa.parse(file, {
				complete: function (results) {
					//TODO Check for errores
					self.u_torres = self.previewFile(results.data, update) || [];
					hideProgress();
				}
			});
		},
		previewFile: function (data, update) {
			try {
				var headerMap = {};
				data[0].forEach((item, index) => headerMap[item] = index);
				this.preview = [];
				let t_torres = [];
				this.stats.torres = 0;
				this.stats.pisos = 0;
				this.stats.unidades = 0;
				var tmp, torre, piso, idtorre, idpiso;
				for (var i = 1; i < data.length; i++) {
					tmp = {};
					for (var key in headerMap)
						tmp[key] = data[i][headerMap[key]];
					idtorre = tmp["torre"];
					idpiso = tmp["piso"];
					if (idtorre == null || idpiso == null) continue;
					torre = t_torres.find(item => item.idtorre == idtorre);
					if (torre == null) {
						torre = { idtorre: idtorre, pisos: [] };
						t_torres.push(torre);
						this.stats.torres++;
					}
					piso = torre.pisos.find(item => item.idpiso == idpiso)
					if (piso == null) {
						piso = { idtorre: idtorre, idpiso: idpiso, unidades: [] };
						torre.pisos.push(piso);
						this.stats.pisos++;
					}
					piso.unidades.push(tmp);
					this.stats.unidades++;
					if (i > 100) continue;
					this.preview.push(tmp);
				}
				t_torres.sort((a, b) => a.idtorre - b.idtorre);
				t_torres.forEach(item => item.pisos.sort((a, b) => a.idpiso - b.idpiso));
				this.mode = 1;
				if (update) return t_torres;
				else this.torres = t_torres;
			} catch (error) {
				console.error(error);
			}
		},
		async confirmUpload() {
			showProgress();
			let data = this.u_torres.length ? this.u_torres : this.torres;
			let res = null;
			try {
				res = await (httpFunc(`/generic/genericST/Unidades:${this.u_torres.length ? 'Upd_Unidades' : 'ins_unidades'}`, {
					id_proyecto: GlobalVariables.id_proyecto,
					unidades: JSON.stringify(data),
					Usuario: GlobalVariables.username
				}));
				if (res.isError || res.data !== 'OK') throw res;
				await this.loadUnidades();
				this.computeViews();
				this.u_torres = [];
			} catch (e) {
				console.error(e);
				showMessage('Error: ' + e.errorMessage || e.data);
			}
			hideProgress();
		},
		computeViews: function () {
			this.tabmode = 0;
			this.mode = 3;
			this.viewProperties === '3d' && setTimeout(this.threeInit, 10);
			this.ruta = [{ text: `${GlobalVariables.proyecto.nombre} / Unidades`, action: () => this.computeViews() }];
			this.setRuta();
		},
		threeInit: async function () {
			var three = { units: [] };
			var THREE = await import("three");
			this.$options.three = three;
			var TrackballControls = await import("three/addons/TrackballControls.js")
			let container;
			let camera, controls, scene, renderer;
			three.init = function () {

				container = document.getElementById('container');
				var width = container.offsetWidth;
				console.log(width);
				var height = container.offsetHeight;
				console.log(height);
				camera = new THREE.PerspectiveCamera(45, width / height, 1, 10000);
				camera.position.z = 1000;

				scene = new THREE.Scene();
				scene.background = new THREE.Color(0xffffff);

				scene.add(new THREE.AmbientLight(0xcccccc));

				const light = new THREE.DirectionalLight(0xffffff, 3);
				light.position.set(0, 500, 2000);
				scene.add(light);

				renderer = new THREE.WebGLRenderer({ antialias: true });
				renderer.setPixelRatio(window.devicePixelRatio);
				renderer.setSize(width, height);
				renderer.setAnimationLoop(three.animate);
				container.appendChild(renderer.domElement);

				controls = new TrackballControls.TrackballControls(camera, renderer.domElement);
				controls.rotateSpeed = 5.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 1;
				controls.noZoom = false;
				controls.noPan = false;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3;
			}
			three.animate = function () {
				three.render();
			}
			three.render = function () {
				controls.update();
				renderer.render(scene, camera);

			}
			three.addCube = function (data, viewProperties) {
				for (i = 0; i < three.units.length; i++) {
					scene.remove(three.units[i].cube);
				}
				three.units = [];
				var boxsize = 100;
				var boxpadding = 20;
				var towerpadding = 200;
				var towersizeLength = viewProperties.rows * (boxsize + boxpadding);
				var towersizeWidth = viewProperties.cols * (boxsize + boxpadding)
				var actualx = 0, actualy = 0, actualz = 0, actualmegarow = 0, actualunit = 0;
				const color = new THREE.Color();
				color.setHex(0x00839C);
				for (var i = 0; i < data.length; i++) {
					actualz = 0;
					//color.setHex( Math.random() * 0xffffff );
					if (i > 0 && i % viewProperties.megarows == 0) actualmegarow++;
					for (var z = 0; z < data[i]["pisos"].length; z++) {
						actualunit = 0;
						actualx = (i - actualmegarow * viewProperties.megarows) * (towersizeLength + towerpadding);
						for (var x = 0; x < viewProperties.rows; x++) {
							actualy = actualmegarow * (towersizeWidth + towerpadding);
							for (var y = 0; y < viewProperties.cols; y++) {
								if (actualunit < data[i]["pisos"][z]["unidades"].length) {
									const geometry = new THREE.BoxGeometry(boxsize, boxsize, boxsize);
									geometry.translate(actualx, actualy, actualz);
									const material = new THREE.MeshPhongMaterial({ color: color, transparent: true });
									const cube = new THREE.Mesh(geometry, material);
									scene.add(cube);
									three.units.push({ cube: cube, data: data[i]["pisos"][z]["unidades"][actualunit] });
									actualunit++;
								}
								actualy += boxsize + boxpadding;
							}
							actualx += boxsize + boxpadding;
						}
						actualz += boxsize + boxpadding;
					}
				}
				var renderLength = (viewProperties.megarows + 1) * towersizeLength;
				var renderWidth = (data.length / viewProperties.megarows + 2) * towersizeWidth;
				camera.position.set(renderLength / 2, -renderWidth, actualz * (data.length / viewProperties.megarows));
				camera.up = new THREE.Vector3(0, 0, 1);
				//controls.target = new THREE.Vector3(renderLength/2, 0, 0);
				controls.target = new THREE.Vector3(renderLength / 2, renderWidth / 2, 0);

				const geometry = new THREE.PlaneGeometry(renderLength * 1.2, renderWidth * 1.2);
				const material = new THREE.MeshBasicMaterial({ color: 0xbfbfbf, side: THREE.DoubleSide });
				const plane = new THREE.Mesh(geometry, material);
				geometry.translate(renderLength / 2, renderWidth / 2, - boxsize / 2 - 20);
				three.units.push({ cube: plane, data: null });
				scene.add(plane);
			};
			three.selectItem = function (selection) {
				var material;
				for (var i = 0; i < three.units.length; i++) {
					if (three.units[i].data == null) continue;
					material = three.units[i].cube.material;
					if (selection == null || selection.value == null) {
						material.opacity = 1;
						continue;
					}
					material.opacity = 1;
					if (selection.type == "unidad" && selection.value == three.units[i].data) continue;
					if (selection.type == "piso" && selection.value["idpiso"] == three.units[i].data["piso"] && selection.value["idtorre"] == three.units[i].data["torre"]) continue;
					if (selection.type == "torre" && selection.value["idtorre"] == three.units[i].data["torre"]) continue;
					material.opacity = 0.1;
				}
			};
			three.init();
		},
		addCube: function () {
			this.$options.three.addCube(this.torres, this.viewProperties);
		},
		selectItem: function (type, item) {
			if (this.selection.value == item) {
				this.selection.type = "";
				this.selection.value = null;
			} else {
				this.selection.type = type;
				this.selection.value = item;
			}
			this.$options.three.selectItem(this.selection);
		},
		toggleTorre(torre) {
			let i = this.filtros.aptos.torres.indexOf(torre.idtorre);
			i === -1 ? this.filtros.aptos.torres.push(torre.idtorre) : this.filtros.aptos.torres.splice(i, 1);
		},
		toggleApto(apto) {
			let i = this.ids_unidades.indexOf(apto.id_unidad);
			i === -1 ? this.ids_unidades.push(apto.id_unidad) : this.ids_unidades.splice(i, 1);
		},
		onClearFilters(table) {
			if (table === 'aptos')
				this.filtros.aptos = {
					apartamento: '',
					id_estado_unidad: '',
					codigo_planta: '',
					localizacion: '',
					torres: [],
					piso: '',
					id_agrupacion: ''
				}
			if (table === 'groupedAptos')
				this.filtros.groupedAptos = {
					apartamento: '',
					id_estado_unidad: '',
					codigo_planta: '',
					localizacion: '',
					piso: '',
				}
			if (table === 'agrupaciones') {
				this.filtros.agrupaciones = {};
				this.onCancelGroup();
			}
		},
		onSelectApto(apto) {
			this.apto = apto;
			this.mode = 5;
			this.ruta = [this.ruta[0], { text: `Torre ${apto.idtorre} - ${apto.apartamento}`, action: () => this.onSelectApto(apto) }];
			this.setRuta();
		},
		async addUnidad(apto) {
			let payload = {
				id_cliente: GlobalVariables.id_cliente,
				id_proyecto: GlobalVariables.id_proyecto,
				usuario: GlobalVariables.username,
				unidad: apto.numero_apartamento,
				cotizacion: GlobalVariables.id_cotizacion,
				inv_terminado: apto.inv_terminado,
				tipo: apto.tipo,
				torre: apto.idtorre,
				observacion_apto: apto.observacion_apto,
				valor_descuento: apto.valor_descuento,
				valor_unidad: apto.valor_unidad,
				lista: apto.lista,
				numero_apartamento: apto.nombre_unidad,
				id_unidad: apto.id_unidad,
			};

			let res = await httpFunc('/generic/genericST/ProcesoNegocio:Ins_Unidades', payload);

			if (res.data.includes("OK")) {
				this.mode = 3;
				this._preselectDone = false;
				await this.loadUnidades();
				this.selectedApto = null;

				if (window.opener) {
					window.opener.postMessage({
						type: 'REFRESH_COTIZACION',
						cotizacionId: GlobalVariables.id_cotizacion
					}, '*');
				}
			} else {
				showMessage("Ocurrió un error al registrar la unidad");
			}
		},
		async onSave() {
			showProgress();
			let res = null;
			try {
				res = await (httpFunc('/generic/genericST/Unidades:Upd_Unidad', {
					...this.apto,
					Usuario: GlobalVariables.username
				}));
				if (res.isError || res.data !== 'OK') throw res;
				await this.loadUnidades();
				this.computeViews();
			} catch (e) {
				console.error(e);
				showMessage('Error: ' + e.errorMessage || e.data);
			}
			hideProgress();
		},
		formatNumber(value, dec = true) {
			if (!value) return "";
			let [parteEntera, parteDecimal] = value.split(".");
			parteEntera = parteEntera.replace(/\D/g, "");
			parteDecimal = parteDecimal && dec ? parteDecimal.replace(/\D/g, "") : "";

			let groups = [];
			let len = parteEntera.length;
			for (let i = len; i > 0; i -= 3)
				groups.unshift(parteEntera.substring(Math.max(0, i - 3), i));

			let formattedEntera = groups[0] || "";
			for (let i = 1; i < groups.length; i++)
				formattedEntera += '.' + groups[i];

			let result = formattedEntera;
			if (parteDecimal)
				result += "," + parteDecimal;

			return result;
		},
		cleanNumber(value) {
			let cleaned = value.replace(/['.]/g, "");
			cleaned = cleaned.replace(",", ".");
			return cleaned;
		},
		validarFormato(e) {
			e.target.value = e.target.value.replaceAll(/[^0-9\.,]/g, '');
			if (e.target.value == '') e.target.value = '0';
			e.target.value = e.target.value.replace(/^0+(\d)/, '$1');
		},
		async onSaveGroup() {
			const i = this.selRow;
			if (this.grupo.nombre) {
				showProgress();
				let res = null;
				try {
					res = await (httpFunc(`/generic/genericST/Unidades:${this.grupo.id_agrupacion ? 'Upd' : 'Ins'}_Agrupacion`, {
						nombre: this.grupo.nombre,
						id_proyecto: GlobalVariables.id_proyecto,
						id_agrupacion: this.grupo.id_agrupacion
					}));
					if (res.isError || res.data !== 'OK') throw res;
					await this.loadAgrupacion();
				} catch (e) {
					console.error(e);
					showMessage('Error: ' + e.errorMessage || e.data);
				}
				hideProgress();
			}
			this.onCancelGroup();
			this.selRow = i;
		},
		async onSelectGroup(i) {
			if (this.editNewRow)
				await this.onSaveGroup();
			if (this.editRow && this.selRow !== null && this.selRow !== i) {
				this.grupo.id_agrupacion = this.getFilteredList('agrupaciones')[this.selRow].id_agrupacion;
				await this.onSaveGroup();
			}
			let id = this.getFilteredList('agrupaciones')[i].id_agrupacion + '';
			this.filtros.aptos.id_agrupacion = id;
			this.selRow = i;
			this.groupedAptos = this.aptos.filter(a => !a.id_agrupacion || a.id_agrupacion === id);
		},
		async onEditGroup(grupo, i) {
			this.onSelectGroup(i);
			this.grupo = { ...grupo };
			this.editRow = true;
		},
		onCancelGroup() {
			this.selRow = null;
			this.grupo = {};
			this.editRow = false;
			this.editNewRow = false;
		},
		requestDelete(item) {
			console.log(item);
		},
		openModal() {
			if (this.selRow !== null) {
				let $modal = document.getElementById('modalOverlay');
				$modal && ($modal.style.display = 'flex');
				let ids_unidades = [];
				this.groupedAptos.filter(a => a.id_agrupacion).forEach(a => ids_unidades.push(a.id_unidad));
				this.ids_unidades = [...ids_unidades];
			}
		},
		closeModal() {
			let $modal = document.getElementById('modalOverlay');
			$modal && ($modal.style.display = 'none');
			this.ids_unidades = [];
		},
		async cargarLogoProyecto() {
			const idProyecto = GlobalVariables.id_proyecto;

			const res = await httpFunc('/generic/genericDT/Maestros:Get_Archivos', {
				tipo: 'logo',
				id_proyecto: idProyecto
			});

			if (res.data && res.data.length) {
				const urlLogo = '/file/S3get/' + res.data[0].llave;
				this.logoProyecto = urlLogo;
			}
		},
		formatoMoneda(valor) {
			if (valor == null || valor === '') return '';
			let limpio = String(valor)
				.replace(/[^\d,.-]/g, '')
				.replace(',', '.');
			const numero = parseFloat(limpio);
			if (isNaN(numero)) return '';
			return new Intl.NumberFormat('es-CO', {
				style: 'currency',
				currency: 'COP',
				minimumFractionDigits: 0
			}).format(numero);
		},
		chunkArray(arr = [], size = 3) {
			const res = [];
			for (let i = 0; i < arr.length; i += size) {
				res.push(arr.slice(i, i + size));
			}
			return res;
		},
		rowsForTorre(id_torre, aptos = []) {
			const torre = this.NwTorre.find(t => t.idtorre == id_torre) || {};
			const columnas = Math.max(1, parseInt(torre?.aptos_fila) || 3);
			return this.chunkArray(aptos, columnas);
		},
		aptosRowStyle(id_torre, row = [], rowIndex = 0, totalRows = 0) {
			const torre = this.NwTorre.find(t => t.idtorre == id_torre) || {};
			const columnas = Math.max(1, parseInt(torre?.aptos_fila) || 3);
			const ancho = 100;

			const base = {
				display: 'flex',
				gap: '0.2rem',
				width: `${ancho}%`,
			};
			return base;
		},
		async selectApto(apto) {
			try {
				const { id_proyecto } = GlobalVariables;
				const { id_unidad } = apto;
			
				const consultas = [
					{
						prop: "tipoProyecto",
						url: "/generic/genericDT/ProcesoNegocio:Get_Tipos",
						params: { tipo: "imagenes", id_proyecto, id_unidad },
						formatter: (data) => `/file/S3get/${data[0].llave}`
					},
					{
						prop: "plantProyecto",
						url: "/generic/genericDT/Maestros:Get_Archivos",
						params: { tipo: "planta", id_proyecto },
						formatter: (data) => `/file/S3get/${data[0].llave}`
					},
					{
						prop: "recorrido",
						url: "/generic/genericDT/ProcesoNegocio:Get_Tipos",
						params: { tipo: "recorridos virt", id_proyecto, id_unidad },
						formatter: (data) => data[0].link
					}
				];

				const results = await Promise.all(
					consultas.map((q) => httpFunc(q.url, q.params))
				);

				results.forEach((res, i) => {
					if (res.data?.length) {
						this[consultas[i].prop] = consultas[i].formatter(res.data);
					}
				});

				this.selectedApto = apto;
			} catch (error) {
				showMessage("No se pudieron cargar los datos del apartamento.");
			}
		},
		openModal(img) {
			this.modalImage = img
			this.showModal = true
		},
		closeModal() {
			this.showModal = false
			this.modalImage = null
		},
		setTorre(torre) {
			this.torre = torre;
		},
		async addListaEspera(apto){

			let payload = {
				id_lista: apto.id_lista,
				id_cliente: GlobalVariables.id_cliente,
				usuario: GlobalVariables.username,
				id_proyecto: GlobalVariables.id_proyecto,
				id_unidad: apto.id_unidad,
				id_torre: apto.id_torre,
				piso: apto.piso,
				id_tipo: apto.id_tipo,
				id_clase: apto.id_tipo_proyecto,
				localizacion: apto.localizacion,
				num_alcobas: apto.num_alcobas,
				num_banos: apto.num_banos,
				asoleacion: apto.asoleacion,
				altura: apto.altura,
				cerca_porteria: apto.cerca_porteria,
				cerca_juegos_infantiles: apto.cerca_juegos_infantiles,
				cerca_piscina: apto.cerca_piscina,
				tiene_balcon: apto.tiene_balcon,
				tiene_parq_sencillo: apto.tiene_parq_sencillo,
				tiene_parq_doble: apto.tiene_parq_doble,
				tiene_deposito: apto.tiene_deposito,
				tiene_acabados: apto.tiene_acabados,
			};

			let res = await httpFunc('/generic/genericST/ProcesoNegocio:Ins_ListaEspera', payload);


			if ((res.errorMessage && res.errorMessage.includes("Duplicate")) ||
				(res.error && res.error.message && res.error.message.includes("Duplicate")) ||
				(res.message && res.message.includes("Duplicate"))) {

				showMessage("El cliente ya existe en la lista de espera.");
				return;
			}

			if (res.data.includes("OK")) {
				showMessage("El registro en la lista de espera fue completado con éxito.");
				this.mode = 3;
				this._preselectDone = false;
				await this.loadUnidades();

				if (window.opener) {
					window.opener.postMessage({
						type: 'REFRESH_COTIZACION',
						cotizacionId: GlobalVariables.id_cotizacion
					}, '*');
				}
			} else {
				showMessage("Ocurrió un error al registrar la unidad");
			}
		},
	},
	computed: {
		f_area_privada_cub: {
			get() { return this.formatNumber(this.apto['area_privada_cub'], true); },
			set(val) { this.apto['area_privada_cub'] = this.cleanNumber(val); }
		},
		f_area_privada_lib: {
			get() { return this.formatNumber(this.apto['area_privada_lib'], true); },
			set(val) { this.apto['area_privada_lib'] = this.cleanNumber(val); }
		},
		f_area_total: {
			get() { return this.formatNumber(this.apto['area_total'], true); },
			set(val) { this.apto['area_total'] = this.cleanNumber(val); }
		},
		f_acue: {
			get() { return this.formatNumber(this.apto['acue'], true); },
			set(val) { this.apto['acue'] = this.cleanNumber(val); }
		},
		f_total_acue: {
			get() { return this.formatNumber(this.apto['area_total_mas_acue'], true); },
			set(val) { this.apto['area_total_mas_acue'] = this.cleanNumber(val); }
		},
		f_valor_separacion: {
			get() { return this.formatNumber(this.apto['valor_separacion'], false); },
			set(val) { this.apto['valor_separacion'] = this.cleanNumber(val); }
		},
		f_valor_reformas: {
			get() { return this.formatNumber(this.apto['valor_reformas'], false); },
			set(val) { this.apto['valor_reformas'] = this.cleanNumber(val); }
		},
		f_valor_descuento: {
			get() { return this.formatNumber(this.apto['valor_descuento'], false); },
			set(val) { this.apto['valor_descuento'] = this.cleanNumber(val); }
		},
		f_valor_acabados: {
			get() { return this.formatNumber(this.apto['valor_acabados'], false); },
			set(val) { this.apto['valor_acabados'] = this.cleanNumber(val); }
		},
		f_valor_unidad: {
			get() { return this.formatNumber(this.apto['valor_unidad'], false); },
			set(val) { this.apto['valor_unidad'] = this.cleanNumber(val); }
		},
		getFilteredList() {
			return (tabla) => {
				if (!this[tabla]) return [];

				if (!this.filtros[tabla]) return [];

				const hayFiltrosActivos = Object.keys(this.filtros[tabla]).some(key => {
					const valor = this.filtros[tabla][key];
					return Array.isArray(valor) ? valor.length > 0 : valor !== '';
				});

				if (!hayFiltrosActivos) return this[tabla];

				return this[tabla].filter(item =>
					Object.keys(this.filtros[tabla]).every(key => {
						if (tabla === 'aptos' && key === 'torres')
							return this.filtros[tabla][key].length === 0 || this.filtros[tabla][key].includes(item.idtorre);

						if (key.startsWith('id_') || key === 'localizacion' || key === 'piso')
							return this.filtros[tabla][key] === '' || String(item[key]) === this.filtros[tabla][key];

						return this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
					})
				);
			};
		},
		totalAptos() {
			return this.getFilteredList("aptos").length;
		},
		vendidosSum() {
			return this.getFilteredList("aptos")
				.reduce((total, apto) => total + (apto.estatus === "Vendido" ? 1 : 0), 0);
		},
		vendidosPorcentaje() {
			return this.totalAptos > 0
				? Math.round((this.vendidosSum / this.totalAptos) * 100)
				: 0;
		},
		// barraColor() {
		// 	if (this.vendidosPorcentaje < 40) return "red";
		// 	if (this.vendidosPorcentaje < 70) return "orange";
		// 	return "green";
		// },
		tabClasses() {
			return this.tabs.map((_, index) => {
				if (this.tabmode === index) {
					return 'wizarTabActive';
				} else if (!this.tabsIncomplete.includes(index)) {
					return 'wizarTabCompleted';
				} else {
					return 'wizarTabIncomplete';
				}
			});
		},
		filters2text() {
			let filters = {
				Torre: this.filtros.aptos.torres.join(', '),
				Tipo: this.filtros.aptos.codigo_planta,
				Piso: this.filtros.aptos.piso,
				Localización: this.filtros.aptos.localizacion
			};
			let t = Object.keys(filters).reduce((t, key) => t += filters[key] ? `${key} ${filters[key]}; ` : '', '');
			if (t.length >= 2) t = 'en ' + t.substring(0, t.length - 2);
			return t;
		},
		aptosAgrupadosPorTorreYPiso() {
			const agrupado = {};
			const lista = this.getFilteredList('aptos');
			lista.forEach(apto => {
				const torre = apto.idtorre;
				const piso = apto.piso;
				if (!agrupado[torre]) agrupado[torre] = {};
				if (!agrupado[torre][piso]) agrupado[torre][piso] = [];

				agrupado[torre][piso].push(apto);
			});
			return agrupado;
		},
		aptosAgrupadosPorTorreYUnidad() {
			let result = {};
			for (let apto of this.aptos) {
				if (!result[apto.torre]) result[apto.torre] = {};
				if (!result[apto.torre][apto.apartamento]) result[apto.torre][apto.apartamento] = [];
				result[apto.torre][apto.apartamento].push(apto);
			}

			// ordenar cada columna de arriba (piso mayor) a abajo (piso menor)
			for (let torre in result) {
				for (let apto in result[torre]) {
					result[torre][apto].sort((a, b) => b.piso - a.piso);
				}
			}
			return result;
		}
		
	},
	watch: {
		torres: {
			handler(nuevasTorres) {
				if (nuevasTorres && nuevasTorres.length) {
					this.filtros.aptos.torres = nuevasTorres.map(t => t.idtorre);
				}
			},
			immediate: true
		}
	}
};
