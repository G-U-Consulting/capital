-- =============================================
-- Proceso: General/Ins_Subsidio
-- =============================================
--START_PARAM
set @periodo = NULL,
    @smmlv = '0',
    @smmlv_0_2 = '0',
    @smmlv_2_4 = '0',
    @imagen = '' 

--END_PARAM
INSERT INTO dim_subsidio_vis (periodo, smmlv, smmlv_0_2, smmlv_2_4, imagen) 
VALUES (@periodo, @smmlv, @smmlv_0_2, @smmlv_2_4, @imagen);
update dim_subsidio_vis set imagen = replace(imagen, '#', cast(id_subsidio as char)) where periodo = @periodo;
SELECT concat('OK-id_subsidio:', (SELECT id_subsidio from dim_subsidio_vis where periodo = @periodo)) AS result;