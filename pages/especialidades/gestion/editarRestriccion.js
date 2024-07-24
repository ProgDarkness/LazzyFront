import { Dialog } from 'primereact/dialog'
import { useState, useRef, useEffect } from 'react'
import { Button } from 'primereact/button'
import request from 'graphql-request'
import { Toast } from 'primereact/toast'
import { motion } from 'framer-motion'
import GQLEspecialidades from 'graphql/especialidades'
import { InputText } from 'primereact/inputtext'
import { ToggleButton } from 'primereact/togglebutton'
import useSWR from 'swr'

function EditarRestriccion({
  visibled,
  setVisibled,
  tokenQuery,
  rowDataEditar,
  setRowDataEditar
}) {
  const toast = useRef(null)
  const [incompleto, setIncompleto] = useState(false)
  const [restricEdad, setRestricEdad] = useState(false)
  const [maxMinEdad, setMaxMinEdad] = useState(false)
  const [edad, setEdad] = useState(null)
  const [restricSexo, setRestricSexo] = useState(false)
  const [sexo, setSexo] = useState("")

  const { data: restriccion } = useSWR(
    tokenQuery && rowDataEditar?.co_especialidad
      ? [
          GQLEspecialidades.UPDATE_CREAR_ESPECIALIDAD,
          {
            inputActualizarEspecialidad: {
              co_especialidad: rowDataEditar.co_especialidad,
              buscarDatosEspecialidad: true
            }
          },
          tokenQuery
        ]
      : null
  )

  console.log("rowDataEditar" + setRowDataEditar)

  console.log(restriccion)

  useEffect(() => {
    setRestricEdad(
      restriccion?.updateActualizarRestriccion.response.bl_restriccion_edad
    )
    setMaxMinEdad(
      restriccion?.updateActualizarRestriccion.response.bl_edad_maxima_minima
    )
    setEdad(restriccion?.updateActualizarRestriccion.response.nu_edad)
    setRestricSexo(
      restriccion?.updateActualizarRestriccion.response.bl_restriccion_sexo
    )
    setSexo(restriccion?.updateActualizarRestriccion.response.tx_sexo)
  }, [restriccion])

  /* {
    "co_especialidad": 1,
    "id_restriccion": 1,
    "bl_restriccion_edad": true,
    "bl_edad_maxima_minima": false,
    "nu_edad": 13,
    "bl_restriccion_sexo": true,
    "tx_sexo": "M"
} */

  const actualizarEspecialidad = (variables) => {
    return request(
      process.env.NEXT_PUBLIC_URL_BACKEND,
      GQLEspecialidades.UPDATE_CREAR_ESPECIALIDAD,
      variables,
      { authorization: `Bearer ${tokenQuery}` }
    )
  }

  function animation(input) {
    // eslint-disable-next-line prefer-const
    let container = {
      hidden: { opacity: 1, scale: 0 },
      visible: {
        opacity: 1,
        scale: [0, 1],
        transition: { delay: 0.02 }
      }
    }

    for (let i = 0; i < input; i++) {
      container.visible.transition.delay += 0.3
    }

    return container
  }

  function cerrarCrearEspecialidad() {
    setVisibled(false)
    setIncompleto(false)
    setRowDataEditar(null)
  }

  function EditarEspecialidad(e) {
    e.preventDefault()

    const inputActualizarEspecialidad = {
      co_especialidad: rowDataEditar?.co_especialidad,
      buscarDatosEspecialidad: false,
      bl_restriccion_edad: restricEdad,
      bl_edad_maxima_minima: maxMinEdad,
      nu_edad: parseInt(edad),
      bl_restriccion_sexo: restricSexo,
      tx_sexo: sexo
    }

    actualizarEspecialidad({ inputActualizarEspecialidad }).then(
      ({ updateActualizarRestriccion: { status, message, type } }) => {
        toast.current.show({
          severity: type,
          summary: 'Atención',
          detail: message,
          life: 3000
        })
      }
    )
  }

  const header = (
    <motion.div
      variants={animation(1)}
      initial="hidden"
      animate="visible"
      style={{ fontSize: '27px', fontWeight: '600', textAlign: 'center' }}
      className="bg-[#2a7e87] text-white w-80 redondeo-xl"
    >
      <h1>Editar Restricciones</h1>
    </motion.div>
  )

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        header={header}
        visible={visibled}
        className="w-[40vw] md:w-[50vw]"
        onHide={() => {
          cerrarCrearEspecialidad()
        }}
        resizable={false}
        draggable={false}
        contentClassName="redondeo-dialog-content"
        headerClassName="redondeo-dialog-header"
        position="top-right"
      >
        <div className="grid grid-cols-6 gap-4">
          <motion.center
            variants={animation(2)}
            initial="hidden"
            animate="visible"
            className="col-span-6"
          >
            <div
              style={{ fontSize: '20px', fontWeight: '600' }}
              className="bg-[#2a7e87] text-white w-[45%] redondeo-xl"
            >
              <h1>RESTRICCIONES POR EDAD</h1>
            </div>
          </motion.center>

          <div className="field col-span-2">
            <motion.span
              variants={animation(3)}
              initial="hidden"
              animate="visible"
              className="p-float-label flex"
            >
              <h1 className="mt-[3%] mr-[3%]">¿Restricción de edad?</h1>
              <ToggleButton
                checked={restricEdad}
                onChange={(e) => setRestricEdad(e.value)}
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                aria-label="Confirmación"
                onLabel="SI"
                offLabel="NO"
              />
            </motion.span>
          </div>

          {restricEdad === true && (
            <div className="field col-span-2">
              <motion.span
                variants={animation(3)}
                initial="hidden"
                animate="visible"
                className="p-float-label flex"
              >
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-1">
                  <h1 className="mt-[3%] mr-[3%]">¿Edad Maxima o Minima?</h1>
                  <ToggleButton
                    checked={maxMinEdad}
                    onChange={(e) => setMaxMinEdad(e.value)}
                    aria-label="Confirmación"
                    onLabel="Máxima"
                    offLabel="Mínima"
                  />
                </div>
              </motion.span>
            </div>
          )}
          {restricEdad === true && (
            <div className="field col-span-2 mx-auto">
              <motion.span
                variants={animation(3)}
                initial="hidden"
                animate="visible"
                className="p-float-label"
              >
                <InputText
                  id="username"
                  autoComplete="off"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  className={` ${
                    incompleto && edad === null ? 'border-red-600' : ''
                  }`}
                />
                <label htmlFor="username">Edad de restricción</label>
              </motion.span>
              {incompleto && edad === null && (
                <small className="block text-red-600 text-center">
                  Necesita registrar la edad.
                </small>
              )}
            </div>
          )}
          <motion.center
            variants={animation(2)}
            initial="hidden"
            animate="visible"
            className="col-span-6"
          >
            <div
              style={{ fontSize: '20px', fontWeight: '600' }}
              className="bg-[#2a7e87] text-white w-[45%] redondeo-xl"
            >
              <h1>RESTRICCIONES POR SEXO</h1>
            </div>
          </motion.center>
          <div className="field col-span-2">
            <motion.span
              variants={animation(3)}
              initial="hidden"
              animate="visible"
              className="p-float-label flex"
            >
              <h1 className="mt-[3%] mr-[3%]">¿Restricción por Sexo?</h1>
              <ToggleButton
                checked={restricSexo}
                onChange={(e) => setRestricSexo(e.value)}
                onIcon="pi pi-check"
                offIcon="pi pi-times"
                aria-label="Confirmación"
                onLabel="SI"
                offLabel="NO"
              />
            </motion.span>
          </div>
          {restricSexo === true && (
            <div className="field col-span-2">
              <motion.span
                variants={animation(3)}
                initial="hidden"
                animate="visible"
                className="p-float-label flex"
              >
                <h1 className="mt-[3%] mr-[3%]">Sexo</h1>
                <ToggleButton
                  checked={sexo}
                  onChange={(e) => setSexo(e.value)}
                  aria-label="Confirmación"
                  onLabel="Masculino"
                  offLabel="Femenino"
                />
              </motion.span>
            </div>
          )}
          <motion.center
            variants={animation(2)}
            initial="hidden"
            animate="visible"
            className="col-span-6"
          >
            <Button
              label="Editar"
              onClick={EditarEspecialidad}
              disabled={false}
            />
          </motion.center>
        </div>
        {/* eslint-disable-next-line react/no-unknown-property */}
        <style jsx global>{`
          .nacionalidad .p-button {
            min-width: 1rem !important;
          }
          .p-button:disabled {
            background: #3f51b5 !important;
            color: #ffffff !important;
            opacity: 1;
          }
          .nacionalidad .p-button.p-highlight {
            background: #3f51b5 !important;
            border-color: #3f51b5 !important;
            color: white !important;
          }
          .p-disabled .p-component:disabled {
            opacity: 0.5;
          }
          #DropDown .p-disabled,
          .p-component:disabled {
            opacity: 1;
          }
          .p-selectbutton .p-button.p-highlight {
            background: #2a7e87;
            border-color: #2a7e87;
            color: white;
          }
          button:not(button):not(a):not(.p-disabled):active {
            background: #2a7e87;
            border-color: #2a7e87;
            color: white;
          }
          .p-selectbutton .p-button:focus.p-highlight {
            background: #2a7e87;
            border-color: #2a7e87;
            color: white;
          }
          .redondeo-dialog-header {
            border-top-left-radius: 0.75rem !important;
            border-top-right-radius: 0px !important;
          }
          .redondeo-dialog-content {
            border-bottom-left-radius: 0.75rem !important;
            border-bottom-right-radius: 0.75rem !important;
          }
        `}</style>
      </Dialog>
    </>
  )
}

export default EditarRestriccion
