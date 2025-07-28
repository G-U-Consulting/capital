export default {
	data() {
		return {
			mode: 0,
			torres: [],
			aptos: [],
			estados: [],
			preview: [],
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
				viewType: "3d"
			},
			selection: {
				type: "",
				value: null
			},
			apto: {}
		};
	},
	three: null,
	async mounted() {
		//this.computeViews();
		await this.loadUnidades();
	},
	methods: {
		async loadUnidades() {
			showProgress();
			let [torres, aptos, estados] = (await
				httpFunc('/generic/genericDS/Unidades:Get_Unidades', { id_proyecto: GlobalVariables.id_proyecto })).data;
			this.estados = estados;
			if (torres.length && aptos.length) {
				let number_fileds = ['valor_separacion', 'piso', 'area_total', 'area_privada_cub'];
				aptos.forEach(a => number_fileds.forEach(key => a[key] = parseFloat(a[key].replace(',', '.'))));
				torres = torres.map(t => ({ idtorre: t.consecutivo, pisos: [], id_torre: t.id_torre }));
				aptos.forEach(a => {
					let torre = torres.find(t => t.id_torre === a.id_torre);
					if (torre) {
						let i = torre.pisos.findIndex(p => p.idpiso == a.piso && p.idtorre == torre.idtorre);
						if (i == -1) torre.pisos.push({ idpiso: a.piso, idtorre: torre.idtorre, unidades: [a] });
						else torre.pisos[i].unidades.push(a);
					}
				});
				torres.sort((a, b) => a.idtorre - b.idtorre);
				torres.forEach(item => item.pisos.sort((a, b) => a.idpiso - b.idpiso));
				console.log(torres);
				this.torres = torres;
				this.computeViews();
			};
			this.loading = false;
			hideProgress();
		},
		openFileDialog: function () {
			document.getElementById("fileUpload").value = null;
			document.getElementById("fileUpload").click();
		},
		handleChangeFile: function (e) {
			var self = this;
			showProgress();
			const file = e.target.files[0];
			Papa.parse(file, {
				complete: function (results) {
					//TODO Check for errores
					self.previewFile(results.data);
					hideProgress();
				}
			});
		},
		previewFile: function (data) {
			try {
				var headerMap = {};
				data[0].forEach((item, index) => headerMap[item] = index);
				this.preview = [];
				this.torres = [];
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
					torre = this.torres.find(item => item.idtorre == idtorre);
					if (torre == null) {
						torre = { idtorre: idtorre, pisos: [] };
						this.torres.push(torre);
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
				this.torres.sort((a, b) => a.idtorre - b.idtorre);
				this.torres.forEach(item => item.pisos.sort((a, b) => a.idpiso - b.idpiso));
				this.mode = 1;
				console.log(JSON.stringify(this.torres));
			} catch (error) {
				console.log(error);
			}
		},
		computeViews: function () {
			this.mode = 3;
			setTimeout(this.threeInit, 10);
			console.log(this.torres);
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
		onSelectTorre(torre) {
			console.log(torre);
			this.aptos = [];
			torre.pisos.forEach(p => this.aptos.push(...p.unidades))
			console.log(this.aptos);
			this.mode = 4;
		},
		onSelectApto(apto) {
			this.apto = apto;
			this.mode = 5;
		}
	}
};
