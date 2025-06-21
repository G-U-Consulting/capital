export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            proyecto: null,
            nameDays: ["lun","mar","mié","jue","vie","sáb","dom"],
            nameMonths: ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"],
            viewMode: {},
            optionMode: [
                { name: "6 meses", months: 6, initMonth: 0, year: new Date().getFullYear(), class: "m6" },
                { name: "12 meses", months: 12, initMonth: 0, year: new Date().getFullYear(), class: "m12" }
            ],
            viewMonths: {},
            filtros: {
                
            }
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("SalaMedios", null);
        this.setMainMode('SalaMedios');
        await this.loadData();
        console.log(this.getMonthCalendar);
        this.viewMode = this.optionMode[1];
        this.setViewMonths();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async loadData() {
            /*[this.bancos, this.factores, this.tipos_factor, this.bancos_factores] =
                (await httpFunc("/generic/genericDS/Proyectos:Get_Bancos", { id_proyecto: this.proyecto.id_proyecto })).data;
            */
        },
        getMonthCalendar(baseDate) {
            const daysView = [];
            const year = baseDate.getFullYear();
            const month = baseDate.getMonth();

            const initMonth = new Date(year, month, 1);
            const endMonth = new Date(year, month + 1, 0);

            const firstWeekday = (initMonth.getDay() + 6) % 7; // lunes = 0
            const currentMonthDays = endMonth.getDate();
            const today = new Date();

            for (let i = firstWeekday - 1; i >= 0; i--) {
                const fecha = new Date(year, month, -i);
                daysView.push({
                    weekDay: (fecha.getDay() + 6) % 7,
                    monthDay: fecha.getDate(),
                    currentMonth: false,
                    month: fecha.getMonth(),
                    localeDate: fecha.toLocaleDateString(),
                    isToday: false
                });
            }

            for (let i = 1; i <= currentMonthDays; i++) {
                const fecha = new Date(year, month, i);
                daysView.push({
                    weekDay: (fecha.getDay() + 6) % 7,
                    monthDay: i,
                    currentMonth: true,
                    month: fecha.getMonth(),
                    localeDate: fecha.toLocaleDateString(),
                    isToday: fecha.getDate() === today.getDate() &&
                        fecha.getMonth() === today.getMonth() &&
                        fecha.getFullYear() === today.getFullYear()
                });
            }

            let i = 1;
            while (daysView.length < 42) {
                const fecha = new Date(year, month + 1, i);
                daysView.push({
                    weekDay: (fecha.getDay() + 6) % 7,
                    monthDay: i,
                    currentMonth: false,
                    month: fecha.getMonth(),
                    localeDate: fecha.toLocaleDateString(),
                    isToday: false
                });
                i++;
            }

            return daysView;
        },
        setViewMonths() {
            let today = new Date(), 
                init = Math.floor(today.getMonth() / this.viewMode.months) * this.viewMode.months;
            for (let x = init; x < this.viewMode.months + init; x++) 
                this.viewMonths[this.nameMonths[x]] = 
                    {
                        year: this.viewMode.year,
                        days: this.getMonthCalendar(new Date(this.viewMode.year, x, 1)),
                        selected: today.getMonth() === x
                    }
        },
        selectMonth(n) {
            for (const key in this.viewMonths) 
                this.nameMonths[n] == key ? this.viewMonths[key].selected = true : this.viewMonths[key].selected = false;
        }
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                    ) : []
                ) : [];
            };
        },
    }
}