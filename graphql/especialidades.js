import { gql } from 'graphql-request'

export default {
  GET_ESPECIALIDADES_TABLE: gql`
    query getEspecialidadesTabla {
      getEspecialidadesTabla {
        co_especialidad
        nb_especialidad
        co_locacion
        nb_locacion
        co_especialidad_locacion
        bl_activo
        bl_orden
        bl_personal_disponible
      }
    }
  `,
  GET_CREAR_ESPE_LOCACIONES: gql`
    query {
      getLocacionesCrearEspe {
        name
        code
      }
    }
  `,
  INSERT_ESPECIALIDAD: gql`
    mutation insertarEspecialidad(
      $inputCrearEspecialidad: inputCrearEspecialidad!
    ) {
      insertarEspecialidad(inputCrearEspecialidad: $inputCrearEspecialidad) {
        status
        message
        type
      }
    }
  `,
  ELIMINAR_ESPECIALIDAD: gql`
    mutation eliminarEspecialidad($codigoEspecialidadPersonal: Int!) {
      eliminarEspecialidad(
        codigoEspecialidadPersonal: $codigoEspecialidadPersonal
      ) {
        status
        message
        type
      }
    }
  `,
  UPDATE_ESTADO: gql`
    mutation actualizarEspecialidad(
      $codigoEspecialidadLocacion: Int!
      $distinc: Boolean!
    ) {
      actualizarEspecialidad(
        codigoEspecialidadLocacion: $codigoEspecialidadLocacion
        distinc: $distinc
      ) {
        status
        message
        type
      }
    }
  `,
  UPDATE_CREAR_ESPECIALIDAD: gql`
    mutation updateActualizarRestriccion(
      $inputActualizarEspecialidad: inputActualizarEspecialidad
    ) {
      updateActualizarRestriccion(
        inputActualizarEspecialidad: $inputActualizarEspecialidad
      ) {
        status
        message
        type
        response{
          co_especialidad
          id_restriccion
          bl_restriccion_edad
          bl_edad_maxima_minima
          nu_edad
          bl_restriccion_sexo
          tx_sexo
        }
      }
    }
  `
}
