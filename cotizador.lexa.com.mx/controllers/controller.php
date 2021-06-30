<?php
require_once "./models/crud.php";
class MvcController{
	
	#LLAMADA A LA PLANTILLA USUARIO
	#-------------------------------------
	public function pagina(){	
		include "views/template.php";
	}

	#ENLACES USUARIO
	#-------------------------------------
	public function enlacesPaginasController(){
		if(isset( $_GET['action'])){
			$enlaces = $_GET['action'];
		} else {
			$enlaces = "index";
		}
		$respuesta = Paginas::enlacesPaginasModel($enlaces);
		include $respuesta;
	}

    #LLAMADA A LA PLANTILLA ADMINISTRADOR
	#-------------------------------------
	public function paginaAdministrador(){	
		include "views/templateAdministrador.php";
	}

    #ENLACES ADMINISTRADOR
	#-------------------------------------
	public function enlacesPaginasUsuarioController(){
		if(!empty( $_GET['action'])){
			$enlaces = $_GET['action'];
		} else {
			$enlaces = "index";
		}
		$respuesta = paginasAdministrador::enlacesPaginasUsuarioModel($enlaces);
		include $respuesta;
	}

	#REGISTRO DE USUARIOS
	#------------------------------------
	public static function registroUsuarioController(){
		if(isset($_POST["nombre_completo"])){
			$datosController = array( "nombre_completo"=>$_POST["nombre_completo"], 
								      "email"=>$_POST["email"],
									  "username"=>$_POST["username"],
									  "contrasena"=>$_POST["contrasena"], 
                                      "id_perfil"=>$_POST["id_perfil"],                                      
									  "id_empresa_u"=>$_POST["id_empresa_u"]);
			$respuesta = Datos::registroUsuarioModel($datosController, "usuarios");
            $link = "index.php?action=usuarios/listadoUsuarios";
            if($respuesta == "success"){
                echo "<script>
                        registroOK('". $link ."');
                    </script>";
            }else{
                echo "<script>
                        errorRegistro('". $respuesta[2] ."','". $link ."');
                    </script>";
            }
		}
	}

	#INGRESO DE USUARIOS
	#------------------------------------
    public static function ingresoUsuarioController(){
        require_once "./models/crud.php";
		if(isset($_POST["username_i"])){
			$datosController = array( "username"=>$_POST["username_i"],
								      "contrasena"=>$_POST["contrasena"]);         
			$respuesta = Datos::ingresoUsuarioModel($datosController, "usuarios");
            if(password_verify($_POST["contrasena"], $respuesta["password"])){	
                $_SESSION["autentificado"] = "SI";
				$_SESSION["id_usuario"] = $respuesta["id_usuario"];
                $_SESSION["nombreCompleto"] = $respuesta["nombre_completo"];
                $_SESSION["id_perfil"] = $respuesta["id_perfil"];
                $_SESSION["id_empresa"] = $respuesta["id_empresa_u"];
                $_SESSION["timeout"] = time();
            echo "<script>bienvenida('".$_SESSION["nombreCompleto"]."')</script>";
			} else{
				return "error";		
			}
        }
	}	


	#VISTA DE USUARIOS
	#------------------------------------
	public static function vistaUsuariosController(){
		$respuesta = Datos::vistaUsuariosTablaModel("usuarios");
		#El constructor foreach proporciona un modo sencillo de iterar sobre arrays. foreach funciona sólo sobre arrays y objetos, y emitirá un error al intentar usarlo con una variable de un tipo diferente de datos o una variable no inicializada.
		foreach($respuesta as $row => $item){
			echo'<tr>
					<td>'.$item["id_usuario"].'</td>
					<td>'.$item["nombre_completo"].'</td>
					<td>'.$item["email"].'</td>
					<td>'.$item["username"].'</td>
					<td>'.$item["contrasena"].'</td>
					<td>'.$item["id_perfil"].'</td>
					<td>'.$item["activo"].'</td>
					<td>'.$item["id_empresa_u"].'</td>
					<td><a href="index.php?action=usuarios/editarUsuario&id_usuario_editar='.$item["id_usuario"].'"><img src="/views/img/editar.png" class="img-25"></img></a></td>
					<td><a href="index.php?action=usuarios/listadoUsuarios&id_usuario_borrar='.$item["id_usuario"].'"><img src="/views/img/eliminar.png" class="img-25"></img></a></td>
				</tr>';
			}
	}

