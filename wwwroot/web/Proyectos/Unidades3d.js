export default {
	data() {
		return {
			mode: 0,
			ruta: [],
			tabsIncomplete: [],
			tabmode: -1,
			tabs: [
				"Torres",
				"Unidades",
				"Listas de Precios",
				"Agrupaciones",
				"Otros",
			],

			torres: [],
			pisos: [],
			u_torres: [],
			aptos: [],
			estados: [],
			fiduciarias: [],
			instructivos: [],
			tipos: [],
			localizaciones: [],
			agrupaciones: [],
			groupedAptos: [],
			selectedAptos: [],
			ids_unidades: [],
			listas: [],
			listaTipoTorre: [],
			precios: [],
			preview: [],
			sortIds: [],
			files: [],
			selListas: [],
			previewList: {},
			viewList: null,
			selTipo: null,
			listFromCSV: false,
			loading: true,
			loadingImg: true,
			playIndex: null,
			editUnit: false,
			resType: 'imagen',
			ordenTorres: 'ordinal',
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
			lista: {},
			gruposImg: [],
			projectList: '',
			projectAlert: '',

			filtros: {
				aptos: {
					apartamento: '',
					id_estado_unidad: '',
					codigo_planta: '',
					localizacion: '',
					torres: [],
					piso: '',
					id_tipo: '',
				},
				agrupaciones: {},
				groupedAptos: {
					apartamento: '',
					id_estado_unidad: '1',
					codigo_planta: '',
					localizacion: '',
					piso: '',
					id_torre: '',
					id_tipo: '',
				}
			},
			editNewRow: false,
			selRow2: null,
			selRow3: null,
			editRow: false,

			filtroTipos: [],
			filtroAgrupado: false,

			tooltipVisible: false,
			tooltipX: 0,
			tooltipY: 0,
			expandedVisible: false,
		};
	},
	three: null,
	async mounted() {
		//this.computeViews();
		await this.loadOrdenPref();
		await this.loadUnidades(true);
		if (this.torres.length) this.setTabmode(0);
		let b = !!this.torres.length;
		this.ruta = [{ text: `${GlobalVariables.proyecto.nombre} / Unidades`, action: () => b ? this.setTabmode(0) : this.setTabmode(-1, true) }];
		if (b) this.ruta.push({ text: `Torres`, action: () => this.setTabmode(0) })
		this.setRuta();
		this.listResources();
	},
	methods: {
		setRuta() {
			GlobalVariables.miniModuleCallback('SetRuta', this.ruta);
		},
		async setTabmode(index, force) {
			if (this.tabmode !== -1 || force) {
				if (index === 0) if (this.sortTorres.length) this.torre = this.sortTorres[0];
				if (index === 1) this.computeViews();
				if (index === 2) {
					await this.loadListas();
					this.projectList = GlobalVariables.proyecto.id_lista;
					this.projectAlert = GlobalVariables.proyecto.alerta_cambio_lista || '';
					if (this.torres.length) {
						if (!this.torre.id_torre) this.torre = this.sortTorres[0];
						this.selRow2 = 0;
						this.tabmode = index;
					}
					if (this.listas.length) this.selRow2 ||= 0;
					if (!this.filtroTipos.length) this.toggleTipos();
					this.setTorresList();
				}
				if (index === 3) {
					await this.loadAgrupacion();
					if (this.selRow3 !== null)
						this.filtros.aptos.id_agrupacion = this.getFilteredList('agrupaciones')[this.selRow3].id_agrupacion + '';
					else this.filtros.aptos.id_agrupacion = 'null';
				}
				if (index === 4) {
					if (this.tabmode !== 4) {
						await this.loadTipos();
						if (this.tipos.length) this.selTipo = this.tipos[0];
						else {
							showMessage("No se encotraron tipos para las unidades");
							return;
						}
						if (this.resType === 'imagen') this.setFile(this.selTipo.id_archivo_planta);
						if (this.resType === 'recorrido') this.setFile(this.selTipo.id_archivo_recorrido);
					}
				}
				if (index !== 2 && index !== 3) this.onClearFilters('aptos');
				this.editRow = false;
				this.tabmode = index;
				this.ruta = [this.ruta[0], { text: this.tabs[index], action: () => this.setTabmode(index) }];
				this.setRuta();
			}
		},
		async loadUnidades(compute) {
			showProgress();
			let [torres, aptos, estados, fiduciarias, instructivos] = (await
				httpFunc('/generic/genericDS/Unidades:Get_Unidades', { id_proyecto: GlobalVariables.id_proyecto })).data;
			this.estados = estados;
			this.fiduciarias = fiduciarias;
			this.instructivos = instructivos;
			let pisos = new Set(), localizaciones = new Set();
			if (torres.length && aptos.length) {
				let a_num_fields = ['valor_separacion', 'valor_reformas', 'valor_descuento', 'valor_acabados', 'valor_unidad', 'valor_complemento', 'area_total', 'area_privada_cub', 'area_privada_lib', 'acue', 'area_total_mas_acue'],
					t_num_fields = ['tasa_base', 'antes_p_equ', 'despues_p_equ'];
				aptos.forEach(a => a_num_fields.forEach(key => a[key] = a[key].replace(',', '.')));
				torres.forEach(t => t_num_fields.forEach(key => t[key] = t[key].replace(',', '.')));
				torres = torres.map(t => ({ idtorre: t.consecutivo, pisos: [], ...t }));
				aptos.forEach(a => {
					a.piso && pisos.add(a.piso);
					a.localizacion && localizaciones.add(a.localizacion);
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
				this.pisos = [...pisos].sort((a, b) => parseInt(a) - parseInt(b));
				this.localizaciones = [...localizaciones].sort();
				compute && this.computeViews();
			};
			await this.loadTipos();
			this.loading = false;
			hideProgress();
		},
		async loadTipos() {
			showProgress();
			let tipos = (await
				httpFunc('/generic/genericDT/Unidades:Get_Tipos', { id_proyecto: GlobalVariables.id_proyecto })).data;
			this.tipos = tipos.sort((a, b) => a.tipo.localeCompare(b.tipo));
			hideProgress();
		},
		async loadOrdenPref() {
			showProgress();
			let op = await GlobalVariables.getPreferences('ordenTorres', true);
			if (!op) await GlobalVariables.setPreferences('ordenTorres', 'ordinal', true);
			hideProgress();
			this.ordenTorres = op || 'ordinal';
		},
		async setOrdenPref() {
			await GlobalVariables.setPreferences('ordenTorres', this.ordenTorres);
		},
		async loadAgrupacion() {
			showProgress();
			this.agrupaciones = (await
				httpFunc('/generic/genericDT/Unidades:Get_Agrupacion', { id_proyecto: GlobalVariables.id_proyecto })).data;
			hideProgress();
			if (this.selRow3 === null) {
				this.grupo = {};
				this.onSelectGroup(0);
			}
		},
		async loadListas() {
			showProgress();
			let [lists, listaTipoTorre] = (await
				httpFunc('/generic/genericDS/Unidades:Get_ListaPrecios', { id_proyecto: GlobalVariables.id_proyecto })).data;
			if (lists.every(l => !Number.isNaN(Number(l.lista))))
				lists.sort((a, b) => Number(a.lista) - Number(b.lista));
			else lists.sort();
			this.listas = [...lists.map(l => ({ ...l, promedio_m2: l.promedio_m2.replace(',', '.') }))];
			this.listaTipoTorre = listaTipoTorre;
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
				this.tabmode = -1;
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
				res = await (httpFunc(`/generic/genericST/Unidades:Upd_Unidades`, {
					id_proyecto: GlobalVariables.id_proyecto,
					unidades: JSON.stringify(data),
					Usuario: GlobalVariables.username
				}));
				if (res.isError || res.data !== 'OK') throw res;
				await this.loadUnidades(true);
				this.setTabmode(0, true);
				this.u_torres = [];
			} catch (e) {
				console.error(e);
				showMessage('Error: ' + e.errorMessage || e.data);
			}
			hideProgress();
		},
		computeViews: function () {
			this.tabmode = 1;
			this.mode = 3;
			this.viewProperties === '3d' && setTimeout(this.threeInit, 10);
			let b = !!this.torres.length;
			this.ruta = [{ text: `${GlobalVariables.proyecto.nombre} / Unidades`, action: () => b ? this.setTabmode(0) : this.setTabmode(-1, true) }];
			if (b) this.ruta.push({ text: `Torres`, action: () => this.setTabmode(0) })
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

		onClearTasas() {
			if (this.torre.propuesta_pago != '1') {
				this.torre.tasa_base = '0.00';
				this.torre.antes_p_equ = '0.00';
				this.torre.despues_p_equ = '0.00';
			}
		},
		async onSaveTorre() {
			if (this.torre.id_torre) {
				showProgress();
				let res = null;
				try {
					let torre = { ...this.torre }, tmp = { ...this.torre };
					delete torre.pisos;
					Object.keys(torre).forEach(k => torre[k] === '' && delete torre[k]);
					if (this.blockTower(this.torre)) delete torre.orden_salida;
					res = await httpFunc('/generic/genericST/Unidades:Upd_Torre', torre);
					if (res.isError || res.data !== 'OK') throw res;
					await this.loadUnidades();
					await this.setTabmode(0);
					this.torre = tmp;
				} catch (e) {
					if (e.errorMessage && e.errorMessage.includes('chk_aptos_fila_piso'))
						showMessage('Error: El máximo número de unidades por fila es ' + this.torre.aptos_piso);
					else showMessage('Error: ' + e.errorMessage || e.data);
					console.error(e);
				}
				hideProgress();
			}
		},

		async toggleNewRow() {
			let b = this.editNewRow;
			if (b) this.onSaveGroup();
			this.onCancelGroup();
			this.editNewRow = !b;
		},
		toggleTorre(torre) {
			let i = this.filtros.aptos.torres.indexOf(torre.idtorre);
			i === -1 ? this.filtros.aptos.torres.push(torre.idtorre) : this.filtros.aptos.torres.splice(i, 1);
		},
		toggleTipo(tipo) {
			let i = this.filtroTipos.indexOf(tipo.id_tipo);
			i === -1 ? this.filtroTipos.push(tipo.id_tipo) : this.filtroTipos.splice(i, 1);
		},
		toggleTipos() {
			if (this.filtroTipos.length === this.tiposTorre.length) this.filtroTipos = [];
			else this.filtroTipos = this.tiposTorre.map(tt => tt.id_tipo);
		},
		setTorresList() {
			this.filtroTipos = this.filtroTipos.filter(ft => this.tiposTorre.some(tt => tt.id_tipo === ft));
			this.selListas = [];
			let listas = new Set();
			if (this.torre.id_torre && this.filtroTipos) {
				this.filtroTipos.forEach(ft => {
					listas.add(...this.listaTipoTorre
						.filter(l => l.id_tipo === ft && l.id_torre === this.torre.id_torre)
						.map(l => l.id_lista));
				});
				this.selListas = [...listas];
			}
		},
		setTorre(torre) {
			this.torre = torre;
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
					id_tipo: '',
					localizacion: '',
					clase: '',
					torres: [],
					piso: '',
					id_agrupacion: '',
				}
			if (table === 'groupedAptos')
				this.filtros.groupedAptos = {
					apartamento: '',
					id_estado_unidad: '',
					id_tipo: '',
					localizacion: '',
					clase: '',
					piso: '',
					id_torre: ''
				}
			if (table === 'agrupaciones') {
				this.filtros.agrupaciones = {};
				this.onCancelGroup();
				this.selRow3 = null;
				if (this.agrupaciones.length) this.onSelectGroup(0);
			}
		},
		onSelectApto(apto) {
			this.apto = { ...apto };
			this.mode = 5;
			this.ruta = [this.ruta[0], this.ruta[1], { text: `Torre ${apto.idtorre} - ${apto.apartamento}`, action: () => this.onSelectApto(apto) }];
			this.setRuta();
			let $editCont = document.getElementById('editUnitCont');
			this.editUnit = false;
			if ($editCont) $editCont.addEventListener('change', (e) => {
				if (!this.editUnit && ['INPUT', 'SELECT'].includes(e.target.tagName)) this.editUnit = true;
			});
		},
		async onSave() {
			showProgress();
			let res = null;
			if (!this.apto.id_estado_unidad) delete this.apto.id_estado_unidad;
			try {
				res = await (httpFunc('/generic/genericST/Unidades:Upd_Unidad', {
					...this.apto,
					Usuario: GlobalVariables.username
				}));
				if (res.isError || res.data !== 'OK') throw res;
				this.editUnit = false;
				await this.loadUnidades(true);
			} catch (e) {
				console.error(e);
				showMessage('Error: ' + e.errorMessage || e.data);
			}
			hideProgress();
		},
		formatNumber(value, dec = true, ndec) {
			if (!value) return "";
			let [parteEntera, parteDecimal] = value.split(".");
			parteEntera = parteEntera.replace(/\D/g, "");
			parteDecimal = parteDecimal && dec ? parteDecimal.replace(/\D/g, "") : "";
			if (ndec >= 0)
				parteDecimal = dec && ndec > 0 ? parteDecimal.padEnd(ndec, '0') : "";

			let groups = [];
			let len = parteEntera.length;
			for (let i = len; i > 0; i -= 3)
				groups.unshift(parteEntera.substring(Math.max(0, i - 3), i));

			let formattedEntera = groups[0] || "";
			for (let i = 1; i < groups.length; i++)
				formattedEntera += '.' + groups[i];

			let result = formattedEntera;
			if (parteDecimal) {
				if (ndec > 0 && parteDecimal.length > ndec)
					parteDecimal = Math.round(parseInt(parteDecimal) / Math.pow(10, parteDecimal.length - ndec)).toString();
				result += "," + parteDecimal;
			}

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
			if (this.grupo.nombre) {
				showProgress();
				let res = null;
				try {
					res = await (httpFunc(`/generic/genericST/Unidades:${this.grupo.id_agrupacion ? 'Upd' : 'Ins'}_Agrupacion`, {
						...this.grupo, id_proyecto: GlobalVariables.id_proyecto
					}));
					if (res.isError || res.data !== 'OK') throw res;
					if (!this.grupo.id_agrupacion) this.selRow3 = null;
					await this.loadAgrupacion();
				} catch (e) {
					console.error(e);
					showMessage('Error:   ' + e.errorMessage || e.data);
				}
				hideProgress();
			}
			this.onCancelGroup();
		},
		async onSelectGroup(i) {
			if (this.editNewRow)
				await this.onSaveGroup();
			if (this.editRow && this.selRow3 !== null && this.selRow3 !== i) {
				this.grupo.id_agrupacion = this.getFilteredList('agrupaciones')[this.selRow3].id_agrupacion;
				await this.onSaveGroup();
			}
			if (this.agrupaciones.length) {
				let id = this.getFilteredList('agrupaciones')[i].id_agrupacion + '';
				this.selectedAptos = this.aptos.filter(a => a.id_agrupacion === id).sort((a, b) => {
					if (a.clase == b.clase) return Number(a.numero_apartamento) - Number(b.numero_apartamento);
					else return a.clase.localeCompare(b.clase);
				});
				this.selRow3 = i;
				this.groupedAptos = this.aptos.filter(a => !a.id_agrupacion || a.id_agrupacion === id);
			}
			this.onClearFilters('groupedAptos');
		},
		async onEditGroup(grupo, i) {
			if (!this.editNewRow) {
				this.onSelectGroup(i);
				this.grupo = { ...grupo };
				this.editRow = true;
			}
		},
		async onEditList(list, i) {
			this.selRow2 = i;
			this.lista = { ...list };
			this.editRow = true;
		},
		async onSaveList() {
			if (this.lista.id_lista) {
				showProgress();
				let res = null;
				try {
					res = await httpFunc(`/generic/genericST/Unidades:Upd_Lista`, this.lista);
					if (res.isError || res.data !== 'OK') throw res;
					this.lista = {};
					this.editRow = false;
					await this.loadListas();
				} catch (e) {
					console.error(e);
					showMessage('Error:   ' + e.errorMessage || e.data);
				}
				hideProgress();
			}
		},
		onCancelGroup() {
			this.grupo = {};
			this.editRow = false;
			this.editNewRow = false;
		},
		async onDeleteGroup(group) {
			showProgress();
			let res = null;
			try {
				res = await (httpFunc('/generic/genericST/Unidades:Del_Agrupacion', group));
				if (res.isError || res.data !== 'OK') throw res;
				await this.loadUnidades();
				this.selRow3 = null;
				await this.setTabmode(3);
			} catch (e) {
				console.error(e);
				showMessage('Error: ' + e.errorMessage || e.data);
			}
			hideProgress();
		},
		requestDelete(item, i) {
			if (item.id_agrupacion) {
				this.onSelectGroup(i);
				let msg = `Se eliminará la agrupación <b>${item.nombre}</b> permanentemente. `;
				if (this.selectedAptos.length) msg += 'Las unidades asignadas quedarán sin agrupación.'
				showConfirm(msg, this.onDeleteGroup, null, item);
			}
		},
		openModal() {
			if (this.selRow3 !== null) {
				this.filtroAgrupado = false;
				this.filtros.groupedAptos.id_agrupacion = '';
				this.filtros.groupedAptos.id_estado_unidad = '1';
				this.editRow = false;
				this.editNewRow = false;
				let $modal = document.getElementById('modalOverlay');
				$modal && ($modal.style.display = 'flex');
				let ids_unidades = [];
				this.groupedAptos.filter(a => a.id_agrupacion).forEach(a => ids_unidades.push(a.id_unidad));
				this.ids_unidades = [...ids_unidades];
				this.grupo = { ...this.getFilteredList('agrupaciones')[this.selRow3] };
			}
		},
		closeModal() {
			let $modal = document.getElementById('modalOverlay');
			$modal && ($modal.style.display = 'none');
			this.ids_unidades = [];
		},
		async onSaveModal() {
			if (this.grupo.id_agrupacion) {
				showProgress();
				let res = null;
				try {
					res = await (httpFunc(`/generic/genericST/Unidades:Upd_GrupoUnidad`, {
						ids_unidades: this.ids_unidades.join(','),
						id_agrupacion: this.grupo.id_agrupacion
					}));
					if (res.isError || res.data !== 'OK') throw res;
					await this.loadUnidades();
					await this.setTabmode(3);
					this.onSelectGroup(this.selRow3);
					this.closeModal();
				} catch (e) {
					console.error(e);
					showMessage('Error: ' + e.errorMessage || e.data);
				}
				hideProgress();
			}
			this.onCancelGroup();
		},
		modalGroupedAptos() {
			this.onClearFilters('groupedAptos');
			if (this.filtroAgrupado) this.filtros.groupedAptos.id_agrupacion = this.grupo.id_agrupacion;
		},
		formatList(list = []) {
			if (list && list.length) {
				let keys = list[0];
				list.shift();
				let temp = list.map(l => {
					let obj = {};
					keys.forEach((k, i) => obj[k] = l[i]);
					return obj;
				}).filter(l => l.precio !== null && l.precio !== undefined);
				let res = {};
				temp.forEach(l => {
					l.selected = true;
					if (res[l.lista] && res[l.lista].lista)
						if (res[l.lista].torres[l.torre] && res[l.lista].torres[l.torre].torre)
							res[l.lista].torres[l.torre].precios.push(l);
						else res[l.lista].torres[l.torre] = { torre: l.torre, precios: [l], expanded: false, selected: true };
					else {
						res[l.lista] = { lista: l.lista, torres: {} };
						res[l.lista].torres[l.torre] = { torre: l.torre, precios: [l], expanded: false, selected: true };
					}
				});
				this.previewList = { ...res };
				let keyList = Object.keys(res);
				if (keyList.length) this.viewList = keyList[0];
				this.listFromCSV = true;
				this.openListModal();
			};
		},
		uploadList(e) {
			var self = this;
			showProgress();
			const file = e.target.files[0];
			if (file) {
				Papa.parse(file, {
					complete(results) {
						self.formatList(results.data);
						e.target.value = '';
						hideProgress();
					}
				});
			}
		},
		toggleSelectedTorre(torre) {
			torre.selected = !torre.selected;
			torre.precios.forEach(a => a.selected = torre.selected);
		},
		toggleSelectedApto(apto, torre) {
			apto.selected = !apto.selected;
			if (torre.precios.every(a => a.selected)) torre.selected = true;
			else torre.selected = false;
		},
		async confirmUploadList() {
			showProgress();
			let res = null;
			try {
				res = await (httpFunc(`/generic/genericST/Unidades:Ins_ListaPrecios`, {
					id_proyecto: GlobalVariables.id_proyecto,
					listas: JSON.stringify(this.previewList),
					Usuario: GlobalVariables.username
				}));
				if (res.isError || res.data !== 'OK') throw res;
				await this.loadUnidades();
				await this.setTabmode(2);
				let $modal = document.getElementById('modalOverlayList');
				$modal && ($modal.style.display = 'none');
				this.previewList = {};
			} catch (e) {
				console.error(e);
				showMessage('Error: ' + e.errorMessage || e.data);
			}
			hideProgress();
		},
		async onSaveTabLists() {
			if (this.projectAlert && !this.isEmail(this.projectAlert))
				showMessage("Error: Debe ingresar un correo válido");
			else {
				showProgress();
				let res = null;
				try {
					let obj = { id_proyecto: GlobalVariables.id_proyecto };
					if (this.projectList) obj.id_lista = this.projectList;
					if (this.projectAlert) obj.alerta_cambio_lista = this.projectAlert;
					res = await httpFunc(`/generic/genericST/Unidades:Upd_ListaProyecto`, obj);
					if (res.isError || res.data !== 'OK') throw res;
					GlobalVariables.proyecto.id_lista = this.projectList;
					GlobalVariables.proyecto.alerta_cambio_lista = this.projectAlert;
					await this.loadUnidades();
					await this.setTabmode(2);
				} catch (e) {
					console.error(e);
					showMessage('Error: ' + e.errorMessage || e.data);
				}
				hideProgress();
			}
		},
		async onSetLista() {
			if (this.torre.id_torre && this.selRow2 !== null) {
				showProgress();
				let res = null, i = this.selRow2, torre = { ...this.torre }, filtroTipos = [ ...this.filtroTipos ];
				try {
					let id_lista = this.listas[this.selRow2].id_lista;
					let obj = { id_lista, id_torre: torre.id_torre, ids_tipos: filtroTipos.join(',') };
					res = await httpFunc(`/generic/genericST/Unidades:Upd_ListaTorre`, obj);
					if (res.isError || res.data !== 'OK') throw res;
					await this.loadUnidades();
					await this.setTabmode(2);
					this.torre = torre;
					this.filtroTipos = filtroTipos;
					this.selRow2 = i;
					this.setTorresList();
				} catch (e) {
					console.error(e);
					showMessage('Error: ' + e.errorMessage || e.data);
				}
				hideProgress();
			}
		},
		openListModal() {
			let $modal = document.getElementById('modalOverlayList');
			$modal && ($modal.style.display = 'flex');
		},
		closeListModal(e) {
			if (e.target.matches('#modalOverlayList'))
				e.target.style.display = 'none';
			if (e.target.matches('.closeListModal'))
				document.getElementById('modalOverlayList').style.display = 'none';
		},
		reqOperation(msg, okCallback, cancelCallback, item, textOk, textCancel) {
			showConfirm(msg, okCallback, cancelCallback, item, textOk, textCancel);
		},
		async detailList(lista) {
			showProgress();
			let precios = (await httpFunc('/generic/genericDT/Unidades:Get_PreciosLista',
				{ id_lista: lista.id_lista, id_torre: this.torre.id_torre })).data;
			if (precios.length) {
				let torres = {};
				precios.forEach(p => {
					Object.keys(p).forEach(k => p[k] = p[k].replace(',', '.'));
					if (torres[p.torre]) torres[p.torre].precios.push(p);
					else torres[p.torre] = { torre: p.torre, precios: [p], expanded: this.filtros.aptos.torres.length <= 1 }
				});
				let obj = {};
				obj[lista.lista] = { lista: lista.lista, torres };
				this.previewList = obj;
				this.viewList = lista.lista;
				this.listFromCSV = false;
				this.openListModal();
			}
			hideProgress();
		},
		isEmail(email) {
			let regex = /[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})/i;
			return !email || regex.test(email);
		},
		async downloadTemplate() {
			try {
				showProgress();
				let datos = (await httpFunc('/generic/genericDT/Unidades:Get_ExportPrecios',
					{ id_proyecto: GlobalVariables.id_proyecto })).data;
				let archivo = (await httpFunc(`/util/Json2File/csv`, datos)).data;
				window.open("./docs/" + archivo, "_blank");
			}
			catch (e) {
				console.error(e);
			}
			hideProgress();
		},
		setOrdenTorre(dir) {
			if (!this.blockTower(this.torre)) {
				let a = this.sortTorres.findIndex(t => t.id_torre === this.torre.id_torre);
				let next = this.sortTorres[a + dir];
				if (next && !this.blockTower(next)) {
					let i = this.torre.orden_salida;
					this.torre.orden_salida = next.orden_salida;
					next.orden_salida = i;
					this.onUpdateOrden(this.torre, next);
				}
				else if (next && this.blockTower(next))
					showMessage(`No es posible cambiar el orden de la torre ${next.consecutivo} con unidades vendidas, consignadas o opcionadas.`)
			}
			else showMessage(`No es posible cambiar el orden de la torre ${this.torre.consecutivo} con unidades vendidas, consignadas o opcionadas.`);
		},
		async onUpdateOrden(torre1, torre2) {
			if (torre1 && torre2) {
				showProgress();
				let res = null;
				try {
					res = await httpFunc(`/generic/genericST/Unidades:Upd_OrdenTorres`,
						{
							id_torre1: torre1.id_torre, orden_torre1: torre1.orden_salida,
							id_torre2: torre2.id_torre, orden_torre2: torre2.orden_salida,
						}
					);
					if (res.isError || res.data !== 'OK') throw res;
				} catch (e) {
					console.error(e);
					showMessage('Error:   ' + e.errorMessage || e.data);
				}
				hideProgress();
			}
		},
		msgListaTorres(lista) {
			let lists = [];
			if (this.torre.id_torre) {
				this.listaTipoTorre.forEach(l =>
					l.id_torre === this.torre.id_torre && l.id_lista === lista.id_lista && lists.push(l.tipo));
			}
			return lists.sort().join('<br>');
		},
		
		async listResources() {
			this.loadingImg = true;
			this.files = [];
			let id_proyecto = GlobalVariables.proyecto.id_proyecto;
			if (id_proyecto) {
				let res = await httpFunc('/generic/genericDT/Medios:Get_GrupoProyecto', { id_proyecto });
				let grupos = res.data;
				let modulos = ['imagenes', 'recorridos virt'];
				if (grupos) grupos = grupos.filter(g => g.modulo === modulos[1] || (g.modulo === modulos[0] && g.grupo === 'Plantas Arquitectónicas'));
				res = await httpFunc('/generic/genericDT/Maestros:Get_Archivos', { tipo: modulos.join(','), id_proyecto });

				modulos.forEach(mod => {
					let data = res.data.filter(d => d.tipo == mod);
					grupos.forEach(g => {
						let temp = data.filter(d => d.id_grupo_proyecto == g.id_grupo_proyecto);
						g.files = [...(g.files || []), ...temp];
						g.expanded = true;
					})
				});
				this.gruposImg = [...grupos];

				await this.addResources();
				this.files.length && (this.files[0].current = true);
				await this.loadResources();
			}
		},
		async addResources() {
			let grupos = [...this.gruposImg];
			grupos.forEach(g => {
				let files = g.files.sort((a, b) => parseInt(a.orden) - parseInt(b.orden)).filter(f => f != undefined);
				this.files = [...this.files, ...files];
			});
			this.gruposImg = grupos;
		},
		async loadResources() {
			try {
				let files = [...this.files], temp = [...this.files];
				await Promise.all(files.map(async (f, i) => {
					if (!f.link) {
						const res = await fetch('/file/S3get/' + f.llave);
						if (!res.ok) throw new Error(`Error al cargar ${f.llave}: ${res.statusText}`);
						const blob = await res.blob(),
							file = new File([blob], f.name, { type: blob.type }),
							reader = new FileReader();
						reader.onload = async (e) => temp[i].content = e.target.result;
						reader.readAsDataURL(file);
					}
				})).then(f => {
					this.files = temp;
					this.loadingImg = false;
				});
			} catch (error) {
				console.error("Error al cargar archivos:", error);
			}
		},
		selectFile(file, fromClick) {
			if (fromClick && file.current) {
				if (this.resType === 'imagen') this.selTipo.id_archivo_planta = '';
				if (this.resType === 'recorrido') this.selTipo.id_archivo_recorrido = '';
				file.current = false;
				this.playIndex = null;
			}
			else {
				this.files.forEach(f => f.current = false);
				file.current = true;
				this.playIndex = this.files.indexOf(file);
				if (this.resType === 'imagen') this.selTipo.id_archivo_planta = file.id_documento_proyecto;
				if (this.resType === 'recorrido') this.selTipo.id_archivo_recorrido = file.id_documento_proyecto;
			}
		},
		setFile(id_doc_pro) {
			this.files.forEach(f => f.current = false);
			this.playIndex = null;
			if (id_doc_pro) {
				let file = this.files.find(f => f.id_documento_proyecto === id_doc_pro);
				if (file) this.selectFile(file);
			}
		},
		setTipo(tipo) {
			this.selTipo = tipo;
			if (this.resType == 'imagen') this.setFile(tipo.id_archivo_planta);
			if (this.resType == 'recorrido') this.setFile(tipo.id_archivo_recorrido);
		},
		updateCursor(event) {
			this.tooltipX = event.clientX + 10;
			this.tooltipY = event.clientY + 10;
		},
		toggleList() {
			this.showList = !this.showList;
		},
		toggleExpand() {
			let expanded = this.isExpanded();
			this.gruposImg.forEach(g => g.expanded = !expanded);
		},
		setResType(type) {
			this.resType = type;
			if (type == 'imagen') this.setFile(this.selTipo.id_archivo_planta);
			if (type == 'recorrido') this.setFile(this.selTipo.id_archivo_recorrido);
		},
		async onSaveTypes() {
			if (this.tipos.length) {
				showProgress();
				let res = null;
				try {
					res = await httpFunc(`/generic/genericST/Unidades:Upd_Tipos`,
						{ data: JSON.stringify(this.tipos) });
					if (res.isError || res.data !== 'OK') throw res;
				} catch (e) {
					console.error(e);
					showMessage('Error:   ' + e.errorMessage || e.data);
				}
				hideProgress();
			}
		},
		closeExpanded() {
			this.expandedVisible = false;
		},
		reqUnlockApto(apto) {
			if (apto.id_estado_unidad != '1')
				this.reqOperation(`El estado de la unidad <b>${apto.clase} ${apto.numero_apartamento}</b> cambiará de <b>${apto.estatus}</b> a <b>Libre</b>`,
					this.unlockApto, null, apto);
		},
		async unlockApto(apto) {
			apto.estatus = 'Libre';
			apto.id_estado_unidad = '1';
			this.apto = apto;
			await this.onSave();
		}
	},
	computed: {
		f_tasa_base: {
			get() { return this.formatNumber(this.torre['tasa_base'], true); },
			set(val) { this.torre['tasa_base'] = this.cleanNumber(val); }
		},
		f_antes_p_equ: {
			get() { return this.formatNumber(this.torre['antes_p_equ'], true); },
			set(val) { this.torre['antes_p_equ'] = this.cleanNumber(val); }
		},
		f_despues_p_equ: {
			get() { return this.formatNumber(this.torre['despues_p_equ'], true); },
			set(val) { this.torre['despues_p_equ'] = this.cleanNumber(val); }
		},
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
		f_valor_complemento: {
			get() { return this.formatNumber(this.apto['valor_complemento'], false); },
			set(val) { this.apto['valor_complemento'] = this.cleanNumber(val); }
		},
		sortTorres: {
			get() {
				let tmp = [...this.torres]
				if (this.ordenTorres == 'salida')
					tmp = [...this.torres].sort((a, b) => parseInt(a.orden_salida) - parseInt(b.orden_salida));
				this.sortIds = tmp.map(t => t.id_torre);
				return tmp;
			}
		},
		getFilteredList() {
			return (tabla) => {
				return this[tabla] ? this[tabla].filter(item =>
					this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
						if (tabla == 'aptos' && key == 'torres')
							return this.filtros[tabla][key].length === 0 || this.filtros[tabla][key].includes(item.idtorre);
						if (key.startsWith('id_') || key == 'localizacion' || key == 'piso')
							return this.filtros[tabla][key] === '' || String(item[key]) === this.filtros[tabla][key];
						else return this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
					}) : []
				) : [];
			};
		},
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
		blockTower() {
			return (torre) => {
				let b = false;
				for (let piso of torre.pisos) {
					for (let unidad of piso.unidades) {
						if (unidad.id_estado_unidad != '1') {
							b = true;
							break;
						}
					}
					if (b) break;
				}
				return b;
			}
		},
		isExpanded() {
			return () => this.gruposImg.every(g => g.expanded);
		},
		tiposTorre() {
			let tipos = this.tipos.filter(t =>
				this.torre.pisos.some(p => p.unidades.some(u => u.id_tipo === t.id_tipo)));
			return tipos;
		}
	},
};
