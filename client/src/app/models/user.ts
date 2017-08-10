export class User{
	//con lo nuevo ahora ya no necesitamos ni getters ni setters, ya se instancia solo con un valor
	constructor(
			public _id: string,
			public name: string,
			public surname: string,
			public email: string,
			public password: string,
			public rol: string,
			public image: string
		){}
}