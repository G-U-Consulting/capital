export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            cargos: [],
            ruta: [],
            showList: true,
            /// Mis Tareas
            proyectos: [],
            tareas: [],
            prioridades: [],
            estados: [],
            proyecto: {},
            selPro: {},
            usuario: {},
            tarea: {},

            filtros: {
                tareas: { activa: '1', id_proyecto: '', id_estado: '' }
            },

            editNewRow: false,
            selRow: null,
            enableEdit: false,
            orden: "dead-prio",

            //Mi Calendario
            modalmode: 0,
            sala: {},
            hito: {},
            nameDays: ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"],
            nameMonths: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
            viewMode: {},
            optionMode: [
                { name: "1W", months: 3, initMonth: 0, year: new Date().getFullYear(), class: "s1" },
                { name: "1M", months: 3, initMonth: 0, year: new Date().getFullYear(), class: "m1" },
                { name: "6M", months: 6, initMonth: 0, year: new Date().getFullYear(), class: "m6" },
                { name: "12M", months: 12, initMonth: 0, year: new Date().getFullYear(), class: "m12" }
            ],
            frecuencias: [
                { name: '1 vez', value: null, checked: true },
                { name: 'Diario', value: 'd', checked: false },
                { name: 'Semanal', value: 'w', checked: false },
                { name: 'Mensual', value: 'm', checked: false },
            ],
            selDate: null,
            viewMonths: {},
            currentDay: {},
            hitos: [],
            h_cargos: [],
            tableDays: [],
            salas: [],
            asignaciones: [],
            modal: null,
            currentWeek: -1,
            showMode: 'event',

            eventType: 'Sala',
            id_obj: null,
            sala_filter: null,
            pro_filter: null,
            filter_sort: 'dias',

            tooltipVisible: false,
            tooltipX: 0,
            tooltipY: 0,
            tooltipMsg: '',

            editTask: false,
        }
    },
    async mounted() {
        this.setMainMode(0);
    },
    methods: {
        setRuta() {
            let subpath = [this.getMainPath()];
            this.ruta = [{
                text: 'ZU', action: () =>
                    GlobalVariables.zonaActual && GlobalVariables.showModules(GlobalVariables.zonaActual)
            }, { text: 'Agenda', action: () => { this.mode = 0; this.setMode(0) } }];
            this.ruta = [...this.ruta, ...subpath];
        },
        async setMainMode(mode) {
            this.mode = mode;
            this.setRuta();
            if (mode == 0) await this.loadDataTareas();
            if (mode == 1) await this.loadCalendarData();
        },
        getMainPath() {
            const labels = ["Mis Tareas", "Mi Calendario"];
            return {
                text: labels[this.mode],
                action: () => this.setMode(this.mode)
            };
        },
        setMode(mode) {
            this.mode = mode;
            this.setRuta();
        },
        //////////////// Mis Tareas ////////////////
        async loadDataTareas() {
            showProgress();
            let usuarios = [];
            [usuarios, this.proyectos, this.tareas, this.prioridades, this.estados] =
                (await httpFunc("/generic/genericDS/Agenda:Get_Tarea", { username: GlobalVariables.username })).data;
            usuarios.length && (this.usuario = usuarios[0]);
            this.onChangePro();
            hideProgress();
        },
        onChangePro() {
            this.cancel();
        },
        onChangeActive(e) {
            e.target.checked ? this.filtros.tareas.activa = '1' : delete this.filtros.tareas.activa;
            this.cancel();
        },
        newRow() {
            this.editNewRow = !this.editNewRow;
            this.tarea = { alta: this.formatDatetime(null, 'bdate') };
            this.selRow = null;
        },
        async onSelect(t, i) {
            if (this.enableEdit && this.selRow != null && this.selRow != i) await this.onSave();
            if (this.selRow != i && t.id_estado != '4') {
                this.tarea = { ...t };
                this.editNewRow = false;
                this.enableEdit = false;
                this.selRow = i;
            }
        },
        async onSave() {
            if (this.enableEdit || this.editNewRow) {
                showProgress();
                if (!this.tarea.id_proyecto) delete this.tarea.id_proyecto;
                let res = await httpFunc(`/generic/genericST/Agenda:${this.selRow != null ? 'Upd' : 'Ins'}_Tarea`,
                    { ...this.tarea, id_usuario: this.usuario.id_usuario });
                if (res.data === 'OK') {
                    this.tareas =
                        (await httpFunc("/generic/genericDT/Agenda:Get_Tareas", { id_usuario: this.usuario.id_usuario })).data;
                    this.tarea = {};
                    this.cancel();
                } else {
                    let err = res.errorMessage || res.data;
                    console.error(res);
                    showMessage('Error: ' + (err.includes('chk_fecha_alta_mayor')
                        ? 'La fecha deadline debe ser mayor a la fecha de alta' : err));
                }
                hideProgress();
            }
        },
        async onDelete(tarea) {
            showProgress();
            let res = await httpFunc(`/generic/genericST/Agenda:Del_Tarea`, tarea);
            if (res.data === 'OK') {
                this.tareas =
                    (await httpFunc("/generic/genericDT/Agenda:Get_Tareas", { id_usuario: this.usuario.id_usuario })).data;
                this.tarea = {};
                this.cancel();
            } else {
                console.error(res);
                showMessage('Error: ' + (res.errorMessage || res.data));
            }
            hideProgress();
        },
        async reqDelete() {
            if (!this.editNewRow)
                showConfirm(`Se eliminará la tarea <b>${this.tarea.descripcion}</b> permanentemente.`, this.onDelete, null, this.tarea);
        },
        cancel() {
            this.editNewRow = false;
            this.selRow = null;
            this.enableEdit = false;
        },

        //////////////// Mi Calendario ////////////////
        async loadCalendarData(holdDay) {
            showProgress();
            let data = (await httpFunc("/generic/genericDS/Agenda:Get_Agenda", { username: GlobalVariables.username })).data;
            [this.salas, this.proyectos, this.hitos,
            this.cargos, this.asignaciones, this.tareas] = data;
            hideProgress();
            if (!holdDay) this.setToday();
            await this.loadViewMode();
            this.modal = document.getElementById('modalOverlay');
            window.addEventListener('keyup', (e) => e.key === 'Escape' && this.closeModal({}, true));
        },
        async loadViewMode() {
            showProgress();
            let vm = await GlobalVariables.getPreferences('mesesCalendario', true);
            if (!vm) await GlobalVariables.setPreferences('mesesCalendario', 'm6', true);
            await this.updateViewMode(vm || 'm6');
            let sm = await GlobalVariables.getPreferences('verCalendario', true);
            if (!sm) await GlobalVariables.setPreferences('verCalendario', 'event', true);
            await this.setShowMode(sm || 'event');
            hideProgress();
        },
        async loadFields() {
            this.h_cargos = (await httpFunc("/generic/genericDT/Salas:Get_HitoCargo",
                { id_hito: this.hito.id_hito })).data;
        },
        async loadChecked() {
            await this.loadFields();
            this.cargos = this.cargos.map(c => (
                { ...c, checked: !!this.h_cargos.filter(hc => hc.id_cargo == c.id_cargo).length }
            ));
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
                    weekCount: 0,
                    monthDay: fecha.getDate(),
                    currentMonth: false,
                    viewMonth: month,
                    month: fecha.getMonth(),
                    localeDate: fecha.toLocaleDateString(),
                    isToday: false,
                    isSelected: false,
                    isHoliday: false,
                    isRestday: false,
                    events: [],
                    tasks: [],
                    progState: null,
                    stateColor: null,
                    date: fecha
                });
            }
            for (let i = 1; i <= currentMonthDays; i++) {
                const fecha = new Date(year, month, i);
                const day = {
                    weekDay: (fecha.getDay() + 6) % 7,
                    weekCount: Math.floor((i + firstWeekday - 1) / 7),
                    monthDay: i,
                    currentMonth: true,
                    viewMonth: month,
                    month: fecha.getMonth(),
                    localeDate: fecha.toLocaleDateString(),
                    isToday: this.equalsDate(fecha, today),
                    isSelected: this.equalsDate(fecha, this.selDate),
                    isHoliday: false,
                    isRestday: false,
                    events: [],
                    tasks: [],
                    progState: null,
                    stateColor: null,
                    date: fecha
                }
                daysView.push(day);
                if (day.isSelected) this.currentDay = day;
            }

            let i = 1;
            while (daysView.length < 42) {
                const fecha = new Date(year, month + 1, i);
                daysView.push({
                    weekDay: (fecha.getDay() + 6) % 7,
                    weekCount: Math.floor((currentMonthDays + firstWeekday + i - 1) / 7),
                    monthDay: i,
                    currentMonth: false,
                    viewMonth: month,
                    month: fecha.getMonth(),
                    localeDate: fecha.toLocaleDateString(),
                    isToday: false,
                    isSelected: false,
                    isHoliday: false,
                    isRestday: false,
                    events: [],
                    tasks: [],
                    progState: null,
                    stateColor: null,
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
            if (this.viewMode.class == 'm1' || this.viewMode.class == 's1') this.setTableDetails(current);
        },
        async setTableDetails(date) {
            let days = [];
            if (this.viewMode.class == 'm1')
                days = this.viewMonths[this.nameMonths[date.getMonth()]].days.filter(d => d.currentMonth);
            if (this.viewMode.class == 's1')
                days = this.viewMonths[this.nameMonths[date.getMonth()]].days.filter(d => d.weekCount === this.currentDay.weekCount);
            if (this.showMode == 'event') {
                let events = [];
                days.forEach(day => {
                    if (day.events.length - (day.isHoliday ? 1 : 0))
                        day.events.forEach(e => e.festivo != '1' && events.push(
                            {
                                day,
                                e_titulo: e.titulo,
                                e_categorias: e.categorias ? e.categorias.split(',') : [],
                                e_tipo: e.id_proyecto ? 'Proyecto' : 'Sala',
                                e_hora: this.formatDatetime(e.fecha, 'time'),
                                color: e.color + '50',
                                event: e
                            }));
                    else events.push({
                        day,
                        e_titulo: day.isHoliday ? 'Festivo' : '-',
                        e_tipo: '-',
                        e_hora: '-',
                        e_categorias: [],
                        color: day.isHoliday ? '#c8000020' : (day.stateColor + '20')
                    });
                });
                await Promise.resolve();
                this.tableDays = events;
            }
            if (this.showMode == 'task') {
                let tasks = [];
                days.forEach(day => {
                    if (day.tasks.length)
                        day.tasks.forEach(t => tasks.push({ day, ...t, color: t.color + '50' }));
                    else if (this.filter_sort == 'dias') tasks.push({
                        day,
                        proyecto: '-',
                        descripcion: day.isHoliday ? 'Festivo' : '-',
                        color: day.isHoliday ? '#c8000020' : (day.stateColor + '20')
                    });
                });
                await Promise.resolve();
                this.tableDays = tasks.sort((a, b) => {
                    if (this.filter_sort == 'deadline')
                        return new Date(a.deadline + ' 00:00').getTime() - new Date(b.deadline + ' 00:00').getTime();
                    if (this.filter_sort == 'prioridad')
                        return parseInt(b.orden_p) - parseInt(a.orden_p);
                });
            }
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
        async setShowMode(mode) {
            if (this.showMode != mode) {
                this.showMode = mode;
                this.setViewMonths();
                await GlobalVariables.setPreferences('verCalendario', mode || 'event');
            }
            if (mode == 'task') this.sala_filter = null;
        },
        setDate(dir) {
            let date = this.selDate, m = date.getMonth(), y = date.getFullYear();
            if (this.viewMode.class !== 's1') {
                let fact = this.viewMode.months;
                if (this.viewMode.class == 'm1') fact = 1;
                date.setMonth(date.getMonth() + (fact * dir));
                if (Math.abs((date.getFullYear() - y) * 12 + (date.getMonth() - m)) !== fact)
                    date.setDate(0);
            }
            else {
                date.setDate(date.getDate() + (7 * dir));
            }
            this.setViewMonths();
        },
        setToday() {
            this.selDate = new Date();
            this.setViewMonths();
        },
        onDblClickDay(day) {
            if (this.showMode == 'event')
                day.currentMonth && day.events && day.events.filter(e => e.festivo != '1').length && this.openModal(3)
            if (this.showMode == 'task')
                day.currentMonth && day.tasks && day.tasks.length && this.openModal(4);
        },
        async selDay(day, scroll) {
            const selectedMonthKey = Object.keys(this.viewMonths).find(key => this.viewMonths[key].selected);
            if (selectedMonthKey) {
                const selectedDay = this.viewMonths[selectedMonthKey].days.find(d => d.isSelected);
                if (selectedDay) selectedDay.isSelected = false;
                this.viewMonths[selectedMonthKey].selected = false;
            }
            day.isSelected = true;
            this.selDate = day.date;
            this.viewMonths[this.nameMonths[day.viewMonth]].selected = true;
            this.currentDay = day;
            await this.setTableDetails(this.selDate);
            if (scroll)
                document.getElementById(`tab-m${day.month}-d${day.monthDay}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        },
        isToday() {
            const today = new Date();
            return this.equalsDate(this.selDate, today);
        },
        cleanType() {
            if (this.eventType === 'Torre')
                delete this.hito.id_unidad;
            if (this.eventType === 'Proyecto') {
                delete this.hito.id_unidad;
                delete this.hito.id_torre;
            }
            if (this.eventType === 'Sala') {
                delete this.hito.id_unidad;
                delete this.hito.id_torre;
                delete this.hito.id_proyecto;
            }
        },
        async openModal(mode, e) {
            let fre = this.frecuencias[0];
            if (mode == 1) {
                this.hito = { hora: '00:00', color: '#006ec9' };
                this.id_obj = null;
                this.eventType = 'Sala';
                this.onChangeFreq(fre);
                this.cargos.forEach(c => c.checked = false);
            }
            if (mode == 2 && e) {
                if (e.id_unidad) this.eventType = 'Inmueble';
                else if (e.id_torre) this.eventType = 'Torre';
                else if (e.id_proyecto) this.eventType = 'Proyecto';
                else this.eventType = 'Sala';
                this.hito = { ...e, hora: this.formatDatetime(e.fecha, 'vtime') };
                this.onChangeFreq(this.frecuencias.find(f => f.value == this.hito.frecuencia) || fre);
                showProgress();
                await this.loadChecked();
                hideProgress();
                console.log(this.hito);
            }
            if (mode == 4) this.editTask = false;
            this.modalmode = mode;
            this.modal && (this.modal.style.display = 'flex');
        },
        closeModal(e, forzar) {
            if (this.modal && (e.target === this.modal || forzar))
                this.modal.style.display = 'none';
        },
        onCancel() {
            this.hito = {};
            if (this.modalmode == 1) this.modal.style.display = 'none';
            else this.modalmode = 3;
        },
        setRecurringEvents(e) {
            if (this.viewMode.months >= 0 && this.viewMode.initMonth >= 0 && e.frecuencia) {
                let endMonth = this.viewMonths[this.nameMonths[this.viewMode.initMonth + this.viewMode.months - 1]],
                    lastday = endMonth.days[endMonth.days.length - 1].date,
                    lim = e.limite ? new Date(`${e.limite} 23:59:59`) : false, fecha = new Date(e.fecha), d = 0, m = 0, o = fecha.getDate();
                lastday.setDate(lastday.getDate() + 1);
                if (lastday < lim || !lim) lim = lastday;
                if (e.frecuencia == 'd') d = 1;
                if (e.frecuencia == 'w') d = 7;
                if (e.frecuencia == 'm') m = 1;
                let i = 0;
                while (fecha <= lim) {
                    let month = this.viewMonths[this.nameMonths[fecha.getMonth()]];
                    if (month) {
                        let day = month.days.find(d => d.currentMonth && d.monthDay == fecha.getDate() && this.viewMode.year == fecha.getFullYear());
                        if (day && day.events) day.events.push(e);
                    }
                    fecha.setDate(fecha.getDate() + d);
                    if (m) {
                        let m1 = fecha.getMonth();
                        fecha.setMonth(m1 + m);
                        if (fecha.getMonth() - m1 > m) fecha.setDate(0);
                        else fecha.setDate(o);
                    }
                    i++;
                }
            }
        },
        loadEvent(month, h) {
            const fecha = new Date(h.fecha);
            let day = null;
            if (month && fecha.getFullYear() == this.viewMode.year)
                day = month.days.find(d => (d.monthDay === fecha.getDate() && d.month === fecha.getMonth() && (d.currentMonth || this.viewMode.class === 's1')));
            if (day && month && fecha.getFullYear() == this.viewMode.year && !h.frecuencia) {
                day.events.push(h);
                h.festivo == '1' && (day.isHoliday = true);
            }
        },
        loadEvents(day) {
            if (day) {
                day['events'] = [...this.hitos.filter(h => this.equalsDate(new Date(h.fecha), day.date))];
                if (day.events.some(e => e.festivo === '1')) day.isHoliday = true;
                else day.isHoliday = false;
            }
            else {
                this.hitos.forEach(h => {
                    if ((this.showMode == 'event' && ((!this.sala_filter || h.id_sala_venta == this.sala_filter)
                        && (!this.pro_filter || h.id_proyecto == this.pro_filter))) || h.festivo === '1') {
                        const fecha = new Date(h.fecha),
                            p_month = this.viewMonths[this.nameMonths[fecha.getMonth() - 1]],
                            month = this.viewMonths[this.nameMonths[fecha.getMonth()]],
                            n_month = this.viewMonths[this.nameMonths[fecha.getMonth() + 1]];
                        this.loadEvent(p_month, h);
                        this.loadEvent(month, h);
                        this.loadEvent(n_month, h);
                        h.frecuencia && this.setRecurringEvents(h);
                    }
                });
                this.asignaciones.forEach(a => {
                    let day = this.findDay(new Date(a.fecha + ' 00:00'));
                    if (day) {
                        day.progState = a.estado;
                        day.stateColor = a.color;
                        if (a.is_laboral == '0') day.isRestday = true;
                    }
                });
                this.showMode == 'task' && this.tareas.forEach(t => {
                    if ((!this.pro_filter || t.id_proyecto == this.pro_filter) && t.activa == '1') {
                        let day = this.findDay(new Date(t.deadline + ' 00:00'));
                        day && !day.tasks.includes(t) && day.tasks.push(t);
                    }
                })
            }
            this.setTableDetails(this.selDate);
        },
        findDay(date) {
            let month = this.viewMonths[this.nameMonths[date.getMonth()]];
            if (month)
                return month.days.find(d => (d.monthDay === date.getDate() && d.month === date.getMonth()
                    && this.viewMode.year == date.getFullYear() && d.currentMonth));
        },
        selEvent(e) {
            this.hito = { ...e, hora: this.formatDatetime(e.fecha, 'vtime') };
            this.openModal(2, e);
        },
        onChangeFreq(fre) {
            this.frecuencias.forEach(f => f.checked = false);
            fre.checked = true;
            if (fre.value) this.hito.frecuencia = fre.value;
            else {
                delete this.hito.limite;
                delete this.hito.frecuencia;
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
            if (type === 'bdate')
                return `${year}-${month}-${day}`;
            if (type === 'time')
                return `${hour}:${minutes} ${meridian}`;
            if (type === 'vtime')
                return `${date.getHours().toString().padStart(2, '0')}:${minutes}`
            return `${day}/${month}/${year} ${hour}:${minutes} ${meridian}`;
        },
        equalsDate(f1, f2) {
            return f1 && f2 && f1.getDate() === f2.getDate() && f1.getMonth() === f2.getMonth() && f1.getFullYear() === f2.getFullYear();
        },
        updateCursor(event) {
            this.tooltipX = event.clientX + 10;
            this.tooltipY = event.clientY + 10;
        },
        getMetaHito(e) {
            let text = '';
            if (!e.id_proyecto) text = e.sala_venta;
            else if (!e.id_torre) text = e.nombre_pro;
            else if (!e.id_unidad) text = `${e.nombre_pro} - ${e.torre}`;
            else if (e.id_proyecto && e.id_torre && e.id_unidad) text = `${e.nombre_pro} - ${e.torre} - ${e.unidad}`;
            return text;
        },
        async updateTarea(tarea) {
            showProgress();
            let res = await httpFunc(`/generic/genericST/Agenda:Upd_Tarea`, tarea);
            if (res.data === 'OK') {
                this.tareas = (await httpFunc("/generic/genericDT/Agenda:Get_Tareas", { id_usuario: this.usuario.id_usuario })).data;
                this.setViewMonths();
                if (!this.currentDay.tasks.length) this.closeModal({}, true);
            }
            else {
                let err = res.errorMessage || res.data;
                console.error(res);
                showMessage('Error: ' + (err.includes('chk_fecha_alta_mayor')
                    ? 'La fecha deadline debe ser mayor a la fecha de alta' : err));
            }
            hideProgress();
        },
        async exportExcel(tabla) {
            try {
                showProgress();
                let datos = this.getFilteredList(tabla);
                var archivo = (await httpFunc("/util/Json2File/excel", datos)).data;
                var formato = (await httpFunc("/util/ExcelFormater", { "file": archivo, "format": "FormatoMaestros" })).data;
                window.open("./docs/" + archivo, "_blank");
            }
            catch (e) {
                console.error(e);
            }
            hideProgress();
        },
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(String(this.filtros[tabla][key]).toLowerCase())
                    ) : []
                ).sort((a, b) => {
                    let fecha_a = new Date(a.deadline), fecha_b = new Date(b.deadline),
                        orden_a = parseInt(a.orden_p), orden_b = parseInt(b.orden_p);
                    if (this.orden == 'prio-dead') {
                        if (orden_a == orden_b) return fecha_a <= fecha_b ? -1 : 1;
                        else return orden_b - orden_a;
                    }
                    else {
                        if (a.deadline == b.deadline) return orden_b - orden_a;
                        else return fecha_a <= fecha_b ? -1 : 1;
                    }
                }) : [];
            };
        }
    }

}