    #BORRAR USUARIO
	#------------------------------------
	public function borrarUsuarioController(){
		if(isset($_GET["id_usuario_borrar"])){
			$datosController = $_GET["id_usuario_borrar"];
			$respuesta = Datos::borrarGeneralModel($datosController, "usuarios", "id_usuario");
            $link = "index.php?action=usuarios/listadoUsuarios";
			if($respuesta == "success"){
                echo "<script>
                        borrarOk('".$link."');
                    </script>";
			}else{
                $valor = $respuesta[2];
                $error = str_replace("'", "", $valor);
                echo '<script>
                        errorRegistro('."'".$error."','".$link."'".');
                    </script>';
		    }
		}
	}

	#EDITAR USUARIO
	#------------------------------------
	public function editarUsuarioController(){
		$datosController = $_GET["id_usuario_editar"];
		$respuesta = Datos::editarGralIdModel($datosController, "usuarios", "id_usuario");
		return $respuesta;
	}

	#ACTUALIZAR USUARIO
	#------------------------------------
	public function actualizarUsuarioController(){
		if(isset($_POST["id_usuario_actualizar"])){
			$datosController = array( "id_usuario"=>$_POST["id_usuario_actualizar"],
                                      "nombre_completo"=>$_POST["nombre_completo"],
							          "email"=>$_POST["email"],
				                      "username"=>$_POST["username"],
									  "contrasena"=>$_POST["contrasena"],
									  "id_perfil"=>$_POST["id_perfil"],
                                      "activo"=>$_POST["activo"],
									  "id_empresa_u"=>$_POST["id_empresa_u"]);
			$respuesta = Datos::actualizarUsuarioModel($datosController, "usuarios");
            $url ="index.php?action=usuarios/listadoUsuarios";
			if($respuesta == "success"){
                echo "<script>
                        actualizarOK('". $url . "');
                    </script>";
            } else {
				echo "<script> 
                        errorRegistro('". $respuesta[2] . "','" . $url . "');
                    </script>";
			}
		}
	}

	#VISTA DE EMPRESAS SELECT
	#------------------------------------
	public static function vistaEmpresasSelectController(){
		$respuesta = Datos::vistaGeneralTablaModel("empresa");
		#El constructor foreach proporciona un modo sencillo de iterar sobre arrays. foreach funciona sólo sobre arrays y objetos, y emitirá un error al intentar usarlo con una variable de un tipo diferente de datos o una variable no inicializada.
		echo"<option value='0' disabled selected>Selecciona una empresa . . . </option>";
        foreach($respuesta as $row => $item){
		echo"<option value='". $item['id_empresa']."'>".$item['razon_social']."</option>";
		}
	}

	#VISTA DE EMPRESAS SELECTED
	#------------------------------------
	public static function vistaEmpresasSelectedController($id_empresa){
		$respuesta = Datos::vistaGeneralTablaModel("empresa");
        foreach($respuesta as $row => $item){
            if($id_empresa == $item['id_empresa'])
		        echo"<option value='". $item['id_empresa']."' selected>".$item['razon_social']."</option>";
            else
                echo"<option value='". $item['id_empresa']."'>".$item['razon_social']."</option>";
		}
	}

	#REGISTRO DE EMPRESA NUEVA
	#------------------------------------
	public static function registroEmpresaController(){
		if(isset($_POST["razon_social"])){
			$datosController = array( "razon_social"=>strtoupper($_POST["razon_social"]));
			$respuesta = Datos::registroEmpresaModel($datosController, "empresa");
            $link = "index.php?action=empresas/listadoEmpresas";
            if($respuesta == "success"){
                echo "<script>
                        registroOK('". $link ."');
                    </script>";
            }else{
                echo "<script>
                        errorRegistro('". $respuesta[2] ."','". $link ."');
                    </script>";
            }
		}
	}

