--START_PARAM
set @access_token = NULL,
    @refresh_token = NULL,
    @expires_at = NULL;
--END_PARAM

INSERT INTO dim_autodesk_token_cc (id, access_token, refresh_token, expires_at)
VALUES (1, @access_token, @refresh_token, @expires_at)
ON DUPLICATE KEY UPDATE
    access_token = @access_token,
    refresh_token = @refresh_token,
    expires_at = @expires_at;

SELECT 'OK' AS resultado;
