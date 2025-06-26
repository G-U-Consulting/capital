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
            day: {},
            hitos: [],
            hitoPro: false,
            modal: null,
        };
    },
    async mounted() {
        this.proyecto = await GlobalVariables.miniModuleCallback("SalaCalendario", null);
        this.setMainMode('SalaCalendario');
        await this.loadData();
        this.setToday();
        await this.loadViewMode();
        this.modal = document.getElementById('modalOverlay');
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async loadData() {
            showProgress();
            let [salas, hitos] = (await httpFunc("/generic/genericDS/Proyectos:Get_Hito",
                { id_sala: this.proyecto.id_sala_venta, id_proyecto: this.proyecto.id_proyecto })).data;
            if (salas.length) this.sala = salas[0];
            this.hitos = hitos;
            hideProgress();
        },
        async loadViewMode() {
            showProgress();
            let vm = await GlobalVariables.getPreferences('mesesCalendario', true);
            if (!vm) await GlobalVariables.setPreferences('mesesCalendario', 'm6', true);
            await this.updateViewMode(vm || 'm6');
            hideProgress();
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
                    isSelected: false,
                    isHoliday: false,
                    events: [],
                    date: fecha
                });
            }
            for (let i = 1; i <= currentMonthDays; i++) {
                const fecha = new Date(year, month, i);
                const day = {
                    weekDay: (fecha.getDay() + 6) % 7,
                    monthDay: i,
                    currentMonth: true,
                    month: fecha.getMonth(),
                    localeDate: fecha.toLocaleDateString(),
                    isToday: this.equalsDate(fecha, today),
                    isSelected: this.equalsDate(fecha, this.selDate),
                    isHoliday: false,
                    events: [],
                    date: fecha
                }
                daysView.push(day);
                if (day.isSelected) this.day = day;
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
                    isSelected: false,
                    isHoliday: false,
                    events: [],
                    date: fecha
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
            this.loadEvents();
        },
        async updateViewMode(mode) {
            let upd = this.viewMode.class;
            if (mode != this.viewMode.class) {
                let option = this.optionMode.find(o => o.class == mode);
                option && (this.viewMode = option);
                this.setViewMonths();
                upd && await GlobalVariables.setPreferences('mesesCalendario', mode || 'm6');
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
            this.day = day;
        },
        isToday() {
            const today = new Date();
            return this.equalsDate(this.selDate, today);
        },
        openModal(mode) {
            this.mode = mode;
            if (mode == 1) {
                this.hito = { hora: '00:00', color: '#006ec9' };
                this.hitoPro = false;
            }
            this.modal && (this.modal.style.display = 'flex');
        },
        closeModal(e) {
            if (this.modal && e.target === this.modal)
                this.modal.style.display = 'none';
        },
        async onSave() {
            showProgress();
            this.hito.fecha = `${this.selDate.getFullYear()}-${this.selDate.getMonth() + 1}-${this.selDate.getDate()} ${this.hito.hora}`;
            if (this.hitoPro) this.hito.id_proyecto = this.proyecto.id_proyecto;
            else delete this.hito.id_proyecto;
            let res = await httpFunc(`/generic/genericST/Proyectos:${this.mode == 1 ? 'Ins' : 'Upd'}_Hito`,
                { ...this.hito, id_sala: this.sala.id_sala_venta });
            if (res.data !== 'OK') {
                console.error(res);
                showMessage('Error: ' + (res.errorMessage || res.data));
            }
            await this.loadData();
            this.loadEvents(this.day);
            this.modal.style.display = 'none';
            hideProgress();
        },
        onCancel() {
            this.hito = {};
            if (this.mode == 1) this.modal.style.display = 'none';
            else this.mode = 3;
        },
        async toggleHoliday() {
            showProgress();
            if (this.day.isHoliday) {
                let event = this.day.events.find(e => e.festivo === '1');
                if (event && event.id_hito) {
                    let res = await httpFunc("/generic/genericST/Proyectos:Del_Hito", { id_hito: event.id_hito });
                    if (res.data !== 'OK') {
                        console.error(res);
                        showMessage('Error: ' + (res.errorMessage || res.data));
                    } else {
                        await this.loadData();
                        this.loadEvents(this.day);
                    }
                }
            } else {
                this.hito = {
                    fecha: `${this.selDate.getFullYear()}-${this.selDate.getMonth() + 1}-${this.selDate.getDate()} 00:00`,
                    color: '#c80000', titulo: `Festivo ${this.selDate.toLocaleDateString()}`, festivo: '1'
                };
                let res = await httpFunc("/generic/genericST/Proyectos:Ins_Hito", { ...this.hito, id_sala: this.sala.id_sala_venta, festivo: '1' });
                if (res.data !== 'OK') {
                    console.error(res);
                    showMessage('Error: ' + (res.errorMessage || res.data));
                } else {
                    await this.loadData();
                    this.loadEvents(this.day);
                }
            }
            hideProgress();
        },
        loadEvents(day) {
            if (day) {
                day['events'] = [...this.hitos.filter(h => this.equalsDate(new Date(h.fecha), day.date))];
                if (day.events.some(e => e.festivo === '1')) day.isHoliday = true;
                else day.isHoliday = false;
            }
            else {
                let temp = [];
                this.hitos.forEach(h => {
                    let day = null;
                    const fecha = new Date(h.fecha),
                        month = this.viewMonths[this.nameMonths[fecha.getMonth()]];
                    if (month && fecha.getFullYear() == this.viewMode.year)
                        day = month.days.find(d => d.monthDay === fecha.getDate() && d.currentMonth);
                    if (day && month && fecha.getFullYear() == this.viewMode.year) {
                        if (temp.includes(day)) {
                            day.events = [];
                            temp.push(day);
                        }
                        day['events'].push(h);
                        h.festivo == '1' && (day.isHoliday = true);
                    }
                });
            }
        },
        selEvent(e) {
            this.hito = { ...e, hora: this.formatDatetime(e.fecha, 'vtime') };
            this.hitoPro = e.id_proyecto ? true : false;
            this.mode = 2;
        },
        async reqDeleteEvent(e) {
            showConfirm(`Se eliminará el hito <b>${e.titulo}</b> permanentemente.`, this.delEvent, null, e);
        },
        async delEvent(e) {
            if (e && e.id_hito) {
                let res = await httpFunc("/generic/genericST/Proyectos:Del_Hito", e);
                if (res.data !== 'OK') {
                    console.error(res);
                    showMessage('Error: ' + (res.errorMessage || res.data));
                } else {
                    await this.loadData();
                    this.loadEvents(this.day);
                    this.modal.style.display = 'none';
                }
            }
        },
        formatDatetime(text, type = 'datetime', _date) {
            const date = _date || (text ? new Date(text) : new Date());
            let day = date.getDate().toString().padStart(2, '0'),
                month = (date.getMonth() + 1).toString().padStart(2, '0'),
                year = date.getFullYear(),
                hour = (date.getHours() % 12 || 12).toString().padStart(2, '0'),
                minutes = date.getMinutes().toString().padStart(2, '0'),
                meridian = date.getHours() >= 12 ? 'p. m.' : 'a. m.';
            if (type === 'date')
                return `${day}/${month}/${year}`;
            if (type === 'time')
                return `${hour}:${minutes} ${meridian}`;
            if (type === 'vtime')
                return `${date.getHours().toString().padStart(2, '0')}:${minutes}`
            return `${day}/${month}/${year} ${hour}:${minutes} ${meridian}`;
        },
        equalsDate(f1, f2) {
            return f1 && f2 && f1.getDate() === f2.getDate() && f1.getMonth() === f2.getMonth() && f1.getFullYear() === f2.getFullYear();
        }
    }
}