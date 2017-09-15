//	Juan Gonzalez
//	Metodos Consumo API
//	07/09/2017
import beetrackService from './api'

const userService = {}

/* metodo para obtener todos los usuarios, con parametros de paginación y limite de registros */
userService.get = function (page, limit) {
	return beetrackService.get('users', {
		params: {
			_page: page,
			_limit: limit
		}
	}).then(res => res.data)
}

/* metodo para crear un nuevo usuario */
userService.post = function (name, description, photo) {
	return beetrackService.post('users',
		{
			name: name,
			description: description,
			photo: photo
		}
	).then(res => res.data)
}
/* metodo para buscar usuarios segun parametro q, con parametros de paginación y limite de registros */
userService.search = function (q, _page, _limit) {
	return beetrackService.get('users', {
		params: {
			q,
			_page,
			_limit
		}
	}).then(res => res.data)
}

/* metodo para eliminar un usuarios segun id */
userService.delete = function (id) {
	return beetrackService.delete('users/' + id)
}

export default userService
