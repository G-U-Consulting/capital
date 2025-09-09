-- =============================================
-- Proceso: Clientes/Get_ListasEsperas
-- =============================================
--START_PARAM

--END_PARAM

select l.*, c.numero_documento, p.nombre as proyecto from fact_lista_espera l
join fact_clientes c on l.id_cliente = c.id_cliente
join fact_proyectos p on l.id_proyecto = p.id_proyecto;

select id_proyecto, nombre
from fact_proyectos
where is_active = 1;