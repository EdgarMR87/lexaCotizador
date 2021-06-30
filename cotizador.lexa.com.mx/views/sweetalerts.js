var tablesToExcel = (function() {
    var uri = 'data:application/vnd.ms-excel;base64,'
    , tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
      + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
      + '<Styles>'
      + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
      + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
      + '</Styles>' 
      + '{worksheets}</Workbook>'
    , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
    , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
    , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
    return function(tables, wsnames, wbname, appname) {
      var ctx = "";
      var workbookXML = "";
      var worksheetsXML = "";
      var rowsXML = "";

      for (var i = 0; i < tables.length; i++) {
        if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
        for (var j = 0; j < tables[i].rows.length; j++) {
          rowsXML += '<Row>'
          for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
            var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
            var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
            var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
            dataValue = (dataValue)?dataValue:tables[i].rows[j].cells[k].innerHTML;
            var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
            dataFormula = (dataFormula)?dataFormula:(appname=='Calc' && dataType=='DateTime')?dataValue:null;
            ctx = {  attributeStyleID: (dataStyle=='Currency' || dataStyle=='Date')?' ss:StyleID="'+dataStyle+'"':''
                   , nameType: (dataType=='Number' || dataType=='DateTime' || dataType=='Boolean' || dataType=='Error')?dataType:'String'
                   , data: (dataFormula)?'':dataValue
                   , attributeFormula: (dataFormula)?' ss:Formula="'+dataFormula+'"':''
                  };
            rowsXML += format(tmplCellXML, ctx);
          }
          rowsXML += '</Row>'
        }
        ctx = {rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i};
        worksheetsXML += format(tmplWorksheetXML, ctx);
        rowsXML = "";
      }

      ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
      workbookXML = format(tmplWorkbookXML, ctx);

console.log(workbookXML);

      var link = document.createElement("A");
      link.href = uri + base64(workbookXML);
      link.download = wbname || 'Workbook.xls';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  })();

// ****************** FUNCION PARA CREAR PDF ***********************//

function getPDF(){
    var doc = new jsPDF('l', 'pt');
    var logo = new Image();
    const hoy = new Date();
    logo.src = 'views/img/logo-big.png';
    doc.setFontSize(15);
    doc.text("Reporte : " + hoy.toLocaleDateString() + " " + $("#name-empresa").val(), 250, 25);
    doc.addImage(logo, "PNG", 15, 8, 70, 30);
    doc.line(15, 43, 825, 43); // horizontal line
    doc.setFontSize(10);
    doc.text("Zona Geografica : " + $("#salarios_minimos option:selected").text(), 15, 56);
    doc.text("Comisión del Servicio : " + document.getElementById('comision_servicio').value, 400, 56);
    doc.text("Factor de Nómina : " + $("#factor_nomina option:selected").text(), 15, 70);
    doc.text("Salario Propuesto : " + document.getElementById('salario_propuesto').value, 400, 70); 
    doc.setFontSize(15);
    //*********************************************************/
    //PRIMER TABLA //
    //**************************************************************/

    //AGREGAMOS EL TITULO DE LA TABLA COTIZADOR IMSS REAL
    var titulo = ["Tabla Nomina / Nomina Propuesta"];
    var row =[];
    doc.autoTable(titulo,row,{
        margin: {left: 50, right: 50, top:78},
        headerStyles: {
            halign: 'center'
        },
        didParseCell: function (titulo) {
                titulo.cell.styles.fillColor = [255,255,255];
                titulo.cell.styles.textColor = [10, 28, 119];
        },
    });
    //GUARDAMOS LOS DATOS DE LA PRIMER TABLA
    var columns = ["#", "SALARIO REAL", "FACTOR DE ANTIGÜEDAD", "#", "SALARIO ANTE EL IMSS", "INDEMNIZACIÓN NOM 035"];
    var rows = Array();
    $("#tabla-nomina tr").each(function(i, v){
        rows[i] = Array();
        $(this).children('td').each(function(ii, vv){
            rows[i][ii] = Intl.NumberFormat('en-EN').format((parseFloat($(this).text())).toFixed(2));
        }); 
    })
    rows.shift();
    doc.autoTable(columns, rows,{
        margin: {left: 10, right: 10},
        headerStyles: {
            halign: 'center'
        },
        bodyStyles: {
            halign: 'center'
        }
    });
    //*********************************************************/
    //SEGUNDA TABLA //
    //**************************************************************/
    //AGREGAMOS EL TITULO DE LA TABLA COTIZADOR IMSS REAL
    var titulo = ["COTIZADOR IMSS REAL"];
    var row =[];
    doc.autoTable(titulo,row,{
        margin: {left: 50, right: 50},
        headerStyles: {
            halign: 'center'
        },
        didParseCell: function (titulo) {
                titulo.cell.styles.fillColor = [255,255,255];
                titulo.cell.styles.textColor = [10, 28, 119];
        },
    });
     //AGREGAMOS LA TABLA DE FORMA MANUAL
    var columns = ["#", "SXD", "SDI", "SBDC","DT", "SBE", "PR", "RT", "UMA", "CF", "EP", "EO", "PEP", "PEO", "PDP", "PDO", "SIVP", "SIVO", "SR", "CEP", "CEO", "GUAR", "INFON", "TCP", "TCO", "TLM", "ISN"];
    var rows = Array();
    $("#cotizador-imss-real tr").each(function(i, v){
        rows[i] = Array();
        $(this).children('td').each(function(ii, vv){
            rows[i][ii] = $(this).text();
        }); 
    })
    rows.shift();
    doc.autoTable(columns, rows,{
        margin: {left: 3, right: 3},
        styles: { fontSize: number = 5}
    });
    //*********************************************************/
    //TERCER TABLA //
    //**************************************************************/
    //AGREGAMOS EL TITULO LA TABLA IMSS PROPUESTO
    var titulo = ["COTIZADOR IMSS PROPUESTO"];
    var row =[];
    doc.autoTable(titulo,row,{
        margin: {left: 50, right: 50},
        headerStyles: {
            halign: 'center'
        },
        didParseCell: function (titulo) {
                titulo.cell.styles.fillColor = [255,255,255];
                titulo.cell.styles.textColor = [10, 28, 119];
        },
    });
    //AGREGAMOS LA TABLA IMSS PROPUESTA
    var columns_imss_p = ["#", "SXD", "SDI", "SBDC","DT", "S", "PR", "RT", "UMA", "CF", "EP", "EO", "PEP", "PEO", "PDP", "PDO", "SIVP", "SIVO", "SR", "CEP", "CEO", "GUAR", "INFON", "TCP", "TCO", "TLM", "ISN"];
    var rows_imss_p = Array();
    $("#cotizador-imss-propuesto tr").each(function(i, v){
        rows_imss_p[i] = Array();
        $(this).children('td').each(function(ii, vv){
            rows_imss_p[i][ii] = $(this).text();
        }); 
    })
    rows_imss_p.shift();
    doc.autoTable(columns_imss_p, rows_imss_p,{
        margin: {left: 3, right: 3},
        styles: { fontSize: number = 5}
    });
    
    //*********************************************************/
    //CUARTA TABLA //
    //**************************************************************/
    //AGREGAMOS EL TITULO DE LA TABLA CÁLCULO DE RETENCIONES DE ISR ESQUEMA REAL
    var titulo = ["CÁLCULO DE RETENCIONES DE ISR ESQUEMA REAL"];
    var row =[];
    doc.autoTable(titulo,row,{
        margin: {left: 50, right: 50},
        headerStyles: {
            halign: 'center'
        },
        didParseCell: function (titulo) {
            titulo.cell.styles.fillColor = [255,255,255];
            titulo.cell.styles.textColor = [10, 28, 119];
        },
    });
    //AGREGAMOS LA TABLA DE FORMA MANUAL
     var columns = ["CONS", "INGRESOS OBT X SAL", "IMP LOCAL RET TRABAJ", "FACTOR DE NÓMINA","BASE GRAVABLE", "LIM INF ART 96 LISR", "EXCEDENTE S/LIM INF", "% APLICABLE S/EXC LIM INF", "IMP MARGINAL", "CUOTA FIJA", "IMPUESTO SEGUN TARIFA ART 96 LISR", "SUBSIDIO EMPLEO SEGUN TABLA", "SUBSIDIO EMPLEO ENTREG TRABAJ", "RETENCIÓN ISR"];
     var rows = Array();
 
     $("#cotizador-retisr tr").each(function(i, v){
        rows[i] = Array();
         $(this).children('td').each(function(ii, vv){
            rows[i][ii] = $(this).text();
         }); 
     })

    rows.shift(); //SE ELIMINA LA PRIMER FILA
    doc.autoTable(columns, rows,{
        margin: {left: 15, right: 15},
        autoSize : true,
        styles: { fontSize: number = 8}
    });
    //*********************************************************/
    //QUINTA TABLA //
    //**************************************************************/
    //AGREGAMOS EL TITULO DE LA TABLA CÁLCULO DE RETENCIONES DE ISR ESQUEMA REAL
    var titulo = ["CÁLCULO DE RETENCIONES DE ISR ESQUEMA PROPUESTO"];
    var row =[];
    doc.autoTable(titulo,row,{
        margin: {left: 50, right: 50},
        headerStyles: {
            halign: 'center'
        },
        didParseCell: function (titulo) {
            titulo.cell.styles.fillColor = [255,255,255];
            titulo.cell.styles.textColor = [10, 28, 119];
        },
    });
    //AGREGAMOS LA TABLA DE FORMA MANUAL
    var columns = ["CONS", "INGRESOS OBT X SALARIO", "FACTOR DE NÓMINA", "BASE GRAVABLE", "LIM INF T ART 96 LISR", "EXCEDENTE S/LIM INFERIOR", "% APLICABLE S/EXC LIM INF", "IMPUESTO MARGINAL", "CUOTA FIJA", "IMPUESTO SEGUN TARIFA ART 96 LISR", "SUBSIDIO EMPLEO SEGÚN TABLA", "SUBSIDIO EMPLEO ENTREGADO TRABAJ", "RETENCIÓN ISR"];
    var rows = Array();
    $("#cotizador-retisr-propuesto tr").each(function(i, v){
        rows[i] = Array();
        $(this).children('td').each(function(ii, vv){
            rows[i][ii] = $(this).text();
        }); 
    });
    rows.shift(); //SE ELIMINA LA PRIMER FILA
    doc.autoTable(columns, rows,{
        margin: {left: 15, right: 15},
        autoSize : true,
        styles: { fontSize: number = 8}
    });
    //*********************************************************/
    //SEXTA TABLA //
    //**************************************************************/
    //AGREGAMOS EL TITULO DE LA TABLA DETERMINACIÓN NÓMINA ESQUEMA REAL (100%)
    var titulo = ["DETERMINACIÓN NÓMINA ESQUEMA REAL (100%)"];
    var row =[];
    doc.autoTable(titulo,row,{
        margin: {left: 50, right: 50},
        headerStyles: {
            halign: 'center'
        },
        didParseCell: function (titulo) {
            titulo.cell.styles.fillColor = [255,255,255];
            titulo.cell.styles.textColor = [10, 28, 119];
        },
    });
    //AGREGAMOS LA TABLA DE FORMA MANUAL
    var columns = ["CONS", "DÍAS", "SALARIO DIARIO INT", "SUELDO", "SUBSIDIO AL EMPLEO", "TOTAL PERCEPCIONES", "RETENCIÓN ISR", "IMSS", "TOTAL DEDUCCIONES", "NETO NOMINA"];
    var rows = Array();
    $("#cotizador-nomina-real tr").each(function(i, v){
        rows[i] = Array();
        $(this).children('td').each(function(ii, vv){
            rows[i][ii] = $(this).text();
        }); 
    });
    rows.shift(); //SE ELIMINA LA PRIMER FILA
    doc.autoTable(columns, rows,{
        margin: {left: 15, right: 15},
        autoSize : true,
        styles: { fontSize: number = 8}
    });

    //*********************************************************/
    //SEPTIMA TABLA //
    //**************************************************************/
    //AGREGAMOS EL TITULO DE LA TABLA DETERMINACIÓN NÓMINA ESQUEMA PROPUESTO (INDEMNIZACIÓN)
    var titulo = ["DETERMINACIÓN NÓMINA ESQUEMA PROPUESTO (INDEMNIZACIÓN)"];
    var row =[];
    doc.autoTable(titulo,row,{
        margin: {left: 50, right: 50},
        headerStyles: {
            halign: 'center'
        },
        didParseCell: function (titulo) {
            titulo.cell.styles.fillColor = [255,255,255];
            titulo.cell.styles.textColor = [10, 28, 119];
        },
    });

    //AGREGAMOS LA TABLA DE FORMA MANUAL
    var columns = ["CONS", "DÍAS", "SALARIO DIARIO INT", "SUELDO", "SUBSIDIO AL EMPLEO", "TOTAL PERCEPCIONES", "RETENCIÓN ISR", "IMSS", "TOTAL DEDUCCIONES", "NETO NOMINA"];
    var rows = Array();
    $("#cotizador-nomina-propuesta tr").each(function(i, v){
        rows[i] = Array();
        $(this).children('td').each(function(ii, vv){
            rows[i][ii] = $(this).text();
        }); 
    });
    rows.shift(); //SE ELIMINA LA PRIMER FILA
    doc.autoTable(columns, rows,{
        margin: {left: 15, right: 15},
        autoSize : true,
        styles: { fontSize: number = 8}
    });

    


    doc.save("a4.pdf");

}



