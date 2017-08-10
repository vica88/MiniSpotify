export class Album{
	//con lo nuevo ahora ya no necesitamos ni getters ni setters, ya se instancia solo con un valor
	constructor(
			public title: string,
			public description: string,
			public year: number,
			public image: string,
			public artist: string
		){}
}