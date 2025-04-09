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
    "Seguridad": {
        templateUrl: "./web/Seguridad/Seguridad.html",
        jsUrl: "./web/Seguridad/Seguridad.js",
        title: "Seguridad",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZU",
        category: "CONFIGURACION",
        allow: ["*"]
    },
    "Presentacion": {
        templateUrl: "./web/Presentacion/Presentacion.html",
        jsUrl: "./web/Presentacion/Presentacion.js",
        title: "Presentación",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZU",
        category: "CONFIGURACION",
        allow: ["*"]
    },
    "EdicionMaestro": {
        templateUrl: "./web/EdicionMaestro/EdicionMaestro.html",
        jsUrl: "./web/EdicionMaestro/EdicionMaestro.js",
        title: "Edición Maestro",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZU",
        category: "CONFIGURACION",
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
            { key:"CONFIGURACION", name: "Configuración"},
            { key:"Informes", name: "Informes"}
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
    "ZO": {
        name: "ZO",
        title: "Zona Obras",
        img: "./img/ico/menu/zo.png",
        categories: []
    },
    "OUT": {
        name: "OUT",
        title: "logOut",
        img: "./img/ico/menu/out.png",
        isLogOut: true,
    }
};
export { modules, zones};