function calculatePDF_height_width(selector,index){
    page_section = $(selector).eq(index);
    HTML_Width = page_section.width();
    HTML_Height = page_section.height();
    top_left_margin = 15;
    PDF_Width = HTML_Width + (top_left_margin * 2);
    PDF_Height = (PDF_Width * 1.2) + (top_left_margin * 2);
    canvas_image_width = HTML_Width;
    canvas_image_height = HTML_Height;
}


function borrarOk(link){
    swal({
        title: "Se elimino el registro Exitosamente!",
        text: "Redireccionando en 2 segundos...",
        type: "success",
        timer: 2000
    }).then(() => {
        window.location.href = link;
    });
}

function clickactionEliminar( b ){
    document.getElementById('id_dato_borrar').value = b.id; 
    document.getElementById('concepto').innerHTML = b.id + "?";
}

function registroOK(url){
    swal({
        title: "Registro Exitoso",
        text: "Redireccionando en 2 segundos .....",
        type: "success",
        timer: 5000
    }).then(() => {
        window.location.href = url;
    });
}

function actualizarOK(url){
    swal({
        title: "Actualizacion Exitosa",
        text: "Redireccionando en 2 segundos .....",
        type: "success",
        timer: 5000
    }).then(() => {
        window.location.href = url;
    });
}



function bienvenida(usuario){
    swal({
        title: "Acceso Exitoso!",
        text: "Bienvenido : " + usuario,
        type: "success",
        timer: 5000
    }).then(() => {
            window.location.href = "index.php?action=ok";
    });
}

function errorAcceso(){
    swal({
        title: "Usuario y/o Contraseña incorrectos!",
        text: "Vuelve a intentar",
        type: "warning",
        closeOnClickOutside: false,
        closeOnEsc: false,
        allowOutsideClick: false
    });
}

var impuesto_sobre_nomina = 0;
var impuesto_sobre_nomina_propuesta = 0;
var gran_total_cuotas_patronales = 0;
var gran_total_impuesto_sobre_nomina = 0;
let gran_total_cuotas_obreras = 0;
var total_carga_social = 0;
//VARIABLES PARA LA SUMA DEL IMSS PROPUESTA
var gran_total_cuotas_patronales_propuesta = 0;
var gran_total_impuesto_sobre_nomina_propuesta = 0;
var gran_total_cuotas_obreras_propuesta = 0;
var total_carga_social_propuesta = 0;
//VARIABLE DEL GRAN TOTAL DEL ISR REAL
var gran_total_retencion_isr = 0;
//VARIABLE DEL GRAN TOTAL DEL ISR REAL
var gran_total_retencion_isr_propuesto = 0;
//VARIABLE DEL GRAN TOTAL DE LAS INDEMNIZACIONES
var gran_total_indemnizaciones = 0;

