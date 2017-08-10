export class Artist{
	//con lo nuevo ahora ya no necesitamos ni getters ni setters, ya se instancia solo con un valor
	constructor(
			public name: string,
			public description: string,
			public image: string
		){}
}