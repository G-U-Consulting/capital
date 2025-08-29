export default {
    data() {
        return {
            mainmode: 0,
            mode: 0,
            ruta: [],
            clientes: [],

            cliente: {},

            filtros: {
                clientes: {}
            },

            chart: null
        };
    },
    async mounted() {
        await this.loadData();
        //this.setMode('chart');
        //this.setMode('d3');
    },
    async unmounted() {
        if (this.chart) this.chart.destroy();
    },
    methods: {
        setRuta() {
            GlobalVariables.miniModuleCallback('SetRuta', this.ruta);
        },
        setMainMode(mode) {
            this.mainmode = mode;
        },
        async setMode(mode) {
            this.mode = mode;
            await Promise.resolve();
            if (mode === 0) GlobalVariables.miniModuleCallback('StartModule');
            if (mode === 'chart') this.initChart();
            if (mode === 'd3') this.initD3();
        },
        async loadData() {
            this.clientes = (await httpFunc("/generic/genericDT/Proyectos:Get_Clientes", {})).data;
            console.log(this.clientes);
        },
        onClear(table) {
            let item = this.filtros[table];
            item = Object.keys(item).forEach((key) => item[key] = '');
        },
        onSelect(cliente) {
            this.cliente = { ...cliente };
            this.setMode(1);
            this.ruta.push({ text: `${cliente.numero_documento} - Edición` });
            this.setRuta();
            console.log(cliente);
        },

        initChart() {
            const ctx = document.getElementById('chart-js');
            const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const data = {
                labels: labels,
                datasets: [
                    {
                        label: 'Stack 1',
                        data: Array(12).fill(0).map(a => Math.floor(Math.random() * 200) - 100),
                        backgroundColor: "#ee4444",
                    },
                    {
                        label: 'Stack 2',
                        data: Array(12).fill(0).map(a => Math.floor(Math.random() * 200) - 100),
                        backgroundColor: "#4444ee",
                    },
                    {
                        label: 'Stack 3',
                        data: Array(12).fill(0).map(a => Math.floor(Math.random() * 200) - 100),
                        backgroundColor: "#44ee44",
                    },
                ]
            };
            const config = {
                type: 'bar',
                data: data,
                options: {
                    plugins: {
                        title: {
                            display: true,
                            text: 'Chart.js Bar Chart - Stacked'
                        },
                    },
                    responsive: true,
                    scales: {
                        x: {
                            stacked: true,
                        },
                        y: {
                            stacked: true
                        }
                    }
                }
            };
            console.log(ctx, data, this.chart);
            if (ctx) this.chart = new Chart(ctx, config);
        },
        initD3() {
            const container = document.getElementById('d3-js');
            if (container) {
                const width = 600;
                const height = Math.min(width, 500);
                const radius = Math.min(width, height) / 2;
                let data = Array(10).fill(0).map(a => ({ name: '%', value: Math.floor(Math.random() * 1000000) }));
                let sum = data.reduce((a, b) => a + b.value, 0);
                data = data.sort((a, b) => a.value - b.value)
                    .map(a => ({ value: a.value, name: (parseInt(a.value / sum * 10000) / 100) + '%' }));
                console.log(data);

                const arc = d3.arc()
                    .innerRadius(radius * 0.6)
                    .outerRadius(radius - 1);
                const pie = d3.pie()
                    .padAngle(1 / radius)
                    .sort(null)
                    .value(d => d.value);
                const color = d3.scaleOrdinal()
                    .domain(data.map(d => d.name))
                    .range(d3.quantize(t => d3.interpolateCool(t * 0.8 + 0.1), data.length).reverse());
                const svg = d3.create("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .attr("viewBox", [-width / 2, -height / 2, width, height])
                    .attr("style", "max-width: 100%; height: auto;");
                svg.append("g")
                    .selectAll()
                    .data(pie(data))
                    .join("path")
                    .attr("fill", d => color(d.data.name))
                    .attr("d", arc)
                    .append("title")
                    .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
                svg.append("g")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 12)
                    .attr("text-anchor", "middle")
                    .selectAll()
                    .data(pie(data))
                    .join("text")
                    .attr("transform", d => `translate(${arc.centroid(d)})`)
                    .call(text => text.append("tspan")
                        .attr("y", "-0.4em")
                        .attr("font-weight", "bold")
                        .text(d => d.data.name))
                    .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
                        .attr("x", 0)
                        .attr("y", "0.7em")
                        .attr("fill-opacity", 0.7)
                        .text(d => d.data.value.toLocaleString("en-US")));

                container.insertAdjacentElement('afterbegin', svg.node());
            }
        }
    },
    computed: {
        getFilteredList() {
            return (tabla) => {
                return this[tabla] ? this[tabla].filter(item =>
                    this.filtros[tabla] ? Object.keys(this.filtros[tabla]).every(key => {
                        if (tabla == 'clientes' && key == 'nombre_id')
                            return this.filtros[tabla][key] === ''
                                || String(item['nombre']).toLowerCase().includes(this.filtros[tabla][key].toLowerCase())
                                || String(item['numero_documento']).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
                        else return this.filtros[tabla][key] === '' || String(item[key]).toLowerCase().includes(this.filtros[tabla][key].toLowerCase());
                    }) : []
                ) : [];
            };
        },
    }
}