function agregarFila(){
    
    var salario =  document.getElementById("salario_t").value;
    var comision_de_servicio = (parseFloat(document.getElementById("comision_servicio").value) / 100).toFixed(2);

    var factor_a =  document.getElementById("factor_a").value;

    var prima_riesgo =  document.querySelector('#prima_media');
    var porc_prima_riesgo = prima_riesgo.selectedOptions[0].getAttribute("data-enporcientos");
   

    var salarios_minimos = document.querySelector('#salarios_minimos');
    var sm = salarios_minimos.selectedOptions[0].getAttribute("data-pesos");
    var factor_nomina = document.querySelector('#factor_nomina');
    var id_factorn_tarifaisr = factor_nomina.selectedOptions[0].getAttribute("value"); //OBTENEMOS EL ID DEL FACTOR DE NOMINA
    var dias = factor_nomina.selectedOptions[0].getAttribute("data-dias");
    var factor_dec = factor_nomina.selectedOptions[0].getAttribute("data-factor-dec");
    var sp = document.getElementById("salario_propuesto");
    var valor = sp.value;
    var salario_propuesto = (sm*dias*valor);
    var indemnizacion =  salario - salario_propuesto;
    //GUARDAMOS LA BASE GRAVABLE
    var base_gravable = (salario * factor_dec).toFixed(2);
    //GUARDAMOS LA BASE GRAVABLE PROPUESTA
    var base_gravable_propuesta = (salario_propuesto * factor_dec).toFixed(2);
    //GUARDAMOS LA VARIABLE PARA ENVIARLA POR AJAX
    var id_factorn_tarifaisr_ajax = 'id_factorn_tarifaisr=' + id_factorn_tarifaisr;
    //CREAMOS LA VARIABLE DE LIMITE SUPERIOR DEL ISR y la varibale DEL % sobre excedente del limite inferior y la cuota fija
    var lim_inf_ISR = 0; var por_exc_li_inf= 0; var cuota_fija_isr = 0;
    //BUSCAMOS LOS VALORES DEL ISR EN LA TABLA 
    $.ajax({
        type:'post',
        url:'./views/modules/datos/obtenerISRTabla.php',
        data: id_factorn_tarifaisr_ajax,   
        async:false,
        dataType: "json",
        success: function(resp){      
            for(var i = 0; i < resp.length; i++){
                limite_sup = resp[i][2];
              
                if(parseFloat(base_gravable) >= parseFloat(resp[i][1]) && parseFloat(base_gravable) <= parseFloat(resp[i][2])){
                    lim_inf_ISR = resp[i][1];
                    por_exc_li_inf = resp[i][4];
                    cuota_fija_isr = resp[i][3];
                }
            }
        }
    })
    //++++++++++++++++++++++++++++++//
    //    BUSCAMOS LA PROPUESTA    //
    //CREAMOS VARIABLES PROPUESTA DE LIMITE SUPERIOR DEL ISR y la varibale DEL % sobre excedente del limite inferior y la cuota fija
    var lim_inf_ISR_propuesta = 0; var por_exc_li_inf_propuesta= 0; var cuota_fija_isr_propuesta = 0;
    //BUSCAMOS LOS VALORES DEL ISR EN LA TABLA PARA PROPUESTA
    $.ajax({
        type:'post',
        url:'./views/modules/datos/obtenerISRTabla.php',
        data: id_factorn_tarifaisr_ajax,   
        async:false,
        dataType: "json",
        success: function(resp){      
            for(var i = 0; i < resp.length; i++){
                limite_sup = resp[i][2];
                if(parseFloat(base_gravable_propuesta) >= parseFloat(resp[i][1]) && parseFloat(base_gravable_propuesta) <= parseFloat(resp[i][2])){
                    lim_inf_ISR_propuesta = resp[i][1];
                    por_exc_li_inf_propuesta = resp[i][4];
                    cuota_fija_isr_propuesta = resp[i][3];
                }
            }
        }
    })
    
    //CALCULAMOS EXCEDENTE SOBRE LIMITE INFERIOR
    var excedente_sobre_lim_inferior_propuesta = (parseFloat(base_gravable_propuesta) - parseFloat(lim_inf_ISR_propuesta)).toFixed(2)
    //CALCULAMOS EL IMPUESTO MARGINAL PROPUESTA
    var impuesto_marginal_propuesta = (excedente_sobre_lim_inferior_propuesta * por_exc_li_inf_propuesta).toFixed(2);
    //CALCULAMOS IMPUESTO SEGUN TARIFA ART 96 LISR
    var imp_segun_tar_art96_lisr_propuesta = (parseFloat(impuesto_marginal_propuesta) + parseFloat(cuota_fija_isr_propuesta)).toFixed(2);
    //AHORA BUSCAMOS EN LA TABLA DEL SUBISIO LA COMPRATIVA PARA LA PROPUESTA
    //CREAMOS LA VARIABLE DEL SUBSIDIO SEGUN LA TABLA CORRESPONDINETE
    var  subsidio_empleo_segun_tabla_propuesta = 0;
    //BUSCAMOS LA TABLA DEL SUBSIDIO PARA REALIZAR LA COMPARATIVA//
    $.ajax({
        type:'post',
        url:'./views/modules/datos/obtenerSubsidioPEmpleo.php',
        data: id_factorn_tarifaisr_ajax,   
        async:false,
        dataType: "json",
        success: function(resp){      
            for(var i = 0; i < resp.length; i++){
                if(parseFloat(base_gravable_propuesta) >= parseFloat(resp[i][1]) && parseFloat(base_gravable_propuesta) <= parseFloat(resp[i][2])){
                    subsidio_empleo_segun_tabla_propuesta = resp[i][3];
                }
            }
        }
    })
    //DECLARAMOS LAS VARIABLES SUBISIDIO AL EMPLEO ENTREGADO TRABJADOR Y RETENCION ISR
    var subsidio_empleo_entregado_trabajador_propuesta = 0;
    var retencion_isr_propuesta = 0;
    //CALCULAMOS SUBSIDIO EMPLEO ENTREGADO TRABAJADOR
    if( parseFloat(imp_segun_tar_art96_lisr_propuesta) < parseFloat(subsidio_empleo_segun_tabla_propuesta)){
        subsidio_empleo_entregado_trabajador_propuesta = ((parseFloat(subsidio_empleo_segun_tabla_propuesta) - parseFloat(imp_segun_tar_art96_lisr_propuesta)) / parseFloat(factor_dec)).toFixed(2);
    }else if (parseFloat(imp_segun_tar_art96_lisr_propuesta) > parseFloat(subsidio_empleo_segun_tabla_propuesta)){
        retencion_isr_propuesta = ((parseFloat(imp_segun_tar_art96_lisr_propuesta) - parseFloat(subsidio_empleo_segun_tabla_propuesta)) / parseFloat(factor_dec)).toFixed(2);
    }

    //++++++++++++++++++++++++++++//

    //CALCULAMOS EXCEDENTE SOBRE LIMITE INFERIOR
    var excedente_sobre_lim_inferior = (parseFloat(base_gravable) - parseFloat(lim_inf_ISR)).toFixed(2)
    //CALCULAMOS EL IMPUESTO MARGINAL
    var impuesto_marginal = (excedente_sobre_lim_inferior * por_exc_li_inf).toFixed(2);
    //CALCULAMOS IMPUESTO SEGUN TARIFA ART 96 LISR
    var imp_segun_tar_art96_lisr = (parseFloat(impuesto_marginal) + parseFloat(cuota_fija_isr)).toFixed(2);

    //*------------------------------*//
    //CREAMOS LA VARIABLE DEL SUBSIDIO SEGUN LA TABLA CORRESPONDINETE
    var  subsidio_empleo_segun_tabla = 0;
    //BUSCAMOS LA TABLA DEL SUBSIDIO PARA REALIZAR LA COMPARATIVA//
    $.ajax({
        type:'post',
        url:'./views/modules/datos/obtenerSubsidioPEmpleo.php',
        data: id_factorn_tarifaisr_ajax,   
        async:false,
        dataType: "json",
        success: function(resp){      
            for(var i = 0; i < resp.length; i++){
                if(parseFloat(base_gravable) >= parseFloat(resp[i][1]) && parseFloat(base_gravable) <= parseFloat(resp[i][2])){
                    subsidio_empleo_segun_tabla = resp[i][3];
                }
            }
        }
    })
    //*------------------------------*//
    //DECLARAMOS LAS VARIABLES SUBISIDIO AL EMPLEO ENTREGADO TRABJADOR Y RETENCION ISR
    var subsidio_empleo_entregado_trabajador = 0;
    var retencion_isr = 0;
    //CALCULAMOS SUBSIDIO EMPLEO ENTREGADO TRABAJADOR
    if( parseFloat(imp_segun_tar_art96_lisr) < parseFloat(subsidio_empleo_segun_tabla)){
        subsidio_empleo_entregado_trabajador = ((parseFloat(subsidio_empleo_segun_tabla) - parseFloat(imp_segun_tar_art96_lisr)) / parseFloat(factor_dec)).toFixed(2);
    }else if (parseFloat(imp_segun_tar_art96_lisr) > parseFloat(subsidio_empleo_segun_tabla)){
        retencion_isr = ((parseFloat(imp_segun_tar_art96_lisr) - parseFloat(subsidio_empleo_segun_tabla)) / parseFloat(factor_dec)).toFixed(2);
    }

    //OBTENEMOS EL IMPUESTO SOBRE NOMINA
    var i_s_n = document.querySelector('#entidad_federativa');
    var id_entidad_federativa = i_s_n.selectedOptions[0].getAttribute("value");
    var i_s_n_porcentaje = i_s_n.selectedOptions[0].getAttribute("data-por_imp");
    var i_s_n_porcentaje_sobre_tasa = i_s_n.selectedOptions[0].getAttribute("data-sobretasa");
    var cuotafija_extra = 0;
    var por_exc_li = 0;
   
 

    if(id_entidad_federativa == 25 || id_entidad_federativa == 4){
        var id_isn_entidad = 'id_isn_entidad=' + id_entidad_federativa;
        $.ajax({
            type:'post',
            url:'./views/modules/datos/obtenerISNPorcentaje.php',
            data: id_isn_entidad,   
            async:false,
            dataType: "json",
            success: function(resp){      
                for(var i = 0; i < resp.length; i++){
                    cuotafija_extra = resp[i][3];
                    por_exc_li = resp[i][4];
                    l_i_extra = resp[i][1];
                    if(parseFloat(salario) >= parseFloat(resp[i][1]) && parseFloat(salario) <= parseFloat(resp[i][2])){
                        impuesto_sobre_nomina = ((((parseFloat(salario) - parseFloat(l_i_extra)) * parseFloat(por_exc_li)) + parseFloat(cuotafija_extra)) + (parseFloat(salario) * parseFloat(i_s_n_porcentaje_sobre_tasa))).toFixed(2);              
                    }
                    if(parseFloat(salario_propuesto) >= parseFloat(resp[i][1]) && parseFloat(salario_propuesto) <= parseFloat(resp[i][2])){
                        impuesto_sobre_nomina_propuesta = ((((parseFloat(salario_propuesto) - parseFloat(l_i_extra)) * parseFloat(por_exc_li)) + parseFloat(cuotafija_extra)) + (parseFloat(salario_propuesto) * parseFloat(i_s_n_porcentaje_sobre_tasa))).toFixed(2);
                    }
                }
            }
        })
    }else{
        //CALCULAMOS IMPUESTO SOBRE NOMINA
        impuesto_sobre_nomina = (parseFloat(salario * i_s_n_porcentaje) + parseFloat(salario * i_s_n_porcentaje_sobre_tasa)).toFixed(2);
        //CALCULAMOS IMPUESTO SOBRE NOMINA PROPUESTA
        impuesto_sobre_nomina_propuesta = (parseFloat(salario_propuesto * i_s_n_porcentaje) + parseFloat(salario_propuesto * i_s_n_porcentaje_sobre_tasa)).toFixed(2);
    }

   
    var uma = document.getElementById("uma").value; //OBTENEMOS EL UMA
    //OBTENEMOS EL TOPE DE COTIZACION
    var tope_de_cotizacion = (uma *25).toFixed(2);

     //OBTENEMOS LA CUOTA FIJA 
    var cuota_fija = document.getElementById("cuota_fija").value;
    var cuota_fija_t = (cuota_fija * uma * dias).toFixed(2);
    //OBTENEMOS EL SALARIO DIARIO INTREGADO
    var salario_diario_integrado = (salario/dias*factor_a).toFixed(2);
    var salario_diario_integrado_propuesto = (salario_propuesto/dias*factor_a).toFixed(2);

    //VALIDAMOS SI NO EXCEDE EL SALARIO DIARIO INTEGRADO
    if( parseFloat(salario_diario_integrado) > parseFloat(tope_de_cotizacion)){
        salario_diario_base_cotizacion = tope_de_cotizacion;
    }else{
        salario_diario_base_cotizacion = salario_diario_integrado;
    }


    //VALIDAMOS SI NO EXCEDE EL SALARIO DIARIO INTEGRADO PROPUESTO
    if( parseFloat(salario_diario_integrado_propuesto) > parseFloat(tope_de_cotizacion)){
        salario_diario_base_cotizacion_propuesto = tope_de_cotizacion;
    }else{
        salario_diario_base_cotizacion_propuesto = salario_diario_integrado_propuesto;
    }

    //calculamos el excedente patronal
    var excedente_p =0;
    if(salario_diario_base_cotizacion > (uma*3)){
        var excedente_p = (((salario_diario_base_cotizacion - (uma*3))* dias)*.011).toFixed(2);
    }
     //calculamos el excedente OBRERO
     var excedente_o =0;
     if(salario_diario_base_cotizacion > (uma*3)){
         var excedente_o = (((salario_diario_base_cotizacion - (uma*3))* dias)*.004).toFixed(2);
     }


     //calculamos el excedente patronal PROPUESTO
    var excedente_p_propuesto =0;
    if(salario_diario_base_cotizacion_propuesto > (uma*3)){
        var excedente_p_propuesto = (((salario_diario_base_cotizacion_propuesto - (uma*3))* dias)*.011).toFixed(2);
    }
     //calculamos el excedente OBRERO PROPUESTO
     var excedente_o_propuesto =0;
     if(salario_diario_base_cotizacion_propuesto > (uma*3)){
         var excedente_o_propuesto = (((salario_diario_base_cotizacion_propuesto - (uma*3))* dias)*.004).toFixed(2);
     }




    
    //RIESGO DE TRABAJO
    riesgo_de_trabajo = (salario_diario_base_cotizacion*dias*porc_prima_riesgo).toFixed(2);

    //RIESGO DE TRABAJO PROPUESTO
    riesgo_de_trabajo_propuesto = (salario_diario_base_cotizacion_propuesto*dias*porc_prima_riesgo).toFixed(2);

    //OBTENEMOS LA CUOTA FIJA 
    var p_e_p = document.getElementById("prestaciones_especie_p").value;
    //CALCULAMOS PRESTACIONES EN ESPECIE PATRON    
    var prestaciones_e_patron = (salario_diario_base_cotizacion * dias * p_e_p).toFixed(2);

    //CALCULAMOS PRESTACIONES EN ESPECIE PATRON PROPUESTA 
    var prestaciones_e_patron_propuesta = (salario_diario_base_cotizacion_propuesto * dias * p_e_p).toFixed(2);

    //OBTENEMOS LA CUOTA FIJA 
    var p_e_o = document.getElementById("prestaciones_especie_o").value;
    //CALCULAMOS PRESTACIONES EN ESPECIE OBRERO
    var prestaciones_e_obrero = (salario_diario_base_cotizacion * dias * p_e_o).toFixed(2);
    //CALCULAMOS PRESTACIONES EN ESPECIE OBRERO PROPUESTA
    var prestaciones_e_obrero_propuesta = (salario_diario_base_cotizacion_propuesto * dias * p_e_o).toFixed(2);


    //OBTENEMOS PRESTACIONES EN DINERO PATRON 
    var p_d_p = document.getElementById("prestaciones_dinero_p").value;
    //CALCULAMOS PRESTACIONES EN DINERO PATRON 
    var prestaciones_d_patron = (salario_diario_base_cotizacion * dias * p_d_p).toFixed(2);
     //CALCULAMOS PRESTACIONES EN DINERO PATRON PROPUESTA
     var prestaciones_d_patron_propuesta = (salario_diario_base_cotizacion_propuesto * dias * p_d_p).toFixed(2);

    //OBTENEMOS PRESTACIONES EN DINERO TRABAJADOR
    var p_d_o = document.getElementById("prestaciones_dinero_o").value;
    //CALCULAMOS PRESTACIONES EN DINERO TRABAJADOR 
    var prestaciones_d_obrero = (salario_diario_base_cotizacion * dias * p_d_o).toFixed(2);
    //CALCULAMOS PRESTACIONES EN DINERO TRABAJADOR PROPUESTA
    var prestaciones_d_obrero_propuesta = (salario_diario_base_cotizacion_propuesto * dias * p_d_o).toFixed(2);

     //OBTENEMOS SEGURO INVALIDEZ Y VIDA PATRON 
     var s_i_v_p = document.getElementById("seguro_invalidez_vida_p").value;
     //CALCULAMOS SEGURO INVALIDEZ Y VIDA PATRON 
     var seguro_invalidez_vida_p = (salario_diario_base_cotizacion * dias * s_i_v_p).toFixed(2);
      //CALCULAMOS SEGURO INVALIDEZ Y VIDA PATRON 
      var seguro_invalidez_vida_p_propuesta = (salario_diario_base_cotizacion_propuesto * dias * s_i_v_p).toFixed(2);
 
     //OBTENEMOS  SEGURO INVALIDEZ Y VIDA TRABAJADOR
     var s_i_v_o = document.getElementById("seguro_invalidez_vida_o").value;
     //CALCULAMOS SEGURO INVALIDEZ Y VIDA TRABAJADOR
     var seguro_invalidez_vida_o = (salario_diario_base_cotizacion * dias * s_i_v_o).toFixed(2);
      //CALCULAMOS SEGURO INVALIDEZ Y VIDA TRABAJADOR PROPUESTA
      var seguro_invalidez_vida_o_propuesta = (salario_diario_base_cotizacion_propuesto * dias * s_i_v_o).toFixed(2);

     //OBTENEMOS RETIRO
     var retiro = document.getElementById("retiro").value;
     //CALCULAMOS RETIRO
     var seguro_retiro = (salario_diario_base_cotizacion * dias * retiro).toFixed(2);
      //CALCULAMOS RETIRO PROPUESTA
      var seguro_retiro_propuesta = (salario_diario_base_cotizacion_propuesto * dias * retiro).toFixed(2);

     //OBTENEMOS CESANTIA EN EDAD AVANZADA Y VEJEZ PATRON
     var c_e_a_v_p = document.getElementById("cesentia_edad_avanz_vejez_p").value;
     //CALCULAMOS CESANTIA EN EDAD AVANZADA Y VEJEZ PATRON
     var cesentia_edad_avanz_vejez_p = (salario_diario_base_cotizacion * dias * c_e_a_v_p).toFixed(2);
      //CALCULAMOS CESANTIA EN EDAD AVANZADA Y VEJEZ PATRON PROPUESTA
      var cesentia_edad_avanz_vejez_p_propuesta = (salario_diario_base_cotizacion_propuesto * dias * c_e_a_v_p).toFixed(2);

     //OBTENEMOS CESANTIA EN EDAD AVANZADA Y VEJEZ OBRERO
     var c_e_a_v_o = document.getElementById("cesentia_edad_avanz_vejez_o").value;
     //CALCULAMOS CESANTIA EN EDAD AVANZADA Y VEJEZ OBRERO
     var cesentia_edad_avanz_vejez_o = (salario_diario_base_cotizacion * dias * c_e_a_v_o).toFixed(2);
      //CALCULAMOS CESANTIA EN EDAD AVANZADA Y VEJEZ OBRERO PROPUESTA
      var cesentia_edad_avanz_vejez_o_propuesta = (salario_diario_base_cotizacion_propuesto * dias * c_e_a_v_o).toFixed(2);

    //OBTENEMOS GUARDERIA Y PRESTACIONES SOCIALES
    var g_p_c = document.getElementById("guarderias_prest_soc").value;
    //CALCULAMOS GUARDERIA Y PRESTACIONES SOCIALES
    var guarderias_prest_soc = (salario_diario_base_cotizacion * dias * g_p_c).toFixed(2);
    //CALCULAMOS GUARDERIA Y PRESTACIONES SOCIALES PROPUESTA
    var guarderias_prest_soc_propuesta = (salario_diario_base_cotizacion_propuesto * dias * g_p_c).toFixed(2);

    //OBTENEMOS INFONAVIT
    var i = document.getElementById("infonavit").value;
    //CALCULAMOS INFONAVIT
    var infonavit = (salario_diario_base_cotizacion * dias * i).toFixed(2);
     //CALCULAMOS INFONAVIT PROPUESTA
     var infonavit_propuesta = (salario_diario_base_cotizacion_propuesto * dias * i).toFixed(2);

    //SUMAMOS TOTAL CUOTAS PATRONALES
    var total_cuotas_patronales = (parseFloat(riesgo_de_trabajo) + parseFloat(cuota_fija_t) + parseFloat(excedente_p) + parseFloat(prestaciones_e_patron) + parseFloat(prestaciones_d_patron) + parseFloat(seguro_invalidez_vida_p) + parseFloat(seguro_retiro) + parseFloat(cesentia_edad_avanz_vejez_p) + parseFloat(guarderias_prest_soc) + parseFloat(infonavit)).toFixed(2);
    //SUMAMOS TOTA  L CUOTAS PATRONALES PROPUESTA
    var total_cuotas_patronales_propuesta = (parseFloat(riesgo_de_trabajo_propuesto) + parseFloat(cuota_fija_t) + parseFloat(excedente_p_propuesto) + parseFloat(prestaciones_e_patron_propuesta) + parseFloat(prestaciones_d_patron_propuesta) + parseFloat(seguro_invalidez_vida_p_propuesta) + parseFloat(seguro_retiro_propuesta) + parseFloat(cesentia_edad_avanz_vejez_p_propuesta) + parseFloat(guarderias_prest_soc_propuesta) + parseFloat(infonavit_propuesta)).toFixed(2);

    //OBTENEMOS CUOTAS OBRERAS
    var total_porcentaje_trabajador = document.getElementById("total_porcentaje_trabajador").value;
    
    //CALCULAMOS CUOTAS OBRERAS
    var total_cuotas_obreras = (((parseFloat(salario_diario_base_cotizacion) * parseFloat(dias)) * parseFloat(total_porcentaje_trabajador)) + parseFloat(excedente_o)).toFixed(2);
    //CALCULAMOS CUOTAS OBRERAS PROPUESTA
    var total_cuotas_obreras_propuesta = (((salario_diario_base_cotizacion_propuesto * dias) * total_porcentaje_trabajador) + parseFloat(excedente_o_propuesto)).toFixed(2);

    //CALCULAMOS TOTAL DE LIQUIDACION IMSS
    var total_liquidacion_imss = (parseFloat(total_cuotas_patronales) + parseFloat(total_cuotas_obreras)).toFixed(2);
    //CALCULAMOS TOTAL DE LIQUIDACION IMSS PROPUESTA
    var total_liquidacion_imss_propuesta = (parseFloat(total_cuotas_patronales_propuesta) + parseFloat(total_cuotas_obreras_propuesta)).toFixed(2);
    
  
    document.getElementById("tabla-nomina").insertRow(-1).innerHTML = '<td></td><td>'+salario+'</td><td>'+
    factor_a+'</td><td></td><td>'+salario_propuesto+'</td><td>'+indemnizacion+'</td>';
    document.getElementById("salario_t").value = "";
    document.getElementById("factor_a").value = "";
 
    document.getElementById("cotizador-imss-real").insertRow(-1).innerHTML = '<td></td><td>'+(salario/dias).toFixed(2)+'</td><td>'+salario_diario_integrado+
    '</td><td>'+salario_diario_base_cotizacion+'</td><td>'+dias+'</td><td>'+salario+'</td><td>'+(porc_prima_riesgo*100)+'</td><td>'+riesgo_de_trabajo+'</td><td>'+uma+'</td><td>'+
    cuota_fija_t+'</td><td>'+excedente_p+'</td><td>'+excedente_o+'</td><td>'+prestaciones_e_patron+'</td><td>'+prestaciones_e_obrero+'</td><td>'+
    prestaciones_d_patron+'</td><td>'+prestaciones_d_obrero+'</td><td>'+seguro_invalidez_vida_p+'</td><td>'+seguro_invalidez_vida_o+'</td><td>'+
    seguro_retiro+'</td><td>'+cesentia_edad_avanz_vejez_p+'</td><td>'+cesentia_edad_avanz_vejez_o+'</td><td>'+guarderias_prest_soc+'</td><td>'+
    infonavit+'</td><td>'+total_cuotas_patronales+'</td><td>'+total_cuotas_obreras+'</td><td>'+
    total_liquidacion_imss+'</td><td>'+impuesto_sobre_nomina+'</td><td>';
    //SUMAMOS LAS CUOTAS PATRONALES PARA EL GRAN TOTAL
    gran_total_cuotas_patronales = parseFloat(gran_total_cuotas_patronales) + parseFloat(total_cuotas_patronales);
    document.getElementById("gran_total_cuotas_patronales").value = gran_total_cuotas_patronales;
    //SUMAMOS EL EL IMPUESTO PARA EL GRAN TOTAL
    gran_total_impuesto_sobre_nomina = parseFloat(gran_total_impuesto_sobre_nomina) + parseFloat(impuesto_sobre_nomina);
    document.getElementById("gran_total_impuesto_sobre_nomina").value = gran_total_impuesto_sobre_nomina;
    //SUMAMOS LAS CUOTAS OBRERAS PARA EL GRAN TOTAL
    gran_total_cuotas_obreras = document.getElementById("gran_total_cuotas_obreras").value;
    var gran_total_cuotas_obreras_nuevo =  parseFloat(gran_total_cuotas_obreras) + parseFloat(total_cuotas_obreras);
    document.getElementById("gran_total_cuotas_obreras").value = gran_total_cuotas_obreras_nuevo;
    //SUMAMOS LAS CUOTAS OBRERAS PARA EL GRAN TOTAL
    total_carga_social = (parseFloat(document.getElementById("gran_total_cuotas_patronales").value ) + 
                         parseFloat(document.getElementById("gran_total_impuesto_sobre_nomina").value ) + 
                         parseFloat(document.getElementById("gran_total_cuotas_obreras").value)).toFixed(2);
    document.getElementById("total_carga_social").value = total_carga_social;


    //------------------------------------------------//
    //SE AGREGA FILA DE LA TABLA IMSS PROPUESTA
    document.getElementById("cotizador-imss-propuesto").insertRow(-1).innerHTML = '<td></td><td>'+(salario_propuesto/dias).toFixed(2)+'</td><td>'+salario_diario_integrado_propuesto+'</td><td>'+salario_diario_base_cotizacion_propuesto+'</td><td>'+dias+'</td><td>'+salario_propuesto+'</td><td>'+(porc_prima_riesgo*100)+'</td><td>'+riesgo_de_trabajo_propuesto+'</td><td>'+uma+'</td><td>'+
    cuota_fija_t+'</td><td>'+excedente_p_propuesto+'</td><td>'+excedente_o_propuesto+'</td><td>'+prestaciones_e_patron_propuesta+'</td><td>'+prestaciones_e_obrero_propuesta+'</td><td>'+
    prestaciones_d_patron_propuesta+'</td><td>'+prestaciones_d_obrero_propuesta+'</td><td>'+seguro_invalidez_vida_p_propuesta+'</td><td>'+seguro_invalidez_vida_o_propuesta+'</td><td>'+
    seguro_retiro_propuesta+'</td><td>'+cesentia_edad_avanz_vejez_p_propuesta+'</td><td>'+cesentia_edad_avanz_vejez_o_propuesta+'</td><td>'+guarderias_prest_soc_propuesta+'</td><td>'+
    infonavit_propuesta+'</td><td>'+total_cuotas_patronales_propuesta+'</td><td>'+total_cuotas_obreras_propuesta+'</td><td>'+
    total_liquidacion_imss_propuesta+'</td><td>'+impuesto_sobre_nomina_propuesta+'</td><td>';
    //SUMAMOS LAS CUOTAS PATRONALES PARA EL GRAN TOTAL PROPUESTA
    gran_total_cuotas_patronales_propuesta = parseFloat(gran_total_cuotas_patronales_propuesta) + parseFloat(total_cuotas_patronales_propuesta);
    document.getElementById("gran_total_cuotas_patronales_propuesta").value = gran_total_cuotas_patronales_propuesta;
    //SUMAMOS EL EL IMPUESTO PARA EL GRAN TOTAL PROPUESTA
    gran_total_impuesto_sobre_nomina_propuesta = parseFloat(gran_total_impuesto_sobre_nomina_propuesta) + parseFloat(impuesto_sobre_nomina_propuesta);
    document.getElementById("gran_total_impuesto_sobre_nomina_propuesta").value = gran_total_impuesto_sobre_nomina_propuesta;
    
     //SUMAMOS LAS CUOTAS OBRERAS PARA EL GRAN TOTAL PROPUESTA
     gran_total_cuotas_obreras_propuesta = document.getElementById("gran_total_cuotas_obreras_propuesta").value;
     var gran_total_cuotas_obreras_propuesta_nuevo =  parseFloat(gran_total_cuotas_obreras_propuesta) + parseFloat(total_cuotas_obreras_propuesta);
     document.getElementById("gran_total_cuotas_obreras_propuesta").value = gran_total_cuotas_obreras_propuesta_nuevo;
     //SUMAMOS LAS CUOTAS OBRERAS PARA EL GRAN TOTAL PROPUESTA
     total_carga_social_propuesta = (parseFloat(document.getElementById("gran_total_cuotas_patronales_propuesta").value ) + 
                          parseFloat(document.getElementById("gran_total_impuesto_sobre_nomina_propuesta").value ) + 
                          parseFloat(document.getElementById("gran_total_cuotas_obreras_propuesta").value)).toFixed(2);
     document.getElementById("total_carga_social_propuesta").value = total_carga_social_propuesta;



    //------------------------------------------------//
    //SE AGREGA FILA DE LA TABLA ISR
    document.getElementById("cotizador-retisr").insertRow(-1).innerHTML = '<td></td><td>'+salario+'</td><td></td><td>'+
    factor_dec+'</td><td>'+base_gravable+'</td><td>'+lim_inf_ISR+'</td><td>'+excedente_sobre_lim_inferior+'</td><td>'+
    (por_exc_li_inf*100).toFixed(2)+'</td><td>'+impuesto_marginal+'</td><td>'+cuota_fija_isr+'</td><td>'+
    imp_segun_tar_art96_lisr+'</td><td>'+subsidio_empleo_segun_tabla+'</td><td>'+
    subsidio_empleo_entregado_trabajador+'</td><td>'+retencion_isr+'</td>';
    //SUMAMOS LA COLUMNA DE TOTAL ISR PARA EL GRAN TOTAL
    gran_total_retencion_isr = parseFloat(gran_total_retencion_isr) + parseFloat(retencion_isr);
    document.getElementById("gran_total_retencion_isr").value = gran_total_retencion_isr;

    //------------------------------------------------//
    //SE AGREGA FILA DE LA TABLA ISR PROPUESTO
    document.getElementById("cotizador-retisr-propuesto").insertRow(-1).innerHTML = '<td></td><td>'+salario_propuesto+'</td><td>'+
    factor_dec+'</td><td>'+base_gravable_propuesta+'</td><td>'+lim_inf_ISR_propuesta+'</td><td>'+
    excedente_sobre_lim_inferior_propuesta+'</td><td>'+(por_exc_li_inf_propuesta*100).toFixed(2)+'</td><td>'+
    impuesto_marginal_propuesta+'</td><td>'+cuota_fija_isr_propuesta+'</td><td>'+
    imp_segun_tar_art96_lisr_propuesta+'</td><td>'+subsidio_empleo_segun_tabla_propuesta+'</td><td>'+
    subsidio_empleo_entregado_trabajador_propuesta+'</td><td>'+retencion_isr_propuesta+'</td>';
    //SUMAMOS LA COLUMNA DE TOTAL ISR PARA EL GRAN TOTAL PROPUESTO
    gran_total_retencion_isr_propuesto = parseFloat(gran_total_retencion_isr_propuesto) + parseFloat(retencion_isr_propuesta);
    document.getElementById("gran_total_retencion_isr_propuesto").value = gran_total_retencion_isr_propuesto;

    
    document.getElementById("cotizador-nomina-real").insertRow(-1).innerHTML = '<td></td><td>'+
    dias+'</td><td>'+(salario/dias).toFixed(2)+'</td><td>'+(salario/dias*factor_a).toFixed(2)+'</td><td>'+
    salario+'</td><td>'+subsidio_empleo_entregado_trabajador+'</td><td>'+
    (parseFloat(salario) + parseFloat(subsidio_empleo_entregado_trabajador)).toFixed(2)+'</td><td>'+
    retencion_isr+'</td><td>'+total_cuotas_obreras+'</td><td>'+
    (parseFloat(retencion_isr)+parseFloat(total_cuotas_obreras)).toFixed(2)+'</td><td>'+
    ((parseFloat(salario) + parseFloat(subsidio_empleo_entregado_trabajador)) - (parseFloat(retencion_isr)+parseFloat(total_cuotas_obreras))).toFixed(2)  +'</td>';
    
    //VALIDAMOS SI EL SALARIO DIARIO ES = A 123.22 ENTONCES EL PAGO DE IMSS ES 0
    imss_nomina_propuesta = 0;
    if((salario_propuesto/dias) != 123.22){
        imss_nomina_propuesta = total_cuotas_obreras_propuesta;
    }
    

   
    
    document.getElementById("cotizador-nomina-propuesta").insertRow(-1).innerHTML = '<td></td><td>'+
    dias+'</td><td style="background: #4472C4;">'+(salario_propuesto/dias).toFixed(2)+'</td><td>'+salario_diario_integrado_propuesto
    +'</td><td>'+salario_propuesto+'</td><td>'+indemnizacion+'</td><td>'+
    subsidio_empleo_entregado_trabajador_propuesta+'</td><td>'+
    (parseFloat(salario_propuesto)  + parseFloat(indemnizacion) + parseFloat(subsidio_empleo_entregado_trabajador_propuesta)).toFixed(2)+
    '</td><td>'+retencion_isr_propuesta+'</td><td>'+imss_nomina_propuesta+'</td><td></td><td>'+
    (parseFloat(retencion_isr_propuesta) + parseFloat(imss_nomina_propuesta)).toFixed(2)+'</td><td>'+
    ((parseFloat(salario_propuesto)  + parseFloat(indemnizacion) + parseFloat(subsidio_empleo_entregado_trabajador_propuesta))  - (parseFloat(retencion_isr_propuesta) + parseFloat(imss_nomina_propuesta))).toFixed(2) +'</td>';
    //SUMAMOS EL TOTAL DE INDEMNIZACIONES AL GRAN TOTAL PARA LA FACTURACION
    gran_total_indemnizaciones = (parseFloat(gran_total_indemnizaciones) + parseFloat(indemnizacion)).toFixed(2);

    actualizarFilas();


    document.getElementById("isn_cuadro").value = gran_total_impuesto_sobre_nomina;
    document.getElementById("isn_cuadro_propuesto").value = gran_total_impuesto_sobre_nomina_propuesta;
    var ahorro = parseFloat(gran_total_impuesto_sobre_nomina) - parseFloat(gran_total_impuesto_sobre_nomina_propuesta);
    document.getElementById("ahorro_cuadro").value = ahorro;
    document.getElementById("porcentaje_cuadro").value = ((parseFloat(ahorro) / parseFloat(gran_total_impuesto_sobre_nomina)) * 100).toFixed(0);


    //PASAMOS LOS VALORES DE LOS INPUTS HIDDEN A LAS TD
    document.getElementById("isn_cuadro_texto").innerHTML = " $ " + document.getElementById("isn_cuadro").value;
    document.getElementById("isn_cuadro_propuesto_texto").innerHTML = " $ " + document.getElementById("isn_cuadro_propuesto").value;
    document.getElementById("ahorro_cuadro_texto").innerHTML = " $ " + document.getElementById("ahorro_cuadro").value;
    document.getElementById("porcentaje_cuadro_texto").innerHTML = " % " + document.getElementById("porcentaje_cuadro").value;

    
    document.getElementById("cuota_patro_cuadro").value = gran_total_cuotas_patronales;
    document.getElementById("cuota_patro_cuadro_propuesto").value = gran_total_cuotas_patronales_propuesta;
    var ahorro_cuotas_patronales = (parseFloat(gran_total_cuotas_patronales) - parseFloat(gran_total_cuotas_patronales_propuesta)).toFixed(2);
    document.getElementById("ahorro_cuadro_propuesto").value = ahorro_cuotas_patronales;
    document.getElementById("porcentaje_cuadro_propuesto").value = ((parseFloat(ahorro_cuotas_patronales) / parseFloat(gran_total_cuotas_patronales)) * 100).toFixed(0);
    //PASAMOS LOS VALORES DE LOS HIDDEN A LOS TD
    document.getElementById("cuota_patro_cuadro_texto").innerHTML = " $ " + document.getElementById("cuota_patro_cuadro").value;
    document.getElementById("cuota_patro_cuadro_propuesto_texto").innerHTML = " $ " + document.getElementById("cuota_patro_cuadro_propuesto").value;
    document.getElementById("ahorro_cuadro_propuesto_texto").innerHTML = " $ " + document.getElementById("ahorro_cuadro_propuesto").value;
    document.getElementById("porcentaje_cuadro_propuesto_texto").innerHTML = " % " + document.getElementById("porcentaje_cuadro_propuesto").value;

    //REALIZAMOS LAS CUMAS CORRESPODNIENTES
    document.getElementById("primer_total").value = (parseFloat(gran_total_impuesto_sobre_nomina) + parseFloat(gran_total_cuotas_patronales)).toFixed(2);
    document.getElementById("segundo_total").value = (parseFloat(gran_total_impuesto_sobre_nomina_propuesta) + parseFloat(gran_total_cuotas_patronales_propuesta)).toFixed(2);
    document.getElementById("tercer_total").value = parseFloat(ahorro) + parseFloat(ahorro_cuotas_patronales);
    document.getElementById("cuarto_total").value = ( (parseFloat(document.getElementById("tercer_total").value) / parseFloat(document.getElementById("primer_total").value)) *100 ).toFixed(0);
    //PASAMOS LOS VALORES DE LOS HIDDEN A LOS TD
    document.getElementById("primer_total_texto").innerHTML = " $ " + document.getElementById("primer_total").value;
    document.getElementById("segundo_total_texto").innerHTML = " $ " + document.getElementById("segundo_total").value;
    document.getElementById("tercer_total_texto").innerHTML = " $ " + document.getElementById("tercer_total").value;
    document.getElementById("cuarto_total_texto").innerHTML = " % " + document.getElementById("cuarto_total").value;


    //************************************************//
    //MOSTRAMOS LOS TOTALES DEL ISR Y CALCULAMOS EL TOTAL DE AHORRO Y PORCENTAJE
    document.getElementById("isr_cuadro").value = gran_total_retencion_isr;
    document.getElementById("isr_cuadro_propuesto").value = (gran_total_retencion_isr_propuesto).toFixed(2);
    var ahorro_isr = (parseFloat(gran_total_retencion_isr) - parseFloat(gran_total_retencion_isr_propuesto)).toFixed(2);
    document.getElementById("ahorro_isr_cuadro").value = ahorro_isr;
    document.getElementById("porcentaje_isr_cuadro").value = ((parseFloat(ahorro_isr) / parseFloat(gran_total_retencion_isr)) * 100).toFixed(0);
    //PASAMOS LOS VALORES DE LOS HIDDEN A LOS TD
    document.getElementById("isr_cuadro_texto").innerHTML = " $ " + document.getElementById("isr_cuadro").value;
    document.getElementById("isr_cuadro_propuesto_texto").innerHTML = " $ " + document.getElementById("isr_cuadro_propuesto").value;
    document.getElementById("ahorro_isr_cuadro_texto").innerHTML = " $ " + document.getElementById("ahorro_isr_cuadro").value;
    document.getElementById("porcentaje_isr_cuadro_texto").innerHTML = " % " + document.getElementById("porcentaje_isr_cuadro").value;

    //************************************************//
    //MOSTRAMOS LOS TOTALES DE CUOTAS OBRERAS Y CALCULAMOS EL TOTAL DE AHORRO Y PORCENTAJE
    document.getElementById("cuota_obre_cuadro").value = gran_total_cuotas_obreras_nuevo;
    document.getElementById("cuota_obre_cuadro_propuesto").value = (gran_total_cuotas_obreras_propuesta_nuevo).toFixed(2);
    var ahorro_cuota_obre = parseFloat(gran_total_cuotas_obreras_nuevo) - parseFloat(gran_total_cuotas_obreras_propuesta_nuevo);
    document.getElementById("ahorro_cuadro_obre_propuesto").value = (ahorro_cuota_obre).toFixed(2);
    document.getElementById("porcentaje_cuadro_obre_propuesto").value = ((parseFloat(ahorro_cuota_obre) / parseFloat(gran_total_cuotas_obreras_nuevo)) * 100).toFixed(0);
    //PASAMOS LOS VALORES DE LOS HIDDEN A LOS TD
    document.getElementById("cuota_obre_cuadro_texto").innerHTML = " $ " + document.getElementById("cuota_obre_cuadro").value;
    document.getElementById("cuota_obre_cuadro_propuesto_texto").innerHTML = " $ " + document.getElementById("cuota_obre_cuadro_propuesto").value;
    document.getElementById("ahorro_cuadro_obre_propuesto_texto").innerHTML = " $ " + document.getElementById("ahorro_cuadro_obre_propuesto").value;
    document.getElementById("porcentaje_cuadro_obre_propuesto_texto").innerHTML = " % " + document.getElementById("porcentaje_cuadro_obre_propuesto").value;

    //************************************************//
    //SUMAMOS LAS RETENCIONES AL TRABAJADOR DEL CUADRO COMPARATIVO
    document.getElementById("primer_total_rat").value = (parseFloat(gran_total_retencion_isr) + parseFloat(gran_total_cuotas_obreras_nuevo)).toFixed(2);
    document.getElementById("segundo_total_rat").value = (parseFloat(gran_total_retencion_isr_propuesto) + parseFloat(gran_total_cuotas_obreras_propuesta_nuevo)).toFixed(2);
    document.getElementById("tercer_total_rat").value = parseFloat(ahorro_isr) + parseFloat(ahorro_cuota_obre);
    document.getElementById("cuarto_total_rat").value = ( (parseFloat(document.getElementById("tercer_total_rat").value) / parseFloat(document.getElementById("primer_total_rat").value)) *100 ).toFixed(0);
    //PASAMOS LOS VALORES DE LOS HIDDEN A LOS TD
    document.getElementById("primer_total_rat_texto").innerHTML = " $ " + document.getElementById("primer_total_rat").value;
    document.getElementById("segundo_total_rat_texto").innerHTML = " $ " + document.getElementById("segundo_total_rat").value;
    document.getElementById("tercer_total_rat_texto").innerHTML = " $ " + document.getElementById("tercer_total_rat").value;
    document.getElementById("cuarto_total_rat_texto").innerHTML = " % " + document.getElementById("cuarto_total_rat").value;

    //MOSTRAMOS EL TOTAL DE INDEMNIZACIONES PARA LA FACTURACION
    document.getElementById("total_fact_indemnizacion").value = parseFloat(gran_total_indemnizaciones);
    document.getElementById("total_comis_fact_comision").value = (parseFloat(gran_total_indemnizaciones) * parseFloat(comision_de_servicio) ).toFixed(2);
    document.getElementById("subtotal_fact_comision").value = (parseFloat(document.getElementById("total_fact_indemnizacion").value) + parseFloat(document.getElementById("total_comis_fact_comision").value) ).toFixed(2);
    document.getElementById("iva_fact_comision").value = (parseFloat(document.getElementById("subtotal_fact_comision").value) * .16).toFixed(2);
    //PASAMOS LOS VALORES DE FACTURACION HIDDEN A LOS TD
    document.getElementById("total_fact_indemnizacion_texto").innerHTML = " $ " + document.getElementById("total_fact_indemnizacion").value;
    document.getElementById("total_comis_fact_comision_texto").innerHTML =  " $ " + document.getElementById("total_comis_fact_comision").value;
    document.getElementById("subtotal_fact_comision_texto").innerHTML =  " $ " + document.getElementById("subtotal_fact_comision").value;
    document.getElementById("iva_fact_comision_texto").innerHTML = " $ " + document.getElementById("iva_fact_comision").value;
     
    
    const value = Intl.NumberFormat('en-EN').format((parseFloat( document.getElementById("subtotal_fact_comision").value) + parseFloat(document.getElementById("iva_fact_comision").value) ).toFixed(2));

    document.getElementById("total_fact_comision").value = ("$  " + value) ;
    document.getElementById("total_fact_comision_texto").innerHTML = ("$  " + value) ;
    //REGISTRAMOS LOS AHORROS GENERADOS
    document.getElementById("ahorro_mensual").value = (parseFloat(document.getElementById("tercer_total").value) +  parseFloat(document.getElementById("tercer_total_rat").value)).toFixed(2);
    document.getElementById("ahorro_comision").value = document.getElementById("total_comis_fact_comision").value;
    document.getElementById("ahorro_neto").value = (parseFloat( document.getElementById("ahorro_mensual").value) - parseFloat( document.getElementById("ahorro_comision").value)).toFixed(2);

     //PASAMOS LOS VALORES DE LOS HIDDEN A LOS TD
     document.getElementById("ahorro_mensual_texto").innerHTML = " $ " + document.getElementById("ahorro_mensual").value;
     document.getElementById("ahorro_comision_texto").innerHTML = " $ " + document.getElementById("ahorro_comision").value;
     document.getElementById("ahorro_neto_texto").innerHTML = " $ " + document.getElementById("ahorro_neto").value;


    if(id_factorn_tarifaisr == 1){
        const ahorro_neto_anual = Intl.NumberFormat('en-EN').format((parseFloat(document.getElementById("ahorro_neto").value) * 52).toFixed(2));
        document.getElementById("ahorro_neto_anual_texto").innerHTML = " $ " + (ahorro_neto_anual);
    }else if(id_factorn_tarifaisr == 2){
        const ahorro_neto_anual = Intl.NumberFormat('en-EN').format((parseFloat(document.getElementById("ahorro_neto").value) * 24).toFixed(2));
        document.getElementById("ahorro_neto_anual_texto").innerHTML = " $ " + (ahorro_neto_anual);
    }else if(id_factorn_tarifaisr == 3){
        const ahorro_neto_anual = Intl.NumberFormat('en-EN').format((parseFloat(document.getElementById("ahorro_neto").value) * 12).toFixed(2));
        document.getElementById("ahorro_neto_anual_texto").innerHTML = " $ " + (ahorro_neto_anual);
    }
    document.getElementById("salario_t").focus();  
}


