//	Juan Gonzalez
//	Configuracion consumo API con Trae.js
//	07/09/2017
import trae from 'trae'	//	Cliente HTTP minimalista para el navegador y Node.js - Basado en Fetch API (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
import configService from './config'

const beetrackService = trae.create({
	baseUrl: configService.apiUrl
})

export default beetrackService
