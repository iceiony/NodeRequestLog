///<reference path='lib.d.ts' />
export class SimpleFormatOutput{
    formatJASON(jason: String){
		return jason.replace(/{/g,'{\n').replace(/}/g,'\n}\n').replace(/",/g,'",\n');
	};
}