	#ACTUALIZAR EMPRESA
	#------------------------------------
	public function actualizarEmpresaController(){
		if(isset($_POST["id_empresa_editar"])){
			$datosController = array( "id_empresa"=>$_POST["id_empresa_editar"],
							          "razon_social"=>strtoupper($_POST["razon_social"]));
			$respuesta = Datos::actualizarEmpresaModel($datosController, "empresa");
            $url ="index.php?action=empresas/listadoEmpresas";
			if($respuesta == "success"){
                echo "<script>
                        actualizarOK('". $url . "');
                    </script>";
            } else {
				echo "<script> 
                        errorRegistro('". $respuesta[2] . "','" . $url . "');
                    </script>";
			}
		}
	
	}
	
	#VISTA DE EMPRESAS TABLA
	#------------------------------------
	public static function vistaEmpresasTablaController(){
		$respuesta = Datos::vistaGeneralTablaModel("empresa");
		#El constructor foreach proporciona un modo sencillo de iterar sobre arrays. foreach funciona sólo sobre arrays y objetos, y emitirá un error al intentar usarlo con una variable de un tipo diferente de datos o una variable no inicializada.
		foreach($respuesta as $row => $item){
			echo'<tr>
					<td>'.$item["id_empresa"].'</td>
					<td>'.$item["razon_social"].'</td>
					<td><a href="index.php?action=empresas/editarEmpresa&id_empresa_editar='.$item["id_empresa"].'&razon_social='.$item["razon_social"].'"><img src="/views/img/editar.png" class="img-25"></img></a></td>
					<td><a href="#openModalEliminar" onclick="clickactionEliminar(this)" id="'.$item["id_empresa"].'"><img src="/views/img/eliminar.png" class="img-25"></img></a></td>
				</tr>';
			}
	}

	#BORRAR EMPRESA
	#------------------------------------
	public function borrarEmpresaController(){
		if(isset($_GET["id_empresa_borrar"])){
			$datosController = $_GET["id_empresa_borrar"];
			$respuesta = Datos::borrarGeneralModel($datosController, "empresa", "id_empresa");
            $link = "index.php?action=empresas/listadoEmpresas";
			if($respuesta == "success"){
                echo "<script>
                        borrarOk('".$link."');
                    </script>";
			}else{
                $valor = $respuesta[2];
                $error = str_replace("'", "", $valor);
                echo '<script>
                        errorRegistro('."'".$error."','".$link."'".');
                    </script>';
		    }
		}
	}

    #REGISTRO DE AÑO
	#------------------------------------
	public static function registroAnioController(){
		if(isset($_POST["descrip_anio"])){
			$datosController = array( "descrip_anio"=>$_POST["descrip_anio"]);
			$respuesta = Datos::registroAnioModel($datosController, "anios");
            $link = "index.php?action=valores/anio/listadoAnios";
            if($respuesta == "success"){
                echo "<script>
                        registroOK('". $link ."');
                    </script>";
            }else{
                echo "<script>
                        errorRegistro('". $respuesta[2] ."','". $link ."');
                    </script>";
            }
		}
	}

   	#VISTA DE AÑOS FISCALES
	#------------------------------------
	public static function vistaAniosTablaController(){
		$respuesta = Datos::vistaGeneralTablaModel("anios");
		return $respuesta;
	}

    #VISTA DE AÑOS FISCALES PARA SELECT
	#------------------------------------
	public static function vistaAniosSelectController(){
		$respuesta = Datos::vistaGeneralTablaModel("anios");
            echo"<option value='' selected disabled>Selecciona un año fiscal</option>";
        foreach($respuesta as $row => $item){
		    echo"<option value='". $item['id_anio']."'>".$item['descrip_anio']."</option>";
		}
	}

    #REGISTRO DE CATEGORIA IMSS
	#------------------------------------
	public static function registroCatImssController(){
		if(isset($_POST["descripcion_cat_imss"])){
			$datosController = array("descripcion_cat_imss"=>$_POST["descripcion_cat_imss"]);
			$respuesta = Datos::registroCatImssModel($datosController, "categoria_imss");
            $link = "index.php?action=valores/imss/listadoCategoriasImss";
            if($respuesta == "success"){
                echo "<script>
                        registroOK('". $link ."');
                    </script>";
            }else{
                echo "<script>
                        errorRegistro('". $respuesta[2] ."','". $link ."');
                    </script>";
            }
		}
	}
    
