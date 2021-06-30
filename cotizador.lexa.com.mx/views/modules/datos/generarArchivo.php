<div class="tablas-listado" id="contenido">
    <h1>INGRESAR DATOS</h1>

    <form method="post">
        <table class="tabla-alta">
            <tr>
                <td class="derecha">
                    <p>Entidad Federativa : </p>
                </td>
                <td>
                    <select name="entidad_federativa" id="entidad_federativa" required>
                        <?php
                        $vistaEmpresas = new MvcController();
                        $vistaEmpresas->vistaEntidadFSelectController();
                        ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td class="derecha">
                    <p>Zona Geografica : </p>
                </td>
                <td>
                    <select name="salarios_minimos" id="salarios_minimos" required>
                        <?php
                        $vistaEmpresas->vistaZonaGeograficaSelectController();
                        ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td class="derecha">
                    <p>Prima Media En Porcientos : </p>
                </td>
                <td>
                    <select name="prima_media" id="prima_media" required>
                        <?php
                        $vistaEmpresas->vistaPrimaMediaSelectController();
                        ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td class="derecha">
                    <p>Comision del Servicio : </p>
                </td>
                <td>
                    <input type="number" max="10" min="0" name="comision_servicio" id="comision_servicio" required>
                </td>
            </tr>
            <tr>
                <td class="derecha">
                    <p>Factor de Nómina : </p>
                </td>
                <td>
                    <select name="factor_nomina" id="factor_nomina" required>
                        <?php
                        $vistaEmpresas->vistaFactorNominaPSelectController();
                        ?>
                    </select>
                </td>
                <?php
                $vistaEmpresas->vistaUMAController();
                $vistaEmpresas->vistaCuotaFijaController();
                $vistaEmpresas->vistaPrestacionesEspecieController();
                $vistaEmpresas->vistaPrestacionesDineroController();
                $vistaEmpresas->vistaSeguroInvalidezVidaController();
                $vistaEmpresas->vistaRetiroController();
                $vistaEmpresas->vistaCesentiaEdadAvanzadaVejezController();
                $vistaEmpresas->vistaGuarderiasPrestacionesSocialesController();
                $vistaEmpresas->vistaInfonavitController();
                $vistaEmpresas->vistaTotalPorcentajeTrabajadorController();
                ?>
            </tr>
            <tr>
                <td class="derecha">
                    <p>Salario Propuesto(N veces SM IMSS del 1 al 25) : </p>
                </td>
                <td>
                    <input type="number" max="25" min="1" name="salario_propuesto" id="salario_propuesto" required>
                </td>
            </tr>
        </table>
        <table class="tabla-alta">
            <tr>
                <td>
                    <p>Salario : </p>
                <td>
                    <input type="number" step="any" name="salario_t" id="salario_t">
                </td>
                <td>
                    <p>Factor Antiguedad : </p>
                </td>
                <td>
                    <input type="number" step="any" name="factor_a" id="factor_a">
                </td>
            </tr>
        </table>
    </form>
    <br>
    <input class="btn-agregarfila" type="button" onclick="agregarFila()" value="Agregar Fila">
    <input class="btn-eliminarfila" type="button" onclick="eliminarFila()" value="Eliminar Fila">
    <br>
    <input class="btn-registrar" type="button" onclick="calcularSalarioPropuesto()" value="Calcular">
    <hr>
    <div class="propuesta">
        <table class="tabla-alta" id="tabla-nomina">
            <thead>
                <tr>
                    <th class="listado-th">CONSECUTIVO</th>
                    <th class="listado-th">SALARIO REAL</th>
                    <th class="listado-th">FACTOR DE ANTIGÜEDAD</th>
                    <th class="listado-th">CONSECUTIVO</th>
                    <th class="listado-th">SALARIO ANTE EL IMSS</th>
                    <th class="listado-th">INDEMNIZACIÓN NOM 035</th>
                </tr>
            </thead>
        </table>
    </div>
    <br>

    <div class="propuesta">
        <hr>
        <h1>COTIZADOR IMSS REAL</h1>
        <table class="tabla-alta" id="cotizador-imss-real">
            <thead>
                <tr>
                    <th class="listado-th">CONS</th>
                    <th class="listado-th">SALARIO DIARIO</th>
                    <th class="listado-th">SD INTEGRADO</th>
                    <th class="listado-th">SB DE COTIZACIÓN</th>
                    <th class="listado-th">DÍAS TRABAJADOS</th>
                    <th class="listado-th">SUELDO BRUTO EMPRESA</th>
                    <th class="listado-th">PRIMA RIESGO</th>
                    <th class="listado-th">RIESGO DE TRABAJO</th>
                    <th class="listado-th">UMA</th>
                    <th class="listado-th">CUOTA FIJA</th>
                    <th class="listado-th">EXCEDENTE PATRONAL</th>
                    <th class="listado-th">EXCEDENTE OBRERO</th>
                    <th class="listado-th">PRESTACIONES ESPECIE P</th>
                    <th class="listado-th">PRESTACIONES ESPECIE O</th>
                    <th class="listado-th">PRESTACIONES DINERO P</th>
                    <th class="listado-th">PRESTACIONES DINERO O</th>
                    <th class="listado-th">SEGURO INVALIDEZ VIDA P</th>
                    <th class="listado-th">SEGURO INVALIDEZ VIDA O</th>
                    <th class="listado-th">SEGURO RETIRO</th>
                    <th class="listado-th">CESENTIA EDAD PATRON</th>
                    <th class="listado-th">CESENTIA EDAD OBRERO</th>
                    <th class="listado-th">GUARDERIAS</th>
                    <th class="listado-th">INFONAVIT</th>
                    <th class="listado-th">TOTAL CUOTAS PATRONALES</th>
                    <th class="listado-th">TOTAL CUOTAS OBRERAS</th>
                    <th class="listado-th">TOTAL LIQ. IMSS</th>
                    <th class="listado-th">IMPUESTO SOBRE NÓMINA</th>
                </tr>
            </thead>
        </table>
        <br>
        <hr>
        <table>
            <tr>
                <td>
                    <span>TOTAL CUOTAS PATRONALES : </span>
                </td>
                <td>
                    <input type="text" name="gran_total_cuotas_patronales" id="gran_total_cuotas_patronales">
                </td>
                <td>
                    <span>TOTAL IMPUESTO SOBRE NÓMINA : </span>
                </td>
                <td>
                    <input type="text" name="gran_total_impuesto_sobre_nomina" id="gran_total_impuesto_sobre_nomina">
                </td>
                <td>
                    <span>TOTAL CUOTAS OBRERAS : </span>
                </td>
                <td>
                    <input type="number" name="gran_total_cuotas_obreras" id="gran_total_cuotas_obreras" value="0">
                </td>
                <td>
                    <span>TOTAL CARGA SOCIAL : </span>
                </td>
                <td>
                    <input type="text" name="total_carga_social" id="total_carga_social">
                </td>
            </tr>
        </table>
        <br>
        <hr>
        <h1>COTIZADOR IMSS PROPUESTO</h1>
        <table class="tabla-alta" id="cotizador-imss-propuesto">
            <thead>
                <tr>
                    <th class="listado-th">CONS</th>
                    <th class="listado-th">SALARIO DIARIO</th>
                    <th class="listado-th">SD INTEGRADO</th>
                    <th class="listado-th">SB DE COTIZACIÓN</th>
                    <th class="listado-th">DÍAS TRABAJADOS</th>
                    <th class="listado-th">SUELDO</th>
                    <th class="listado-th">PRIMA RIESGO</th>
                    <th class="listado-th">RIESGO DE TRABAJO</th>
                    <th class="listado-th">UMA</th>
                    <th class="listado-th">CUOTA FIJA</th>
                    <th class="listado-th">EXCEDENTE PATRONAL</th>
                    <th class="listado-th">EXCEDENTE OBRERO</th>
                    <th class="listado-th">PRESTACIONES ESPECIE P</th>
                    <th class="listado-th">PRESTACIONES ESPECIE O</th>
                    <th class="listado-th">PRESTACIONES DINERO P</th>
                    <th class="listado-th">PRESTACIONES DINERO O</th>
                    <th class="listado-th">SEGURO INVALIDEZ VIDA P</th>
                    <th class="listado-th">SEGURO INVALIDEZ VIDA O</th>
                    <th class="listado-th">SEGURO RETIRO</th>
                    <th class="listado-th">CESENTIA EDAD PATRON</th>
                    <th class="listado-th">CESENTIA EDAD OBRERO</th>
                    <th class="listado-th">GUARDERIAS</th>
                    <th class="listado-th">INFONAVIT</th>
                    <th class="listado-th">TOTAL CUOTAS PATRONALES</th>
                    <th class="listado-th">TOTAL CUOTAS OBRERAS</th>
                    <th class="listado-th">TOTAL LIQ. IMSS</th>
                    <th class="listado-th">IMPUESTO SOBRE NÓMINA</th>
                </tr>
            </thead>
        </table>
        <br>
        <hr>
        <table>
            <tr>
                <td>
                    <span>TOTAL CUOTAS PATRONALES PROPUESTA : </span>
                </td>
                <td>
                    <input type="text" name="gran_total_cuotas_patronales_propuesta" id="gran_total_cuotas_patronales_propuesta">
                </td>
                <td>
                    <span>TOTAL IMPUESTO SOBRE NÓMINA PROPUESTA : </span>
                </td>
                <td>
                    <input type="text" name="gran_total_impuesto_sobre_nomina_propuesta" id="gran_total_impuesto_sobre_nomina_propuesta">
                </td>
                <td>
                    <span>TOTAL CUOTAS OBRERAS PROPUESTA : </span>
                </td>
                <td>
                    <input type="number" name="gran_total_cuotas_obreras_propuesta" id="gran_total_cuotas_obreras_propuesta" value="0">
                </td>
                <td>
                    <span>TOTAL CARGA SOCIAL PROPUESTA : </span>
                </td>
                <td>
                    <input type="text" name="total_carga_social_propuesta" id="total_carga_social_propuesta">
                </td>
            </tr>
        </table>
        <br>
        <hr>
        <h1>CÁLCULO DE RETENCIONES DE ISR ESQUEMA REAL</h1>
        <table class="tabla-alta" id="cotizador-retisr">
            <thead>
                <tr>
                    <th class="listado-th">CONS.</th>
                    <th class="listado-th">INGRESOS OBT. X SALARIO</th>
                    <th class="listado-th">IMP. LOCAL RETENIDO TRA.</th>
                    <th class="listado-th">FACTO DE NOMINA</th>
                    <th class="listado-th">BASE GRAVABLE</th>
                    <th class="listado-th">LIM. INF. T. ART. 96 LISR</th>
                    <th class="listado-th">EXCEDENTE S/LIM. INFERIOR</th>
                    <th class="listado-th">% APLICABLE S/EXC. LIM. INF.</th>
                    <th class="listado-th">IMPUESTO MARGINAL</th>
                    <th class="listado-th">CUOTA FIJA</th>
                    <th class="listado-th">IMPUESTO SEGUN TARIFA ART. 96 LISR</th>
                    <th class="listado-th">SUBSIDIO EMPLEO SEGUN TABLA</th>
                    <th class="listado-th">SUBSIDIO EMPLEO ENTREGADO TRABAJADOR</th>
                    <th class="listado-th">RETENCÓN ISR</th>
                </tr>
            </thead>
        </table>
        <br>
        <hr>
        <table>
            <tr>
                <td>
                    <span>Total Retencion ISR : </span>
                </td>
                <td>
                    <input type="text" name="gran_total_retencion_isr" id="gran_total_retencion_isr">
                </td>
            </tr>
        </table>
        <br>
        <hr>
        <h1>CÁLCULO DE RETENCIONES DE ISR ESQUEMA PROPUESTO</h1>
        <table class="tabla-alta" id="cotizador-retisr-propuesto">
            <thead>
                <tr>
                    <th class="listado-th">CONS</th>
                    <th class="listado-th">INGRESOS OBT. X SALARIO</th>
                    <th class="listado-th">FACTOR DE NOMINA</th>
                    <th class="listado-th">BASE GRAVABLE</th>
                    <th class="listado-th">LIM. INF. T. ART. 96 LISR</th>
                    <th class="listado-th">EXCEDENTE S/LIM. INFERIOR</th>
                    <th class="listado-th">% APLICABLE S/EXC. LIM. INF.</th>
                    <th class="listado-th">IMPUESTO MARGINAL</th>
                    <th class="listado-th">CUOTA FIJA</th>
                    <th class="listado-th">IMPUESTO SEGUN TARIFA ART. 96 LISR</th>
                    <th class="listado-th">SUBSIDIO EMPLEO SEGÚN TABLA</th>
                    <th class="listado-th">SUBSIDIO EMPLEO ENTREGADO TRABAJADOR</th>
                    <th class="listado-th">RETENCIÓN ISR</th>
                </tr>
            </thead>
        </table>
        <br>
        <hr>
        <table>
            <tr>
                <td>
                    <span>Total Retencion ISR Propuesto : </span>
                </td>
                <td>
                    <input type="number" name="gran_total_retencion_isr_propuesto" id="gran_total_retencion_isr_propuesto" value="0">
                </td>
            </tr>
        </table>
        <br>
        <hr>
        <h1>DETERMINACIÓN NÓMINA ESQUEMA REAL (100%)</h1>
        <table class="tabla-alta" id="cotizador-nomina-real">
            <thead>
                <tr>
                    <th class="listado-th">CONS.</th>
                    <th class="listado-th">DÍAS</th>
                    <th class="listado-th">SALARIO DIARIO</th>
                    <th class="listado-th">SALARIO DIARIO INTEGRADO</th>
                    <th class="listado-th">SUELDO</th>
                    <th class="listado-th">SUBSIDIO AL EMPLEO</th>
                    <th class="listado-th">TOTAL PERCEPCIONES</th>
                    <th class="listado-th">RETENCIÓN ISR</th>
                    <th class="listado-th">IMSS</th>
                    <th class="listado-th">TOTAL DEDUCCIONES</th>
                    <th class="listado-th">NETO NOMINA</th>
                </tr>
            </thead>
        </table>
        <br>
        <hr>
        <h1>DETERMINACIÓN NÓMINA ESQUEMA PROPUESTO (INDEMNIZACIÓN)</h1>
        <table class="tabla-alta" id="cotizador-nomina-propuesta">
            <thead>
                <tr>
                <th class="listado-th">CONS.</th>
                    <th class="listado-th">DÍAS</th>
                    <th class="listado-th">SALARIO DIARIO</th>
                    <th class="listado-th">SALARIO DIARIO INTEGRADO</th>
                    <th class="listado-th">SUELDO</th>
                    <th class="listado-th">INDEMNIZACIÓN</th>
                    <th class="listado-th">SUBSIDIO AL EMPLEO</th>
                    <th class="listado-th">TOTAL PERCEPCIONES</th>
                    <th class="listado-th">RETENCIÓN ISR</th>
                    <th class="listado-th">IMSS</th>
                    <th class="listado-th">INFONAVIT</th>
                    <th class="listado-th">TOTAL DEDUCCIONES</th>
                    <th class="listado-th">NETO NOMINA</th>
                </tr>
            </thead>
        </table>
        <br>
        <hr>
        <h1> CUADRO COMPARATIVO AHORRO </h1>

        <input type="hidden" name="isn_cuadro" id="isn_cuadro">
        <input type="hidden" name="isn_cuadro_propuesto" id="isn_cuadro_propuesto">
        <input type="hidden" name="ahorro_cuadro" id="ahorro_cuadro">
        <input type="hidden" name="porcentaje_cuadro" id="porcentaje_cuadro">
        <input type="hidden" name="cuota_patro_cuadro" id="cuota_patro_cuadro">
        <input type="hidden" name="cuota_patro_cuadro_propuesto" id="cuota_patro_cuadro_propuesto">
        <input type="hidden" name="ahorro_cuadro_propuesto" id="ahorro_cuadro_propuesto">
        <input type="hidden" name="porcentaje_cuadro_propuesto"  id="porcentaje_cuadro_propuesto">
        <input type="hidden" name="primer_total" id="primer_total"> 
        <input type="hidden" name="segundo_total" id="segundo_total">
        <input type="hidden" name="tercer_total" id="tercer_total" > 
        <input type="hidden" name="cuarto_total" id="cuarto_total" >
        <input type="hidden" name="isr_cuadro" id="isr_cuadro">
        <input type="hidden" name="isr_cuadro_propuesto" id="isr_cuadro_propuesto">
        <input type="hidden" name="ahorro_isr_cuadro" id="ahorro_isr_cuadro">
        <input type="hidden" name="porcentaje_isr_cuadro" id="porcentaje_isr_cuadro">
        <input type="hidden" name="cuota_obre_cuadro" id="cuota_obre_cuadro">
        <input type="hidden" name="cuota_obre_cuadro_propuesto" id="cuota_obre_cuadro_propuesto">
        <input type="hidden" name="ahorro_cuadro_obre_propuesto" id="ahorro_cuadro_obre_propuesto">
        <input type="hidden" name="porcentaje_cuadro_obre_propuesto" id="porcentaje_cuadro_obre_propuesto">
        <input type="hidden" name="primer_total_rat" id="primer_total_rat">
        <input type="hidden" name="segundo_total_rat" id="segundo_total_rat">
        <input type="hidden" name="tercer_total_rat" id="tercer_total_rat">
        <input type="hidden" name="cuarto_total_rat" id="cuarto_total_rat">
        <input type="hidden" name="ahorro_mensual" id="ahorro_mensual">
        <input type="hidden" name="ahorro_comision" id="ahorro_comision">
        <input type="hidden" name="ahorro_neto" id="ahorro_neto">
        <input type="hidden" name="ahorro_neto_anual" id="ahorro_neto_anual">

        <table class="tabla-alta" id="cuadro-comparativo">
            <thead>
                <th class="listado-th">CONCEPTO</th>
                <th class="listado-th">ESQUEMA NORMAL <br> NÓMINA 100% IMSS</th>
                <th class="listado-th">ESQUEMA PROPUESTO <br> IMSS  INDEMNIZACIÓN</th>
                <th class="listado-th">AHORRO</th>
                <th class="listado-th">PORCENTAJE DE AHORRO</th>
            </thead>
            <tr>
                <td><span class="titulo">CARGA SOCIAL PATRÓN</span></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td><span>IMPUESTO SOBRE NÓMINA</span></td>
                <td id="isn_cuadro_texto"></td>
                <td id="isn_cuadro_propuesto_texto"></td>
                <td id="ahorro_cuadro_texto"></td>
                <td id="porcentaje_cuadro_texto"></td>
            </tr>
            <tr>
                <td><span>CUOTAS PATRONALES</span></td>
                <td id="cuota_patro_cuadro_texto"></td>
                <td id="cuota_patro_cuadro_propuesto_texto"></td>
                <td id="ahorro_cuadro_propuesto_texto"></td>
                <td id="porcentaje_cuadro_propuesto_texto"></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td><span class="titulo">TOTALES</span></td>
                <td id="primer_total_texto"></td>         
                <td id="segundo_total_texto"></td>
                <td id="tercer_total_texto"></td>                
                <td id="cuarto_total_texto"></td>            
            </tr>
            <tr>
                <td><span class="titulo">RETENCIONES AL TRABAJADOR</span></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td><span>ISR RETENIDO AL TRABAJADOR</span></td>
                <td id="isr_cuadro_texto"></td>
                <td id="isr_cuadro_propuesto_texto"></td>
                <td id="ahorro_isr_cuadro_texto"></td>
                <td id="porcentaje_isr_cuadro_texto"></td>
            </tr>
            <tr>
                <td><span>CUOTAS IMSS RETENIDAS AL TRABAJADOR</span></td>
                <td id="cuota_obre_cuadro_texto"></td>
                <td id="cuota_obre_cuadro_propuesto_texto"></td>
                <td id="ahorro_cuadro_obre_propuesto_texto"></td>
                <td id="porcentaje_cuadro_obre_propuesto_texto"></td>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td><span class="titulo">TOTALES</span></td>
                <td id="primer_total_rat_texto"></td>               
                <td id="segundo_total_rat_texto"></td>
                <td id="tercer_total_rat_texto"></td>               
                <td id="cuarto_total_rat_texto"></td>           
            </tr>
            <tr>
                <td></td>
                <td colspan="2"><span> AHORRO MENSUAL </span></td>
                <td id="ahorro_mensual_texto" ></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td colspan="2"><span> COMISIÓN </span></td>
                <td id="ahorro_comision_texto" ></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td colspan="2"><span class="titulo">  AHORRO NETO </span></td>
                <td id="ahorro_neto_texto" ></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td></td>
                <td colspan="2" class="listado-th"><span class="titulo" style="color: white;">  AHORRO NETO ANUAL</span></td>
                <td id="ahorro_neto_anual_texto" class="listado-th" style="color:  white;" ></td>
                <td></td>
                <td></td>
            </tr>
        <table>

        <input type="hidden" name="total_fact_indemnizacion" id="total_fact_indemnizacion">
        <input type="hidden" name="total_comis_fact_comision" id="total_comis_fact_comision">
        <input type="hidden" name="subtotal_fact_comision" id="subtotal_fact_comision">
        <input type="hidden" name="iva_fact_comision" id="iva_fact_comision">
        <input type="hidden" name="total_fact_comision" id="total_fact_comision">

        <table class="tabla-alta" id="cuadro-comparativo-facturacion">
            <tr><td colspan="3"  class="listado-th" style="color: white;">FACTURACIÓN </td></tr>
            <tr>
                <td>INDEMNIZACIONES</td>
                <td>
                </td>
                <td id="total_fact_indemnizacion_texto">
                </td>
            </tr>
            <tr>
                <td>COMISIÓN</td>
                <td>
                </td>
                <td id="total_comis_fact_comision_texto">
                </td>
            </tr>
            <tr>
                <td>SUBTOTAL</td>
                <td>
                </td>
                <td id="subtotal_fact_comision_texto">
                    
                </td>
            </tr>
            <tr>
                <td>I.V.A.</td>
                <td>
                </td>
                <td id="iva_fact_comision_texto">
                    
                </td>
            </tr>
            <tr>
                <td>TOTAL FACTURA</td>
                <td>
                </td>
                <td id="total_fact_comision_texto">
                </td>
            </tr>
        </table>
    </div>

    <div class="new-flotante">
        <a href=""  
        onclick="tablesToExcel(['tabla-nomina','cotizador-imss-real','cotizador-imss-propuesto','cotizador-retisr','cotizador-retisr-propuesto','cotizador-nomina-real','cotizador-nomina-propuesta','cuadro-comparativo-facturacion'], 
        ['DATOS','COTIZADOR IMSS REAL','COTIZADOR IMSS PROPUESTO','CALCULO ISR REAL NOMINA','CALCULO ISR PROPUESTO','NOMINA REAL','NOMINA  PROPUESTO','ejemplo'],'Cotizacion.xls', 'Excel')">
            <img src="/views/img/excel.png" alt="">
        </a>
    </div>
    

    <div class="new-flotante" id="segundo-flotante">
        <a href="" onclick="getPDF()">
            <img src="/views/img/pdf.png" alt="">
        </a>
    </div>
</div>
