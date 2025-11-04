-- =============================================
-- proceso: procesonegocio/ins_plazos
-- =============================================
--START_PARAM
set 
    @descripcion,
    @dias_banco_constructor_escrituracion,
    @dias_banco_aliado_escrituracion,
    @dias_fna_otros_escrituracion,
    @dias_banco_constructor_entrega,
    @dias_banco_aliado_entrega,
    @dias_fna_otros_entrega;
--END_PARAM

insert into fact_plazos (
    descripcion,
    dias_banco_constructor_escrituracion,
    dias_banco_aliado_escrituracion,
    dias_fna_otros_escrituracion,
    dias_banco_constructor_entrega,
    dias_banco_aliado_entrega,
    dias_fna_otros_entrega
)
values (
    @descripcion,
    @dias_banco_constructor_escrituracion,
    @dias_banco_aliado_escrituracion,
    @dias_fna_otros_escrituracion,
    @dias_banco_constructor_entrega,
    @dias_banco_aliado_entrega,
    @dias_fna_otros_entrega
)
on duplicate key update
    dias_banco_constructor_escrituracion = values(dias_banco_constructor_escrituracion),
    dias_banco_aliado_escrituracion = values(dias_banco_aliado_escrituracion),
    dias_fna_otros_escrituracion = values(dias_fna_otros_escrituracion),
    dias_banco_constructor_entrega = values(dias_banco_constructor_entrega),
    dias_banco_aliado_entrega = values(dias_banco_aliado_entrega),
    dias_fna_otros_entrega = values(dias_fna_otros_entrega);

-- devolver resultado
if row_count() = 1 then
    select 'insert' as resultado;
elseif row_count() = 2 then
    select 'update' as resultado;
else
    select 'sin cambios' as resultado;
end if;
