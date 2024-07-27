/* eslint-disable react/no-unknown-property */
import { useRef, useState } from 'react'
import AppLayout from 'components/AppLayout'
import { useRouter } from 'next/router'
import { request } from 'graphql-request'
import GQLLogin from 'graphql/login'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import CryptoJS from 'crypto-js'
import { Password } from 'primereact/password'
import { Dialog } from 'primereact/dialog'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// import the icons you need
import { faUser, faKey, faCheck } from '@fortawesome/free-solid-svg-icons'

export default function Index() {
  const router = useRouter()
  const toast = useRef(null)
  const [state, setState] = useState({
    usuario: '',
    clave_: '',
    captcha: JSON.parse(process.env.NEXT_PUBLIC_PRODUCTION) ? '' : 'abc'
  })
  const [correoUser, setCorreoUser] = useState(null)
  const [claveUser, setClaveUser] = useState(null)
  const [confirClave, setConfirClave] = useState(null)
  const [visiblebDialogNewUser, setVisiblebDialogNewUser] = useState(false)

  const login = (variables) => {
    return (
      request(process.env.NEXT_PUBLIC_URL_BACKEND, GQLLogin.LOGIN, variables) ||
      null
    )
  }

  const newUser = (variables) => {
    return (
      request(
        process.env.NEXT_PUBLIC_URL_BACKEND,
        GQLLogin.NEW_USER,
        variables
      ) || null
    )
  }

  const insertNewUser = (variables) => {
    return (
      request(
        process.env.NEXT_PUBLIC_URL_BACKEND,
        GQLLogin.INSERT_NEW_USER,
        variables
      ) || null
    )
  }

  const comprobarNewUser = () => {
    newUser({ cedula: parseInt(state.usuario) }).then(
      ({ newUser: { status, message, type, response } }) => {
        if (status === 201) {
          iniciarSesion()
        } else if (status === 200 && state.usuario === state.clave_) {
          setVisiblebDialogNewUser(true)
          toast.current.show({
            severity: type,
            summary: 'Info',
            detail: message,
            life: 8000
          })
        } else {
          toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Compruebe los datos de ingreso',
            life: 8000
          })
        }
      }
    )
  }
  /* 14965070 */
  const validarContraseña = () => {
    if (confirClave === claveUser) {
      insertNewUser({
        cedula: parseInt(state.usuario),
        correo: correoUser,
        clave: CryptoJS.AES.encrypt(
          claveUser,
          process.env.NEXT_PUBLIC_SECRET_KEY
        ).toString()
      }).then(({ inserNewUser: { status, message, type } }) => {
        setVisiblebDialogNewUser(false)
        toast.current.show({
          severity: type,
          summary: 'Atención',
          detail: message,
          life: 4000
        })
        setCorreoUser('')
        setClaveUser('')
        setConfirClave('')
        setState({
          usuario: '',
          clave_: '',
          captcha: JSON.parse(process.env.NEXT_PUBLIC_PRODUCTION) ? '' : 'abc'
        })
      })
    } else {
      toast.current.show({
        severity: 'warn',
        summary: 'Info',
        detail: 'La confirmacion no coincide con la contraseña',
        life: 4000
      })
    }
  }

  const iniciarSesion = () => {
    const input = {
      usuario: state.usuario,
      clave: CryptoJS.AES.encrypt(
        state.clave_,
        process.env.NEXT_PUBLIC_SECRET_KEY
      ).toString(),
      captcha: state.captcha
    }

    login({ input }).then(({ login }) => {
      const loginJson = JSON.parse(
        CryptoJS.AES.decrypt(
          login,
          process.env.NEXT_PUBLIC_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8)
      )
      const { status, message, response } = loginJson
      if (status === 200) {
        const { token, nameRuta } = response
        toast.current.show({
          severity: 'success',
          summary: 'Info',
          detail: message,
          life: 8000
        })

        sessionStorage.clear()
        sessionStorage.setItem('token', token)
        router.push(nameRuta)
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 1000
        })
        sessionStorage.clear()
      }
    })
  }

  const onEnter = (e) => {
    if (e.keyCode === 13 || e.charCode === 13) {
      document.querySelector('#btn-loguear').click()
    }
  }

  const onEnterR = (e) => {
    if (e.keyCode === 13 || e.charCode === 13) {
      document.querySelector('#btn-registrar').click()
    }
  }

  return (
    <AppLayout marca={false}>
      <Toast ref={toast} />
      <Dialog
        visible={visiblebDialogNewUser}
        resizable={false}
        draggable={false}
        showHeader={false}
        style={{ width: '450px', height: '400px' }}
        contentClassName="redondeo-xl"
        contentStyle={{ backgroundColor: '#00454d' }}
        onHide={() => {}}
      >
        <div className="flex justify-center">
          <div className="flex flex-col text-white w-[26rem] redondeo-xl mt-2 text-center">
            <div className="bg-[#2d8d97] redondeo-lg">
              <h1 style={{ fontSize: '30px', fontWeight: '600' }}>USUARIO</h1>
              <div>
                <p>Debe Registrar su correo y contraseña </p>
              </div>
              <div>
                <p>para ingresar al sistema</p>
              </div>
            </div>
            <div className="bg-[#babd2bcc] redondeo-lg mt-5">
              <div>
                <p>- La contraseña debe tener por lo menos 6 digitos</p>
              </div>
              <div>
                <p>- El correo debe ser una dirección válida @cne.gob.ve</p>
              </div>
            </div>
            <div className="p-inputgroup h-8 mt-5">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <InputText
                id="user"
                value={correoUser}
                autoComplete="off"
                placeholder="Correo electrónico"
                className="redondeo-input-addon"
                onChange={(e) => setCorreoUser(e.target.value)}
              />
            </div>
            <div className="p-inputgroup h-8 mt-5">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faKey} />
              </span>
              <Password
                id="password"
                placeholder="Contraseña"
                className="redondeo-input-addon"
                toggleMask
                value={claveUser}
                feedback={false}
                onKeyPress={onEnter}
                onChange={(e) => setClaveUser(e.target.value)}
              />
            </div>
            <div className="p-inputgroup h-8 mt-5">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <Password
                id="password"
                toggleMask
                placeholder="Confirmar Contraseña"
                className="redondeo-input-addon"
                value={confirClave}
                feedback={false}
                onKeyPress={onEnterR}
                onChange={(e) => setConfirClave(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 justify-items-center mt-3">
              <Button
                id="btn-registrar"
                icon="pi pi-sign-in"
                className="redondeo-lg w-40 h-6 bg-[#40b4bf] text-black"
                label="Entrar"
                disabled={
                  correoUser === null ||
                  !correoUser.includes('@cne.gob.ve') ||
                  claveUser === null ||
                  claveUser?.length < 6 ||
                  confirClave === null ||
                  confirClave?.length < 6
                }
                onClick={validarContraseña}
              />
            </div>
          </div>
        </div>
      </Dialog>
      <div className="w-full grid grid-cols-1">
        <div className="grid items-center">
          <div>
            <Card
              className="w-[25%] text-center bg-[#dbcdae] text-white redondeo-xl mb-12"
              style={{ marginLeft: 'auto', marginRight: 'auto' }}
            >
              <div className="grid grid-cols-1 gap-6 w-4/5 mx-auto">
                <h6
                  style={{
                    fontWeight: 'bold',
                    fontSize: 30,
                    fontFamily: 'Arial'
                  }}
                >
                  Inicio de Sesión
                </h6>
                <div className="p-inputgroup h-8">
                  <span className="p-inputgroup-addon span-sesion">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <InputText
                    keyfilter="pint"
                    id="user"
                    value={state.usuario}
                    maxLength={8}
                    autoComplete="off"
                    placeholder="Usuario"
                    className="redondeo-input-addon"
                    onChange={({ target: { value } }) =>
                      setState((ps) => ({ ...ps, usuario: value }))
                    }
                  />
                </div>
                <div className="p-inputgroup h-8">
                  <span className="p-inputgroup-addon span-sesion">
                    <FontAwesomeIcon icon={faKey} />
                  </span>
                  <Password
                    id="password"
                    placeholder="Contraseña"
                    className="redondeo-input-addon"
                    toggleMask
                    value={state.clave_}
                    feedback={false}
                    onKeyPress={onEnter}
                    onChange={({ target }) =>
                      setState((ps) => ({ ...ps, clave_: target.value }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 justify-items-center">
                  <Button
                    id="btn-loguear"
                    icon="pi pi-sign-in"
                    className="redondeo-lg w-40 h-6 bg-[#40b4bf] text-black"
                    label="Entrar"
                    disabled={state.usuario === '' || state.clave_ === ''}
                    onClick={comprobarNewUser}
                  />
                  <Button
                    id="btn-register"
                    icon="pi pi-user-plus"
                    className="redondeo-lg w-40 h-6 bg-[#40b4bf] text-black mt-3"
                    label="Registrate"
                    disabled={state.usuario === '' || state.clave_ === ''}
                    onClick={comprobarNewUser}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .item {
          width: 56%;
          overflow: visible;
          stroke: #fff;
          stroke-width: 2;
          stroke-linejoin: round;
          stroke-linecap: round;
        }

        circle,
        rect,
        line {
          stroke-width: 10px;
          stroke-linecap: round;
          fill: transparent;
        }
        #user,
        #password {
          /* border-top-right-radius: 0;
          border-bottom-right-radius: 0.5rem;
        border-top-right-radius: 9999px;*/
          /* border-bottom-right-radius: 9999px;*/
        }
        .span-sesion {
          border-top-left-radius: 0.5rem !important;
          border-bottom-left-radius: 0.5rem !important;
        }
      `}</style>
    </AppLayout>
  )
}