    #VISTA DE CATEGORIA IMSS
	#------------------------------------
    public static function vistaCategoriasImssTablaController(){
		$respuesta = Datos::vistaGeneralTablaModel("categoria_imss");
        return $respuesta;
    }

    #VISTA DE CATEGORIAS IMSS PARA SELECT
	#------------------------------------
	public static function vistaCategoriasImssSelectController(){
		$respuesta = Datos::vistaGeneralTablaModel("categoria_imss");
		#El constructor foreach proporciona un modo sencillo de iterar sobre arrays. foreach funciona sólo sobre arrays y objetos, y emitirá un error al intentar usarlo con una variable de un tipo diferente de datos o una variable no inicializada.
		echo"<option value='0' disabled selected>Selecciona una categoria imss . . . </option>";
        foreach($respuesta as $row => $item){
		echo"<option value='". $item['id_categoria_imss']."'>".$item['descripcion_cat_imss']."</option>";
		}
	}
 
    #VISTA DE CATEGORIAS IMSS PARA SELECTED
	#------------------------------------
	public static function vistaCategoriasImssSelectedController($id_categoria_imss){
		$respuesta = Datos::vistaGeneralTablaModel("categoria_imss");
		#El constructor foreach proporciona un modo sencillo de iterar sobre arrays. foreach funciona sólo sobre arrays y objetos, y emitirá un error al intentar usarlo con una variable de un tipo diferente de datos o una variable no inicializada.
		echo"<option value='0' disabled selected>Selecciona una categoria imss . . . </option>";
        foreach($respuesta as $row => $item){
            if($id_categoria_imss == $item["id_categoria_imss"])
		        echo"<option value='". $item['id_categoria_imss']."' selected>".$item['descripcion_cat_imss']."</option>";                
            else
                echo"<option value='". $item['id_categoria_imss']."'>".$item['descripcion_cat_imss']."</option>";

		}
	}

    #REGISTRO DE PARTIDAS IMSS
	#------------------------------------
	public static function registroPartidaImssController(){
		if(isset($_POST["concepto_imss"])){
			$datosController = array( "concepto_imss"=>strtoupper($_POST["concepto_imss"]), 
								      "porcentaje_trabajador"=>$_POST["porcentaje_trabajador"],
                                      "porcentaje_patron"=>$_POST["porcentaje_patron"],
                                      "fundamento_legal"=>$_POST["fundamento_legal"],
                                      "id_cat_concep_imss"=>$_POST["id_cat_concep_imss"]);
			$respuesta = Datos::registroPartidaImssModel($datosController, "imss");
            $link = "index.php?action=valores/imss/listadoPartidasImss";
			if($respuesta == "success"){
                echo "<script>
                        registroOK('".$link."');
                    </script>";
			}else{
                $valor = $respuesta[2];
                $error = str_replace("'", "", $valor);
                echo '<script>
                        errorRegistro('."'".$error."','".$link."'".');
                </script>';
			}
		}
	}
    
	public static function vistaPartidasImssTablaController(){
		$respuesta = Datos::vistaGeneralTablaModel("imss");
        return $respuesta;
    }

	  #VISTA PARA EDITAR PARTIDA IMSS
	  public static function editarPartidaImssController(){
        $datosController = $_GET["id_concepto_imss_editar"];
        $respuesta = Datos::editarGeneralModel($datosController, "imss", "id_concepto_imss");
        return $respuesta;
    }

