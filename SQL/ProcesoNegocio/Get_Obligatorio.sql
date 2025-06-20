-- =============================================
-- Proceso: ProcesoNegocio/Get_Obligatorio
-- =============================================
--START_PARAM

set @id_sala_venta = '',
    @modulo = '';
--END_PARAM

select modulo, campobd, campo
from dim_campo_obligatorio a 
join dim_campo_obligatorio_sala b on a.id_campo = b.id_campo
where id_sala_venta = @id_sala_venta and modulo = @modulo;