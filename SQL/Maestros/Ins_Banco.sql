-- =============================================
-- Proceso: General/Ins_Banco
-- =============================================
--START_PARAM
set @banco = ''

--END_PARAM

INSERT INTO dim_banco_constructor (banco) VALUES (@banco);

set @id_banco = last_insert_id();

insert into dim_banco_factor (id_banco, id_factor, id_tipo_factor, valor)
select 
    @id_banco as id_banco,
    f.id_factor,
    t.id_tipo_factor,
    0 as valor
from 
    dim_factor f
cross join 
    dim_tipo_factor t;


SELECT concat('OK-id_banco:', @id_banco) AS result;