import { AppLayoutMenus } from 'components/AppLayoutMenus/AppLayoutMenus'
import { useState, useEffect, useRef } from 'react'
import { useSesion } from 'hooks/useSesion'
import GQLLogin from 'graphql/login'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { ProgressSpinner } from 'primereact/progressspinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { InputText } from 'primereact/inputtext'
import { Toast } from 'primereact/toast'
import GQLdocumentoFoto from 'graphql/documentoFoto'
import usuario from 'public/images/usuario.png'
import request from 'graphql-request'
import { Card } from 'primereact/card'
import { ConfirmDialog } from 'primereact/confirmdialog'
import Image from 'next/image'
import { Button } from 'primereact/button'

export default function PerfilUsuario() {
  const router = useRouter()
  const rutaActive = router?.route
  const toast = useRef(null)
  const [imagenPerfil, setImagenPerfil] = useState(null)
  const [idImagenPerfil, setIdImagenPerfil] = useState(null)
  const { token, co_rol, cerrarSesion, co_usuario } = useSesion()
  const [dialogConfirmEliminarFotoPerfil, setDialogConfirmEliminarFotoPerfil] =
    useState(false)

  const { data: menu } = useSWR(
    token && co_rol
      ? [GQLLogin.GET_MENU, { idRol: parseInt(co_rol) }, token]
      : null
  )

  const { data: Acceso } = useSWR(
    rutaActive && co_rol
      ? [
          GQLLogin.GET_ACCESOS_ROL,
          { ruta: rutaActive, idRol: parseInt(co_rol) },
          token
        ]
      : null
  )

  const { data: fotoPerfil, mutate: mutateImage } = useSWR(
    co_usuario
      ? [GQLdocumentoFoto.GET_FOTO, { idUser: parseInt(co_usuario) }]
      : null
  )

  console.log(fotoPerfil)

  useEffect(() => {
    if (fotoPerfil?.obtenerFotoPerfilUsuario.response) {
      setImagenPerfil(fotoPerfil?.obtenerFotoPerfilUsuario.response.archivo)
      setIdImagenPerfil(fotoPerfil?.obtenerFotoPerfilUsuario.response.id)
    }
  }, [fotoPerfil])

  const handleReaderLoaded = (e) => {
    const binaryString = e.target.result
    const transImage = btoa(binaryString)
    /* setExtension(binaryString.type) */
    registraFoto(transImage)
  }

  const onChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = handleReaderLoaded.bind(this)
      reader.readAsBinaryString(file)
    }
  }

  const eliminarFotoEstudiante = (variables) => {
    return request(
      process.env.NEXT_PUBLIC_URL_BACKEND,
      GQLdocumentoFoto.ELIMINAR_FOTO,
      variables
    )
  }

  const acceptEliminarFotoPerfil = () => {
    const InputEliminarFotoPerfilUsuario = {
      idFotoEstudiante: parseInt(idImagenPerfil)
    }

    eliminarFotoEstudiante({ InputEliminarFotoPerfilUsuario }).then(
      ({ eliminarFotoEstudiante: { message } }) => {
        setIdImagenPerfil(null)
        toast.current.show({
          severity: 'error',
          summary: '¡ Atención !',
          detail: message
        })

        setImagenPerfil(null)
        setTimeout(() => {
          mutateImage()
        }, 1000)
      }
    )
  }

  function registraFoto(imagen) {
    const InputFotoEstudiante = {
      archivo: imagen,
      idUsuario: co_usuario
    }

    saveFotoPerfilUser({ InputFotoEstudiante }).then(
      ({ crearFotoEstudiante: { status, message, type } }) => {
        toast.current.show({
          severity: type,
          summary: '¡ Atención !',
          detail: message
        })
        setTimeout(() => {
          mutateImage()
        }, 1000)
      }
    )
  }

  const saveFotoPerfilUser = (imagen) => {
    return request(
      process.env.NEXT_PUBLIC_URL_BACKEND,
      GQLdocumentoFoto.SAVE_FOTO,
      imagen,
      co_usuario
    )
  }

  const adjuntarArchivo = () => {
    document.querySelector('#file').click()
  }

  const rejectEliminarFotoPerfil = () => {
    setDialogConfirmEliminarFotoPerfil(false)
  }

  const header = (
    <>
      {imagenPerfil ? (
        <img
          src={`data:image/png;base64,${imagenPerfil}`}
          width={40}
          height={50}
        />
      ) : (
        <Image
          src={usuario}
          loading="eager"
          fill="true"
          sizes="(max-width: 10vw) 40%"
          priority={true}
          className="rounded-lg"
        />
      )}
    </>
  )

  const footer = (
    <>
      <div
        className="inline-flex rounded-md shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
        role="group"
      >
        <Button
          icon="pi pi-minus-circle"
          className="p-button-danger"
          tooltipOptions={{ position: 'top' }}
          onClick={() => {
            setDialogConfirmEliminarFotoPerfil(true)
            setIdImagenPerfil(idImagenPerfil)
          }}
        />
        <Button
          icon="pi pi-paperclip"
          tooltip="Adjuntar"
          tooltipOptions={{ position: 'top' }}
          onClick={() => adjuntarArchivo()}
          className="ml-2"
        />
        <input
          type="file"
          name="image"
          id="file"
          accept=".jpg, .jpeg, .png"
          onChange={(e) => onChange(e)}
          style={{ display: 'none' }}
        />
      </div>
    </>
  )

  const [items, setItems] = useState(null)

  useEffect(() => {
    setItems(JSON.stringify(menu?.getMenu))
  }, [menu])

  if (!Acceso) {
    return (
      <AppLayoutMenus items={items}>
        <div className="flex justify-center items-center">
          <div className=" text-[#dbcdae] text-2xl xl:text-4xl font-extrabold tracking-widest">
            <h1>Cargando...</h1>
            <ProgressSpinner
              className="w-[50px] h-[50px] mt-[10px] ml-[80px]"
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        </div>
      </AppLayoutMenus>
    )
  }
  if (
    Acceso?.getRolAcceso.status !== 200 &&
    typeof Acceso?.getRolAcceso.status !== 'undefined'
  ) {
    cerrarSesion()
  }
  return (
    <AppLayoutMenus items={items}>
      <Toast ref={toast} />
      <ConfirmDialog
        visible={dialogConfirmEliminarFotoPerfil}
        onHide={() => setDialogConfirmEliminarFotoPerfil(false)}
        message="¿Esta seguro que desea eliminar la foto?"
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        accept={acceptEliminarFotoPerfil}
        reject={rejectEliminarFotoPerfil}
        acceptLabel="SI"
        rejectLabel="NO"
      />
      <div className="flex flex-row">
        <div className="grid grid-cols-5 gap-2 basis-9/12">
          <div className="block">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <InputText placeholder="Primer Nombres" className="rounded-xl" />
            </div>
          </div>
          <div className="block">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <InputText placeholder="Segundo Nombre" className="rounded-xl" />
            </div>
          </div>
          <div className="block">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <InputText placeholder="Primer Apellido" className="rounded-xl" />
            </div>
          </div>
          <div className="block">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <InputText
                placeholder="Segundo Apellido"
                className="rounded-xl"
              />
            </div>
          </div>
          <div className="block">
            <div className="p-inputgroup">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <InputText
                placeholder="Correo Electronico"
                className="rounded-xl"
              />
            </div>
          </div>
        </div>
        <div className="basis-3/12 ml-5">
          <Card style={{ width: '15em' }} footer={footer} header={header} />
        </div>
      </div>
    </AppLayoutMenus>
  )
}
