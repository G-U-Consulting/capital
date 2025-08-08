-- =============================================
-- Proceso: Unidades/Upd_Lista
-- =============================================
--START_PARAM
set @id_lista = NULL,
    @descripcion = NULL;
--END_PARAM

update dim_lista_precios
set descripcion = @descripcion
where id_lista = @id_lista;

select 'OK' as result;