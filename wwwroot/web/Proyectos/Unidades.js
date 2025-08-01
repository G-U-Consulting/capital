export default {
    data() {
        return {
            mode: 0,
            sinco: {
                companies: [],
                company: null,
                macroProjects: [],
                macroProject: null,
                projects: [],
                project: null,
                groups: []
            },
            mensaje: "Hola",
        };
    },
    async mounted() {
        this.sincoCompanies();
    },
    methods: {
        /************************************** SINCO *************************************/
        async sincoCompanies() {
            showProgress();
            var result = (await httpFunc("/api/internal/SincoGetEmpresas", {}));
            this.sinco.companies = result;
            this.mode = 1;
            hideProgress();
        },
        async sincoMacroProjects(item) {
            showProgress();
            this.sinco.company = item;
            var result = (await httpFunc("/api/internal/SincoGetMacroproyectos", item));
            this.sinco.macroProjects = result;
            this.mode = 2;
            hideProgress();
        },
        async sincoProjects(item) {
            showProgress();
            this.sinco.macroProject = item;
            var result = (await httpFunc("/api/internal/SincoGetProyectos", item));
            this.sinco.projects = result;
            this.mode = 3;
            hideProgress();
        },
        async sincoGroups(item) {
            showProgress();
            this.sinco.project = item;
            var result = (await httpFunc("/api/internal/SincoGetAgrupaciones", item));
            console.log(result);
            result.forEach(item => item["expanded"] = false);
            this.sinco.groups = result;
            this.mode = 4;
            hideProgress();
        },
        formatoMoneda(val){
            return formatoMoneda(val);
        }
    }
};
