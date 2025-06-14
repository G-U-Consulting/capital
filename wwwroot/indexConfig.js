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
    "Maestros": {
        templateUrl: "./web/Maestros/Maestros.html",
        jsUrl: "./web/Maestros/Maestros.js",
        title: "Maestros",
        desc: "Permite administrar las listas de maestros",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "",
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
    "EdicionProyectos": {
        templateUrl: "./web/Proyectos/Edicion.html",
        jsUrl: "./web/Proyectos/Edicion.js",
        allow: ["*"]
    },
    "Medios": {
        templateUrl: "./web/Proyectos/Medios.html",
        jsUrl: "./web/Proyectos/Medios.js",
        allow: ["*"]
    },
    "Unidades": {
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
    "TestArchivos": {
        templateUrl: "./web/Test/Archivos.html",
        jsUrl: "./web/Test/Archivos.js",
        title: "Prueba de archivos",
        desc: "",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZM",
        category: "TestArchivos",
        allow: ["*"]
    }
};
const zones = {
    "ZU": {
        name: "ZU",
        title: "Zona Usuarios",
        img: "./img/ico/menu/zu.png",
        categories: [
            { key:"USUARIOS", name: "Usuarios"},
            { key:"ROLES", name: "Roles"},
            { key:"CATEGORIAS", name: "Categorias Adm"},
            { key:"CONFIGURACION", name: "Configuración"},
            { key:" ", name: "Informes"}
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
    // "ZO": {
    //     name: "ZO",
    //     title: "Zona Obras",
    //     img: "./img/ico/menu/zo.png",
    //     categories: []
    // },
    "ZM": {
        name: "ZM",
        title: "Zona Configuracion",
        img: "./img/ico/menu/zc.png",
        categories: [
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