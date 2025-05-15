-- =============================================
-- Proceso: Documentos/Ins_Documento
-- =============================================
--START_PARAM
set @documento = '',
	@llave = '',
	@cache_memoria = 0,
    @usuario = ''
--END_PARAM
insert into fact_documentos(documento, llave, cache_memoria, created_by)
select @documento, @llave, @cache_memoria, @usuario;
set @id_documento = last_insert_id();
select @id_documento as id_documento;