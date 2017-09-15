<template lang="pug">
	#app
		section.section
			.container
				componentHeader
					h1(slot='title') {{titulo}}
						strong.title-beetrack(slot='subtitulo')  {{beetrack}}
				.columns.is-multiline
					.column.is-one-quarter
						.field
							p.control.has-icons-left
								input.input(type='text', placeholder='Buscar Contacto...', v-model='searchQuery')
								span.icon.is-small.is-left
									i.fa.fa-search.beetrack
					.column
						a.button.boton-beetrack.is-pulled-right
							span.icon.is-small
								i.fa.fa-plus-circle
							span(@click='modalNuevoContacto') Nuevo Contacto

				.columns.titulo-listado
					.column.is-one-quarter Nombre
					.column Descripción
				.columns.listado.is-multiline(
					v-for='user in users',
					v-on:mouseover='mostrar(user)',
					v-on:mouseout='mostrar(user)'
					)
					.column.is-one-quarter
						.media
							.media-left
								figure
									img(:src='user.photo', alt='Placeholder image').circle
							.media-content.user-name
								p.title.is-6 {{user.name}}
								p.subtitle.is-6.beetrack.eliminar(@click='eliminar(user.id)', v-show='user.visible') Eliminar
					.column {{user.description}}
				.columns.is-multiline
					.column
						p.is-pulled-left( @click='paginaAnterior()', v-show='paginaAnteriorVisible' )
							span.icon
								i.fa.fa-arrow-circle-left.beetrack
							span Pagina Anterior
					.column
						p.is-pulled-right( @click='paginaSiguiente()', v-show='paginaSiguienteVisible' )
							span Siguiente Pagina
							span.icon
								i.fa.fa-arrow-circle-right.beetrack
			.modal.is-active(v-show='modalAgregar')
				.modal-background(@click='modalNuevoContacto')
				.modal-card
					header.modal-card-head
						p.modal-card-title Agregar nuevo contacto
					section.modal-card-body
						form(@submit.prevent='agregar', action='', method='get')
							.field
								label.label(for='imagen') URL Imagen de Perfil
									span.beetrack  *
								.control
									input.input(type='text', name='imagen', placeholder='', v-model='imagen', :class="{'is-warning': validacionImagen}")
									p.help.is-danger(v-if='validacionImagen') Es Requerido
							.field
								label.label(for='nombre') Nombre
									span.beetrack  *
								.control
									input.input(type='text', name='nombre', placeholder='', v-model='nombre', :class="{'is-warning': validacionNombre}")
									p.help.is-danger(v-if='validacionNombre') Es Requerido
							.field
								label.label(for='descripcion') Descripción
									span.beetrack  *
								.control
									textarea.textarea(name='descripcion', placeholder='', v-model='descripcion', :class="{'is-warning': validacionDescripcion}")
									p.help.is-danger(v-if='validacionDescripcion') Es Requerido
							.field.is-grouped.is-grouped-centered
								p.control
									button.button.boton-beetrack(type='submit') Guardar
</template>

<script>
//	Juan Gonzalez
//	SPA Prueba Test Front-End

import user from './services/user'	//	Servicio consumo API Usuarios Beetrack
import componentHeader from './components/header.vue'	//	componente cabecera

export default {
	name: 'app',
	components: { componentHeader },
	data () {
		return {
			titulo: 'test',
			beetrack: 'Beetrack',
			searchQuery: '',
			users: [],
			modalAgregar: false,			//	visibilidad modal Nuevo Contacto
			imagen: '',						//	variable modelo input nuevo contacto
			nombre: '',						//	variable modelo input nuevo contacto
			descripcion: '',				//	variable modelo input nuevo contacto
			paginaAnteriorVisible: false,	//	visibilidad enlace Pagina Anterior
			paginaSiguienteVisible: true,	//	visibilidad enlace Pagina Siguiente
			numeroPagina: 1,				//	numero de pagina inicial
			limite: 2						//	limite de resultados por pagina

		}
	},
	mounted: function () {
		user.get(this.numeroPagina, this.limite).then(res => {
			res.map((x) => { x.visible = false })
			this.users = res
		})
	},
	computed: {
		//	Validaciones Formulario
		validacionImagen: function () { return this.imagen === '' },
		validacionNombre: function () { return this.nombre === '' },
		validacionDescripcion: function () { return this.descripcion === '' }
	},
	watch: {
		//	Busqueda de usuario
		searchQuery (newData, oldData) {
			user.search(newData, this.numeroPagina, this.limite).then(res => {
				this.users = res
			})
		},
		//	paginacion
		numeroPagina (nuevoNumeroPagina, antiguoNumeroPagina) {
			if (nuevoNumeroPagina <= 1) {
				this.paginaAnteriorVisible = false
			} else {
				this.paginaAnteriorVisible = true
			}
			user.get(nuevoNumeroPagina, this.limite).then(res => {
				res.map((x) => { x.visible = false })
				this.users = res
			})
		},
		//	correccion paginador, para no seguir mostrando enlace para avanzar a siguiente pagina
		users (nuevoUsuario, antiguoUsuario) {
			if (nuevoUsuario.length < this.limite) {
				this.paginaSiguienteVisible = false
			} else {
				this.paginaSiguienteVisible = true
			}
		}
	},
	methods: {
		//	visualizar opcion eliminar por cada fila
		mostrar: function (usuario) {
			usuario.visible = !usuario.visible
		},
		//	Modal Nuevo Contacto
		modalNuevoContacto: function () {
			this.modalAgregar = !this.modalAgregar
			this.imagen = ''
			this.nombre = ''
			this.descripcion = ''
		},
		//	agregar nuevo contacto
		agregar: function () {
			if (this.validacionImagen || this.validacionNombre || this.validacionDescripcion) {
				return true
			} else {
				user.post(this.nombre, this.descripcion, this.imagen).then(res => {
					this.modalAgregar = false
					user.get(this.numeroPagina, this.limite).then(res => {
						res.map((x) => { x.visible = false })
						this.users = res
					})
				})
			}
		},
		//	eliminar usuario
		eliminar: function (id) {
			user.delete(id).then(res => {
				if (res.status === 200) {
					user.get(this.numeroPagina, this.limite).then(res => {
						res.map((x) => { x.visible = false })
						this.users = res
					})
				}
			})
		},
		//	Paginacion Anterior
		paginaAnterior: function () {
			this.numeroPagina--
		},
		//	Paginacion Siguiente
		paginaSiguiente: function () {
			this.numeroPagina++
		}
	}
}
</script>

<style lang="scss">
	@import './scss/main.scss'
</style>
