<template lang="pug">
.content
	slot(name='title')
		h1 prueba
			slot(name='subtitulo')
			strong.title-beetrack  Front-End
</template>
