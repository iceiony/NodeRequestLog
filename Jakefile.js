var sys = require('sys');
var exec = require('child_process').exec;
var fs = require('fs');

var buildCleanup = function(){
		var list = new jake.FileList()
		,fileList
		,i;
	
	console.log('Removing files:');
	
	list.include('build/**/*.ts');
	fileList = list.toArray();
	
	for(i in fileList){
		console.log(fileList[i]);
		fs.unlink(fileList[i]);
	};
};

desc('Removes all *.ts files from build output');
task('cleanTSFromBuild',[],buildCleanup);

desc('Does the actual build');
task('default', ['cleanupBuild','copyToBuild'], function () {
	var list = new jake.FileList()
		,fileList
		,command
		,i;
		
	list.include('build/**/*.ts');
	fileList = list.toArray();
	
	command = 'tsc '+ fileList.join(' ')+ ' > build/build.log 2>&1';
	console.log(command);
	
	exec(command, 
		function(error,stdout,stderr){
			console.log(stdout.toString());
			console.log(stderr.toString());
			if(error !=null){
				console.log("Build failed. Check log for details.\nExit Code:"+error.code);
				fs.readFile('build/build.log',function(err,data){
					if(err) throw err;
					console.log(data.toString());
				});
			}
			else {
				buildCleanup();
			};
		});
});

task('cleanupBuild',[] ,function(){
	jake.rmRf('build');
});

task('copyToBuild',[],function(){
	jake.cpR('./src/','./build/');
});