     #ACTUALIZAR SERVICIO ATR
	#------------------------------------
	public function actualizarPartidaImssController(){
		if(isset($_POST["id_concepto_imss"])){
			$datosController = array( "id_concepto_imss"=>strtoupper($_POST["id_concepto_imss"]),
							          "porcentaje_trabajador"=>$_POST["porcentaje_trabajador"],
                                      "porcentaje_patron"=>$_POST["porcentaje_patron"],
				                      "fundamento_legal"=> $_POST["fundamento_legal"],
                                      "id_cat_concep_imss"=> $_POST["id_cat_concep_imss"]);
			$respuesta = Datos::actualizarPartidasImssModel($datosController, "imss");
            $url ="index.php?action=valores/imss/listadoPartidasImss";
			if($respuesta == "success"){
                echo "<script>
                        actualizarOK('". $url . "');
                    </script>";
            } else {
				echo "<script> 
                        errorRegistro('". $respuesta[2] . "','" . $url . "');
                    </script>";
			}
		}
	}

    #REGISTRO DE FACTOR DE NOMINA
	#------------------------------------
	public static function registroFactorNominaController(){
		if(isset($_POST["descrip_factorn"])){
			$datosController = array( "descrip_factorn"=>$_POST["descrip_factorn"], 
								      "cant_factorn"=>$_POST["cant_factorn"]);
			$respuesta = Datos::registroFactorNominaModel($datosController, "factor_nomina");
            $link = "index.php?action=valores/imss/listadoFactorNomina";
            if($respuesta == "success"){
                echo "<script>
                        registroOK('".$link."');
                    </script>";
            } else{           
                $valor = $respuesta[2];
                $error = str_replace("'", "", $valor);
                echo '<script>
                        errorRegistro('."'".$error."','".$link."'".');
                </script>';
            }
        }
    }
    
    #VISTA DE FACTOR DE NOMINA PARA TABLA
	public static function vistaFactorNominaTablaController(){
		$respuesta = Datos::vistaGeneralTablaModel("factor_nomina");
        return $respuesta;
    }
    
    #VISTA DE FACTOR DE NOMINA PARA SELECT
	#------------------------------------
	public static function vistaFactorNominaSelectController(){
		$respuesta = Datos::vistaGeneralTablaModel("factor_nomina");
            echo"<option value='' selected disabled>Selecciona un factor de nomina . . . </option>";
        foreach($respuesta as $row => $item){
		    echo"<option value='". $item['id_factorn']."'>".$item['descrip_factorn']."</option>";
		}
	}
 
    #REGISTRO DE TARIFA ISR
	#------------------------------------
    public static function registroTarifaIsrController(){
            if(isset($_POST["id_ano_tarifa"])){
                $datosController = array( "id_ano_tarifa"=>$_POST["id_ano_tarifa"],
                                          "id_factorn_tarifaisr"=>$_POST["id_factorn_tarifaisr"],
                                          "limite_inferior"=>$_POST["limite_inferior"],
                                          "limite_superior"=>$_POST["limite_superior"],
                                          "cuota_fija"=>$_POST["cuota_fija"],
                                          "por_s_excedente_li_inf"=>$_POST["por_s_excedente_li_inf"]);
                $respuesta = Datos::registroTarifaIsrModel($datosController, "tarifa_isr");
                $link = "index.php?action=valores/tarifaisr/listadoTarifaIsr";
                if($respuesta == "success"){
                    echo '<script>
                            registroOK("'.$link.'");
                        </script>';
                } else {
                    echo "<script>
                            errorRegistro('".$respuesta[2]  ,  $link ."');
                        </script>";
                }
            }
        }

    
    
    
        public function registroProcesoGeneralController(){
        require_once "./models/crud.php";
        if(isset($_POST["descripcion_proceso_general"])){
            $datosController = array("descripcion_proceso_general" => strtoupper($_POST["descripcion_proceso_general"]),
                                        "comentarios_proceso_general" => strtoupper($_POST["comentarios_proceso_general"]));
            $respuesta = Datos::registroProcesoGeneralModel($datosController, "procesos_general");
            $link = "index.php?action=Procesos/registrarProcesoGeneral";
            if($respuesta == "success"){
                echo '<script>
                        registroOK("'.$link.'");
                </script>';
            } else {
                echo "<script>
                        errorRegistro('".$respuesta[2]  ,  $link ."');
                    </script>";
            }
        }
    }

