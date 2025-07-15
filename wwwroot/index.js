/****************************************************************************************************************************************/
/************************************************* VUEJS ********************************************************************************/
/****************************************************************************************************************************************/
const { createApp } = Vue;
var GlobalVariables = {
    username: null,
    roles: null,
    permisos: null,
    loadModule: null,
    loadMiniModule: null,
    miniModuleCallback: null,
    modules: null,
    ruta: null,
    passwordPolicy: null,
    zonaActual: null,
    showModules: null,
    id_proyecto: null,
    getPreferences: null,
    setPreferences: null,
};
const mainDivId = "#mainContentDiv";
var vm = null, mainVue = null, mvm = null;
var indexMainDiv = document.getElementById("mainContentDiv");
mainVue = {
    data() {
        return {
            moduleSelected: null,
            loginData: { user: "", roles: [], permisos: [], debug: false },
            modules: null,
            showMobileMenu: true,
            showModuleMenu: false,
            mostrarMenu: false,
            zones: null,
            zoneSelected: null,
            zonePreSelected: null,
            categories: null,
            categorySelected: null,
            apiKeys: {},
            nombreUsuario: "",
        }
    },
    async mounted() {
        document.getElementById("indexMainDiv").style.display = "block";
        const pars = new Proxy(new URLSearchParams(window.location.search), {
            get: (searchParams, prop) => searchParams.get(prop),
        });
        var url = window.location.href;
        if (url.indexOf("?") > 0)
            url = url.substring(0, url.indexOf("?"));
        if (pars.loc != null)
            url += "?loc=" + pars.loc;
        //window.history.replaceState({}, document.title, url);
        showProgress();
        var data = (await httpFunc("/auth/getUserProfile", {})).data;
        this.loginData = data;
        this.modules = GlobalVariables.modules["modules"];
        this.zones = GlobalVariables.modules["zones"];
        this.hideModules(this.modules);
        GlobalVariables.roles = data.roles;
        GlobalVariables.permisos = data.permisos;
        GlobalVariables.username = data.user;
        GlobalVariables.loadModule = this.loadModule;
        GlobalVariables.loadMiniModule = this.loadMiniModule;
        GlobalVariables.ruta = localStorage.getItem('ruta');
        GlobalVariables.passwordPolicy = await this.getSeguridad();
        if (pars.loc != null && this.modules[pars.loc] != null) {
            var inpParamter = null;
            if (pars.id != null)
                inpParamter = { "data": { "id": pars.id } };
            await this.loadModule(pars.loc, inpParamter);
            this.mostrarMenu = true;
        } else {
            await this.loadModule("Index");
            this.mostrarMenu = true;
        }
        GlobalVariables.showModules = this.openZone;
        hideProgress();
        window.onpopstate = function (e) {
            if (e.state != null && e.state.moduleName != null)
                this.loadModule(e.state.moduleName);
        }.bind(this);
        GlobalVariables.getPreferences = this.getPreferences;
        GlobalVariables.setPreferences = this.setPreferences;
        const response = await httpFunc("/generic/genericDS/General:Get_NomUser", { user: GlobalVariables.username });
        this.nombreUsuario = response.data[0][0].nombres;
    },
    methods: {
        async loadModule(name, inputParameter) {
            if (inputParameter == null && this.modules[name] != null && this.modules[name].inputParameter != null)
                inputParameter = this.modules[name].inputParameter;
            if (this.modules[name] === this.moduleSelected) {
                if (inputParameter != null) {
                    inputParameter.moduleAreadyLoaded = true;
                    vm.config.globalProperties.inputParameter = inputParameter;
                    vm.mount(mainDivId);
                }
                return;
            }
            showProgress();
            if (vm != null)
                vm.unmount();
            if (name == "Index" || !this.checkAcces(name)) {
                indexMainDiv.innerHTML = "";
                document.getElementById("indexMenuDiv").style.display = "block";
                //document.getElementById("mainFooter").style.display = "none";
                this.moduleSelected = null;

                document.title = "Inicio";
                indexMainDiv.style.minHeight = "auto";
                hideProgress();

                var url = window.location.href;
                if (url.indexOf("?") > 0)
                    url = url.substring(0, url.indexOf("?"))
                if (name == "Index")
                    this.showMobileMenu = false;
                window.history.pushState({ moduleName: name }, document.title, url);
                return;
            }
            if (this.modules[name] == null) {
                indexMainDiv.innerHTML = name;
                hideProgress();
                return;
            }
            this.showMobileMenu = false;
            this.moduleSelected = this.modules[name];
            this.moduleSelected.moduleName = name;
            document.title = this.moduleSelected.title;
            if (this.moduleSelected.moduleObj == null) {
                try {
                    this.moduleSelected.moduleObj = await import(this.moduleSelected.jsUrl);
                    this.moduleSelected.moduleObj = this.moduleSelected.moduleObj.default;
                }
                catch(e) {
                    window.location.href = '/login.html';
                    console.error(e);
                }
            }
            if (this.moduleSelected.moduleObj.template == null || this.moduleSelected.moduleObj.template == "")
                this.moduleSelected.moduleObj.template = await (await fetch(this.moduleSelected.templateUrl)).text();
            this.zoneSelected = this.zones[this.moduleSelected["zone"]];
            GlobalVariables.zonaActual = this.zoneSelected;
            if (this.zoneSelected != null)
                this.categorySelected = this.zoneSelected.categories.find(function (item) { return this.moduleSelected["category"] == item["key"] }.bind(this));
            this.loadVueModule(inputParameter);

            if (GlobalVariables.ruta != null && !GlobalVariables.ruta.includes(name)) {
                GlobalVariables.ruta = GlobalVariables.ruta + " / " + name;
                localStorage.setItem('ruta', GlobalVariables.ruta);
            }
        },
        loadVueModule(inputParameter) {
            document.getElementById("indexMenuDiv").style.display = "none";

            vm = createApp(this.moduleSelected.moduleObj);
            vm.config.globalProperties.inputParameter = inputParameter;
            vm.mount(mainDivId);
            hideProgress();
            var url = window.location.href;
            if (url.indexOf("?") > 0)
                url = url.substring(0, url.indexOf("?"))
            url += "?loc=" + this.moduleSelected.moduleName;
            window.history.pushState({ moduleName: this.moduleSelected.moduleName }, this.moduleSelected.title, url);
        },
        async loadMiniModule(name, inputParameter, elementId) {
            showProgress();
            var miniModule = this.modules[name];
            miniModule.moduleName = name;
            if (miniModule.title != null)
                document.title = miniModule.title;
            if (miniModule.moduleObj == null) {
                miniModule.moduleObj = await import(miniModule.jsUrl);
                miniModule.moduleObj = miniModule.moduleObj.default;
            }
            if (miniModule.moduleObj.template == null || miniModule.moduleObj.template == "")
                miniModule.moduleObj.template = await (await fetch(miniModule.templateUrl)).text();

            if (mvm != null) mvm.unmount();
            mvm = createApp(miniModule.moduleObj);
            mvm.config.globalProperties.inputParameter = inputParameter;
            hideProgress();
            var mount = mvm.mount(elementId);
            return mount;
            //var url = window.location.href;
            //if (url.indexOf("?") > 0)
            //    url = url.substring(0, url.indexOf("?"))
            //url += "?loc=" + this.moduleSelected.moduleName;
            //window.history.pushState({ moduleName: this.moduleSelected.moduleName }, this.moduleSelected.title, url);
        },
        isActiveModule(name) {
            return this.modules[name] == this.moduleSelected || (this.moduleSelected == null && name == "Index");
        },
        checkAcces(name) {
            if (name == "Index" || this.modules[name].allow.indexOf("*") >= 0)
                return true;
            for (var i = 0; i < this.loginData.roles.length; i++) {
                if (this.modules[name].allow.indexOf(this.loginData.roles[i].rol) >= 0)
                    return true;
            }
            return false;
        },
        hideModules(modules) {
            for (const name in modules)
                if (!this.checkAcces(name))
                    modules[name].hidden = true;
        },
        handleClick(item) {
            if (item.isLogOut) {
                return this.logOut();
            }
            const isZAZone = item.name === 'ZA';
            if (isZAZone) {
                this.loadModule('Proyectos', null);
                this.closeMenu();
            } else {
                this.openZone(item);
            }
        },
        async logOut() {
            showProgress();
            var data = await httpFunc("/auth/logout", {});
            window.location = "./login.html";
        },
        openZone(item) {
            this.zonePreSelected = item;
            this.showMobileMenu = true;
            this.showModuleMenu = false;
            this.categories = item.categories;
            this.showModuleMenu = true;
            GlobalVariables.ruta = item.name;
        },
        openCategory(item) {
            this.categorySelected = item;
            this.showModuleMenu = true;
        },
        closeMenu() {
            this.showMobileMenu = false;
            this.zonePreSelected = null;
        },
        async getSeguridad() {
            try {
                const response = await httpFunc("/generic/genericDS/Seguridad:Get_Seguridad", {});
                const variables = response.data;

                if (Array.isArray(variables) && variables.length > 0 && Array.isArray(variables[0]) && variables[0].length > 0) {
                    const data = variables[0][0];
                    if (typeof data.valor === "string") {
                        try {
                            data.valor = JSON.parse(data.valor);
                        } catch (error) {
                            console.log("Error al parsear JSON de valor:", error);
                            return;
                        }
                    }
                    return {
                        minLength: data.valor?.minLength,
                        minNumbers: data.valor?.minNumbers,
                        minSpecialChars: data.valor?.minSpecialChars,
                        history: data.valor?.history,
                        maxDaysChange: data.valor?.maxDaysChange
                    };
                } else {
                    console.log("No se encontraron datos en Seguridad:Get_Seguridad");
                }
            } catch (error) {
                console.log("Error al obtener datos de Seguridad:Get_Seguridad:", error);
            }
        },
        async getPreferences(nombre, oneresult) {
            try {
                if (!GlobalVariables.username)
                    throw "No username";
                let preferences = {},
                    params = { usuario: GlobalVariables.username };
                nombre && (params['nombre'] = nombre);
                let data = (await httpFunc("/generic/genericDT/Usuarios:Get_Preferencias", params)).data;
                if (data && nombre && oneresult && !nombre.includes(','))
                    return data[0] ? data[0].valor : null;
                data.forEach(p => preferences[p.nombre] = p.valor);
                return preferences;
            }
            catch (e) {
                console.log("Error al obtener preferencias de usuario:", e);
                return {};
            }
        },
        async setPreferences(nombre, valor, nuevo) {
            let data = null;
            try {
                if (!GlobalVariables.username)
                    throw "No username";
                data = (await httpFunc(`/generic/genericST/Usuarios:${nuevo ? 'Ins' : 'Upd'}_Preferencias`,
                    { usuario: GlobalVariables.username, nombre, valor }));
                if (data.data != 'OK') throw data.errorMessage || data.data;
                else return 'OK';
            }
            catch (e) {
                console.log("Error al actualizar preferencias de usuario:", e);
                return e;
            }
        }
    }
};
/****************************************************************************************************************************************/
/******************************************************* SCRIPT LOADING FUNCTIONS *******************************************************/
/****************************************************************************************************************************************/
// Creates de VueJs instance
initVueInstance();
async function initVueInstance() {
    var moduleMap = await import("./indexConfig.js");
    GlobalVariables.modules = moduleMap;
    mainVue = createApp(mainVue);
    mainVue.mount("#indexMainDiv");
}
/****************************************************************************************************************************************/
/******************************************************* COMMON FUNCTIONS ***************************************************************/
/****************************************************************************************************************************************/
function showProgress() {
    document.getElementById("divProcess").style.display = "block";
    return false;
}
function hideProgress() {
    document.getElementById("divProcess").style.display = "none";
    return false;
}
function showMessage(msg) {
    if (msg.indexOf("Error") == 0)
        document.getElementById("lbMessage").style.color = "red";
    else document.getElementById("lbMessage").style.color = "#0097AE";

    document.getElementById("lbMessage").innerText = msg;
    document.getElementById("divMessage").style.display = "block";
    document.getElementById("btAccept").focus();
    return false;
}
function hideMessage() {
    document.getElementById("divMessage").style.display = "none";
    hideProgress();
    return false;
}
function showConfirm(msg, okCallback, cancelCallback, event, textOk, textCancel) {
    document.getElementById("divConfirm").style.display = "block";
    document.getElementById("lbConfirmMessage").innerHTML = msg;
    var confirm = document.getElementById("btConfirmAccept");
    var cancel = document.getElementById("btConfirmCancel");
    confirm.onclick = function () {
        if (okCallback != null)
            okCallback(event);
        document.getElementById("divConfirm").style.display = "none";
    };
    cancel.onclick = function () {
        if (cancelCallback != null)
            cancelCallback(event);
        document.getElementById("divConfirm").style.display = "none";
    };
    document.getElementById("btXConfirmCancel").onclick = function () {
        if (cancelCallback != null)
            cancelCallback(event);
        document.getElementById("divConfirm").style.display = "none";
    };
    confirm.innerText = textOk != null ? textOk : "SI";
    cancel.innerText = textCancel != null ? textCancel : "NO";
    document.getElementById("btConfirmAccept").focus();

    return false;
}
function showMessageVue(data) {
    if (data.errorMessage != null)
        showMessage(data.errorMessage);
    else if (data.d != null)
        showMessage(data.d);
    else if (data.Message != null)
        showMessage(data.Message);
    else if (data.message != null)
        showMessage(data.message);
    else if (typeof data.message == "string")
        showMessage(data.message);
    else if (typeof data == "string")
        showMessage(data);
    else
        console.log(data);
    hideProgress();
}
function formatoMoneda(val) {
    var ret = "", n = 0;
    if (typeof val == "string") {
        if (val == "") return "-";
        val = parseFloat(val);
    }

    val = Math.round(val) + "";
    for (var i = val.length - 1; i >= 0; i--) {
        ret = val[i] + ret;
        n++;
        if (n % 3 == 0 && i > 0)
            ret = "." + ret;
    }
    return "$" + ret;

};
/****************************************************************************************************************************************/
/****************************************************************************************************************************************/
/****************************************************************************************************************************************/