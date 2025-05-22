-- =============================================
-- Proceso: General/Get_Archivo
-- =============================================
--START_PARAM
set @nombre = NULL,
    @codigo = NULL,
    @orden = '0',
    @id_documento = '',
    @id_proyecto = NULL

--END_PARAM

insert into dim_documento_archivo(nombre, codigo, orden, id_documento, id_proyecto)
values(@nombre, @codigo, @orden, @id_documento, if(@id_proyecto = '', NULL, @id_proyecto));

select CONCAT('OK-id_archivo:', last_insert_id()) as result;