-- =============================================
-- Proceso: ProcesoNegocio/Upd_Avisor
-- =============================================
--START_PARAM
set @id_cupon = NULL,
	@usuario = NULL,
	@ticket_id_enviar = NULL,
	@ticket_id_descargar = NULL,
	@ecollect_url_enviar = NULL,
	@ecollect_url_descargar = NULL;
--END_PARAM

update dim_cupon_avisor
set ticket_id_enviar = if(@ticket_id_enviar is null or @ticket_id_enviar = '', ticket_id_enviar, @ticket_id_enviar),
	ticket_id_descargar = if(@ticket_id_descargar is null or @ticket_id_descargar = '', ticket_id_descargar, @ticket_id_descargar),
	ecollect_url_enviar = if(@ecollect_url_enviar is null or @ecollect_url_enviar = '', ecollect_url_enviar, @ecollect_url_enviar),
	ecollect_url_descargar = if(@ecollect_url_descargar is null or @ecollect_url_descargar = '', ecollect_url_descargar, @ecollect_url_descargar),
	id_usuario = (select u.id_usuario from fact_usuarios u where @usuario = u.usuario collate utf8mb4_general_ci)
where id_cupon = @id_cupon;