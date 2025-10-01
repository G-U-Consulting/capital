function Unidades(num) {
    switch(num) {
        case 1: return 'uno';
        case 2: return 'dos';
        case 3: return 'tres';
        case 4: return 'cuatro';
        case 5: return 'cinco';
        case 6: return 'seis';
        case 7: return 'siete';
        case 8: return 'ocho';
        case 9: return 'nueve';
    }
    return '';
}

function Decenas(num) {
    let decena = Math.floor(num / 10);
    let unidad = num - (decena * 10);
    switch(decena) {
        case 1:
            switch(unidad) {
                case 0: return 'diez';
                case 1: return 'once';
                case 2: return 'doce';
                case 3: return 'trece';
                case 4: return 'catorce';
                case 5: return 'quince';
                default: return 'dieci' + Unidades(unidad);
            }
        case 2:
            if(unidad == 0)
                return 'veinte';
            else
                return 'veinti' + Unidades(unidad);
        case 3: return DecenasY('treinta', unidad);
        case 4: return DecenasY('cuarenta', unidad);
        case 5: return DecenasY('cincuenta', unidad);
        case 6: return DecenasY('sesenta', unidad);
        case 7: return DecenasY('setenta', unidad);
        case 8: return DecenasY('ochenta', unidad);
        case 9: return DecenasY('noventa', unidad);
        case 0: return Unidades(unidad);
    }
}

function DecenasY(strSin, numUnidades) {
    if (numUnidades > 0)
        return strSin + ' y ' + Unidades(numUnidades);
    return strSin;
}

function Centenas(num) {
    let centenas = Math.floor(num / 100);
    let decenas = num - (centenas * 100);
    switch(centenas) {
        case 1:
            if (decenas > 0)
                return 'ciento ' + Decenas(decenas);
            return 'cien';
        case 2: return 'doscientos ' + Decenas(decenas);
        case 3: return 'trescientos ' + Decenas(decenas);
        case 4: return 'cuatrocientos ' + Decenas(decenas);
        case 5: return 'quinientos ' + Decenas(decenas);
        case 6: return 'seiscientos ' + Decenas(decenas);
        case 7: return 'setecientos ' + Decenas(decenas);
        case 8: return 'ochocientos ' + Decenas(decenas);
        case 9: return 'novecientos ' + Decenas(decenas);
    }
    return Decenas(decenas);
}

function Seccion(num, divisor, strSingular, strPlural) {
    let cientos = Math.floor(num / divisor);
    let resto = num - (cientos * divisor);
    let letras = '';
    if (cientos > 0)
        if (cientos > 1)
            letras = Centenas(cientos) + ' ' + strPlural;
        else
            letras = strSingular;
    if (resto > 0)
        letras += ' ';
    return letras.trim();
}

function Miles(num) {
    let divisor = 1000;
    let cientos = Math.floor(num / divisor);
    let resto = num - (cientos * divisor);
    let strMiles = Seccion(num, divisor, 'mil', 'mil');
    let strCentenas = Centenas(resto);
    if (cientos === 1) {
        strMiles = 'mil';
    } else if (cientos === 21) {
        strMiles = 'veintiún mil';
    } else if (cientos > 1) {
        strMiles = Centenas(cientos).replace('uno', 'un') + ' mil';
    }
    if(strMiles === '')
        return strCentenas;
    return strMiles + ' ' + strCentenas;
}

function Millones(num) {
    let divisor = 1000000;
    let millones = Math.floor(num / divisor);
    let resto = num - (millones * divisor);
    let strMillones = '';
    if (millones === 1) {
        strMillones = 'un millón';
    } else if (millones > 1) {
        strMillones = NumeroALetras(millones, {}, true).replace('uno', 'un') + ' millones';
    }
    let strMiles = Miles(resto);
    if(strMillones === '')
        return strMiles;
    if(strMiles === '')
        return strMillones;
    return strMillones + ' ' + strMiles;
}

