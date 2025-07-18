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
async function httpFunc(path, data, getID = false) {
    var resp = await axios.post(path, data);
    if (resp.status == 200) {
        if(path.includes('/genericST/')){ 
            operacion = path.split(':')[1];
            if (operacion.includes('Upd') || operacion.includes('Ins') || operacion.includes('Del')){
                registro = {
                    operacion,
                    datos: JSON.stringify(data),
                    username: GlobalVariables.username
                };
                if(resp.data.isError || !resp.data.data.startsWith('OK')) {
                    let err = resp.data.errorMessage || resp.data.data || '';
                    if (err instanceof Array || err instanceof Object) err = JSON.stringify(err);
                    registro.error = err.substr(0, 255);
                }
                let res = operacion.includes('Ins') && resp.data.data && resp.data.data.split('-')[1] ? resp.data.data.split('-')[1] : null;
                if (res) {
                    resp.data.data = 'OK';
                    let datos = {...data};
                    datos[res.split(':')[0]] = res.split(':')[1];
                    getID && (resp.data.id = res.split(':')[1]);
                    registro.datos = JSON.stringify(datos);
                }
                await axios.post('/generic/genericST/Auditoria:Ins_Auditoria', registro);
            }
        }
        
        return resp.data;
    }
    console.log(resp);
    if (resp.status == 401) window.location.href = '/login.html';
    throw new Error({ message: resp.statusText, path: path, data: data });
}