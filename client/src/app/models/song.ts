export class Song{
	//con lo nuevo ahora ya no necesitamos ni getters ni setters, ya se instancia solo con un valor
	constructor(
			public number: number,
			public name: string,
			public duration: string,
			public file: string,
			public album: string
		){}
}