-- =============================================
-- Proceso: Clientes/Get_ListasEsperas
-- =============================================
--START_PARAM

--END_PARAM

select l.*, coalesce(c.email1, email2) as email, coalesce(c.telefono1, c.telefono2) as telefono, c.numero_documento,
    concat(coalesce(c.nombres, ''), ' ', coalesce(c.apellido1, ''), ' ', coalesce(c.apellido2, '')) as nombre_cliente,
    c.nombres, c.apellido1, c.apellido2, u.nombres as nombre_asesor, p.nombre as proyecto 
from fact_lista_espera l
join fact_clientes c on l.id_cliente = c.id_cliente
join fact_proyectos p on l.id_proyecto = p.id_proyecto
join fact_usuarios u on l.id_usuario = u.id_usuario;

select id_proyecto, nombre
from fact_proyectos
where is_active = 1;

select id_usuario, usuario, nombres
from fact_usuarios
where is_active = 1;