     //VISTA TARIFA ISR CON NOMBRE DEL AÑO Y FACTOR NOMINAL
     public function vistaTarifaIsrTablaController(){
        $respuesta = Datos::vistaTarifaIsrTablaModel("tarifa_isr");
        return $respuesta;
    }


    #REGISTRO DE TARIFA ISR
    #----------------------------------
    public function registroSubsidioEmpleoController(){
        if(isset($_POST["para_ingresos_de"])){
            $datosController = array("para_ingresos_de" => $_POST["para_ingresos_de"],
                                        "hasta_ingresos_de" => $_POST["hasta_ingresos_de"],
                                        "cant_sub_para_empleo" => $_POST["cant_sub_para_empleo"],
                                        "id_factorn_subsidio" => $_POST["id_factorn_subsidio"],
                                        "id_ano_subsidio" => $_POST["id_ano_subsidio"]);
            $respuesta = Datos::registroSubsidioEmpleoModel($datosController, "subsidio_empleo");
            $link = "index.php?action=valores/subsidioEmpleo/listadoSubsidioEmpleo";
            if($respuesta == "success"){
                echo '<script>
                        registroOK("'.$link.'");
                </script>';
            }else{
                echo "<script>
                        errorRegistro('".$respuesta[2] . "','" .  $link ."');
                    </script>";
            }
        }
    }    

    //VISTA DEL SUBISIO AL EMPLEO CON NOMBRE DEL AÑO Y FACTOR NOMINAL
     public function vistaSubsidioEmpleoTablaController(){
        $respuesta = Datos::vistaSubsidioEmpleoModel("subsidio_empleo");
        return $respuesta;
    }

  
    public static function registroPrimaMediaController(){
        if(isset($_POST["descripcion_pm"])){
            $datosController = array("descripcion_pm" => strtoupper($_POST["descripcion_pm"]),
                                    "en_por_cientos" => $_POST["en_por_cientos"]);
            $respuesta = Datos::registrarPrimaMediaModel($datosController, "prima_media");
            $link = "index.php?action=valores/primaMedia/listadoPrimaMedia";
            if($respuesta == "success"){
                echo "<script>
                        registroOK('". $link ."');
                    </script>";
            }else{
                echo "<script> 
                        errorRegistro('". $respuesta[2] . "','" . $link . "');
                    </script>";
            }
        }
    }

    public static function vistaPrimaMediaTablaController(){
        $respuesta = Datos::vistaGeneralTablaModel("prima_media");
        return $respuesta;
    }


    public static function registroSalarioMinimoController(){
        if(isset($_POST["id_ano_salario_min"])){
            $datosController = array("id_ano_salario_min" => $_POST["id_ano_salario_min"],
                                    "zona_geografica" => strtoupper($_POST["zona_geografica"]),
                                    "pesos" => $_POST["pesos"]);
            $respuesta = Datos::registrarSalarioMinimoModel($datosController, "salarios_minimos");
            $link = "index.php?action=valores/salarioMinimo/listadoSalarioMinimo";
            if($respuesta == "success"){
                echo "<script>
                        registroOK('".$link."');
                    </script>";
            }else{
                echo "<script>
                        errorRegistro('".$respuesta[2]."','".$link ."');    
                    </script>";
            }
        }
    }

    public static function vistaSalarioMinimoTablaController(){
		$respuesta = Datos::vistaSalarioMinimoTablaModel("salarios_minimos");
        return $respuesta;
    }

    public static function registroImpuestoNominaController(){
        if(isset($_POST["id_ano_tarifa"])){
            $datosController = array("id_ano_tarifa" => $_POST["id_ano_tarifa"],
                                    "entidad_federativa" => strtoupper($_POST["entidad_federativa"]),
                                    "porcentaje_impuesto" => $_POST["porcentaje_impuesto"],
                                    "sobre_tasa" => $_POST["sobre_tasa"]);
            $respuesta = Datos::registrarImpuestoNominaModel($datosController, "impuesto_sobre_nomina");
            $link = "index.php?action=valores/isn/listadoImpuestoNomina";
            if($respuesta == "success"){
                echo "<script>
                        registroOK('".$link."');
                    </script>";
            }else{
                echo "<script>
                        errorRegistro('".$respuesta[2]."','".$link."');
                    </script>";
            }
        }
    }