function Billones(num) {
    let divisor = 1000000000;
    let milesDeMillones = Math.floor(num / divisor);
    let resto = num - (milesDeMillones * divisor);
    let strBillones = '';
    if (milesDeMillones === 1) {
        strBillones = 'mil millones';
    } else if (milesDeMillones > 1 && milesDeMillones < 1000) {
        strBillones = NumeroALetras(milesDeMillones, {}, true) + ' mil millones';
    } else if (milesDeMillones >= 1000) {
        // Billones
        let billones = Math.floor(num / 1000000000000);
        let restoBillones = num - (billones * 1000000000000);
        let strBillon = '';
        if (billones === 1) {
            strBillon = 'un billón';
        } else if (billones > 1) {
            strBillon = NumeroALetras(billones, {}, true) + ' billones';
        }
        let strMilesDeMillones = '';
        if (restoBillones > 0) {
            strMilesDeMillones = Billones(restoBillones);
        }
        if (strMilesDeMillones === '') return strBillon;
        return strBillon + ' ' + strMilesDeMillones;
    }
    let strMillones = Millones(resto);
    if(strBillones === '')
        return strMillones;
    if(strMillones === '')
        return strBillones;
    return strBillones + ' ' + strMillones;
}

function NumeroALetras(num, currency, skipCurrency) {
    currency = currency || {};
    let data = {
        numero: num,
        enteros: Math.floor(num),
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))),
        letrasCentavos: '',
        letrasMonedaPlural: currency.plural || 'pesos',
        letrasMonedaSingular: currency.singular || 'peso',
        letrasMonedaCentavoPlural: currency.centPlural || 'centavos',
        letrasMonedaCentavoSingular: currency.centSingular || 'centavo'
    };

    if (data.centavos > 0 && !skipCurrency) {
        let centavosStr = data.centavos.toString().padStart(2, '0');
        data.letrasCentavos = 'con ' + NumeroALetras(parseInt(centavosStr, 10), {}, true).trim() + ' ' + (data.centavos === 1 ? data.letrasMonedaCentavoSingular : data.letrasMonedaCentavoPlural);
    }

    let letrasEnteros = '';
    if (data.enteros < 1000000) {
        letrasEnteros = Miles(data.enteros).trim();
    } else if (data.enteros < 1000000000) {
        letrasEnteros = Millones(data.enteros).trim();
    } else {
        letrasEnteros = Billones(data.enteros).trim();
    }

    letrasEnteros = letrasEnteros.replace('dieciseis', 'dieciséis');
    letrasEnteros = letrasEnteros.replace('veintidos', 'veintidós');
    letrasEnteros = letrasEnteros.replace('veintitres', 'veintitrés');
    letrasEnteros = letrasEnteros.replace('veintiseis', 'veintiséis');
    
    if (skipCurrency) return ajustarUn(letrasEnteros);

    if(data.enteros === 0)
        return 'cero ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos.trim();
    if (data.enteros === 1)
        return ajustarUn(letrasEnteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos.trim();
    else
        return ajustarUn(letrasEnteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos.trim();
}

function Number2Text(num) {
    if (num === undefined || isNaN(num)) {
        return '';
    }
    let partes = num.toString().split('.');
    let enteros = parseInt(partes[0], 10);
    let decimales = partes.length > 1 ? partes[1].padEnd(2, '0').slice(0, 2) : '00';

    let letrasEnteros = NumeroALetras(enteros).trim(); 
    let letrasDecimales = (decimales !== '00') ? `con ${NumeroALetras(parseInt(decimales, 10), {}, true).trim()} centavos` : '';

    return `${letrasEnteros} ${letrasDecimales}`.trim();
}

function ajustarUn(letras) {
    letras = letras.replace(/ veintiuno(?= mil| millones| billones| mil millones| pesos| peso| centavos| centavo|$)/g, ' veintiún');
    letras = letras.replace(/ veintiun(?= mil| millones| billones| mil millones| pesos| peso| centavos| centavo|$)/g, ' veintiún');
    letras = letras.replace(/ uno(?= mil| millones| billones| mil millones| pesos| peso| centavos| centavo|$)/g, ' un');
    return letras;
}