-- =============================================
-- Proceso: ProcesoNegocio/Ins_CuponesAvisor
-- =============================================
--START_PARAM
set @data = '[]';
drop table if exists tmp_cupones_avisor;
create table tmp_cupones_avisor as
select *
from json_table(
    @data,
    '$[*]'
    columns (
        id_opcion int path '$.id_opcion',
		id_unidad int path '$.id_unidad',
		invoice varchar(50) path '$.Invoice',
		ticket_id varchar(50) path '$.TicketId',
		ecollect_url varchar(255) path '$.eCollectUrl',
		is_error bit path '$.isError',
		error_message varchar(255) path '$.errorMessage'
    )
) as t;

insert into dim_cupon_avisor (
	id_opcion, id_unidad, invoice, ticket_id, ecollect_url, is_error, error_message
)
select id_opcion, id_unidad, invoice, ticket_id, ecollect_url, is_error, error_message
from tmp_cupones_avisor
on duplicate key update
	ticket_id = values(ticket_id),
	ecollect_url = values(ecollect_url),
	is_error = values(is_error),
	error_message = values(error_message);
-- drop table if exists tmp_cupones_avisor;

select 'OK' as result;