function calculoGral(){
    var resume_table = document.getElementById("cotizador-imss-real");
    var tabla_imss_propuesta = document.getElementById("cotizador-imss-propuesto");
    var total_tabla_cotizador_imss_real = 0;    var total_tabla_cotizador_imss_propuesta = 0;
    var total_tabla_cir_cuotas_obreras = 0;     var total_tabla_cir_cuotas_obreras_propuesta = 0;
    var total_tabla_cir_isn = 0;                var total_tabla_cir_isn_propuesta = 0;

    for (var i = 1, row; row = resume_table.rows[i]; i++) {
        total_tabla_cotizador_imss_real += parseFloat(row.cells[23].innerText);
        total_tabla_cir_cuotas_obreras += parseFloat(row.cells[24].innerText);
        total_tabla_cir_isn += parseFloat(row.cells[26].innerText);
    }
    document.getElementById("gran_total_cuotas_patronales").value = total_tabla_cotizador_imss_real
    document.getElementById("gran_total_impuesto_sobre_nomina").value = total_tabla_cir_isn
    document.getElementById("gran_total_cuotas_obreras").value = total_tabla_cir_cuotas_obreras
    document.getElementById("total_carga_social").value = (total_tabla_cotizador_imss_real +total_tabla_cir_cuotas_obreras +total_tabla_cir_isn).toFixed(2);

    for (var i = 1, row; row = tabla_imss_propuesta.rows[i]; i++) {
        total_tabla_cotizador_imss_propuesta += parseFloat(row.cells[23].innerText);
        total_tabla_cir_cuotas_obreras_propuesta += parseFloat(row.cells[24].innerText);
        total_tabla_cir_isn_propuesta += parseFloat(row.cells[26].innerText);
    }
    document.getElementById("gran_total_cuotas_patronales_propuesta").value = total_tabla_cotizador_imss_real_propuesta;
    document.getElementById("gran_total_impuesto_sobre_nomina_propuesta").value = total_tabla_cir_isn_propuesta;
    document.getElementById("gran_total_cuotas_obreras_propuesta").value = total_tabla_cir_cuotas_obreras_propuesta;
    document.getElementById("total_carga_social_propuesta").value = (total_tabla_cotizador_imss_real_propuesta + total_tabla_cir_cuotas_obreras_propuesta + total_tabla_cir_isn_propuesta).toFixed(2);

}



