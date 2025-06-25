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
            initDate: null,
            selectedDate: null,
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
        this.viewMode = this.optionMode[0];
        this.setToday();
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
                    isToday: false,
                    isSelected: false
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
                        fecha.getFullYear() === today.getFullYear(),
                    isSelected: fecha.getDate() === this.initDate.getDate() &&
                        fecha.getMonth() === this.initDate.getMonth() &&
                        fecha.getFullYear() === this.initDate.getFullYear()
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
                    isToday: false,
                    isSelected: false
                });
                i++;
            }

            return daysView;
        },
        setViewMonths() {
            let current = this.initDate, 
                init = Math.floor(current.getMonth() / this.viewMode.months) * this.viewMode.months;
            this.viewMode.year = current.getFullYear();
            this.viewMode.initMonth = init;
            let temp = {};
            for (let x = init; x < this.viewMode.months + init; x++) 
                temp[this.nameMonths[x]] = 
                    {
                        year: this.viewMode.year,
                        days: this.getMonthCalendar(new Date(this.viewMode.year, x, 1)),
                        selected: current.getMonth() === x
                    }
            this.viewMonths = temp;
        },
        async updateViewMode(mode) {
            if (mode != this.viewMode.class) {
                let option = this.optionMode.find(o => o.class == mode);
                option && (this.viewMode = option);
                this.setViewMonths();
                //let data = await GlobalVariables.setPreferences('vistaProyecto', mode || 'Tabla');
                //if (data == 'OK') await this.setViewMode();
            }
        },
        setDate(dir) {
            let date = this.initDate, fact = this.viewMode.months, m = date.getMonth();
            date.setMonth(date.getMonth() + (fact * dir));
            if (Math.abs(m - date.getMonth()) !== fact % 12)
                date.setDate(0);
            this.setViewMonths();
        },
        setToday() {
            this.initDate = new Date();
            this.setViewMonths();
        },
        selDay(day, m) {
            const selectedMonthKey = Object.keys(this.viewMonths).find(key => this.viewMonths[key].selected);
            if (selectedMonthKey) {
                const selectedDay = this.viewMonths[selectedMonthKey].days.find(d => d.isSelected);
                if (selectedDay) selectedDay.isSelected = false;
                this.viewMonths[selectedMonthKey].selected = false;
            }
            day.isSelected = true;
            this.initDate = new Date(this.viewMode.year, day.month, day.monthDay);
            this.viewMonths[this.nameMonths[m]].selected = true;
        }
    }
}