    public static function vistaImpuestoNominaTablaController(){
        $respuesta = Datos::vistaImpuestoNominaTablaModel("impuesto_sobre_nomina");
        return $respuesta;
    }

    #VISTA DE PROCESOS GENERAL SELECT
	#------------------------------------
	public static function vistaEntidadFederativaSelectController(){
		$respuesta = Datos::vistaGeneralTablaModel("impuesto_sobre_nomina");
        echo"<option value=''> Selecciona una entidad Federativa ... </option>";
        foreach($respuesta as $row => $item){
            echo"<option value='". $item['id_isn']."'>".$item['entidad_federativa']."</option>";
		}
	} 
    
    public static function registroSubsidioEmpleoExtraController(){
        if(isset($_POST["id_isn_entidad"])){
            $datosController = array("id_isn_entidad" => $_POST["id_isn_entidad"],
                                    "limite_inferior" => $_POST["limite_inferior"],
                                    "limite_superior" => $_POST["limite_superior"],
                                    "cuota_fija" => $_POST["cuota_fija"],
                                    "porc_excedente_li" => $_POST["porc_excedente_li"],
                                    "id_ano_entidad" => $_POST["id_ano_entidad"]);
            $link = "index.php?action=valores/isn/listadoImpuestoNominaExtra";
            $respuesta = Datos::registroSubsidioEmpleoExtraModel($datosController, "impuesto_sobre_nomina_extra");
            if($respuesta == "success"){
                echo "<script>
                        registroOK('".$link."');
                    </script>";
            }else{
                echo "<script>
                        errorRegistro('".$respuesta[2]."','".$link."');
                    </script>";
            }
        }
    }

    public static function vistaImpuestoNominaExtraTablaController(){
        $respuesta = Datos::vistaImpuestoNominaExtraTablaModel("impuesto_sobre_nomina_extra");
        return $respuesta;
    }

    public static function vistaEntidadFSelectController(){
        $respuesta = Datos::vistaGeneralTablaModel("impuesto_sobre_nomina");
        echo"<option value=''> Selecciona una entidad Federativa ... </option>";
        foreach($respuesta as $row => $item){
            echo"<option value='". $item['id_isn']."' data-por_imp='". $item['porcentaje_impuesto']."' data-sobretasa='". $item['sobre_tasa']."'  >".$item['entidad_federativa']."</option>";
		}
    }

    public static function vistaZonaGeograficaSelectController(){
        $respuesta = Datos::vistaGeneralTablaModel("salarios_minimos");
        echo"<option value=''> Selecciona una Zona Geografica ... </option>";
        foreach($respuesta as $row => $item){
            echo"<option value='". $item['id_salario_minimo']."' data-pesos='". $item['pesos']."' >".$item['zona_geografica']."</option>";
		}
    }

    public static function vistaPrimaMediaSelectController(){
        $respuesta = Datos::vistaGeneralTablaModel("prima_media");
        echo"<option value=''> Selecciona una Prima Media ... </option>";
        foreach($respuesta as $row => $item){
            echo"<option value='". $item['id_prima_media']."' data-enporcientos='". $item['en_por_cientos']."' >".$item['descripcion_pm']."</option>";
		}
    }
    
    public static function vistaFactorNominaPSelectController(){
        $respuesta = Datos::vistaGeneralTablaModel("factor_nomina");
        echo"<option value=''> Selecciona una Prima Media ... </option>";
        foreach($respuesta as $row => $item){
            echo"<option value='". $item['id_factorn']."' data-dias='". $item['cant_factorn']."' data-factor-dec='". $item['factor_dec']."' >".$item['descrip_factorn']."</option>";
		}
    }

    public static function vistaUMAController(){
        $respuesta = Datos::vistaUMATablaModel("uma");
        foreach($respuesta as $row => $item){
            echo"<input type='hidden' id='uma' name='uma' value='". $item['importe_uma']."'>";
		}
    }
    
