--START_PARAM
set @dummy = NULL;
--END_PARAM

SELECT access_token, refresh_token, expires_at
FROM dim_autodesk_token_cc
WHERE id = 1
LIMIT 1;