function actualizarFilas(){
    var nFilas = $("#tabla-nomina tr").length;
    for(i=0; i<= nFilas; i++){
        $("#tabla-nomina tr:eq("+i+")").find("td:eq(0)").text(i);
        $("#tabla-nomina tr:eq("+i+")").find("td:eq(3)").text(i);
        $("#cotizador-imss-real tr:eq("+i+")").find("td:eq(0)").text(i);
        $("#cotizador-imss-propuesto tr:eq("+i+")").find("td:eq(0)").text(i);
        $("#cotizador-retisr tr:eq("+i+")").find("td:eq(0)").text(i);
        $("#cotizador-retisr-propuesto tr:eq("+i+")").find("td:eq(0)").text(i);
        $("#cotizador-nomina-real tr:eq("+i+")").find("td:eq(0)").text(i);
        $("#cotizador-nomina-propuesta tr:eq("+i+")").find("td:eq(0)").text(i);
    }
}

function eliminarFila(){
  
    var table = document.getElementById("tabla-nomina");
    var rowCount = table.rows.length;
    if(rowCount <= 1)
      alert('No se puede eliminar el encabezado');
    else
    table.deleteRow(rowCount -1);
    //ELIMINAMOS LAS FILA DEL COTIZADOR IMSS REAL
    var table_imss_real = document.getElementById("cotizador-imss-real");
    var rowCount_imss_real = table_imss_real.rows.length;
    if(rowCount_imss_real <= 1)
        alert('No se puede eliminar el encabezado');
    else
        table_imss_real.deleteRow(rowCount_imss_real -1);

    //ELIMINAMOS LAS FILA DEL COTIZADOR IMSS PROPUESTO
    var table_imss_propuesto = document.getElementById("cotizador-imss-propuesto");
    var rowCount_imss_propuesto = table_imss_propuesto.rows.length;
    if(rowCount_imss_propuesto <= 1)
        alert('No se puede eliminar el encabezado');
    else
    table_imss_propuesto.deleteRow(rowCount_imss_propuesto -1);

    //ELIMINAMOS LAS FILA DEL COTIZADOR IMSS PROPUESTO
    var table_cotizador_retisr = document.getElementById("cotizador-retisr");
    var rowCount_cotizador_retisr = table_cotizador_retisr.rows.length;
    if(rowCount_cotizador_retisr <= 1)
        alert('No se puede eliminar el encabezado');
    else
    table_cotizador_retisr.deleteRow(rowCount_cotizador_retisr -1);

    //ELIMINAMOS LAS FILA DEL COTIZADOR IMSS PROPUESTO
    var table_cotizador_retisr_propuesto = document.getElementById("cotizador-retisr-propuesto");
    var rowCount_cotizador_retisr_propuesto = table_cotizador_retisr_propuesto.rows.length;
    if(rowCount_cotizador_retisr_propuesto <= 1)
        alert('No se puede eliminar el encabezado');
    else
        table_cotizador_retisr_propuesto.deleteRow(rowCount_cotizador_retisr_propuesto -1);
  
  //ELIMINAMOS LAS FILA DEL COTIZADOR IMSS PROPUESTO
  var table_cotizador_nomina_real = document.getElementById("cotizador-nomina-real");
  var rowCount_cotizador_nomina_real = table_cotizador_nomina_real.rows.length;
  if(rowCount_cotizador_nomina_real <= 1)
      alert('No se puede eliminar el encabezado');
  else
  table_cotizador_nomina_real.deleteRow(rowCount_cotizador_nomina_real -1);

  //ELIMINAMOS LAS FILA DEL COTIZADOR IMSS PROPUESTO
  var table_cotizador_nomina_propuesta = document.getElementById("cotizador-nomina-propuesta");
  var rowCount_cotizador_nomina_propuesta = table_cotizador_nomina_propuesta.rows.length;
  if(rowCount_cotizador_nomina_propuesta <= 1)
      alert('No se puede eliminar el encabezado');
  else
  table_cotizador_nomina_propuesta.deleteRow(rowCount_cotizador_nomina_propuesta -1);
  calculoGral();
 

  }

  function calcularSalarioPropuesto(){
      
      var salarios_minimos = document.querySelector('#salarios_minimos');
      var sm = salarios_minimos.selectedOptions[0].getAttribute("data-pesos");
      var factor_nomina = document.querySelector('#factor_nomina');
      var dias = factor_nomina.selectedOptions[0].getAttribute("data-dias");
      var sp = document.getElementById("salario_propuesto");
      var valor = sp.value;
      var salario_propuesto = (sm*dias*valor);
      alert(salario_propuesto);
      
  }


