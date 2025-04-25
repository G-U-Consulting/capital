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