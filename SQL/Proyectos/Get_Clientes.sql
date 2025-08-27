-- =============================================
-- Proceso: Proyecto/Get_Clientes
-- =============================================
--START_PARAM

--END_PARAM

select *, concat(nombres, ' ', apellido1, ' ', apellido2) as nombre from fact_clientes;