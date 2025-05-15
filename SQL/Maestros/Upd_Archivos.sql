-- =============================================
-- Proceso: General/Get_Archivo
-- =============================================
--START_PARAM
set @id_archivo = '',
    @nombre = '',
    @codigo = '',
    @orden = '0',
    @id_documento = ''

--END_PARAM

update dim_documento_archivo
set nombre=@nombre, codigo=@codigo, orden=@orden, id_documento=@id_documento
where id_archivo=@id_archivo;

select 'OK' as result;