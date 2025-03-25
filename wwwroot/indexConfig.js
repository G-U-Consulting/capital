const modules = {
    "Usuarios": {
        templateUrl: "./web/Usuarios/Usuarios.html",
        jsUrl: "./web/Usuarios/Usuarios.js",
        title: "Usuarios y Roles",
        desc: "Permite administrar los usuarios y roles de la aplicación",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZU",
        category: "USUARIOS",
        allow: ["*"]
    },
    "Seguridad": {
        templateUrl: "./web/Usuarios/Usuarios.html",
        jsUrl: "./web/Usuarios/Usuarios.js",
        title: "Seguridad",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZU",
        category: "CONFIGURACION",
        allow: ["*"]
    },
    "Presentacion": {
        templateUrl: "./web/Usuarios/Usuarios.html",
        jsUrl: "./web/Usuarios/Usuarios.js",
        title: "Presentación",
        desc: "Administra las configuraciones de seguridad",
        imgSrc: "./img/ico/menu/006-group.png",
        zone: "ZU",
        category: "CONFIGURACION",
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
            { key:"CONFIGURACION", name: "Configuración"},
            { key:"Informes", name: "Informes"}
        ]
    },
    "ZA": {
        name: "ZA",
        title: "Zona Asesores",
        categories: [
            { key: "PROYECTOS", name: "Proyectos" },
            { key: "INFORMES", name: "Informes" },
            { key: "CONFIGURACION", name: "Configuración" }
        ]
    },
    "ZO": {
        name: "ZO",
        title: "Zona Obras",
        categories: []
    }
};
export { modules, zones};