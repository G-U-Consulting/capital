-- =============================================
-- proceso: procesonegocio/get_bancoplazos
-- =============================================
--START_PARAM
set @id_proyecto = '3',
    @consecutivo = '1',
    @id_banco = '2';
--END_PARAM

select  
    t.id_torre,

    max(
      case 
        when lower(p.descripcion) like '%escritura%' then 
          case 
            when @id_banco in (35, 56) or @id_banco is null or @id_banco = '' 
              then coalesce(p.dias_fna_otros_escrituracion)
            when t.id_banco_constructor = @id_banco 
              then coalesce(p.dias_banco_constructor_escrituracion, p.dias_banco_aliado_escrituracion, p.dias_fna_otros_escrituracion)
            when exists (
              select 1 
              from fact_banco_financiador bf
              where bf.id_proyecto = t.id_proyecto
                and bf.id_banco_financiador = @id_banco
            ) 
              then coalesce(p.dias_banco_aliado_escrituracion, p.dias_fna_otros_escrituracion)
            else coalesce(p.dias_fna_otros_escrituracion)
          end
      end
    ) as ultima_cuota,

    max(
      case 
        when lower(p.descripcion) like '%cuota%' or lower(p.descripcion) like '%entrega%' then 
          case 
            when @id_banco in (35, 56) or @id_banco is null or @id_banco = '' 
              then coalesce(p.dias_fna_otros_entrega)
            when t.id_banco_constructor = @id_banco 
              then coalesce(p.dias_banco_constructor_entrega, p.dias_banco_aliado_entrega, p.dias_fna_otros_entrega)
            when exists (
              select 1 
              from fact_banco_financiador bf
              where bf.id_proyecto = t.id_proyecto
                and bf.id_banco_financiador = @id_banco
            ) 
              then coalesce(p.dias_banco_aliado_entrega, p.dias_fna_otros_entrega)
            else coalesce(p.dias_fna_otros_entrega)
          end
      end
    ) as dias_escrituracion

from fact_torres t
join fact_plazos p on p.is_active = 1
where 
    t.id_proyecto = @id_proyecto
    and t.consecutivo = @consecutivo
    and t.is_active = 1
group by t.id_torre;