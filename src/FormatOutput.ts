///<reference path='lib.d.ts' />
export class SimpleFormatOutput{
    formatJASON(jason: String){
		var result = jason.replace(/{/g,'{\n').replace(/}/g,'\n}\n').replace(/",/g,'",\n');
		return result;
    };
}