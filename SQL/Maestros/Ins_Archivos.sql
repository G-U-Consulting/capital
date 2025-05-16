-- =============================================
-- Proceso: General/Get_Archivo
-- =============================================
--START_PARAM
set @nombre = NULL,
    @codigo = NULL,
    @orden = '0',
    @id_documento = ''

--END_PARAM

insert into dim_documento_archivo(nombre, codigo, orden, id_documento)
values(@nombre, @codigo, @orden, @id_documento);

select CONCAT('OK-id_archivo:', (select id_archivo from dim_documento_archivo where nombre=@nombre and id_documento=@id_documento)) as result;