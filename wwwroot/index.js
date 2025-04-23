/****************************************************************************************************************************************/
/************************************************* AXIOS ********************************************************************************/
/****************************************************************************************************************************************/
var AxiosConfig = {
    defaultUrl: null,
    defaultDB: null,
    version: null
};
var AxiosMethods = {
    loginMethod: null,
    autoErrorFunction: null
};

var AxiosConst = {
    GENERIC_DT: "genericDT",
    GENERIC_DS: "genericDS",
    GENERIC_ST: "genericST",
    GENERIC_DO: "genericDO",
    EXPORT_DATA: "exportData",
    EXPORT_DATA_SP: "exportDataSP",
    EXECUTE_SP: "executeSP"
}
axios.defaults.withCredentials = true;
axios.defaults.maxRedirects = true;
axios.defaults.validateStatus = function (status) { return true; };
async function httpFunc(path, data) {
    var resp = await axios.post(path, data);
    if (resp.status == 200)
        return resp.data;
    console.log(resp);
    //if (resp.status == 401)
    //if (resp.status == 403) 
    throw new Error({ message: resp.statusText, path: path, data: data });
}
/****************************************************************************************************************************************/
/************************************************* VUEJS ********************************************************************************/
/****************************************************************************************************************************************/
const { createApp } = Vue;
var GlobalVariables = {
    username: null,
    roles: null,
    loadModule: null,
    modules: null,
    ruta: null
};
const mainDivId = "#mainContentDiv";
var vm = null, mainVue = null;
var indexMainDiv = document.getElementById("mainContentDiv");
mainVue = {
    data() {
        return {
            moduleSelected: null,
            loginData: { user: "", roles: [], debug: false },
            modules: null,
            showMobileMenu: true,
            showModuleMenu: false,
            mostrarMenu: false,
            modules: null,
            zones: null,
            zoneSelected: null,
            zonePreSelected: null,
            categories: null,
            categorySelected: null,
            
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
        var data = await httpFunc("/auth/getUserProfile", {});
        this.loginData = data;
        this.modules = GlobalVariables.modules["modules"];
        this.zones = GlobalVariables.modules["zones"];
        GlobalVariables.roles = data.roles;
        GlobalVariables.username = data.user;
        GlobalVariables.loadModule = this.loadModule;
        GlobalVariables.ruta = localStorage.getItem('ruta');
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
        hideProgress();
        window.onpopstate = function (e) {
            if (e.state != null && e.state.moduleName != null)
                this.loadModule(e.state.moduleName);
        }.bind(this);
    },
    methods: {
        async loadModule(name, inputParameter) {
            if (inputParameter == null && this.modules[name] != null && this.modules[name].inputParameter != null)
                inputParameter = this.modules[name].inputParameter;
            if (this.modules[name] === this.moduleSelected) {
                if (inputParameter != null) {
                    inputParameter.moduleAreadyLoaded = true;
                    vm.inputParameter = inputParameter;
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
                this.moduleSelected.moduleObj = await import(this.moduleSelected.jsUrl);
                this.moduleSelected.moduleObj = this.moduleSelected.moduleObj.default;
            }
            if (this.moduleSelected.moduleObj.template == null || this.moduleSelected.moduleObj.template == "")
                this.moduleSelected.moduleObj.template = await (await fetch(this.moduleSelected.templateUrl)).text();
            this.zoneSelected = this.zones[this.moduleSelected["zone"]];
            if(this.zoneSelected != null)
                this.categorySelected = this.zoneSelected.categories.find(function (item) { return this.moduleSelected["category"] == item["key"] }.bind(this));
            this.loadVueModule(inputParameter);

            if(!GlobalVariables.ruta.includes(name)){
                GlobalVariables.ruta = GlobalVariables.ruta + " / " + name;
                localStorage.setItem('ruta', GlobalVariables.ruta);
            }
        },
        loadVueModule(inputParameter) {
            document.getElementById("indexMenuDiv").style.display = "none";

            delete this.moduleSelected.moduleObj.data.inputParameter;
            if (inputParameter != null)
                this.moduleSelected.moduleObj.data.inputParameter = inputParameter;
            vm = createApp(this.moduleSelected.moduleObj);
            vm.mount(mainDivId);
            hideProgress();
            var url = window.location.href;
            if (url.indexOf("?") > 0)
                url = url.substring(0, url.indexOf("?"))
            url += "?loc=" + this.moduleSelected.moduleName;
            window.history.pushState({ moduleName: this.moduleSelected.moduleName }, this.moduleSelected.title, url);
        },
        isActiveModule(name) {
            return this.modules[name] == this.moduleSelected || (this.moduleSelected == null && name == "Index");
        },
        checkAcces(name) {
            if (name == "Index" || this.modules[name].allow.indexOf("*") >= 0)
                return true;
            for (var i = 0; i < this.loginData.roles.length; i++) {
                if (this.modules[name].allow.indexOf(this.loginData.roles[i]) >= 0)
                    return true;
            }
            return false;
        },
        handleClick(item) {
            if (item.isLogOut) {
                this.logOut();
            } else {
                this.openZone(item);
            }
        },
        logOut() {
            window.location = "/login.html";
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
    else document.getElementById("lbMessage").style.color = "black";

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
/****************************************************************************************************************************************/
/****************************************************************************************************************************************/
/****************************************************************************************************************************************/