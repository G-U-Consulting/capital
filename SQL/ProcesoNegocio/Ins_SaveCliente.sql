-- =============================================
-- Proceso: Medios/Ins_SaveCliente
-- =============================================
--START_PARAM
set @id_proyecto = 1,
    @username = '',
    @cliente = '';
--END_PARAM


update fact_cliente_actual
set
    is_active = 0
where
    username = @username
    and is_active = 1;
insert into
    fact_cliente_actual (
        id_proyecto,
        username,
        cliente
    )
values (
        @id_proyecto,
        @username,
        @cliente
    );

    select concat('OK-id_cliente:', last_insert_id(), ' ', 'Insert') as result;