    public static function vistaCuotaFijaController(){
        $respuesta = Datos::vistaCuotaFijaTablaModel("imss");
        foreach($respuesta as $row => $item){
            echo"<input type='hidden' id='cuota_fija' name='cuota_fija' value='". $item['porcentaje_patron']."'>";
		}
    }

    public static function vistaPrestacionesEspecieController(){
        $respuesta = Datos::vistaPrestacionesEspecieTablaModel("imss");
        foreach($respuesta as $row => $item){
            echo"<input type='hidden' id='prestaciones_especie_p' name='prestaciones_especie_p' value='". $item['porcentaje_patron']."'>";
            echo"<input type='hidden' id='prestaciones_especie_o' name='prestaciones_especie_o' value='". $item['porcentaje_trabajador']."'>";
		}
    }

    public static function vistaPrestacionesDineroController(){
        $respuesta = Datos::vistaPrestacionesDineroTablaModel("imss");
        foreach($respuesta as $row => $item){
            echo"<input type='hidden' id='prestaciones_dinero_p' name='prestaciones_dinero_p' value='". $item['porcentaje_patron']."'>";
            echo"<input type='hidden' id='prestaciones_dinero_o' name='prestaciones_dinero_o' value='". $item['porcentaje_trabajador']."'>";
		}
    }
    
    public static function vistaSeguroInvalidezVidaController(){
        $respuesta = Datos::vistaSeguroInvalidezVidaModel("imss");
        foreach($respuesta as $row => $item){
            echo"<input type='hidden' id='seguro_invalidez_vida_p' name='seguro_invalidez_vida_p' value='". $item['porcentaje_patron']."'>";
            echo"<input type='hidden' id='seguro_invalidez_vida_o' name='seguro_invalidez_vida_o' value='". $item['porcentaje_trabajador']."'>";
		}
    }
    
    public static function vistaRetiroController(){
        $respuesta = Datos::vistaRetiroModel("imss");
        foreach($respuesta as $row => $item){
            echo"<input type='hidden' id='retiro' name='retiro' value='". $item['porcentaje_patron']."'>";
		}
    }
    
    public static function vistaCesentiaEdadAvanzadaVejezController(){
        $respuesta = Datos::vistaCesentiaEdadAvanzadaVejezModel("imss");
        foreach($respuesta as $row => $item){
            echo"<input type='hidden' id='cesentia_edad_avanz_vejez_p' name='cesentia_edad_avanz_vejez_p' value='". $item['porcentaje_patron']."'>";
            echo"<input type='hidden' id='cesentia_edad_avanz_vejez_o' name='cesentia_edad_avanz_vejez_o' value='". $item['porcentaje_trabajador']."'>";
		}
    }

    public static function vistaGuarderiasPrestacionesSocialesController(){
        $respuesta = Datos::vistaGuarderiasPrestacionesSocialesModel("imss");
        foreach($respuesta as $row => $item){
            echo"<input type='hidden' id='guarderias_prest_soc' name='guarderias_prest_soc' value='". $item['porcentaje_patron']."'>";
		}
    }
    
    public static function vistaInfonavitController(){
        $respuesta = Datos::vistaInfonavitModel("imss");
        foreach($respuesta as $row => $item){
            echo"<input type='hidden' id='infonavit' name='infonavit' value='". $item['porcentaje_patron']."'>";
		}
    }

    public static function vistaTotalPorcentajeTrabajadorController(){
        $respuesta = Datos::vistaTotalPorcentajeTrabajadorModel("imss");
        foreach($respuesta as $row => $item){
            echo"<input type='hidden' id='total_porcentaje_trabajador' name='total_porcentaje_trabajador' value='". $item['total_porcentaje_trabajador']."'>";
		}
    }

    
#OBTENER NOMBRE DE LA EMPRESA DEL USUARIO
	#------------------------------------
    public static function vistaEmpresaUsuarioController(){
		if($_SESSION["id_empresa"]){
			$datosController = array("id_empresa_u"=>$_SESSION["id_empresa"]);         
			$respuesta = Datos::vistaEmpresaUsuarioModel($datosController, "empresa");
            if(isset($respuesta)){
                return $respuesta;
			}
        }
	}	


    
}
?>