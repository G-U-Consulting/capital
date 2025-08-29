const modules = {
    "Usuarios": {
        templateUrl: "./web/Usuarios/Usuarios.html",
        jsUrl: "./web/Usuarios/Usuarios.js",
        title: "Usuarios",
        desc: "Permite administrar los usuarios y roles de la aplicación",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZU",
        category: "USUARIOS",
        allow: ["*"]
    }, 
    "Roles": {
        templateUrl: "./web/Roles/Roles.html",
        jsUrl: "./web/Roles/Roles.js",
        title: "Roles",
        desc: "Permite administrar los usuarios y roles de la aplicación",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZU",
        category: "ROLES",
        allow: ["*"]
    },
    "Agenda": {
        templateUrl: "./web/Agenda/Agenda.html",
        jsUrl: "./web/Agenda/Agenda.js",
        title: "Mi Agenda",
        desc: "Permite administrar los usuarios y roles de la aplicación",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZU",
        category: "AGENDA",
        allow: ["*"]
    },
    "Categorias": {
        templateUrl: "./web/Categorias/Categorias.html",
        jsUrl: "./web/Categorias/Categorias.js",
        title: "Configuración",
        desc: "Permite administrar los usuarios y roles de la aplicación",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "",
        category: "CATEGORIAS",
        allow: ["*"]
    },
    "Proyectos": {
        templateUrl: "./web/Proyectos/Proyectos.html",
        jsUrl: "./web/Proyectos/Proyectos.js",
        title: "Proyectos",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZA",
        category: "PROYECTOS",
        allow: ["*"]
    }, 
    "ProcesosUnidades": {
        external: true, 
        templateUrl: "./web/Proyectos/Unidades.html",
        jsUrl: "./web/Proyectos/Unidades.js",
        allow: ["*"]
    },
    "EdicionProyectos": {
        templateUrl: "./web/Proyectos/Edicion.html",
        jsUrl: "./web/Proyectos/Edicion.js",
        allow: ["*"]
    },
    "InicioProyecto": {
        templateUrl: "./web/Proyectos/InicioProyecto.html",
        jsUrl: "./web/Proyectos/InicioProyecto.js",
        allow: ["*"]
    },
    "Medios": {
        templateUrl: "./web/Proyectos/Medios.html",
        jsUrl: "./web/Proyectos/Medios.js",
        allow: ["*"]
    },
    "Unidades": {
        external: true, 
        templateUrl: "./web/Proyectos/Unidades3d.html",
        jsUrl: "./web/Proyectos/Unidades3d.js",
        allow: ["*"]
    },
    "Documentacion": {
        templateUrl: "./web/Proyectos/Documentacion.html",
        jsUrl: "./web/Proyectos/Documentacion.js",
        allow: ["*"]
    },
    "Bancos": {
        templateUrl: "./web/Proyectos/Bancos.html",
        jsUrl: "./web/Proyectos/Bancos.js",
        allow: ["*"]
    },
    "Recorridos": {
        templateUrl: "./web/Proyectos/Recorridos.html",
        jsUrl: "./web/Proyectos/Recorridos.js",
        allow: ["*"]
    },
    "Rotafolio": {
        templateUrl: "./web/Proyectos/Rotafolio.html",
        jsUrl: "./web/Proyectos/Rotafolio.js",
        allow: ["*"]
    },
    "ProcesoNegocio": {
        templateUrl: "./web/Proyectos/ProcesoNegocio.html",
        jsUrl: "./web/Proyectos/ProcesoNegocio.js",
        allow: ["*"]
    },
    "MisTareas": {
        templateUrl: "./web/Proyectos/MisTareas.html",
        jsUrl: "./web/Proyectos/MisTareas.js",
        allow: ["*"]
    },
    "MiCalendario":{
        templateUrl: "./web/Proyectos/MiCalendario.html",
        jsUrl: "./web/Proyectos/MiCalendario.js",
        allow: ["*"]
    },
    "SeleccionSalas": {
        templateUrl: "./web/ConfigSalas/Seleccion.html",
        jsUrl: "./web/ConfigSalas/Seleccion.js",
        allow: ["*"]
    },
    "SalaPersonal": {
        templateUrl: "./web/ConfigSalas/SalaPersonal.html",
        jsUrl: "./web/ConfigSalas/SalaPersonal.js",
        allow: ["*"]
    },
    "SalaCalendario": {
        templateUrl: "./web/ConfigSalas/SalaCalendario.html",
        jsUrl: "./web/ConfigSalas/SalaCalendario.js",
        allow: ["*"]
    },
    "ProgMensual":{
        templateUrl: "./web/ConfigSalas/ProgMensual.html",
        jsUrl: "./web/ConfigSalas/ProgMensual.js",
        allow: ["*"]
    },
    "Clientes": {
        templateUrl: "./web/GestClientes/Clientes.html",
        jsUrl: "./web/GestClientes/Clientes.js",
        allow: ["*"]
    },
    "GCListaEspera": {
        templateUrl: "./web/GestClientes/ListaEspera.html",
        jsUrl: "./web/GestClientes/ListaEspera.js",
        allow: ["*"]
    },
    "GCOpciones": {
        templateUrl: "./web/GestClientes/Opciones.html",
        jsUrl: "./web/GestClientes/Opciones.js",
        allow: ["*"]
    },
    "GCConsignaciones": {
        templateUrl: "./web/GestClientes/Consignaciones.html",
        jsUrl: "./web/GestClientes/Consignaciones.js",
        allow: ["*"]
    },
    "GCPreCredito": {
        templateUrl: "./web/GestClientes/PreCredito.html",
        jsUrl: "./web/GestClientes/PreCredito.js",
        allow: ["*"]
    },
    "GCVentas": {
        templateUrl: "./web/GestClientes/Ventas.html",
        jsUrl: "./web/GestClientes/Ventas.js",
        allow: ["*"]
    },
    "GCDesistimientos": {
        templateUrl: "./web/GestClientes/Desistimientos.html",
        jsUrl: "./web/GestClientes/Desistimientos.js",
        allow: ["*"]
    },
    "GCPqrs": {
        templateUrl: "./web/GestClientes/Pqrs.html",
        jsUrl: "./web/GestClientes/Pqrs.js",
        allow: ["*"]
    },
    "GCVetos": {
        templateUrl: "./web/GestClientes/Vetos.html",
        jsUrl: "./web/GestClientes/Vetos.js",
        allow: ["*"]
    },
    "Informes": {
        templateUrl: "./web/Informes/Informes.html",
        jsUrl: "./web/Informes/Informes.js",
        title: "Informes y Exportación",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZU",
        category: "INFORMES",
        allow: ["*"]
    },
    "Informes": {
        templateUrl: "./web/Informes/Informes.html",
        jsUrl: "./web/Informes/Informes.js",
        title: "Informes y Exportación",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZI",
        category: "INFORMES",
        allow: ["*"]
    },
    "ConfigUsuarios": {
        templateUrl: "./web/ConfigUsuario/ConfigUsuario.html",
        jsUrl: "./web/ConfigUsuario/ConfigUsuario.js",
        title: "Usuarios",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZM",
        category: "CONFIGUSUARIOS",
        allow: ["*"]
    },
    "ConfigProyectos": {
        templateUrl: "./web/ConfigProyectos/ConfigProyectos.html",
        jsUrl: "./web/ConfigProyectos/ConfigProyectos.js",
        title: "Proyectos",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZM",
        category: "ConfigProyectos",
        allow: ["*"]
    },
    "ConfigSalas": {
        templateUrl: "./web/ConfigSalas/ConfigSalas.html",
        jsUrl: "./web/ConfigSalas/ConfigSalas.js",
        title: "Salas de ventas",
        desc: "",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZM",
        category: "ConfigSalas",
        allow: ["*"]
    },
    "ConfigGeneral": {
        templateUrl: "./web/ConfigGeneral/ConfigGeneral.html",
        jsUrl: "./web/ConfigGeneral/ConfigGeneral.js",
        title: "General",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZM",
        category: "ConfigGeneral",
        allow: ["*"]
    },
    "GestClientes": {
        templateUrl: "./web/GestClientes/GestClientes.html",
        jsUrl: "./web/GestClientes/GestClientes.js",
        title: "Clientes",
        desc: "",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZG",
        category: "CLIENTES",
        allow: ["*"]
    },
    "GestProyectos": {
        templateUrl: "./web/GestProyectos/GestProyectos.html",
        jsUrl: "./web/GestProyectos/GestProyectos.js",
        title: "Proyectos",
        desc: "",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZG",
        category: "PROYECTOS",
        allow: ["*"]
    },
    "Dashboards": {
        templateUrl: "./web/Dashboards/Dashboards.html",
        jsUrl: "./web/Dashboards/Dashboards.js",
        title: "Dashboards",
        desc: "",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZG",
        category: "DASHBOARDS",
        allow: ["*"]
    },
    // "TestArchivos": {
    //     templateUrl: "./web/Test/Archivos.html",
    //     jsUrl: "./web/Test/Archivos.js",
    //     title: "Prueba de archivos",
    //     desc: "",
    //     imgSrc: "./img/ico/menu/006-group.png",
    //     zone: "ZM",
    //     category: "TestArchivos",
    //     allow: ["*"]
    // }
};
const zones = {
    "ZM": {
        name: "ZM",
        title: "Zona Configuracion",
        img: "./img/ico/menu/zc.png",
        categories: []
    },
    "ZU": {
        name: "ZU",
        title: "Zona Usuarios",
        img: "./img/ico/menu/zu.png",
        categories: [
            { key:"USUARIOS", name: "Usuarios"},
            { key:"ROLES", name: "Roles"},
        ]
    },
    "ZA": {
        name: "ZA",
        title: "Zona Asesores",
        img: "./img/ico/menu/za.png",
        categories: [
            { key: "PROYECTOS", name: "Proyectos" },
            { key: "INFORMES", name: "Informes" },
            { key: "CONFIGURACION", name: "Configuración" }
        ]
    },
    "ZG": {
        name: "ZG",
        title: "Zona Gestión",
        img: "./img/ico/menu/zo.png",
        categories: [
            { key: "CLIENTES", name: "Clientes" },
            { key: "PROYECTOS", name: "Proyectos" },
            { key: "DASHBOARDS", name: "Dashboards" },
        ]
    },
    "ZI": {
        name: "ZI",
        title: "Zona Informes",
        img: "./img/ico/menu/zi.png",
        categories: [
            { key: "INFORMES", name: "Informes" },
        ]
    },
    "OUT": {
        name: "OUT",
        title: "logOut",
        img: "./img/ico/menu/out.png",
        isLogOut: true,
    }
};
export { modules, zones};