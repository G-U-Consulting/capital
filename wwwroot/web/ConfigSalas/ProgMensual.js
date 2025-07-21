export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            onlyActive: false,
            searchID: null,
            programaciones: [],
            usuarios: [],
            hitos: [],
            cargos: [],
            estados: [],
            nameDays: ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"],
            nameMonths: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],

            viewMode: {},
            viewMonths: {},
            filterMode: 'm',

            selUser: {},
            usuario: {},
            sala: {},
            programacion: {},

            selDate: new Date(),
            currentDay: {},

            editNewRow: false,
            selRow: null,

            filtros: {
                programaciones: { fecha: '', id_usuario: '', id_cargo: '' }
            }
        };
    },
    async mounted() {
        this.sala = await GlobalVariables.miniModuleCallback('GetSala');
        await this.loadData();
        this.setToday();
        this.viewMode = { name: "1M", months: 1, initMonth: 0, year: new Date().getFullYear(), class: "m1" };
        this.setViewMonths();
        this.fillDays();
    },
    methods: {
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async loadData(fill) {
            [this.programaciones, this.hitos, this.usuarios, this.estados, this.cargos] =
                (await httpFunc("/generic/genericDS/Salas:Get_Programacion", { id_sala: this.sala.id_sala_venta })).data;
            fill && this.fillDays();
        },
        fillDays() {
            let days = this.viewMonths[this.nameMonths[this.viewMode.initMonth]].days.filter(d => d.currentMonth);
            days.forEach(d => {
                let e = this.programaciones.some(p => this.equalsDate(d.date, new Date(p.fecha + ' 00:00')));
                if (!e) this.programaciones.push({ fecha: this.formatDatetime(null, 'bdate', d.date) });
            });
            this.programaciones.sort((a, b) => new Date(a.fecha + ' 00:00').getDate() - new Date(b.fecha + ' 00:00').getDate());
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
                    events: [],
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
                    events: [],
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
        setToday() {
            this.selDate = new Date();
            this.setViewMonths();
            this.selRow = null;
        },
        async selDay(day) {
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
            await Promise.resolve();
            let $row = document.querySelector('.tab-' + this.formatDatetime(day.date, 'bdate'));
            if ($row) {
                let index = parseInt($row.id);
                $row.scrollIntoView({ behavior: 'smooth', block: 'center' });
                this.onSelect(this.getFilteredList('programaciones')[index], index);
            } else this.selRow = null;
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
        loadEvents() {
            this.hitos.forEach(h => {
                if (!this.pro_filter || h.id_proyecto == this.pro_filter || h.festivo === '1') {
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
        },
        setDate(dir) {
            let date = this.selDate, m = date.getMonth(), y = date.getFullYear();
            date.setMonth(date.getMonth() + dir);
            if (Math.abs((date.getFullYear() - y) * 12 + (date.getMonth() - m)) !== 1)
                date.setDate(0);
            this.setViewMonths();
            this.fillDays();
            this.selRow = null;
        },
        isToday() {
            const today = new Date();
            return this.equalsDate(this.selDate, today);
        },
        equalsDate(f1, f2) {
            return f1 && f2 && f1.getDate() === f2.getDate() && f1.getMonth() === f2.getMonth() && f1.getFullYear() === f2.getFullYear();
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
            if (type === 'date-my')
                return `${this.nameMonths[date.getMonth()]} ${year}`;
            if (type === 'bdate')
                return `${year}-${month}-${day}`;
            if (type === 'time')
                return `${hour}:${minutes} ${meridian}`;
            if (type === 'vtime')
                return `${date.getHours().toString().padStart(2, '0')}:${minutes}`
            return `${day}/${month}/${year} ${hour}:${minutes} ${meridian}`;
        },
        getWeekDay(date) {
            if (date) {
                let days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
                return days[new Date(date).getDay()];
            }
        },
        getWeekCount(date) {
            if (date) {
                let firstDay = new Date(date.getFullYear(), date.getMonth(), 1),
                    firstWeekday = (firstDay.getDay() + 6) % 7, // lunes = 0
                    day = date.getDate(),
                    weekCount = Math.floor((day + firstWeekday - 1) / 7);
                return weekCount;
            }
        },
        newRow() {
            this.editNewRow = !this.editNewRow;
            this.programacion = {};
            this.selRow = null;
        },
        onSelect(p, i) {
            if (this.selRow != i && p.id_usuario) {
                this.programacion = { ...p };
                this.editNewRow = false;
                this.selRow = i;
            }
            if (!p.id_usuario) this.selRow = null;
        },
        async onSave() {
            if (this.editNewRow) {
                showProgress();
                if (this.selRow)
                    this.programacion = this.getFilteredList('programaciones')[this.selRow];
                let res = await httpFunc(`/generic/genericST/Salas:Ins_Programacion`,
                    { ...this.programacion, id_sala_venta: this.sala.id_sala_venta, id_usuario: this.selUser.id_usuario });
                if (res.data === 'OK') {
                    this.loadData(true);
                    this.programacion = {};
                    this.cancel();
                } else {
                    console.error(res);
                    showMessage('Error: ' + (res.errorMessage || res.data));
                }
                hideProgress();
            }
        },
        cancel() {
            this.editNewRow = false;
            this.selRow = null;
            this.selUser = {};
        },
        async reqDeleteAll() {
            showConfirm(`Se eliminarán todas las asignaciones de la tabla.`, this.onDeleteAll, null, null);
        },
        async reqDelete() {
            if (!this.editNewRow && this.selRow)
                showConfirm(`Se eliminará la asignación permanentemente.`, this.onDelete, null, this.programacion);
        },
        async onDelete(prog) {
            showProgress();
            let res = await httpFunc(`/generic/genericST/Salas:Del_Programacion`, prog);
            if (res.data === 'OK') {
                await this.loadData(true);
                this.programacion = {};
                this.cancel();
            } else {
                console.error(res);
                showMessage('Error: ' + (res.errorMessage || res.data));
            }
            hideProgress();
        },
        async onDeleteAll() {
            showProgress();
            await Promise.all(await this.getFilteredList('programaciones').filter(p => p.id_usuario)
                .map(async prog => await httpFunc(`/generic/genericST/Salas:Del_Programacion`, prog)));
            await this.loadData();
            this.fillDays();
            hideProgress();
        },
        async fileUpload(e) {
            let files = Array(...e.target.files);
            showProgress();
            let form = new FormData();
            files.forEach(f => form.append(f.name, f));
            let res = await httpFunc(`/util/ImportFiles/genericST/Salas:Ins_Programacion/{id_sala_venta: ${this.sala.id_sala_venta}}`, form);
            if (res.isError) showMessage(this.JSON2HTML(res.errorMessage));
            await this.loadData();
            this.fillDays();
            hideProgress();
        },
        isHoliday(text) {
            let fecha = new Date(text + ' 00:00'), month = this.viewMonths[this.nameMonths[fecha.getMonth()]];
            if (month) {
                let day = month.days.find(d => d.currentMonth && d.monthDay == fecha.getDate() && this.viewMode.year == fecha.getFullYear());
                return day.isHoliday;
            }
        },
        JSON2HTML(errorMessage) {
            let html = "<div class='error-container'>";
            errorMessage.forEach((archivo, i) => {
                html += `
            <div class='archivo-error'>
                <h2>Errores en el archivo: <em>${archivo.fileName}</em></h2>
        `;

                archivo.errors.forEach((error, errorIndex) => {
                    html += `
                <div class='error-item'>
                    <h3>Error en la fila ${error.rowIndex + 1}</h3>
                    <p><strong>Mensaje:</strong> ${error.errorMessage}</p>
                    <table border="1" cellpadding="5" cellspacing="0">
                        <thead>
                            <tr>${Object.keys(error.rowData).map(key => `<th>${key}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            <tr>${Object.values(error.rowData).map(value => `<td>${value}</td>`).join('')}</tr>
                        </tbody>
                    </table>
                </div>
                <hr/>
            `;
                });

                html += "</div>";
            });

            html += "</div>";
            return html;

        },
        async downloadTemplate(type) {
            try {
                showProgress();
                let datos = this.programaciones.filter(p => (new Date(p.fecha + ' 00:00').getFullYear() == this.selDate.getFullYear()
                    && new Date(p.fecha + ' 00:00').getMonth() == this.selDate.getMonth()) && p.id_usuario).map(p => (
                        {
                            fecha: new Date(p.fecha + ' 00:00'), cedula: parseInt(p.identificacion), estado: p.estado, dia: this.getWeekDay(p.fecha),
                            asesor: p.nombres, sala: this.sala.sala_venta, categoria: p.cargo, festivo: this.isHoliday(p.fecha) ? 'Sí' : 'No'
                        }
                    ));
                var archivo = (await httpFunc(`/util/Json2File/${type}`, datos)).data;
                type === 'excel' && await httpFunc("/util/ExcelFormater", { "file": archivo, "format": "FormatoProgSalas" });
                window.open("./docs/" + archivo, "_blank");
            }
            catch (e) {
                console.error(e);
            }
            hideProgress();
        }
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key =>
                        this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                    ) : []
                ).filter(p => (this.filterMode == 'm' && new Date(p.fecha + ' 00:00').getFullYear() == this.selDate.getFullYear()
                    && new Date(p.fecha + ' 00:00').getMonth() == this.selDate.getMonth())
                    || (this.filterMode == 's' && new Date(p.fecha + ' 00:00').getFullYear() == this.selDate.getFullYear()
                        && new Date(p.fecha + ' 00:00').getMonth() == this.selDate.getMonth()
                        && this.getWeekCount(new Date(p.fecha + ' 00:00')) == this.getWeekCount(this.selDate))
                    || (this.filterMode == 'd' && this.equalsDate(this.selDate, new Date(p.fecha + ' 00:00')))) : [];
            };
        },
    }
}