$(document).ready(function(){

    $(document).on('click', '.indemnizacion', function(event){
       var salario = $(this).closest('tr').find('td:nth-child(1)').html();
       var salariop = $(this).closest('tr').find('td:nth-child(4)').html();
       $(this).closest('tr').find('td:nth-child(5)').html(salariop-salario);
    });


    $('#li-empresas').click(function(event){
        $('#submenu-empresas').css('display', 'block');
        $('#submenu-impuestos-fijos').css('display', 'none');
        $('#submenu-calcular').css('display', 'none');    
        $('#contenido').css('display', 'none');    
    });
    
       
    $('#li-impuestos-fijos').click(function(event){
        $('#submenu-empresas').css('display', 'none');
        $('#submenu-impuestos-fijos').css('display', 'block');
        $('#submenu-calcular').css('display', 'none');    
        $('#contenido').css('display', 'none');    
    });    
       
    $('#li-calcular').click(function(event){
        $('#submenu-empresas').css('display', 'none');
        $('#submenu-impuestos-fijos').css('display', 'none');
        $('#submenu-calcular').css('display', 'block');   
        $('#contenido').css('display', 'none');     
    });

    $("#buscarTabla").keyup(function(){
            _this = this;
            // Show only matching TR, hide rest of them
            $.each($("#tabla-listado tbody tr"), function() {
                if($(this).text().toLowerCase().indexOf($(_this).val().toLowerCase()) === -1)
                $(this).hide();
                else
                $(this).show();
            });
        });
        });
