export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            proyecto: null,
            sala: {},
            hito: {},
            nameDays: ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"],
            nameMonths: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            viewMode: {},
            optionMode: [
                { name: "6 meses", months: 6, initMonth: 0, year: new Date().getFullYear(), class: "m6" },
                { name: "12 meses", months: 12, initMonth: 0, year: new Date().getFullYear(), class: "m12" }
            ],
            selDate: null,
            viewMonths: {},
            hitos: [],

            modal: null,
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("SalaCalendario", null);
        this.setMainMode('SalaCalendario');
        await this.loadData();
        console.log(this.getMonthCalendar);
        this.viewMode = this.optionMode[0];
        this.setToday();
        this.modal = document.getElementById('modalOverlay');
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async loadData() {
            let [salas, hitos] = (await httpFunc("/generic/genericDS/Proyectos:Get_Hito", { id_sala: this.proyecto.id_sala_venta })).data;
            if (salas.length) this.sala = salas[0];
            this.hitos = hitos;
            console.log(this.sala, this.hitos);
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
                    isSelected: fecha.getDate() === this.selDate.getDate() &&
                        fecha.getMonth() === this.selDate.getMonth() &&
                        fecha.getFullYear() === this.selDate.getFullYear()
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
            let current = this.selDate,
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
            let date = this.selDate, fact = this.viewMode.months, m = date.getMonth();
            date.setMonth(date.getMonth() + (fact * dir));
            if (Math.abs(m - date.getMonth()) !== fact % 12)
                date.setDate(0);
            this.setViewMonths();
        },
        setToday() {
            this.selDate = new Date();
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
            this.selDate = new Date(this.viewMode.year, day.month, day.monthDay);
            this.viewMonths[this.nameMonths[m]].selected = true;
        },
        isToday() {
            const today = new Date();
            return this.selDate && today.getDate() === this.selDate.getDate()
                && today.getMonth() === this.selDate.getMonth()
                && today.getFullYear() === this.selDate.getFullYear();
        },
        openModal() {
            this.hito.hora = '00:00';
            this.hito.color = '#006ec9';
            this.modal && (this.modal.style.display = 'flex');
        },
        closeModal(e) {
            if (this.modal && e.target === this.modal)
                (this.modal.style.display = 'none');
        },
        async onSave() {
            this.hito['fecha'] = `${this.selDate.getFullYear()}-${this.selDate.getMonth() + 1}-${this.selDate.getDate()} ${this.hito.hora}`;
            let res = await httpFunc("/generic/genericST/Proyectos:Ins_Hito", { ...this.hito, id_sala: this.sala.id_sala_venta });
            console.log(this.hito, res);
        }
    }
}